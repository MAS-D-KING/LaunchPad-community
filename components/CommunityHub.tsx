
import React, { useState } from 'react';
import { UserProfile, Community, CommunityProblem } from '../types';
import { MOCK_COMMUNITIES, MOCK_PROBLEMS } from '../constants';
import { Search, Users, Shield, ArrowRight, MessageSquare, Video, HelpCircle, Plus, Image as ImageIcon, CheckCircle, Brain, Filter, Lock } from 'lucide-react';

interface Props {
  user: UserProfile;
  joinedCommunities?: string[];
  onJoin?: (id: string) => void;
}

const CommunityHub: React.FC<Props> = ({ user, joinedCommunities = [], onJoin }) => {
  const [view, setView] = useState<'discovery' | 'detail'>('discovery');
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [activeTab, setActiveTab] = useState<'problems' | 'chat' | 'spaces' | 'live' | 'members'>('problems');
  const [showPostModal, setShowPostModal] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredCommunities = MOCK_COMMUNITIES.filter(c => {
      if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
      // Smart Filtering: If user is high school, don't show graduate-only
      if (user.education === 'High School' && c.educationLevel === 'Graduate') return false;
      return true;
  });

  const handleCommunityClick = (c: Community) => {
      setSelectedCommunity(c);
      setView('detail');
  };

  const handleJoin = (c: Community, e: React.MouseEvent) => {
      e.stopPropagation();
      if (onJoin) onJoin(c.id);
  };

  const handlePostProblem = (e: React.FormEvent) => {
      e.preventDefault();
      alert("Problem posted! AI is analyzing content for moderation...");
      setShowPostModal(false);
  };

  const isMember = selectedCommunity ? joinedCommunities.includes(selectedCommunity.id) : false;

  const renderDiscovery = () => (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
              <div>
                  <h2 className="text-3xl font-extrabold text-charcoal-900 dark:text-white mb-2">Community Hub</h2>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Join verified groups, solve problems, and collaborate with peers.</p>
              </div>
              <div className="flex items-center bg-white dark:bg-charcoal-800 rounded-full px-4 py-2 border border-gray-200 dark:border-charcoal-700 shadow-sm w-full md:w-auto">
                  <Search size={18} className="text-gray-400 mr-2"/>
                  <input placeholder="Find communities..." className="bg-transparent outline-none text-sm w-full dark:text-white"/>
              </div>
          </div>

          {/* Authentic Directory Banner */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white mb-10 shadow-lg relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                      <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Shield size={24} fill="white" className="text-white"/> Authentic Student Communities</h3>
                      <p className="text-violet-100 text-sm max-w-lg">Explore verified organizations like GDG, Open Dreams, and Microsoft Learn Student Ambassadors.</p>
                  </div>
                  <button className="bg-white text-violet-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-violet-50 transition-colors">Browse Directory</button>
              </div>
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10"><Users size={200}/></div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
              {['All', 'Tech', 'STEM', 'Art', 'Business'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${categoryFilter === cat ? 'bg-charcoal-900 dark:bg-white text-white dark:text-charcoal-900' : 'bg-white dark:bg-charcoal-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}
                  >
                      {cat}
                  </button>
              ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map(c => {
                  const alreadyJoined = joinedCommunities.includes(c.id);
                  return (
                  <div key={c.id} onClick={() => handleCommunityClick(c)} className="bg-white dark:bg-charcoal-800 rounded-2xl p-6 border border-gray-100 dark:border-charcoal-700 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-md ${c.category === 'Tech' ? 'bg-blue-500' : c.category === 'Art' ? 'bg-pink-500' : 'bg-green-500'}`}>
                              {c.image}
                          </div>
                          {c.isVerified && <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-1 rounded-full"><Shield size={16} fill="currentColor"/></div>}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-golden-500 transition-colors">{c.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 min-h-[40px]">{c.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                          {c.tags.slice(0, 3).map(t => (
                              <span key={t} className="px-2 py-1 bg-gray-100 dark:bg-charcoal-900 rounded text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">{t}</span>
                          ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-charcoal-700">
                          <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                              <Users size={14}/> {c.memberCount}
                          </div>
                          {alreadyJoined ? (
                              <span className="text-sm font-bold text-green-500 flex items-center gap-1"><CheckCircle size={14}/> Member</span>
                          ) : (
                              <button onClick={(e) => handleJoin(c, e)} className="text-sm font-bold text-golden-600 hover:underline flex items-center gap-1">
                                  Join <ArrowRight size={14}/>
                              </button>
                          )}
                      </div>
                  </div>
              )})}
          </div>
      </div>
  );

  const renderDetail = () => {
      if (!selectedCommunity) return null;

      return (
          <div className="h-full flex flex-col bg-white dark:bg-charcoal-900">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-charcoal-700 bg-gray-50 dark:bg-charcoal-800">
                  <button onClick={() => setView('discovery')} className="text-xs font-bold text-gray-500 hover:text-charcoal-900 mb-4 flex items-center gap-1"><ArrowRight size={12} className="rotate-180"/> Back to Hub</button>
                  <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg ${selectedCommunity.category === 'Tech' ? 'bg-blue-500' : 'bg-green-500'}`}>
                              {selectedCommunity.image}
                          </div>
                          <div>
                              <h1 className="text-2xl font-extrabold text-charcoal-900 dark:text-white flex items-center gap-2">
                                  {selectedCommunity.name} 
                                  {selectedCommunity.isVerified && <Shield size={20} className="text-blue-500" fill="currentColor"/>}
                              </h1>
                              <p className="text-gray-500 text-sm font-medium">{selectedCommunity.memberCount} members • {selectedCommunity.activityLevel}</p>
                          </div>
                      </div>
                      <button 
                        onClick={(e) => handleJoin(selectedCommunity, e as any)} 
                        disabled={isMember}
                        className={`px-6 py-2 rounded-full font-bold text-sm shadow-lg transition-all ${isMember ? 'bg-charcoal-200 text-charcoal-600 dark:bg-charcoal-700 dark:text-gray-400' : 'bg-charcoal-900 dark:bg-white text-white dark:text-charcoal-900 hover:opacity-90'}`}
                      >
                          {isMember ? 'Member' : 'Join Community'}
                      </button>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex gap-6 mt-8 border-b border-gray-200 dark:border-charcoal-700 overflow-x-auto">
                      {[
                          { id: 'problems', icon: HelpCircle, label: 'Problems' },
                          { id: 'chat', icon: MessageSquare, label: 'Chat' },
                          { id: 'spaces', icon: Filter, label: 'Spaces' },
                          { id: 'live', icon: Video, label: 'Live' },
                          { id: 'members', icon: Users, label: 'Members' },
                      ].map(tab => (
                          <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`pb-3 flex items-center gap-2 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'border-golden-500 text-golden-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                          >
                              <tab.icon size={16}/> {tab.label}
                          </button>
                      ))}
                  </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-beige-50 dark:bg-charcoal-900 relative">
                  {!isMember && activeTab !== 'problems' && (
                      <div className="absolute inset-0 z-10 bg-white/60 dark:bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center p-6 bg-white dark:bg-charcoal-800 rounded-2xl shadow-xl max-w-sm">
                              <Lock size={48} className="mx-auto text-gray-400 mb-4"/>
                              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Members Only</h3>
                              <p className="text-gray-500 mb-4">Join {selectedCommunity.name} to access chat, live sessions, and member list.</p>
                              <button onClick={(e) => handleJoin(selectedCommunity, e as any)} className="bg-golden-500 text-white px-6 py-2 rounded-lg font-bold">Join Now</button>
                          </div>
                      </div>
                  )}

                  {activeTab === 'problems' && (
                      <div className="max-w-4xl mx-auto">
                          <div className="flex justify-between items-center mb-6">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Community Problems</h3>
                              <button onClick={() => setShowPostModal(true)} className="bg-golden-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-golden-600 transition-colors shadow-lg">
                                  <Plus size={16}/> Post Problem
                              </button>
                          </div>
                          
                          <div className="space-y-4">
                              {MOCK_PROBLEMS.map(p => (
                                  <div key={p.id} className="bg-white dark:bg-charcoal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700">
                                      <div className="flex justify-between items-start mb-2">
                                          <div className="flex gap-2">
                                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.difficulty}</span>
                                              {p.tags.map(t => <span key={t} className="px-2 py-0.5 bg-gray-100 dark:bg-charcoal-900 text-gray-500 text-[10px] font-bold uppercase rounded">{t}</span>)}
                                          </div>
                                          <span className="text-xs text-gray-400 font-medium">{p.date}</span>
                                      </div>
                                      <h4 className="text-lg font-bold text-charcoal-900 dark:text-white mb-2">{p.title}</h4>
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{p.description}</p>
                                      
                                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-charcoal-700">
                                          <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                                              <span className="cursor-pointer hover:text-golden-500">👍 {p.likes}</span>
                                              <span className="cursor-pointer hover:text-golden-500">💬 {p.comments} Solutions</span>
                                          </div>
                                          <button className="text-sm font-bold text-golden-600 hover:underline">View Solutions</button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {activeTab === 'chat' && (
                      <div className="space-y-4">
                          <div className="flex gap-4">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0"></div>
                              <div className="bg-white dark:bg-charcoal-800 p-3 rounded-r-xl rounded-bl-xl shadow-sm max-w-md">
                                  <p className="text-sm font-bold text-blue-500 mb-1">Blaise</p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">Hey guys, anyone joining the Code Fest?</p>
                              </div>
                          </div>
                          <div className="flex gap-4 flex-row-reverse">
                              <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0"></div>
                              <div className="bg-golden-50 dark:bg-golden-900/20 p-3 rounded-l-xl rounded-br-xl shadow-sm max-w-md">
                                  <p className="text-sm font-bold text-purple-500 mb-1">You</p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">Yeah! I'm looking for a team.</p>
                              </div>
                          </div>
                      </div>
                  )}

                  {activeTab === 'spaces' && (
                      <div className="grid grid-cols-2 gap-4">
                          {['General', 'Announcements', 'Projects', 'Random'].map(s => (
                              <div key={s} className="bg-white dark:bg-charcoal-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700 hover:border-golden-500 cursor-pointer">
                                  <h4 className="font-bold text-gray-900 dark:text-white"># {s}</h4>
                                  <p className="text-xs text-gray-500 mt-1">Active 2m ago</p>
                              </div>
                          ))}
                      </div>
                  )}
                  
                  {activeTab === 'members' && (
                      <div className="space-y-2">
                          {[1,2,3,4,5].map(i => (
                              <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-charcoal-800 rounded-lg shadow-sm">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-charcoal-600"></div>
                                  <div className="font-bold text-sm text-gray-700 dark:text-gray-200">Member {i}</div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      );
  };

  return (
    <>
        {view === 'discovery' ? renderDiscovery() : renderDetail()}
        
        {/* Post Problem Modal */}
        {showPostModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-charcoal-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-gray-200 dark:border-charcoal-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Post a Problem</h3>
                        <button onClick={() => setShowPostModal(false)}><Plus size={24} className="rotate-45 text-gray-500"/></button>
                    </div>
                    <form onSubmit={handlePostProblem} className="space-y-4">
                        <input placeholder="Title" className="w-full p-3 bg-gray-50 dark:bg-charcoal-900 rounded-lg border-none outline-none dark:text-white font-bold" required/>
                        <div className="relative">
                            <textarea placeholder="Describe your problem..." rows={5} className="w-full p-3 bg-gray-50 dark:bg-charcoal-900 rounded-lg border-none outline-none dark:text-white" required></textarea>
                            <button type="button" className="absolute bottom-3 right-3 p-2 bg-violet-100 text-violet-600 rounded-full hover:bg-violet-200" title="AI: Convert Image to LaTeX">
                                <Brain size={16}/>
                            </button>
                        </div>
                        <div className="flex gap-4">
                             <select className="flex-1 p-3 bg-gray-50 dark:bg-charcoal-900 rounded-lg outline-none text-sm font-bold dark:text-white">
                                 <option>Easy</option><option>Medium</option><option>Hard</option>
                             </select>
                             <button type="button" className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-charcoal-900 rounded-lg text-sm font-bold text-gray-500 border border-dashed border-gray-300">
                                 <ImageIcon size={16}/> Add Image
                             </button>
                        </div>
                        <button type="submit" className="w-full bg-golden-500 text-white font-bold py-3 rounded-lg hover:bg-golden-600 transition-colors shadow-lg">Post Problem</button>
                    </form>
                </div>
            </div>
        )}
    </>
  );
};

export default CommunityHub;
