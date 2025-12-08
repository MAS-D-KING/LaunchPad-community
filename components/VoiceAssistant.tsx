
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { Mic, MicOff, Volume2, X, Loader2 } from 'lucide-react';
import { UserProfile, Opportunity, Language } from '../types';

interface Props {
  user: UserProfile;
  opportunities: Opportunity[];
  onBookmark: (id: string) => void;
  language: Language;
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

const VoiceAssistant: React.FC<Props> = ({ user, opportunities, onBookmark, language }) => {
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

  const bookmarkTool: FunctionDeclaration = {
    name: 'bookmarkOpportunity',
    description: 'Bookmark or save an opportunity for the user based on the opportunity ID.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        opportunityId: {
          type: Type.STRING,
          description: 'The unique ID of the opportunity to bookmark.'
        }
      },
      required: ['opportunityId']
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
    try {
      setIsConnecting(true);
      setError(null);

      const InputContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      const inputCtx = new InputContextClass({ sampleRate: 16000 });
      const outputCtx = new InputContextClass({ sampleRate: 24000 });
      
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      const today = new Date().toDateString();
      const opsSummary = opportunities.slice(0, 15).map(o => ({
        id: o.id, 
        title: o.title, 
        deadline: o.deadline, 
        category: o.category,
        location: o.location,
        org: o.organization
      }));
      
      const langContext = language === 'fr' 
        ? "Speak exclusively in French (Français). Adopt a warm, helpful tone suitable for Francophone Cameroonian youth."
        : "Speak in English. Adopt a warm, helpful tone suitable for Anglophone Cameroonian youth.";

      const systemInstruction = `
        You are "LaunchPad Assistant", a knowledgeable and supportive career guide specifically for Cameroonian youth and students.
        
        Language Requirement:
        ${langContext}

        Your Personality:
        - Encouraging and local. You understand the Cameroonian context (universities like UB, UY1, Silicon Mountain tech scene).
        - You speak clearly and concisely.
        
        User Context:
        - Name: ${user.name}
        - City: ${user.city}
        - Education: ${user.education} in ${user.academicBackground}
        
        Current Date: ${today}
        
        Task:
        - Help the user find opportunities from the list provided.
        - Prioritize opportunities in ${user.city} or online.
        - If they ask about scholarships, mention specific deadlines.
        - If they like an opportunity, use the 'bookmarkOpportunity' tool.
        
        Available Opportunities:
        ${JSON.stringify(opsSummary)}
      `;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: systemInstruction,
          tools: [{ functionDeclarations: [bookmarkTool] }]
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
                  session.sendRealtimeInput({
                    media: {
                      mimeType: 'audio/pcm;rate=16000',
                      data: base64Data
                    }
                  });
                });
              };

              source.connect(processor);
              processor.connect(inputCtx.destination);
            } catch (err) {
              console.error('Mic Error:', err);
              setError('Could not access microphone.');
              stopAudio();
            }
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              setIsSpeaking(true);
              const audioBuffer = await decodeAudioData(
                decode(audioData),
                outputCtx,
                24000,
                1
              );
              
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
                if (fc.name === 'bookmarkOpportunity') {
                  const id = (fc.args as any).opportunityId;
                  onBookmark(id);
                  sessionPromise.then(session => {
                    session.sendToolResponse({
                      functionResponses: {
                        id: fc.id,
                        name: fc.name,
                        response: { result: `Success` }
                      }
                    });
                  });
                }
              }
            }
          },
          onclose: () => {
            console.log('Gemini Live Closed');
            stopAudio();
          },
          onerror: (err) => {
            console.error('Gemini Live Error:', err);
            setError('Connection error.');
            stopAudio();
          }
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (err) {
      console.error('Setup Error:', err);
      setError('Failed to start assistant.');
      setIsConnecting(false);
    }
  };

  const toggleAssistant = () => {
    if (isActive) {
      stopAudio();
    } else {
      startSession();
    }
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-30 flex flex-col items-end gap-2">
      {error && (
        <div className="bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg mb-2 animate-fadeIn flex items-center gap-2 font-bold">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X size={12}/></button>
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

        {isConnecting ? (
          <Loader2 className="animate-spin" size={24} />
        ) : isActive ? (
          isSpeaking ? <Volume2 size={24} /> : <Mic size={24} />
        ) : (
          <MicOff size={24} />
        )}
      </button>

      {isActive && (
        <div className="bg-charcoal-900 text-white text-xs px-3 py-1 rounded-full shadow-xl font-bold tracking-wide">
          {isSpeaking ? (language === 'fr' ? 'Parle...' : 'Speaking...') : (language === 'fr' ? 'Écoute...' : 'Listening...')}
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
