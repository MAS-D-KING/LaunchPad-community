
import React, { useState } from 'react';
import { MOCK_GROUPS } from '../constants';
import { Users, MessageSquare, CheckSquare, Plus, Folder, X, Send, FileText } from 'lucide-react';

const GroupsHub: React.FC = () => {
  const [activeModal, setActiveModal] = useState<{ type: 'chat' | 'tasks' | 'files' | 'add', groupId: string } | null>(null);
  
  const closeModal = () => setActiveModal(null);
  const currentGroup = activeModal ? MOCK_GROUPS.find(g => g.id === activeModal.groupId) : null;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-extrabold text-charcoal-900 dark:text-white">Groups & Teams</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">Your study circles and project teams.</p>
            </div>
            <button className="bg-charcoal-900 dark:bg-white text-white dark:text-charcoal-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-md">
                <Plus size={16}/> Create Group
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_GROUPS.map(g => (
                <div key={g.id} className="bg-white dark:bg-charcoal-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-charcoal-700 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-coral-100 dark:bg-coral-900/30 rounded-xl flex items-center justify-center text-coral-600 dark:text-coral-400">
                            <Users size={24}/>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-charcoal-900 rounded text-[10px] font-bold uppercase text-gray-500">{g.type}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{g.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{g.description}</p>
                    
                    <div className="flex items-center gap-2 mb-6">
                        {g.members.map((m, i) => (
                             <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-charcoal-600 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-charcoal-800 -ml-2 first:ml-0 shadow-sm" title={m}>
                                 {m.charAt(0)}
                             </div>
                        ))}
                        <button 
                            onClick={() => setActiveModal({ type: 'add', groupId: g.id })}
                            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-charcoal-900 flex items-center justify-center text-xs font-bold text-gray-400 border-2 border-dashed border-gray-300 dark:border-charcoal-600 ml-2 hover:border-golden-500 hover:text-golden-500"
                        >
                            +
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 dark:border-charcoal-700">
                        <button 
                            onClick={() => setActiveModal({ type: 'chat', groupId: g.id })}
                            className="flex flex-col items-center gap-1 text-xs font-bold text-gray-500 hover:text-golden-500 transition-colors p-2 hover:bg-gray-50 dark:hover:bg-charcoal-700 rounded-lg"
                        >
                            <MessageSquare size={18}/> Chat
                        </button>
                        <button 
                            onClick={() => setActiveModal({ type: 'tasks', groupId: g.id })}
                            className="flex flex-col items-center gap-1 text-xs font-bold text-gray-500 hover:text-golden-500 transition-colors p-2 hover:bg-gray-50 dark:hover:bg-charcoal-700 rounded-lg relative"
                        >
                            <CheckSquare size={18}/> Tasks
                            {g.tasksPending > 0 && <span className="absolute top-1 right-8 w-2 h-2 bg-red-500 rounded-full"></span>}
                        </button>
                        <button 
                            onClick={() => setActiveModal({ type: 'files', groupId: g.id })}
                            className="flex flex-col items-center gap-1 text-xs font-bold text-gray-500 hover:text-golden-500 transition-colors p-2 hover:bg-gray-50 dark:hover:bg-charcoal-700 rounded-lg"
                        >
                            <Folder size={18}/> Files
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Action Modals */}
        {activeModal && currentGroup && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-charcoal-800 w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 dark:border-charcoal-700 flex flex-col max-h-[80vh]">
                    <div className="p-4 border-b border-gray-100 dark:border-charcoal-700 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white capitalize">{currentGroup.name} {activeModal.type}</h3>
                        <button onClick={closeModal}><X size={20} className="text-gray-500"/></button>
                    </div>
                    
                    <div className="p-4 flex-1 overflow-y-auto">
                        {activeModal.type === 'chat' && (
                            <div className="space-y-4">
                                <div className="text-center text-xs text-gray-400 mb-4">Today</div>
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                                    <div className="bg-gray-100 dark:bg-charcoal-700 p-2 rounded-r-lg rounded-bl-lg text-sm max-w-[80%] text-gray-800 dark:text-gray-200">
                                        Are we meeting today at 5?
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-golden-500"></div>
                                    <div className="bg-golden-100 dark:bg-golden-900/30 p-2 rounded-l-lg rounded-br-lg text-sm max-w-[80%] text-gray-800 dark:text-gray-200">
                                        Yes, I'll be there!
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeModal.type === 'tasks' && (
                             <ul className="space-y-2">
                                 {['Research topic', 'Create slides', 'Draft report'].map((t, i) => (
                                     <li key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-charcoal-900 rounded-lg">
                                         <input type="checkbox" className="w-4 h-4 rounded text-golden-500 focus:ring-golden-500"/>
                                         <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t}</span>
                                     </li>
                                 ))}
                             </ul>
                        )}
                        {activeModal.type === 'files' && (
                             <div className="grid grid-cols-2 gap-4">
                                 {['Project_Brief.pdf', 'Design_V1.fig', 'Notes.txt'].map((f, i) => (
                                     <div key={i} className="p-4 border border-gray-200 dark:border-charcoal-600 rounded-lg flex flex-col items-center text-center hover:bg-gray-50 dark:hover:bg-charcoal-700 cursor-pointer">
                                         <FileText size={24} className="text-gray-400 mb-2"/>
                                         <span className="text-xs font-bold text-gray-600 dark:text-gray-300 truncate w-full">{f}</span>
                                     </div>
                                 ))}
                             </div>
                        )}
                         {activeModal.type === 'add' && (
                             <div className="space-y-4">
                                 <input placeholder="Enter email or username..." className="w-full p-3 bg-gray-50 dark:bg-charcoal-900 rounded-lg outline-none text-sm dark:text-white" autoFocus/>
                                 <button onClick={() => { alert('Invitation sent!'); closeModal(); }} className="w-full bg-golden-500 text-white font-bold py-2 rounded-lg">Send Invite</button>
                             </div>
                        )}
                    </div>

                    {activeModal.type === 'chat' && (
                        <div className="p-4 border-t border-gray-100 dark:border-charcoal-700 flex gap-2">
                            <input className="flex-1 bg-gray-50 dark:bg-charcoal-900 rounded-full px-4 py-2 text-sm outline-none dark:text-white" placeholder="Type a message..."/>
                            <button className="p-2 bg-golden-500 text-white rounded-full"><Send size={16}/></button>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default GroupsHub;
