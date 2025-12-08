import React, { useState } from 'react';
import { UserProfile, MentorService } from '../types';
import { Save, Calendar, Users, Upload } from 'lucide-react';

interface Props {
  user: UserProfile;
}

const MentorDashboard: React.FC<Props> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'requests' | 'resources'>('profile');
  
  const [bio, setBio] = useState(user.bio || '');
  const [availability, setAvailability] = useState(user.availability || 'Weekly');
  
  const requests = [
      { id: '1', student: 'Amara Ndiaye', topic: 'CV Review', date: '2024-10-15', status: 'Pending' },
      { id: '2', student: 'John Doe', topic: 'Career Advice', date: '2024-10-18', status: 'Accepted' }
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mentor Dashboard</h2>
        
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-charcoal-700 overflow-x-auto">
            <button onClick={() => setActiveTab('profile')} className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'border-golden-500 text-golden-500' : 'border-transparent text-gray-500'}`}>My Profile</button>
            <button onClick={() => setActiveTab('requests')} className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'requests' ? 'border-golden-500 text-golden-500' : 'border-transparent text-gray-500'}`}>Mentorship Requests</button>
            <button onClick={() => setActiveTab('resources')} className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'resources' ? 'border-golden-500 text-golden-500' : 'border-transparent text-gray-500'}`}>Learning Resources</button>
        </div>

        {activeTab === 'profile' && (
            <div className="bg-white dark:bg-charcoal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700 max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-violet-500 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-golden-100 text-golden-800 text-xs font-bold rounded">Verified Mentor</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Professional Bio</label>
                        <textarea 
                            className="w-full p-3 border rounded-lg bg-beige-50 dark:bg-charcoal-700 dark:text-white outline-none focus:ring-2 focus:ring-golden-500"
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Availability</label>
                        <select 
                            className="w-full p-3 border rounded-lg bg-beige-50 dark:bg-charcoal-700 dark:text-white outline-none"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value as any)}
                        >
                            <option>Weekly</option>
                            <option>Monthly</option>
                            <option>On Request</option>
                            <option>Unavailable</option>
                        </select>
                    </div>
                    
                    <div>
                         <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Services I Offer</label>
                         <div className="flex flex-wrap gap-2">
                             {['CV Review', 'Portfolio Review', 'Career Advice', 'Academic Guidance'].map(s => (
                                 <span key={s} className="px-3 py-1 bg-coral-50 text-coral-600 border border-coral-100 rounded-full text-xs font-bold">{s}</span>
                             ))}
                         </div>
                    </div>

                    <button className="flex items-center gap-2 bg-charcoal-900 dark:bg-white text-white dark:text-charcoal-900 px-6 py-2.5 rounded-lg font-bold hover:bg-golden-500 dark:hover:bg-golden-500 hover:text-white transition-colors">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'requests' && (
            <div className="space-y-4">
                {requests.map(req => (
                    <div key={req.id} className="bg-white dark:bg-charcoal-800 p-4 rounded-xl flex items-center justify-between shadow-sm border border-gray-100 dark:border-charcoal-700">
                        <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-gray-100 dark:bg-charcoal-900 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">{req.student.charAt(0)}</div>
                             <div>
                                 <h4 className="font-bold text-gray-900 dark:text-white">{req.student}</h4>
                                 <p className="text-sm text-gray-500">Requested: <span className="text-golden-600 font-medium">{req.topic}</span></p>
                             </div>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-gray-400 mb-1 font-mono">{req.date}</p>
                             <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-golden-100 text-golden-700'}`}>{req.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'resources' && (
            <div className="text-center py-12 bg-white dark:bg-charcoal-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-charcoal-600">
                 <div className="w-16 h-16 bg-beige-100 dark:bg-charcoal-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Upload size={32} />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload Learning Materials</h3>
                 <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Share PDFs, Guides, or Video Links with your mentees to help them grow.</p>
                 <button className="px-6 py-2 bg-golden-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-golden-500/20 hover:bg-golden-600 transition-colors">Select Files</button>
            </div>
        )}
    </div>
  );
};

export default MentorDashboard;