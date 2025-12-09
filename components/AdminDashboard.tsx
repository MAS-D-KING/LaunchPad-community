
import React, { useState, useRef } from 'react';
import { Opportunity, SuccessStory, Category, RegionScope, UserProfile, MentorApplication } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Plus, Check, X, Send, Mail, Image as ImageIcon, Video } from 'lucide-react';

interface Props {
  opportunities: Opportunity[];
  setOpportunities: React.Dispatch<React.SetStateAction<Opportunity[]>>;
  stories: SuccessStory[];
  setStories: React.Dispatch<React.SetStateAction<SuccessStory[]>>;
  mentors: UserProfile[];
  setMentors: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  mentorApps: MentorApplication[];
  onReviewMentorApp: (id: string, approved: boolean) => void;
}

const AdminDashboard: React.FC<Props> = ({ 
    opportunities, setOpportunities, stories, setStories, 
    mentors, setMentors, mentorApps, onReviewMentorApp 
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'create' | 'review' | 'mentors' | 'mentor-review'>('analytics');
  
  const [newPost, setNewPost] = useState<Partial<Opportunity>>({
    category: 'Scholarship',
    regionScope: 'Cameroon',
    cost: 'Free',
    isOnline: false,
    authorRole: 'Admin',
    status: 'approved',
    requirements: [],
    tags: []
  });
  const [reqInput, setReqInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    opportunities.forEach(op => {
        counts[op.category] = (counts[op.category] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  }, [opportunities]);

  const pendingOps = opportunities.filter(op => op.status === 'pending');
  const pendingStories = stories.filter(s => s.status === 'pending');
  const pendingMentors = mentorApps.filter(m => m.status === 'pending');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const post: Opportunity = {
        id: Math.random().toString(36).substr(2, 9),
        title: newPost.title || 'Untitled',
        organization: newPost.organization || 'LaunchPad Admin',
        category: newPost.category as Category,
        regionScope: newPost.regionScope as RegionScope,
        location: newPost.location || 'Remote',
        deadline: newPost.deadline || '2024-12-31',
        description: newPost.description || '',
        tags: newPost.tags || [],
        postedAt: 'Just now',
        status: 'approved',
        authorRole: 'Admin',
        cost: newPost.cost as 'Free' | 'Paid',
        costAmount: newPost.costAmount,
        eligibility: newPost.eligibility || 'Open to all',
        requirements: newPost.requirements || [],
        benefits: newPost.benefits || '',
        applicationLink: newPost.applicationLink || '#',
        targetEducationLevels: [],
        isOnline: newPost.isOnline || false,
        mediaType: newPost.mediaType,
        mediaUrl: newPost.mediaUrl
    };
    setOpportunities([post, ...opportunities]);
    alert('Post published successfully!');
    setNewPost({ category: 'Scholarship', regionScope: 'Cameroon', cost: 'Free', requirements: [], tags: [] });
    setActiveTab('analytics');
  };

  const addReq = () => {
    if (reqInput.trim()) {
        setNewPost(prev => ({
            ...prev,
            requirements: [...(prev.requirements || []), reqInput.trim()]
        }));
        setReqInput('');
    }
  };

  const removeReq = (index: number) => {
     setNewPost(prev => ({
        ...prev,
        requirements: (prev.requirements || []).filter((_, i) => i !== index)
    }));
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const type = file.type.startsWith('video') ? 'video' : 'image';
          // Check size (e.g. limit to 5MB for 'low data' feeling)
          if (file.size > 5 * 1024 * 1024) {
              alert("File too large. Please upload media under 5MB.");
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              setNewPost(prev => ({ ...prev, mediaType: type, mediaUrl: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  const approveItem = (id: string, type: 'op' | 'story') => {
      if (type === 'op') {
          setOpportunities(prev => prev.map(op => op.id === id ? { ...op, status: 'approved' } : op));
      } else {
          setStories(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));
      }
  };

  const rejectItem = (id: string, type: 'op' | 'story') => {
      if (type === 'op') {
        setOpportunities(prev => prev.filter(op => op.id !== id));
      } else {
        setStories(prev => prev.filter(s => s.id !== id));
      }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
            <p className="text-gray-500 text-sm font-medium">Overview and Content Approval</p>
        </div>
        <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${activeTab === 'analytics' ? 'bg-golden-500 text-white' : 'bg-white dark:bg-charcoal-800 text-gray-600'}`}>Analytics</button>
            <button onClick={() => setActiveTab('create')} className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${activeTab === 'create' ? 'bg-golden-500 text-white' : 'bg-white dark:bg-charcoal-800 text-gray-600'}`}>Create Post</button>
            <button onClick={() => setActiveTab('mentors')} className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${activeTab === 'mentors' ? 'bg-golden-500 text-white' : 'bg-white dark:bg-charcoal-800 text-gray-600'}`}>Manage Mentors</button>
            <button onClick={() => setActiveTab('review')} className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all relative ${activeTab === 'review' || activeTab === 'mentor-review' ? 'bg-golden-500 text-white' : 'bg-white dark:bg-charcoal-800 text-gray-600'}`}>
                Queue
                {(pendingOps.length + pendingStories.length + pendingMentors.length) > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral-500 rounded-full text-[10px] flex items-center justify-center text-white border-2 border-white dark:border-charcoal-900">{pendingOps.length + pendingStories.length + pendingMentors.length}</span>}
            </button>
        </div>
      </div>

      {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
              <div className="bg-white dark:bg-charcoal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700 min-w-0">
                  <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Opportunity Distribution</h3>
                  <div className="h-64 w-full">
                    {categoryData.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categoryData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                              <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} interval={0} />
                              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', borderRadius: '8px' }} />
                              <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={30} />
                          </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
              </div>
               <div className="bg-white dark:bg-charcoal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700 min-w-0">
                  <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Engagement Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-beige-50 dark:bg-charcoal-700 rounded-lg min-w-0">
                          <p className="text-xs font-bold text-gray-400 uppercase">Total Users</p>
                          <p className="text-2xl font-bold text-charcoal-900 dark:text-white">780+</p>
                      </div>
                      <div className="p-4 bg-beige-50 dark:bg-charcoal-700 rounded-lg min-w-0">
                          <p className="text-xs font-bold text-gray-400 uppercase">Active Ops</p>
                          <p className="text-2xl font-bold text-charcoal-900 dark:text-white">{opportunities.filter(o => o.status === 'approved').length}</p>
                      </div>
                       <div className="p-4 bg-beige-50 dark:bg-charcoal-700 rounded-lg min-w-0">
                          <p className="text-xs font-bold text-gray-400 uppercase">Mentors</p>
                          <p className="text-2xl font-bold text-charcoal-900 dark:text-white">{mentors.length}</p>
                      </div>
                       <div className="p-4 bg-beige-50 dark:bg-charcoal-700 rounded-lg min-w-0">
                          <p className="text-xs font-bold text-gray-400 uppercase">Success Stories</p>
                          <p className="text-2xl font-bold text-charcoal-900 dark:text-white">{stories.length}</p>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'create' && (
          <div className="bg-white dark:bg-charcoal-800 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700 overflow-hidden max-w-2xl mx-auto">
              <form onSubmit={handleCreatePost} className="p-6 space-y-4">
                  <h3 className="text-xl font-bold mb-4">New Opportunity Post</h3>
                  <input placeholder="Title" required className="w-full p-3 border rounded-lg dark:bg-charcoal-700 dark:text-white focus:ring-2 focus:ring-golden-500 outline-none" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
                  
                  <div className="grid grid-cols-2 gap-4">
                       <select className="p-3 border rounded-lg dark:bg-charcoal-700 dark:text-white outline-none" value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value as Category})}>
                           <option>Scholarship</option><option>Internship</option><option>Hackathon</option><option>Grant</option><option>Competition</option>
                       </select>
                       <select className="p-3 border rounded-lg dark:bg-charcoal-700 dark:text-white outline-none" value={newPost.regionScope} onChange={e => setNewPost({...newPost, regionScope: e.target.value as RegionScope})}>
                           <option>Global</option><option>Africa</option><option>Cameroon</option><option>Specific City</option>
                       </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                       <input placeholder="Deadline" type="date" required className="w-full p-3 border rounded-lg dark:bg-charcoal-700 dark:text-white outline-none" value={newPost.deadline} onChange={e => setNewPost({...newPost, deadline: e.target.value})} />
                       <input placeholder="Location" required className="w-full p-3 border rounded-lg dark:bg-charcoal-700 dark:text-white outline-none" value={newPost.location} onChange={e => setNewPost({...newPost, location: e.target.value})} />
                  </div>

                  <textarea placeholder="Description" rows={4} className="w-full p-3 border rounded-lg dark:bg-charcoal-700 dark:text-white outline-none" value={newPost.description} onChange={e => setNewPost({...newPost, description: e.target.value})} />
                  
                  {/* Media Upload */}
                  <div className="border border-dashed border-gray-300 dark:border-charcoal-600 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-charcoal-900" onClick={() => fileInputRef.current?.click()}>
                       <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleMediaUpload} />
                       {newPost.mediaUrl ? (
                           <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                               <Check size={20}/> Media Attached ({newPost.mediaType})
                           </div>
                       ) : (
                           <div className="flex flex-col items-center gap-2 text-gray-500">
                               <div className="flex gap-2">
                                   <ImageIcon size={24}/> <Video size={24}/>
                               </div>
                               <p className="text-sm font-bold">Upload Image or Video (Low Res)</p>
                           </div>
                       )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Eligibility Criteria" className="w-full p-3 border rounded-lg dark:bg-charcoal-700 dark:text-white outline-none" value={newPost.eligibility} onChange={e => setNewPost({...newPost, eligibility: e.target.value})} />
                      <input placeholder="Benefits" className="w-full p-3 border rounded-lg dark:bg-charcoal-700 dark:text-white outline-none" value={newPost.benefits} onChange={e => setNewPost({...newPost, benefits: e.target.value})} />
                  </div>

                  <div>
                      <div className="flex gap-2 mb-2">
                           <input placeholder="Add Requirement (e.g. CV)" className="flex-1 p-2 border rounded-lg dark:bg-charcoal-700 dark:text-white outline-none" value={reqInput} onChange={e => setReqInput(e.target.value)} />
                           <button type="button" onClick={addReq} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"><Plus size={18}/></button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {(newPost.requirements || []).map((r, i) => (
                              <span key={i} className="px-2 py-1 bg-beige-100 dark:bg-charcoal-900 text-xs font-medium rounded flex items-center gap-1">
                                  {r} <button type="button" onClick={() => removeReq(i)}><X size={12}/></button>
                              </span>
                          ))}
                      </div>
                  </div>

                  <input placeholder="Application Link" className="w-full p-3 border rounded-lg dark:bg-charcoal-700 dark:text-white outline-none" value={newPost.applicationLink} onChange={e => setNewPost({...newPost, applicationLink: e.target.value})} />

                  <button type="submit" className="w-full py-3 bg-golden-500 text-white font-bold rounded-lg hover:bg-golden-600 transition-colors shadow-lg shadow-golden-500/20">Post Opportunity</button>
              </form>
          </div>
      )}

      {/* Review tabs remain similar, omitting for brevity as they are unchanged logic-wise */}
       {activeTab === 'review' && (
          <div className="space-y-6 max-w-3xl mx-auto">
               <div className="flex justify-end">
                   <button onClick={() => setActiveTab('mentor-review')} className="text-sm font-bold text-golden-500 hover:underline">View Mentor Applications</button>
               </div>
               <div>
                   <h3 className="text-lg font-bold mb-3 text-gray-700 dark:text-gray-300">Pending Opportunities</h3>
                   {pendingOps.length === 0 ? <p className="text-sm text-gray-400 italic">No pending posts.</p> : pendingOps.map(op => (
                       <div key={op.id} className="bg-white dark:bg-charcoal-800 p-4 rounded-xl shadow-sm border-l-4 border-coral-400 mb-3">
                           <div className="flex justify-between items-start">
                               <div>
                                   <h4 className="font-bold text-gray-900 dark:text-white">{op.title}</h4>
                                   <p className="text-xs text-gray-500">{op.organization} • Submitted by User</p>
                                   <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">{op.description}</p>
                               </div>
                               <div className="flex gap-2">
                                   <button onClick={() => approveItem(op.id, 'op')} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"><Check size={18}/></button>
                                   <button onClick={() => rejectItem(op.id, 'op')} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"><X size={18}/></button>
                               </div>
                           </div>
                       </div>
                   ))}
               </div>
               <div>
                   <h3 className="text-lg font-bold mb-3 text-gray-700 dark:text-gray-300">Pending Success Stories</h3>
                   {pendingStories.length === 0 ? <p className="text-sm text-gray-400 italic">No pending stories.</p> : pendingStories.map(s => (
                       <div key={s.id} className="bg-white dark:bg-charcoal-800 p-4 rounded-xl shadow-sm border-l-4 border-violet-400 mb-3">
                           <div className="flex justify-between items-start">
                               <div>
                                   <h4 className="font-bold text-gray-900 dark:text-white">{s.title}</h4>
                                   <p className="text-xs text-gray-500">By {s.authorName}</p>
                                   <p className="text-sm mt-2 text-gray-700 dark:text-gray-300 italic">"{s.content}"</p>
                               </div>
                               <div className="flex gap-2">
                                   <button onClick={() => approveItem(s.id, 'story')} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"><Check size={18}/></button>
                                   <button onClick={() => rejectItem(s.id, 'story')} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"><X size={18}/></button>
                               </div>
                           </div>
                       </div>
                   ))}
               </div>
          </div>
      )}

      {/* Mentor Review & List Tabs remain largely unchanged */}
      {activeTab === 'mentor-review' && (
          <div className="space-y-6 max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mentor Applications</h3>
                  <button onClick={() => setActiveTab('review')} className="text-sm font-bold text-gray-500 hover:text-gray-700">Back to Queue</button>
              </div>
              {pendingMentors.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-10">No pending mentor applications.</p>
              ) : (
                  pendingMentors.map(app => (
                      <div key={app.id} className="bg-white dark:bg-charcoal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700">
                          <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-golden-100 rounded-full flex items-center justify-center font-bold text-golden-700">{app.name.charAt(0)}</div>
                                  <div>
                                      <h4 className="font-bold text-lg">{app.name}</h4>
                                      <p className="text-sm text-gray-500">{app.email}</p>
                                  </div>
                              </div>
                              <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
                          </div>
                          <div className="space-y-2 mb-6">
                              <p className="text-sm"><span className="font-bold">Profession:</span> {app.profession}</p>
                              <p className="text-sm"><span className="font-bold">Bio:</span> {app.bio}</p>
                              <div className="flex gap-2 mt-2">
                                  {app.expertise.map(e => <span key={e} className="px-2 py-1 bg-gray-100 dark:bg-charcoal-900 text-xs rounded font-medium">{e}</span>)}
                              </div>
                          </div>
                          <div className="flex gap-3">
                              <button onClick={() => onReviewMentorApp(app.id, true)} className="flex-1 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors">Approve & Promote</button>
                              <button onClick={() => onReviewMentorApp(app.id, false)} className="flex-1 py-2 bg-gray-200 dark:bg-charcoal-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-300 transition-colors">Reject</button>
                          </div>
                      </div>
                  ))
              )}
          </div>
      )}

      {activeTab === 'mentors' && (
          <div className="space-y-4 max-w-4xl mx-auto">
               <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Active Mentors Directory</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {mentors.map(mentor => (
                       <div key={mentor.id} className="bg-white dark:bg-charcoal-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700 flex flex-col">
                           <div className="flex items-start gap-4 mb-3">
                                <div className="w-12 h-12 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-lg">{mentor.name.charAt(0)}</div>
                                <div>
                                    <h4 className="font-bold">{mentor.name}</h4>
                                    <p className="text-sm text-gray-500">{mentor.profession}</p>
                                    <p className="text-xs text-golden-500 font-bold mt-1">{mentor.rating} ★ ({mentor.reviewCount} reviews)</p>
                                </div>
                           </div>
                           <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{mentor.bio}</p>
                           <div className="mt-auto flex gap-2">
                               <button onClick={() => alert(`Opening chat with ${mentor.name}...`)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 dark:bg-charcoal-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">
                                   <Send size={14}/> Message
                               </button>
                               <button onClick={() => alert(`Emailing ${mentor.email}...`)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 dark:bg-charcoal-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">
                                   <Mail size={14}/> Email
                               </button>
                           </div>
                       </div>
                   ))}
               </div>
          </div>
      )}

    </div>
  );
};

export default AdminDashboard;
