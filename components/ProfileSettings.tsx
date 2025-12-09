
import React, { useState, useRef } from 'react';
import { UserProfile, MentorService } from '../types';
import { Settings, Award, Bookmark, Star, Edit, Shield, LogOut, CheckCircle, Briefcase, BookOpen, Clock, Linkedin, Camera, User, Plus, Save } from 'lucide-react';

interface Props {
  user: UserProfile;
  onUpdateProfile?: (data: Partial<UserProfile>) => void;
}

const ProfileSettings: React.FC<Props> = ({ user, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio || '');

  // Achievement Modal
  const [showAchieveModal, setShowAchieveModal] = useState(false);
  const [newAchieveTitle, setNewAchieveTitle] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onUpdateProfile) {
          const reader = new FileReader();
          reader.onloadend = () => {
              onUpdateProfile({ image: reader.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const saveProfile = () => {
      if (onUpdateProfile) {
          onUpdateProfile({ name: editName, bio: editBio });
          setIsEditing(false);
      }
  };

  const addAchievement = () => {
      if (newAchieveTitle && onUpdateProfile) {
          const newAchieves = [...(user.achievements || []), newAchieveTitle];
          onUpdateProfile({ achievements: newAchieves });
          setNewAchieveTitle('');
          setShowAchieveModal(false);
      }
  };

  const renderUserProfile = () => (
    <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-charcoal-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-charcoal-700 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {user.image ? (
                    <img src={user.image} alt={user.name} className="w-28 h-28 rounded-full object-cover border-4 border-beige-100 dark:border-charcoal-600 shadow-lg" />
                ) : (
                    <div className="w-28 h-28 rounded-full bg-golden-500 flex items-center justify-center text-5xl text-white font-bold border-4 border-beige-100 dark:border-charcoal-600 shadow-lg">
                        {user.name.charAt(0)}
                    </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="text-white" size={24} />
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>

            <div className="flex-1 text-center md:text-left w-full">
                {isEditing ? (
                    <div className="space-y-3">
                        <input value={editName} onChange={e => setEditName(e.target.value)} className="text-3xl font-extrabold text-gray-900 dark:text-white bg-transparent border-b border-golden-500 w-full outline-none" placeholder="Your Name"/>
                        <textarea value={editBio} onChange={e => setEditBio(e.target.value)} className="w-full p-2 bg-gray-50 dark:bg-charcoal-900 rounded border border-gray-200 dark:border-charcoal-600 text-sm" rows={3} placeholder="Your Bio..."/>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{user.name}</h2>
                        <p className="text-coral-500 font-bold mb-2">{user.username || '@username'}</p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1"><Briefcase size={14}/> {user.education}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{user.city}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className="flex items-center gap-1"><User size={14}/> Age: {user.age} • {user.gender || 'N/A'}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 max-w-md italic bg-beige-50 dark:bg-charcoal-900/50 p-3 rounded-lg border border-beige-100 dark:border-charcoal-700 mx-auto md:mx-0">{user.bio || 'No bio yet.'}</p>
                    </>
                )}
            </div>
            <div className="flex gap-2 self-start mt-4 md:mt-0">
                 {isEditing ? (
                     <button onClick={saveProfile} className="px-4 py-2 text-sm font-bold bg-golden-500 text-white rounded-lg hover:bg-golden-600 flex items-center gap-2"><Save size={14}/> Save</button>
                 ) : (
                     <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-bold bg-charcoal-900 dark:bg-white text-white dark:text-charcoal-900 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"><Edit size={14}/> Edit</button>
                 )}
            </div>
        </div>

        {/* Academic & Interests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-charcoal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-charcoal-600 pb-2"><BookOpen size={20} className="text-violet-500"/> Academic Info</h3>
                 <div className="space-y-4 text-sm">
                     <div className="flex justify-between items-center bg-gray-50 dark:bg-charcoal-900/50 p-3 rounded-lg">
                         <span className="text-gray-500 font-medium">Level</span>
                         <span className="font-bold text-gray-800 dark:text-gray-200">{user.education}</span>
                     </div>
                     <div className="flex justify-between items-center bg-gray-50 dark:bg-charcoal-900/50 p-3 rounded-lg">
                         <span className="text-gray-500 font-medium">Field</span>
                         <span className="font-bold text-gray-800 dark:text-gray-200">{user.academicBackground || 'N/A'}</span>
                     </div>
                     <div className="flex justify-between items-center bg-gray-50 dark:bg-charcoal-900/50 p-3 rounded-lg">
                         <span className="text-gray-500 font-medium">Graduation</span>
                         <span className="font-bold text-gray-800 dark:text-gray-200">{user.graduationYear || 'N/A'}</span>
                     </div>
                 </div>
            </div>

            <div className="bg-white dark:bg-charcoal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-charcoal-600 pb-2"><Star size={20} className="text-golden-500"/> Interests & Needs</h3>
                 <div className="flex flex-wrap gap-2 mb-6">
                     {user.interests.map(i => (
                         <span key={i} className="px-3 py-1.5 bg-beige-100 dark:bg-charcoal-900 rounded-full text-xs font-bold text-charcoal-700 dark:text-gray-300">{i}</span>
                     ))}
                 </div>
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Specific Needs</h4>
                 <div className="flex flex-wrap gap-2">
                     {user.specificNeeds?.map(n => (
                         <span key={n} className="px-3 py-1.5 border border-coral-400 text-coral-600 dark:text-coral-400 rounded-full text-xs font-bold">{n}</span>
                     ))}
                 </div>
            </div>
        </div>

        {/* Activity & Achievements */}
        <div className="bg-white dark:bg-charcoal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Activity Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                 <div className="p-4 bg-golden-50 dark:bg-charcoal-900 rounded-xl border border-golden-100 dark:border-charcoal-600">
                     <p className="text-3xl font-extrabold text-golden-500">{user.opportunitiesApplied || 0}</p>
                     <p className="text-xs text-gray-500 font-bold uppercase mt-1">Applied</p>
                 </div>
                 <div className="p-4 bg-coral-50 dark:bg-charcoal-900 rounded-xl border border-coral-100 dark:border-charcoal-600">
                     <p className="text-3xl font-extrabold text-coral-500">{user.opportunitiesSaved || 0}</p>
                     <p className="text-xs text-gray-500 font-bold uppercase mt-1">Saved</p>
                 </div>
                 <div className="p-4 bg-gray-50 dark:bg-charcoal-900 rounded-xl col-span-2 md:col-span-2 text-left flex items-center gap-4 border border-gray-100 dark:border-charcoal-600">
                     <div className="flex-1">
                         <h4 className="font-bold text-sm mb-2 text-gray-800 dark:text-gray-200">Achievements</h4>
                         <div className="flex flex-wrap gap-2">
                             {user.achievements?.map(a => (
                                 <div key={a} className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-xl shadow-sm cursor-help" title={a}>🏆</div>
                             ))}
                             <button onClick={() => setShowAchieveModal(true)} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-charcoal-700 flex items-center justify-center text-xs text-gray-500 font-bold border-2 border-dashed border-gray-400 hover:border-golden-500 hover:text-golden-500 transition-colors">+</button>
                         </div>
                     </div>
                 </div>
            </div>
        </div>

        {/* Add Achievement Modal */}
        {showAchieveModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-charcoal-800 rounded-xl p-6 w-full max-w-sm shadow-xl">
                    <h3 className="font-bold text-lg mb-4 dark:text-white">Add Achievement</h3>
                    <input 
                        className="w-full p-2 border rounded mb-2 dark:bg-charcoal-900 dark:text-white" 
                        placeholder="Title (e.g. Hackathon Winner)"
                        value={newAchieveTitle}
                        onChange={e => setNewAchieveTitle(e.target.value)}
                    />
                    <textarea 
                        className="w-full p-2 border rounded mb-4 dark:bg-charcoal-900 dark:text-white" 
                        placeholder="Description / Proof Link (Optional)" 
                        rows={2}
                    />
                    <div className="flex gap-2">
                        <button onClick={() => setShowAchieveModal(false)} className="flex-1 py-2 bg-gray-200 rounded font-bold text-sm">Cancel</button>
                        <button onClick={addAchievement} className="flex-1 py-2 bg-golden-500 text-white rounded font-bold text-sm">Add</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );

  const renderMentorProfile = () => (
    <div className="space-y-8">
        {/* Professional Header */}
        <div className="bg-white dark:bg-charcoal-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-charcoal-700">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-charcoal-800 shadow-lg" />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-violet-500 flex items-center justify-center text-5xl text-white font-bold shadow-lg">
                            {user.name.charAt(0)}
                        </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white dark:border-charcoal-800"><CheckCircle size={20}/></div>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                        <Camera className="text-white" size={24} />
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>

                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex flex-col md:flex-row items-center gap-3">
                        {user.name} 
                        <span className="text-xs font-bold text-white bg-blue-500 px-3 py-1 rounded-full shadow-sm shadow-blue-500/30">Verified Mentor</span>
                    </h2>
                    <p className="text-xl text-coral-500 font-bold mt-1">{user.profession || 'Industry Expert'}</p>
                    <p className="text-sm text-gray-500 font-medium mt-1">{user.currentRole} • {user.city}, {user.country}</p>
                    
                    <div className="flex gap-6 mt-6 justify-center md:justify-start">
                        <a href={user.linkedinLink} className="text-blue-600 hover:text-blue-700 bg-blue-50 p-2 rounded-lg"><Linkedin size={24}/></a>
                        <div className="flex items-center gap-2 text-golden-500 text-lg font-bold bg-golden-50 px-3 py-1 rounded-lg">
                           <Star size={20} fill="currentColor" /> {user.rating} <span className="text-gray-400 font-normal text-sm">({user.reviewCount} reviews)</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-charcoal-700 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Expertise</h4>
                     <div className="flex flex-wrap gap-2">
                         {user.expertise?.map(e => <span key={e} className="px-2 py-1 bg-gray-100 dark:bg-charcoal-900 rounded-md text-xs font-bold text-gray-700 dark:text-gray-300">{e}</span>)}
                     </div>
                </div>
                <div>
                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Services</h4>
                     <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                         {user.services?.map(s => <li key={s} className="flex items-center gap-2 font-medium"><div className="w-2 h-2 rounded-full bg-coral-500"></div> {s}</li>)}
                     </ul>
                </div>
                 <div>
                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Availability</h4>
                     <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-bold bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg w-fit">
                         <Clock size={18}/> {user.availability}
                     </div>
                </div>
            </div>
        </div>

        {/* Settings Area */}
        <div className="bg-white dark:bg-charcoal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button className="flex items-center justify-between p-4 bg-beige-50 dark:bg-charcoal-900 rounded-xl hover:bg-beige-100 dark:hover:bg-charcoal-700 transition-colors font-bold text-charcoal-800 dark:text-gray-200">
                     <span>Manage Availability</span>
                     <Clock size={20} className="text-gray-400"/>
                 </button>
                  <button className="flex items-center justify-between p-4 bg-beige-50 dark:bg-charcoal-900 rounded-xl hover:bg-beige-100 dark:hover:bg-charcoal-700 transition-colors font-bold text-charcoal-800 dark:text-gray-200">
                     <span>Edit Services</span>
                     <Briefcase size={20} className="text-gray-400"/>
                 </button>
                  <button className="flex items-center justify-between p-4 bg-beige-50 dark:bg-charcoal-900 rounded-xl hover:bg-beige-100 dark:hover:bg-charcoal-700 transition-colors font-bold text-charcoal-800 dark:text-gray-200">
                     <span>Upload Resources</span>
                     <BookOpen size={20} className="text-gray-400"/>
                 </button>
             </div>
        </div>
    </div>
  );

  const renderAdminProfile = () => (
    <div className="space-y-8">
        <div className="bg-charcoal-900 text-white p-6 md:p-8 rounded-2xl shadow-md border-l-8 border-coral-500">
            <div className="flex items-center gap-6">
                 <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="w-20 h-20 rounded-xl object-cover shadow-lg" />
                    ) : (
                        <div className="w-20 h-20 rounded-xl bg-coral-500 flex items-center justify-center text-3xl font-bold shadow-lg">
                            <Shield size={32} />
                        </div>
                    )}
                     <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="text-white" size={20} />
                    </div>
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                 </div>

                 <div>
                     <h2 className="text-2xl font-bold">{user.name}</h2>
                     <p className="text-coral-400 font-bold tracking-wide uppercase text-sm mt-1">{user.adminRole || 'Administrator'}</p>
                     <p className="text-sm text-gray-400 mt-1">{user.email}</p>
                 </div>
            </div>
        </div>

        <div className="bg-white dark:bg-charcoal-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Permissions & Security</h3>
            <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-charcoal-900 rounded-lg border border-gray-200 dark:border-charcoal-600">
                    <h4 className="text-sm font-bold mb-3 text-gray-600 dark:text-gray-300 uppercase">Active Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                        {user.permissions?.map(p => (
                            <span key={p} className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-md font-bold font-mono border border-green-200">{p}</span>
                        )) || <span className="text-sm text-gray-500">Standard Admin Access</span>}
                    </div>
                </div>
                 <div className="flex gap-4">
                     <button className="px-4 py-2 bg-gray-100 dark:bg-charcoal-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors">View Logs</button>
                     <button className="px-4 py-2 bg-gray-100 dark:bg-charcoal-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors">2FA Settings</button>
                 </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Role-Based Content */}
      {user.role === 'User' && renderUserProfile()}
      {user.role === 'Mentor' && renderMentorProfile()}
      {user.role === 'Admin' && renderAdminProfile()}

      {/* Common Settings */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-charcoal-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"><Settings size={20}/> General Settings</h3>
          <div className="space-y-4 max-w-lg">
               <div className="flex items-center justify-between p-4 bg-white dark:bg-charcoal-800 rounded-xl border border-gray-100 dark:border-charcoal-700 shadow-sm">
                   <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Email Notifications</span>
                   <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${user.settings?.notifications ? 'bg-golden-500' : 'bg-gray-300'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${user.settings?.notifications ? 'translate-x-6' : ''}`}></div>
                   </div>
               </div>
               <div className="flex items-center justify-between p-4 bg-white dark:bg-charcoal-800 rounded-xl border border-gray-100 dark:border-charcoal-700 shadow-sm">
                   <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Change Password</span>
                   <button onClick={() => alert('Password update link sent to email.')} className="text-xs font-bold text-blue-500 hover:underline">Update</button>
               </div>
               <button onClick={() => alert('Signed out of all other devices.')} className="flex items-center gap-2 text-red-500 font-bold text-sm mt-4 hover:bg-red-50 p-2 rounded-lg transition-colors">
                   <LogOut size={16}/> Sign out of all devices
               </button>
          </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
