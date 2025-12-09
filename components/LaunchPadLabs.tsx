
import React, { useState, useEffect } from 'react';
import { LabsType, UserProfile } from '../types';
import { Code, PenTool, Cpu, Play, Clock, Save, Users, Sparkles, MessageCircle, Music, Mic2, Box, PenLine, Settings, Type, Bold, Italic } from 'lucide-react';

interface Props {
  user?: UserProfile;
}

const LaunchPadLabs: React.FC<Props> = ({ user }) => {
  const [activeLab, setActiveLab] = useState<LabsType>('Code');
  
  // Filtering logic based on user interests or role
  const availableLabs: LabsType[] = ['Code', 'Writer']; // Everyone gets Code and Writer
  if (user) {
      if (user.role === 'Admin') {
          // Admins get ALL workstations for management/review
          if (!availableLabs.includes('Design')) availableLabs.push('Design');
          if (!availableLabs.includes('Artist')) availableLabs.push('Artist');
          if (!availableLabs.includes('Eng')) availableLabs.push('Eng');
          if (!availableLabs.includes('Audio')) availableLabs.push('Audio');
      } else {
          // Standard User interest logic
          if (user.interests.some(i => ['Design', 'Arts', 'Art'].includes(i))) availableLabs.push('Design');
          if (user.interests.some(i => ['Art', 'Arts'].includes(i))) availableLabs.push('Artist');
          if (user.interests.some(i => ['Engineering', 'Robotics', 'Technology', 'Science'].includes(i))) availableLabs.push('Eng');
          if (user.interests.some(i => ['Music', 'Audio'].includes(i))) availableLabs.push('Audio');
      }
  }

  // Workstation State
  const [code, setCode] = useState(`// LaunchPad Shared Workspace\nimport React from 'react';\n\nconst App = () => {\n  return (\n    <div>Hello World</div>\n  );\n}`);
  const [textDraft, setTextDraft] = useState("## Project Title\n\nStart writing your ideas here...");
  const [isReplaying, setIsReplaying] = useState(false);
  const [engComponents, setEngComponents] = useState<{id: number, type: string, x: number, y: number}[]>([]);

  const [collaborators, setCollaborators] = useState([
      { id: '1', name: 'You', color: 'bg-blue-500', active: true },
      { id: '2', name: 'Sarah', color: 'bg-green-500', active: false },
      { id: '3', name: 'Blaise', color: 'bg-purple-500', active: false }
  ]);

  // Simulate real-time activity
  useEffect(() => {
      const interval = setInterval(() => {
          setCollaborators(prev => prev.map(c => 
              c.id !== '1' ? { ...c, active: Math.random() > 0.5 } : c
          ));
      }, 5000);
      return () => clearInterval(interval);
  }, []);

  const handleAICodeAssist = () => {
      setCode(prev => prev + "\n\n// AI Suggestion:\n// Consider extracting 'Hello World' into a component.");
  };

  const handleReplay = () => {
      setIsReplaying(true);
      setTimeout(() => setIsReplaying(false), 3000); // Simulate 3s replay
  };

  const addEngComponent = (type: string) => {
      setEngComponents(prev => [...prev, { id: Date.now(), type, x: Math.random() * 300, y: Math.random() * 300 }]);
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
                       <div key={c.id} className="absolute w-16 h-16 bg-blue-600/50 border border-blue-400 rounded flex items-center justify-center text-xs text-white" style={{top: c.y, left: c.x}}>
                           {c.type}
                       </div>
                   ))}
                   {engComponents.length === 0 && <p className="text-gray-600 absolute inset-0 flex items-center justify-center">Add components to start building.</p>}
               </div>
          </div>
      );
      if (activeLab === 'Audio') return (
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
                              <button className="p-2 bg-charcoal-800 rounded hover:bg-blue-500/20 text-blue-500">M</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );
      return <div className="flex-1 flex items-center justify-center text-gray-500">Workstation Loading...</div>;
  };

  return (
    <div className="flex flex-col h-full bg-charcoal-900 text-white animate-fadeIn">
        {/* Lab Header */}
        <div className="h-16 border-b border-charcoal-700 flex items-center justify-between px-6 shrink-0 bg-charcoal-800 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-4">
                <h2 className="font-bold text-lg flex items-center gap-2 whitespace-nowrap"><Cpu className="text-golden-500"/> LaunchPad Labs</h2>
                <div className="flex bg-charcoal-900 rounded-lg p-1">
                    {availableLabs.map(l => (
                        <button 
                            key={l}
                            onClick={() => setActiveLab(l)}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${activeLab === l ? 'bg-charcoal-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-3 ml-4">
                 <div className="flex -space-x-2">
                     {collaborators.map(c => (
                         <div key={c.id} className={`w-8 h-8 rounded-full ${c.color} flex items-center justify-center text-xs font-bold border-2 border-charcoal-800 transition-opacity ${c.active ? 'opacity-100' : 'opacity-40 grayscale'}`} title={c.active ? `${c.name} is editing` : `${c.name} is away`}>
                             {c.name.charAt(0)}
                         </div>
                     ))}
                 </div>
                 <button onClick={() => alert('Work saved!')} className="flex items-center gap-2 px-3 py-1.5 bg-golden-500 hover:bg-golden-600 rounded text-xs font-bold text-black transition-colors whitespace-nowrap">
                     <Save size={14}/> Save
                 </button>
            </div>
        </div>

        {/* Main Workspace Simulation */}
        <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 p-6 relative flex flex-col">
                {/* Editor Area */}
                {renderWorkstation()}

                {/* AI Assistant Bar */}
                <div className="mt-4 flex gap-2">
                    <button onClick={handleAICodeAssist} className="flex items-center gap-2 px-4 py-2 bg-charcoal-800 rounded-lg text-xs font-bold hover:bg-charcoal-700 border border-charcoal-600 text-golden-400">
                        <Sparkles size={14}/> AI Assist
                    </button>
                    <button onClick={() => alert('Chat opened!')} className="flex items-center gap-2 px-4 py-2 bg-charcoal-800 rounded-lg text-xs font-bold hover:bg-charcoal-700 border border-charcoal-600 text-gray-300">
                        <MessageCircle size={14}/> Team Chat (3)
                    </button>
                </div>

                {/* Timelapse Overlay for Offline Collab */}
                {!collaborators[2].active && !isReplaying && (
                    <div className="absolute bottom-20 right-10 bg-charcoal-800 border border-charcoal-600 p-4 rounded-xl shadow-2xl max-w-sm z-20">
                        <h4 className="text-xs font-bold text-golden-500 uppercase mb-2 flex items-center gap-2"><Clock size={12}/> While you were away</h4>
                        <p className="text-xs text-gray-300 mb-3">Blaise pushed 3 commits to <span className="font-mono text-golden-200">main</span>.</p>
                        <button onClick={handleReplay} className="w-full flex items-center justify-center gap-2 bg-charcoal-700 hover:bg-charcoal-600 py-2 rounded text-xs font-bold transition-colors">
                            <Play size={14}/> Replay Changes
                        </button>
                    </div>
                )}
                
                {isReplaying && (
                    <div className="absolute inset-0 bg-black/50 z-30 flex items-center justify-center backdrop-blur-sm rounded-xl">
                        <div className="text-center">
                            <Clock size={48} className="text-golden-500 animate-spin mx-auto mb-4"/>
                            <h3 className="text-white font-bold text-xl">Replaying Session History...</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default LaunchPadLabs;
