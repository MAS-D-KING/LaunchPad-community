
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { Mic, MicOff, Volume2, X, Loader2 } from 'lucide-react';
import { UserProfile, Opportunity, Language, MentorApplication, Category } from '../types';

interface Props {
  user: UserProfile;
  opportunities: Opportunity[];
  mentorApps: MentorApplication[];
  onBookmark: (id: string) => void;
  language: Language;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  onPostOpportunity: (op: Partial<Opportunity>) => void;
  onReviewMentorApp: (id: string, approved: boolean) => void;
}

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return new Blob([int16], { type: 'audio/pcm' });
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceAssistant: React.FC<Props> = ({ 
    user, opportunities, mentorApps, onBookmark, language, 
    setDarkMode, onPostOpportunity, onReviewMentorApp 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  // --- Tools Definition ---
  const bookmarkTool: FunctionDeclaration = {
    name: 'bookmarkOpportunity',
    description: 'Bookmark or save an opportunity for the user based on the opportunity ID.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        opportunityId: { type: Type.STRING }
      },
      required: ['opportunityId']
    }
  };

  const changeThemeTool: FunctionDeclaration = {
      name: 'changeTheme',
      description: 'Switch the application theme between dark mode and light mode.',
      parameters: {
          type: Type.OBJECT,
          properties: {
              mode: { type: Type.STRING, enum: ['dark', 'light'] }
          },
          required: ['mode']
      }
  };

  const postQuickTool: FunctionDeclaration = {
      name: 'postQuickOpportunity',
      description: 'Admins can quickly post a new opportunity. Only use this if the user provides a title and category.',
      parameters: {
          type: Type.OBJECT,
          properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING, enum: ['Scholarship', 'Job', 'Internship', 'Grant'] },
              description: { type: Type.STRING }
          },
          required: ['title', 'category']
      }
  };

  const reviewAppTool: FunctionDeclaration = {
      name: 'approveMentorApp',
      description: 'Approve a pending mentor application by user name or ID.',
      parameters: {
          type: Type.OBJECT,
          properties: {
              appId: { type: Type.STRING }
          },
          required: ['appId']
      }
  };

  const stopAudio = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    sessionPromiseRef.current = null;
  };

  const startSession = async () => {
    if (!apiKey) {
      setError("No API Key");
      return;
    }
    try {
      setIsConnecting(true);
      setError(null);

      const InputContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      if (!InputContextClass) {
        setError("Audio not supported");
        setIsConnecting(false);
        return;
      }

      const inputCtx = new InputContextClass({ sampleRate: 16000 });
      const outputCtx = new InputContextClass({ sampleRate: 24000 });
      
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      const opsSummary = opportunities.slice(0, 10).map(o => ({
        id: o.id, title: o.title, deadline: o.deadline, category: o.category, location: o.location
      }));

      const appsSummary = mentorApps.filter(a => a.status === 'pending').map(a => ({
          id: a.id, name: a.name, profession: a.profession
      }));
      
      let langContext = "Speak in English.";
      if (language === 'fr') langContext = "Speak exclusively in French.";
      else if (language === 'pidgin') langContext = "Speak in Cameroonian Pidgin.";
      else if (language === 'de') langContext = "Speak in German.";
      else if (language === 'zh') langContext = "Speak in Chinese.";
      else if (language === 'es') langContext = "Speak in Spanish.";

      const systemInstruction = `
        You are "LaunchPad Assistant".
        Role: ${user.role}.
        User: ${user.name} in ${user.city}.
        Language: ${langContext}
        
        Capabilities:
        1. Find opportunities from this list: ${JSON.stringify(opsSummary)}.
        2. Toggle Dark Mode (use 'changeTheme').
        3. If Admin, you can post opportunities (use 'postQuickOpportunity').
        4. If Admin, you can review mentor applications: ${JSON.stringify(appsSummary)}. Use 'approveMentorApp' if asked.
        
        Be helpful, concise, and friendly.
      `;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: systemInstruction,
          speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: user.settings?.voicePreference || 'Kore' } }
          },
          tools: [{ functionDeclarations: [bookmarkTool, changeThemeTool, postQuickTool, reviewAppTool] }]
        },
        callbacks: {
          onopen: async () => {
            console.log('Gemini Live Connected');
            setIsConnecting(false);
            setIsActive(true);
            
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              streamRef.current = stream;
              
              const source = inputCtx.createMediaStreamSource(stream);
              const processor = inputCtx.createScriptProcessor(4096, 1, 1);
              
              processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  pcmData[i] = inputData[i] * 32768;
                }
                const uint8Buffer = new Uint8Array(pcmData.buffer);
                const base64Data = encode(uint8Buffer);

                sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: { mimeType: 'audio/pcm;rate=16000', data: base64Data } });
                });
              };

              source.connect(processor);
              processor.connect(inputCtx.destination);
            } catch (err) {
              console.error('Mic Error:', err);
              setError('Mic access denied.');
              stopAudio();
            }
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              setIsSpeaking(true);
              const audioBuffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              const now = outputCtx.currentTime;
              const startTime = Math.max(now, nextStartTimeRef.current);
              source.start(startTime);
              nextStartTimeRef.current = startTime + audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              };
            }

            if (msg.toolCall) {
              for (const fc of msg.toolCall.functionCalls) {
                let result = "Success";
                
                if (fc.name === 'bookmarkOpportunity') {
                  onBookmark((fc.args as any).opportunityId);
                } else if (fc.name === 'changeTheme') {
                    const mode = (fc.args as any).mode;
                    setDarkMode(mode === 'dark');
                    result = `Theme changed to ${mode}`;
                } else if (fc.name === 'postQuickOpportunity') {
                    const { title, category, description } = fc.args as any;
                    onPostOpportunity({ title, category: category as Category, description });
                    result = `Posted ${title}`;
                } else if (fc.name === 'approveMentorApp') {
                    const { appId } = fc.args as any;
                    onReviewMentorApp(appId, true);
                    result = `Approved application ${appId}`;
                }

                sessionPromise.then(session => {
                    session.sendToolResponse({
                      functionResponses: { id: fc.id, name: fc.name, response: { result } }
                    });
                });
              }
            }
          },
          onclose: () => stopAudio(),
          onerror: (err) => {
            console.error(err);
            setError('Connection error.');
            stopAudio();
          }
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      setError('Failed to start.');
      setIsConnecting(false);
    }
  };

  const toggleAssistant = () => isActive ? stopAudio() : startSession();

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-30 flex flex-col items-end gap-2">
      {error && (
        <div className="bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg mb-2 flex items-center gap-2 font-bold">
          <span>{error}</span><button onClick={() => setError(null)}><X size={12}/></button>
        </div>
      )}

      <button
        onClick={toggleAssistant}
        className={`
          relative w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 border-4 border-white dark:border-charcoal-800
          ${isActive 
            ? 'bg-charcoal-900 text-white scale-110' 
            : 'bg-gradient-to-br from-golden-400 to-golden-600 text-white hover:scale-105'}
        `}
      >
        {isActive && (
          <>
             <span className="absolute inset-0 rounded-full bg-golden-400 opacity-30 animate-ping"></span>
             <span className={`absolute inset-0 rounded-full border-2 border-golden-300 ${isSpeaking ? 'animate-pulse scale-125' : ''}`}></span>
          </>
        )}
        {isConnecting ? <Loader2 className="animate-spin" size={24} /> : isActive ? (isSpeaking ? <Volume2 size={24} /> : <Mic size={24} />) : <MicOff size={24} />}
      </button>

      {isActive && (
        <div className="bg-charcoal-900 text-white text-xs px-3 py-1 rounded-full shadow-xl font-bold tracking-wide">
          {isSpeaking ? 'Speaking...' : 'Listening...'}
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
