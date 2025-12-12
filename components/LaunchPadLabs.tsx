
import React, { useState, useEffect } from 'react';
import { LabsType, UserProfile } from '../types';
import { Code, Box, PenLine, Type, Bold, Italic, Settings, Sparkles, MessageCircle, Mic2, Save, Clock, Play, Phone, Video, Eye, X, Send, Mic, MicOff, VideoOff, Users, Activity, Microscope, Film, Music as MusicIcon, Camera } from 'lucide-react';

interface Props {
  user?: UserProfile;
}

const LaunchPadLabs: React.FC<Props> = ({ user }) => {
  const [activeLab, setActiveLab] = useState<LabsType>('Code');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{sender: string, text: string}[]>([{sender: 'Blaise', text: 'Hey team, check line 42.'}]);
  const [chatInput, setChatInput] = useState('');
  const [viewingAs, setViewingAs] = useState('Me');
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  
  // Call State
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected'>('idle');
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [isMuted, setIsMuted] = useState(false);

  // Strict Filtering logic
  const availableLabs: LabsType[] = [];
  if (user) {
      if (user.role === 'Admin') {
          // Admin sees all
          availableLabs.push('Code', 'Writer', 'Design', 'Artist', 'Eng', 'Audio', 'Health', 'Science', 'Film', 'Music');
      } else {
          const interests = user.interests;
          // Tech / Engineering
          if (interests.some(i => ['Technology', 'Software Engineering', 'AI', 'Cybersecurity', 'Data Science'].includes(i))) availableLabs.push('Code');
          if (interests.some(i => ['Engineering', 'Civil Eng', 'Mechanical Eng', 'Electrical Eng', 'Robotics'].includes(i))) availableLabs.push('Eng');
          
          // Arts / Design
          if (interests.some(i => ['Arts', 'Graphic Design', 'Fashion', 'Architecture'].includes(i))) availableLabs.push('Design');
          if (interests.some(i => ['Fine Art', 'Arts'].includes(i))) availableLabs.push('Artist');
          
          // Writing / Media
          if (interests.some(i => ['Writing', 'Journalism', 'Media', 'Law', 'History', 'Politics'].includes(i))) availableLabs.push('Writer');
          
          // Creative Media
          if (interests.some(i => ['Music', 'Audio'].includes(i))) availableLabs.push('Music');
          if (interests.some(i => ['Film', 'Media', 'Animation', 'Photography'].includes(i))) availableLabs.push('Film');
          
          // Science / Health
          if (interests.some(i => ['Health', 'Medicine', 'Nursing', 'Public Health', 'Pharmacy'].includes(i))) availableLabs.push('Health');
          if (interests.some(i => ['Science', 'Biology', 'Chemistry', 'Physics', 'Environmental Science', 'Agriculture', 'AgriTech'].includes(i))) availableLabs.push('Science');
          
          // Fallback if empty (e.g. only Sports selected) -> Basic Writer
          if (availableLabs.length === 0) availableLabs.push('Writer');
      }
  }

  useEffect(() => {
      if (availableLabs.length > 0 && !availableLabs.includes(activeLab)) {
          setActiveLab(availableLabs[0]);
      }
  }, [user]);

  // Workstation State
  const [code, setCode] = useState(`// LaunchPad Shared Workspace\nimport React from 'react';\n\nconst App = () => {\n  return (\n    <div>Hello World</div>\n  );\n}`);
  const [textDraft, setTextDraft] = useState("## Project Title\n\nStart writing your ideas here...");
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayProgress, setReplayProgress] = useState(0);
  const [engComponents, setEngComponents] = useState<{id: number, type: string, x: number, y: number}[]>([]);

  const [collaborators, setCollaborators] = useState([
      { id: '1', name: 'You', color: 'bg-blue-500', active: true },
      { id: '2', name: 'Sarah', color: 'bg-green-500', active: false },
      { id: '3', name: 'Blaise', color: 'bg-purple-500', active: false }
  ]);

  useEffect(() => {
      const interval = setInterval(() => {
          setCollaborators(prev => prev.map(c => c.id !== '1' ? { ...c, active: Math.random() > 0.5 } : c));
      }, 5000);
      return () => clearInterval(interval);
  }, []);

  const handleAICodeAssist = () => setCode(prev => prev + "\n\n// AI Suggestion:\n// Consider extracting 'Hello World' into a component.");
  
  const handleReplay = () => {
      setIsReplaying(true);
      setReplayProgress(0);
      const originalCode = code;
      setCode("// Replaying history...");
      
      const interval = setInterval(() => {
          setReplayProgress(prev => {
              if (prev >= 100) {
                  clearInterval(interval);
                  setCode(originalCode);
                  setTimeout(() => setIsReplaying(false), 500);
                  return 100;
              }
              return prev + 2;
          });
      }, 30);
  };

  const addEngComponent = (type: string) => setEngComponents(prev => [...prev, { id: Date.now(), type, x: Math.random() * 300, y: Math.random() * 300 }]);
  
  const handleSendMessage = () => {
      if(chatInput.trim()) {
          setChatMessages([...chatMessages, {sender: 'Me', text: chatInput}]);
          setChatInput('');
      }
  };

  const startCall = (type: 'voice' | 'video') => {
      setCallType(type);
      setCallStatus('calling');
      setTimeout(() => setCallStatus('connected'), 2000);
  };

  const endCall = () => {
      setCallStatus('idle');
      setIsMuted(false);
  };

  const renderWorkstation = () => {
      if (activeLab === 'Code') return (
          <div className="flex-1 bg-charcoal-950 rounded-xl border border-charcoal-700 p-4 font-mono text-sm text-gray-300 shadow-inner overflow-hidden relative">
              <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-full bg-transparent outline-none resize-none font-mono text-sm z-10 relative" spellCheck={false}/>
              {collaborators[1].active && <div className="absolute top-20 left-40 w-0.5 h-5 bg-green-500 animate-pulse"><div className="absolute -top-4 left-0 bg-green-500 text-black text-[10px] px-1 rounded">Sarah</div></div>}
          </div>
      );
      if (activeLab === 'Writer') return (
          <div className="flex-1 flex flex-col bg-white dark:bg-charcoal-800 rounded-xl border border-gray-200 dark:border-charcoal-700 overflow-hidden shadow-inner">
               <div className="p-2 border-b border-gray-200 dark:border-charcoal-700 flex gap-2 bg-gray-50 dark:bg-charcoal-900">
                   <button className="p-1 hover:bg-gray-200 dark:hover:bg-charcoal-700 rounded"><Bold size={16} className="text-gray-600 dark:text-gray-300"/></button>
                   <button className="p-1 hover:bg-gray-200 dark:hover:bg-charcoal-700 rounded"><Italic size={16} className="text-gray-600 dark:text-gray-300"/></button>
                   <button className="p-1 hover:bg-gray-200 dark:hover:bg-charcoal-700 rounded"><Type size={16} className="text-gray-600 dark:text-gray-300"/></button>
                   <div className="w-px h-6 bg-gray-300 dark:bg-charcoal-600 mx-1"></div>
                   <button className="px-3 py-1 bg-golden-100 text-golden-700 text-xs font-bold rounded hover:bg-golden-200 flex items-center gap-1"><Sparkles size={12}/> AI Expand</button>
               </div>
               <textarea value={textDraft} onChange={(e) => setTextDraft(e.target.value)} className="w-full h-full bg-transparent outline-none resize-none font-serif text-lg leading-relaxed p-6 text-gray-800 dark:text-gray-200" placeholder="Start writing..."/>
          </div>
      );
      if (activeLab === 'Design' || activeLab === 'Artist') return (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
              <div className="absolute top-4 left-4 z-10 bg-white shadow-md rounded-lg p-2 flex flex-col gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Cube"><Box size={20}/></button>
                  <button className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Pen"><PenLine size={20}/></button>
                  <button className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Text"><Type size={20}/></button>
              </div>
              <p className="text-gray-400 select-none pointer-events-none absolute inset-0 flex items-center justify-center">3D Canvas Workspace (Simulated)</p>
              <div className="absolute top-20 left-20 w-32 h-32 bg-coral-500/20 border-2 border-coral-500 rounded-lg transform rotate-12"></div>
              <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/20 border-2 border-blue-500 rounded-full"></div>
          </div>
      );
      if (activeLab === 'Eng') return (
          <div className="flex-1 bg-gray-900 rounded-xl border border-gray-700 flex flex-col relative overflow-hidden">
               <div className="absolute top-0 left-0 right-0 bg-gray-800 p-2 flex gap-4 z-10">
                   <button onClick={() => addEngComponent('Gear')} className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded border border-gray-600 hover:bg-gray-600 flex items-center gap-1"><Settings size={14}/> Gear</button>
                   <button onClick={() => addEngComponent('Motor')} className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded border border-gray-600 hover:bg-gray-600 flex items-center gap-1"><Box size={14}/> Motor</button>
               </div>
               <div className="flex-1 relative bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:20px_20px]">
                   {engComponents.map(c => (
                       <div key={c.id} className="absolute w-16 h-16 bg-blue-600/50 border border-blue-400 rounded flex items-center justify-center text-xs text-white" style={{top: c.y, left: c.x}}>{c.type}</div>
                   ))}
                   {engComponents.length === 0 && <p className="text-gray-600 absolute inset-0 flex items-center justify-center">Add components to start building.</p>}
               </div>
          </div>
      );
      if (activeLab === 'Audio' || activeLab === 'Music') return (
          <div className="flex-1 bg-charcoal-900 rounded-xl border border-charcoal-700 p-6 flex items-center justify-center">
              <div className="w-full max-w-2xl space-y-4">
                  {[1,2,3,4].map(i => (
                      <div key={i} className="flex items-center gap-4">
                          <span className="text-xs font-mono text-gray-500 w-8">CH{i}</span>
                          <div className="flex-1 h-12 bg-charcoal-800 rounded flex items-center px-2 border border-charcoal-600 relative overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 bg-green-500/20 w-1/2"></div>
                              <div className="w-full h-8 flex items-end gap-1">
                                  {Array.from({length: 30}).map((_, k) => <div key={k} className="flex-1 bg-green-500" style={{height: `${Math.random() * 100}%`}}></div>)}
                              </div>
                          </div>
                          <div className="flex gap-2">
                              <button className="p-2 bg-charcoal-800 rounded hover:bg-red-500/20 text-red-500"><Mic2 size={16}/></button>
                          </div>
                      </div>
                  ))}
                  <div className="flex justify-center pt-4">
                      <button className="bg-golden-500 text-black px-6 py-2 rounded-full font-bold flex items-center gap-2"><Play size={16}/> Play</button>
                  </div>
              </div>
          </div>
      );
      if (activeLab === 'Health') return (
          <div className="flex-1 bg-gray-50 dark:bg-charcoal-900 rounded-xl border border-gray-200 dark:border-charcoal-700 flex flex-col items-center justify-center relative overflow-hidden">
              <Activity size={100} className="text-red-500 opacity-20 mb-4 animate-pulse"/>
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">3D Anatomy Viewer</h3>
              <p className="text-sm text-gray-500">Interactive 3D model loading...</p>
              <div className="absolute top-4 right-4 bg-white dark:bg-charcoal-800 p-2 rounded shadow text-xs">
                  <div className="mb-1 font-bold">Vitals</div>
                  <div>HR: 72 bpm</div>
                  <div>BP: 120/80</div>
              </div>
          </div>
      );
      if (activeLab === 'Science') return (
          <div className="flex-1 bg-gray-900 rounded-xl border border-gray-700 flex items-center justify-center relative">
              <Microscope size={80} className="text-blue-400 opacity-50 mb-4"/>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 to-transparent"></div>
              <p className="text-gray-400 font-mono">Microscope Feed: 400x Zoom</p>
          </div>
      );
      if (activeLab === 'Film') return (
          <div className="flex-1 bg-charcoal-950 rounded-xl border border-charcoal-700 flex flex-col">
              <div className="flex-1 flex items-center justify-center bg-black">
                  <Film size={60} className="text-gray-600"/>
              </div>
              <div className="h-32 bg-charcoal-800 border-t border-charcoal-700 p-2 overflow-x-auto whitespace-nowrap">
                  <div className="inline-block h-full w-40 bg-blue-900/50 border-r border-charcoal-600 rounded mr-1"></div>
                  <div className="inline-block h-full w-20 bg-green-900/50 border-r border-charcoal-600 rounded mr-1"></div>
                  <div className="inline-block h-full w-60 bg-blue-900/50 border-r border-charcoal-600 rounded"></div>
              </div>
          </div>
      );

      return <div className="flex-1 flex items-center justify-center text-gray-500">Workstation Loading...</div>;
  };

  return (
    <div className="flex h-full bg-charcoal-900 text-white animate-fadeIn relative">
        <div className="flex-1 flex flex-col h-full min-w-0">
            {/* Lab Header */}
            <div className="h-16 border-b border-charcoal-700 flex items-center justify-between px-6 shrink-0 bg-charcoal-800 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-4">
                    <h2 className="font-bold text-lg flex items-center gap-2 whitespace-nowrap">Labs</h2>
                    <div className="flex bg-charcoal-900 rounded-lg p-1">
                        {availableLabs.map(l => (
                            <button key={l} onClick={() => setActiveLab(l)} className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${activeLab === l ? 'bg-charcoal-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>{l}</button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                    <button onClick={() => startCall('voice')} className="p-2 bg-charcoal-700 rounded-full hover:bg-green-600" title="Voice Call"><Phone size={16}/></button>
                    <button onClick={() => startCall('video')} className="p-2 bg-charcoal-700 rounded-full hover:bg-blue-600" title="Video Call"><Video size={16}/></button>
                    <div className="h-6 w-px bg-charcoal-600 mx-2"></div>
                    
                    <div className="relative">
                        <button onClick={() => setShowUserSwitcher(!showUserSwitcher)} className="flex items-center gap-2 text-xs font-bold bg-charcoal-700 px-3 py-1.5 rounded hover:bg-charcoal-600">
                            <Eye size={14}/> View: {viewingAs}
                        </button>
                        {showUserSwitcher && (
                            <div className="absolute top-full right-0 mt-2 bg-charcoal-800 border border-charcoal-600 rounded-lg shadow-xl py-1 z-20 w-32">
                                {['Me', 'Sarah', 'Blaise'].map(u => (
                                    <button 
                                        key={u} 
                                        onClick={() => { setViewingAs(u); setShowUserSwitcher(false); }}
                                        className="w-full text-left px-4 py-2 text-xs hover:bg-charcoal-700"
                                    >
                                        {u}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex -space-x-2">
                        {collaborators.map(c => (
                            <div key={c.id} className={`w-8 h-8 rounded-full ${c.color} flex items-center justify-center text-xs font-bold border-2 border-charcoal-800 transition-opacity ${c.active ? 'opacity-100' : 'opacity-40 grayscale'}`}>{c.name.charAt(0)}</div>
                        ))}
                    </div>
                    <button onClick={() => alert('Work saved!')} className="flex items-center gap-2 px-3 py-1.5 bg-golden-500 hover:bg-golden-600 rounded text-xs font-bold text-black transition-colors whitespace-nowrap"><Save size={14}/> Save</button>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 p-6 relative flex flex-col">
                    {renderWorkstation()}
                    <div className="mt-4 flex gap-2">
                        <button onClick={handleAICodeAssist} className="flex items-center gap-2 px-4 py-2 bg-charcoal-800 rounded-lg text-xs font-bold hover:bg-charcoal-700 border border-charcoal-600 text-golden-400"><Sparkles size={14}/> AI Assist</button>
                        <button onClick={() => setShowChat(!showChat)} className="flex items-center gap-2 px-4 py-2 bg-charcoal-800 rounded-lg text-xs font-bold hover:bg-charcoal-700 border border-charcoal-600 text-gray-300"><MessageCircle size={14}/> Team Chat</button>
                        {!collaborators[2].active && <button onClick={handleReplay} className="flex items-center gap-2 px-4 py-2 bg-charcoal-800 rounded-lg text-xs font-bold hover:bg-charcoal-700 border border-charcoal-600 text-blue-400"><Play size={14}/> Replay Changes</button>}
                    </div>
                    
                    {/* Replay Overlay */}
                    {isReplaying && (
                        <div className="absolute inset-0 bg-black/50 z-30 flex flex-col items-center justify-center backdrop-blur-sm rounded-xl">
                            <Clock size={48} className="text-golden-500 animate-spin mb-4"/>
                            <h3 className="text-white font-bold text-xl mb-2">Replaying Session History...</h3>
                            <div className="w-64 h-2 bg-charcoal-700 rounded-full overflow-hidden">
                                <div className="h-full bg-golden-500 transition-all duration-75" style={{ width: `${replayProgress}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
            <div className="w-80 bg-charcoal-800 border-l border-charcoal-700 flex flex-col shrink-0 transition-all">
                <div className="p-4 border-b border-charcoal-700 flex justify-between items-center"><h3 className="font-bold">Team Chat</h3><button onClick={() => setShowChat(false)}><X size={16}/></button></div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-gray-400 mb-1">{msg.sender}</span>
                            <div className={`p-2 rounded-lg text-sm max-w-[80%] ${msg.sender === 'Me' ? 'bg-golden-600 text-white' : 'bg-charcoal-700 text-gray-200'}`}>{msg.text}</div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-charcoal-700 flex gap-2">
                    <input className="flex-1 bg-charcoal-900 rounded-lg px-3 py-2 text-sm outline-none" placeholder="Type..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()}/>
                    <button onClick={handleSendMessage} className="p-2 bg-golden-500 text-white rounded-lg"><Send size={16}/></button>
                </div>
            </div>
        )}

        {/* Call Overlay */}
        {callStatus !== 'idle' && (
            <div className={`absolute top-4 right-4 z-50 bg-charcoal-800 border border-charcoal-600 rounded-xl shadow-2xl p-4 animate-fadeIn ${callType === 'video' ? 'w-80' : 'w-64'}`}>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <span className="w-2 h-2 bg-green-500 rounded-full absolute -right-0.5 -top-0.5 animate-pulse"></span>
                            <Users size={16} className="text-gray-300"/>
                        </div>
                        <span className="text-sm font-bold text-white">Team Call</span>
                    </div>
                    <span className="text-xs text-green-400 font-mono">{callStatus === 'calling' ? 'Connecting...' : '00:12'}</span>
                </div>
                
                {callType === 'video' && (
                    <div className="mb-4 bg-black rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                        <Camera size={32} className="text-charcoal-700"/>
                        <div className="absolute bottom-2 right-2 w-16 h-12 bg-charcoal-800 rounded border border-charcoal-600 flex items-center justify-center">
                            <span className="text-[8px] text-gray-400">You</span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-2 mb-4">
                    {collaborators.filter(c => c.id !== '1').map(c => (
                        <div key={c.id} className="bg-charcoal-900 rounded-lg h-20 flex items-center justify-center relative">
                            <div className={`w-8 h-8 rounded-full ${c.color} flex items-center justify-center text-xs font-bold`}>{c.name.charAt(0)}</div>
                            <div className="absolute bottom-1 right-1"><Mic size={10} className="text-gray-500"/></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-4">
                    <button onClick={() => setIsMuted(!isMuted)} className={`p-2 rounded-full ${isMuted ? 'bg-red-500 text-white' : 'bg-charcoal-700 text-gray-300 hover:bg-charcoal-600'}`}>
                        {isMuted ? <MicOff size={18}/> : <Mic size={18}/>}
                    </button>
                    {callType === 'video' && (
                        <button className="p-2 rounded-full bg-charcoal-700 text-gray-300 hover:bg-charcoal-600">
                            <VideoOff size={18}/>
                        </button>
                    )}
                    <button onClick={endCall} className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700">
                        <Phone size={18} className="rotate-[135deg]"/>
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default LaunchPadLabs;
