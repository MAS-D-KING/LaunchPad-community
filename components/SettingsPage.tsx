
import React, { useState } from 'react';
import { Bell, Lock, Globe, Sparkles, User, Shield, Palette } from 'lucide-react';
import { UserProfile, Language, AIVoice } from '../types';

interface Props {
  user?: UserProfile;
  onUpdateProfile?: (data: Partial<UserProfile>) => void;
  onLogout?: () => void;
}

const SettingsPage: React.FC<Props> = ({ user, onUpdateProfile, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'account' | 'profile' | 'notifications' | 'appearance' | 'privacy'>('account');

  // We reuse the state logic from previous version, just organizing into tabs
  const [notifications, setNotifications] = useState({
      email: user?.settings?.notifications ?? true,
      push: user?.settings?.push ?? true,
      reminders: user?.settings?.reminders ?? true,
      news: user?.settings?.news ?? false
  });
  
  const [lang, setLang] = useState<Language>(user?.language || 'en');
  const [voice, setVoice] = useState<AIVoice>(user?.settings?.voicePreference || 'Kore');

  const handleSave = () => {
      onUpdateProfile?.({ language: lang, settings: { ...user?.settings, voicePreference: voice, ...notifications } as any });
      alert("Settings saved.");
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'account':
              return (
                  <div className="space-y-6 animate-fadeIn">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Account Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><label className="text-xs font-bold text-gray-500">Full Name</label><input disabled value={user?.name} className="w-full p-2 bg-gray-100 dark:bg-charcoal-700 rounded border-none"/></div>
                          <div><label className="text-xs font-bold text-gray-500">Email</label><input disabled value={user?.email} className="w-full p-2 bg-gray-100 dark:bg-charcoal-700 rounded border-none"/></div>
                      </div>
                      <div className="pt-4 border-t border-gray-100 dark:border-charcoal-700">
                          <button className="text-sm font-bold text-blue-500 hover:underline mb-2 block">Change Password</button>
                          <button className="text-sm font-bold text-red-500 hover:underline block" onClick={onLogout}>Sign Out</button>
                      </div>
                  </div>
              );
          case 'profile':
              return (
                  <div className="space-y-6 animate-fadeIn">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Public Profile</h3>
                      <div><label className="text-xs font-bold text-gray-500">Bio</label><textarea className="w-full p-2 bg-white dark:bg-charcoal-800 border rounded" rows={3} defaultValue={user?.bio}/></div>
                      <div className="grid grid-cols-2 gap-4">
                          <div><label className="text-xs font-bold text-gray-500">Education</label><input className="w-full p-2 bg-white dark:bg-charcoal-800 border rounded" defaultValue={user?.education}/></div>
                          <div><label className="text-xs font-bold text-gray-500">City</label><input className="w-full p-2 bg-white dark:bg-charcoal-800 border rounded" defaultValue={user?.city}/></div>
                      </div>
                      <button className="bg-golden-500 text-white px-4 py-2 rounded font-bold text-sm" onClick={handleSave}>Save Profile</button>
                  </div>
              );
          case 'appearance':
              return (
                  <div className="space-y-6 animate-fadeIn">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Appearance & AI</h3>
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-charcoal-800 rounded-lg shadow-sm">
                          <span className="font-bold text-sm">Dark Mode</span>
                          <span className="text-xs text-gray-500">Managed via Header Toggle</span>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 mb-2 block">AI Voice Preference</label>
                          <select className="w-full p-2 bg-white dark:bg-charcoal-800 border rounded" value={voice} onChange={e => setVoice(e.target.value as any)}>
                                <option value="Kore">Kore</option><option value="Puck">Puck</option><option value="Fenrir">Fenrir</option>
                          </select>
                      </div>
                      <button className="bg-golden-500 text-white px-4 py-2 rounded font-bold text-sm" onClick={handleSave}>Apply Changes</button>
                  </div>
              );
          default:
              return <div className="text-gray-500">Settings available in full version.</div>;
      }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0 space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
            {[
                { id: 'account', label: 'Account', icon: User },
                { id: 'profile', label: 'Profile', icon: Shield },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'appearance', label: 'Appearance', icon: Palette },
                { id: 'privacy', label: 'Privacy', icon: Lock },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-charcoal-900 text-white dark:bg-white dark:text-charcoal-900 shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-charcoal-800'}`}
                >
                    <tab.icon size={18}/> {tab.label}
                </button>
            ))}
        </div>

        <div className="flex-1 bg-beige-50 dark:bg-charcoal-900 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-charcoal-700">
            {renderContent()}
        </div>
    </div>
  );
};

export default SettingsPage;
