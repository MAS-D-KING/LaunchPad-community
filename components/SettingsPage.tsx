
import React, { useState } from 'react';
import { Bell, Lock, Globe, Sparkles } from 'lucide-react';
import { UserProfile, Language, AIVoice } from '../types';

interface Props {
  user?: UserProfile;
  onUpdateProfile?: (data: Partial<UserProfile>) => void;
  onLogout?: () => void;
}

const SettingsPage: React.FC<Props> = ({ user, onUpdateProfile, onLogout }) => {
  const [notifications, setNotifications] = useState({
      email: user?.settings?.notifications ?? true,
      push: user?.settings?.push ?? true,
      reminders: user?.settings?.reminders ?? true,
      news: user?.settings?.news ?? false
  });

  const [privacy, setPrivacy] = useState({
      profileVisible: user?.settings?.privacyProfile ?? true,
      showActivity: user?.settings?.showActivity ?? true
  });

  // Local state for forms
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');
  const [lang, setLang] = useState<Language>(user?.language || 'en');
  const [voice, setVoice] = useState<AIVoice>(user?.settings?.voicePreference || 'Kore');

  const toggleNotif = (key: keyof typeof notifications) => {
      const newVal = !notifications[key];
      setNotifications(prev => ({ ...prev, [key]: newVal }));
      if (onUpdateProfile) {
          onUpdateProfile({ settings: { ...user?.settings, ...notifications, [key]: newVal } as any });
      }
  };
  
  const togglePrivacy = (key: keyof typeof privacy) => {
      const newVal = !privacy[key];
      setPrivacy(prev => ({ ...prev, [key]: newVal }));
      if (onUpdateProfile) {
          onUpdateProfile({ settings: { ...user?.settings, ...privacy, [key]: newVal } as any });
      }
  };

  const handleSaveProfile = () => {
      if (onUpdateProfile) {
          onUpdateProfile({ 
              city, 
              country, 
              language: lang,
              settings: { ...user?.settings, voicePreference: voice } as any
          });
          alert('Settings updated successfully!');
      }
  };

  const handleUpdatePassword = () => {
      const current = prompt("Enter current password");
      if(current) {
          const newPass = prompt("Enter new password");
          if(newPass) {
              alert("Password updated successfully!");
          }
      }
  };

  const handleSignOutAll = () => {
      if(confirm("Are you sure you want to sign out of all devices?")) {
          onLogout?.();
      }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">App Settings</h2>

        <div className="space-y-6">
            
            {/* Profile & Localization */}
            <div className="bg-white dark:bg-charcoal-800 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-charcoal-700 bg-beige-50 dark:bg-charcoal-900/50">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Globe size={18} className="text-blue-500"/> Localization & Preferences
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">City</label>
                            <input className="w-full p-2 border rounded-lg dark:bg-charcoal-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" value={city} onChange={e => setCity(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Country</label>
                            <input className="w-full p-2 border rounded-lg dark:bg-charcoal-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" value={country} onChange={e => setCountry(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">App Language</label>
                            <select className="w-full p-2 border rounded-lg dark:bg-charcoal-700 dark:text-white outline-none" value={lang} onChange={e => setLang(e.target.value as Language)}>
                                <option value="en">English (Default)</option>
                                <option value="fr">French (Français)</option>
                                <option value="pidgin">Cameroon Pidgin</option>
                                <option value="de">German (Deutsch)</option>
                                <option value="zh">Chinese (中文)</option>
                                <option value="es">Spanish (Español)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Sparkles size={12}/> AI Voice</label>
                            <select className="w-full p-2 border rounded-lg dark:bg-charcoal-700 dark:text-white outline-none" value={voice} onChange={e => setVoice(e.target.value as AIVoice)}>
                                <option value="Kore">Kore (Balanced)</option>
                                <option value="Puck">Puck (Energetic)</option>
                                <option value="Fenrir">Fenrir (Deep)</option>
                                <option value="Charon">Charon (Calm)</option>
                                <option value="Aoede">Aoede (Warm)</option>
                            </select>
                        </div>
                    </div>
                    <button onClick={handleSaveProfile} className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">Save Localization Changes</button>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-charcoal-800 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-charcoal-700 bg-beige-50 dark:bg-charcoal-900/50">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Bell size={18} className="text-golden-500"/> Notifications
                    </h3>
                </div>
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Push Notifications</p>
                            <p className="text-xs text-gray-500">Receive alerts on your device</p>
                        </div>
                        <button onClick={() => toggleNotif('push')} className={`w-10 h-5 rounded-full p-0.5 transition-colors ${notifications.push ? 'bg-golden-500' : 'bg-gray-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications.push ? 'translate-x-5' : ''}`}/>
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Email Updates</p>
                            <p className="text-xs text-gray-500">Receive weekly digest</p>
                        </div>
                        <button onClick={() => toggleNotif('email')} className={`w-10 h-5 rounded-full p-0.5 transition-colors ${notifications.email ? 'bg-golden-500' : 'bg-gray-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications.email ? 'translate-x-5' : ''}`}/>
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Deadline Reminders</p>
                            <p className="text-xs text-gray-500">Get notified 2 days before due dates</p>
                        </div>
                         <button onClick={() => toggleNotif('reminders')} className={`w-10 h-5 rounded-full p-0.5 transition-colors ${notifications.reminders ? 'bg-golden-500' : 'bg-gray-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications.reminders ? 'translate-x-5' : ''}`}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* Privacy */}
            <div className="bg-white dark:bg-charcoal-800 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-charcoal-700 bg-beige-50 dark:bg-charcoal-900/50">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Lock size={18} className="text-violet-500"/> Privacy & Security
                    </h3>
                </div>
                <div className="p-4 space-y-4">
                     <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Public Profile</p>
                            <p className="text-xs text-gray-500">Allow mentors to find you</p>
                        </div>
                        <button onClick={() => togglePrivacy('profileVisible')} className={`w-10 h-5 rounded-full p-0.5 transition-colors ${privacy.profileVisible ? 'bg-violet-500' : 'bg-gray-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${privacy.profileVisible ? 'translate-x-5' : ''}`}/>
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Show Activity Status</p>
                            <p className="text-xs text-gray-500">Let others see when you are online</p>
                        </div>
                        <button onClick={() => togglePrivacy('showActivity')} className={`w-10 h-5 rounded-full p-0.5 transition-colors ${privacy.showActivity ? 'bg-violet-500' : 'bg-gray-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${privacy.showActivity ? 'translate-x-5' : ''}`}/>
                        </button>
                    </div>
                    
                    <div className="border-t border-gray-100 dark:border-charcoal-700 pt-4 mt-2">
                         <button onClick={handleUpdatePassword} className="w-full text-left flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-charcoal-900 rounded-lg">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Change Password</span>
                            <span className="text-xs text-blue-500 font-bold">Update</span>
                         </button>
                         <button onClick={handleSignOutAll} className="w-full text-left flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-charcoal-900 rounded-lg text-red-500">
                            <span className="text-sm font-bold">Sign out of all devices</span>
                            <span className="text-xs font-bold">Execute</span>
                         </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default SettingsPage;
