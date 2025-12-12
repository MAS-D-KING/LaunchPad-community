
import React, { useState } from 'react';
import { UserProfile, UserRole, Category } from '../types';
import { ADMIN_CREDENTIALS, MENTOR_CREDENTIALS, ALL_INTERESTS } from '../constants';
import { LogIn, UserPlus, Mail, ArrowLeft, CheckCircle, Lock, Sparkles, Target, ArrowRight } from 'lucide-react';

interface Props {
  onLogin: (user: UserProfile) => void;
}

type AuthStep = 'form' | 'verify' | 'onboarding-interests' | 'onboarding-categories' | 'onboarding-goals';

const AuthScreen: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [authStep, setAuthStep] = useState<AuthStep>('form');
  const [role, setRole] = useState<UserRole>('User');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Cameroon');
  const [age, setAge] = useState<number>(20);
  const [gender, setGender] = useState<'Male'|'Female'|'Prefer not to say'>('Male');
  const [education, setEducation] = useState('High School');
  const [academicBackground, setAcademicBackground] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const availableCategories: Category[] = ['Scholarship', 'Internship', 'Hackathon', 'Grant', 'Volunteering', 'Fellowship', 'Competition', 'Job', 'Event'];
  
  const toggleSelection = <T extends string>(item: T, list: T[], setList: React.Dispatch<React.SetStateAction<T[]>>) => {
    if (list.includes(item)) setList(list.filter(i => i !== item));
    else setList([...list, item]);
  };

  const saveUserToRegistry = (user: UserProfile) => {
      const registry = JSON.parse(localStorage.getItem('launchpad_registry') || '[]');
      const filtered = registry.filter((u: any) => u.email !== user.email);
      filtered.push({ email: user.email, password: password, profile: user });
      localStorage.setItem('launchpad_registry', JSON.stringify(filtered));
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
        // In a real app, this would be a redirect. Here we simulate success.
        const googleEmail = "user@gmail.com"; 
        
        const registry = JSON.parse(localStorage.getItem('launchpad_registry') || '[]');
        const existing = registry.find((u: any) => u.email === googleEmail);
        
        if (existing) { 
            setIsGoogleLoading(false); 
            onLogin(existing.profile); 
            return; 
        }
        
        const googleUser: UserProfile = {
            id: 'google-' + Math.random().toString(36).substr(2, 9),
            name: "Google User", 
            email: googleEmail, 
            role: 'User', 
            education: 'Undergraduate', 
            academicBackground: 'General', 
            interests: ['Technology'], 
            city: 'Yaoundé', 
            country: 'Cameroon', 
            age: 20, 
            gender: 'Prefer not to say',
            language: 'en', 
            achievements: ["Verified"], 
            joinedCommunityIds: [],
            settings: { notifications: true, push: true, reminders: true, news: false, privacyProfile: true }
        };
        saveUserToRegistry(googleUser); 
        setIsGoogleLoading(false); 
        onLogin(googleUser);
    }, 1500);
  };

  const handleSignUpInitiation = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!name || !email || !city || !education || !password) { setError("Please fill fields."); return; }
    const newUser: UserProfile = {
        id: 'new-' + Math.random(), name, email, role: 'User', education, academicBackground, city, country, age, gender,
        language: 'en', interests: [], targetCategories: [], joinedCommunityIds: [], settings: { notifications: true, push: true, reminders: true, news: false }
    };
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code); setPendingUser(newUser);
    alert(`Your Code: [${code}]`);
    setAuthStep('verify');
  };

  const handleVerificationSubmit = (e: React.FormEvent) => { e.preventDefault(); if (verificationCode === sentCode) setAuthStep('onboarding-interests'); else setError("Incorrect code."); };
  const handleInterestsSubmit = () => { if (pendingUser) { setPendingUser({ ...pendingUser, interests }); setAuthStep('onboarding-categories'); }};
  const handleCategoriesSubmit = () => { if (pendingUser) { setPendingUser({ ...pendingUser, targetCategories: selectedCategories }); setAuthStep('onboarding-goals'); }};
  const handleGoalsSubmit = (e: React.FormEvent) => { e.preventDefault(); if (pendingUser) { const finalUser = { ...pendingUser, goals }; saveUserToRegistry(finalUser); onLogin(finalUser); }};

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (role === 'Admin') {
      const admin = ADMIN_CREDENTIALS.find(a => a.email === email && a.pass === password);
      if (admin) { onLogin({ ...baseUser(admin.name), role: 'Admin', id: 'admin-1' }); return; }
    } 
    if (role === 'Mentor') {
        const mentor = MENTOR_CREDENTIALS.find(m => m.email === email && m.pass === password);
        if (mentor) { onLogin({ ...baseUser(mentor.name), role: 'Mentor', id: 'm-1' }); return; }
    } 
    if (email && password) {
        const registry = JSON.parse(localStorage.getItem('launchpad_registry') || '[]');
        const registeredUser = registry.find((u: any) => u.email === email && u.password === password);
        if (registeredUser) onLogin(registeredUser.profile);
        else setError('Invalid Credentials.');
    }
  };

  const baseUser = (userName: string): UserProfile => ({
      id: 'u-' + Math.random(), name: userName, email, role, education: 'Undergraduate', interests: ['Technology'], city: 'Buea', country: 'Cameroon', language: 'en', age: 22, gender: 'Male', joinedCommunityIds: [], settings: { notifications: true, push: true, reminders: true, news: true }
  });

  if (authStep === 'verify') return (
        <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-charcoal-900 px-4">
            <div className="bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-xl w-full max-w-md border dark:border-charcoal-700">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Verify Email</h2>
                <input type="text" maxLength={6} className="w-full text-center text-3xl p-4 border rounded-xl mb-4 dark:bg-charcoal-700 dark:text-white" placeholder="000000" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button onClick={handleVerificationSubmit} className="w-full bg-golden-500 text-white font-bold py-3 rounded-lg">Verify</button>
            </div>
        </div>
  );

  if (authStep === 'onboarding-interests') return (
      <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-charcoal-900 px-4">
        <div className="bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-xl w-full max-w-2xl border dark:border-charcoal-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Select Interests</h2>
            <div className="flex flex-wrap gap-3 mb-8">{ALL_INTERESTS.map(i => <button key={i} onClick={() => toggleSelection(i, interests, setInterests)} className={`px-4 py-2 text-sm font-bold rounded-full border-2 ${interests.includes(i) ? 'bg-golden-500 text-white border-golden-500' : 'border-gray-200 text-gray-600'}`}>{i}</button>)}</div>
            <button onClick={handleInterestsSubmit} className="w-full bg-charcoal-900 text-white font-bold py-3 rounded-lg">Next</button>
        </div>
      </div>
  );

  if (authStep === 'onboarding-categories') return (
      <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-charcoal-900 px-4">
        <div className="bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-xl w-full max-w-2xl border dark:border-charcoal-700">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">What are you looking for?</h2>
            <div className="flex flex-wrap gap-3 mb-8">{availableCategories.map(c => <button key={c} onClick={() => toggleSelection(c, selectedCategories, setSelectedCategories)} className={`px-4 py-2 text-sm font-bold rounded-lg border-2 ${selectedCategories.includes(c) ? 'bg-coral-500 text-white border-coral-500' : 'border-gray-200 text-gray-600'}`}>{c}</button>)}</div>
            <button onClick={handleCategoriesSubmit} className="w-full bg-charcoal-900 text-white font-bold py-3 rounded-lg">Next</button>
        </div>
      </div>
  );

  if (authStep === 'onboarding-goals') return (
      <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-charcoal-900 px-4">
        <div className="bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-xl w-full max-w-md border dark:border-charcoal-700">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Current Goal</h2>
            <textarea className="w-full p-4 rounded-xl border dark:bg-charcoal-700 dark:text-white mb-6" placeholder="e.g. Get a scholarship..." rows={3} value={goals} onChange={(e) => setGoals(e.target.value)} />
            <button onClick={handleGoalsSubmit} className="w-full bg-golden-500 text-white font-bold py-3 rounded-lg">Finish</button>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-charcoal-900 px-4 py-8 overflow-y-auto">
      <div className="bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100 dark:border-charcoal-700">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-charcoal-900 dark:text-white">LaunchPad<span className="text-golden-500">.</span></h1>
            <p className="text-sm font-medium text-coral-500 mt-2 uppercase tracking-wide">Cameroon's Opportunity Engine</p>
        </div>

        <div className="flex bg-beige-100 dark:bg-charcoal-700 rounded-lg p-1.5 mb-6">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${isLogin ? 'bg-white dark:bg-charcoal-600 shadow-sm text-golden-600 dark:text-white' : 'text-gray-500'}`}>Log In</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isLogin ? 'bg-white dark:bg-charcoal-600 shadow-sm text-golden-600 dark:text-white' : 'text-gray-500'}`}>Sign Up</button>
        </div>

        <form onSubmit={isLogin ? handleLoginSubmit : handleSignUpInitiation} className="space-y-4">
            {isLogin && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {(['User', 'Mentor', 'Admin'] as UserRole[]).map(r => (
                        <button key={r} type="button" onClick={() => setRole(r)} className={`py-2 px-1 text-xs font-bold rounded border-2 transition-all ${role === r ? 'border-golden-500 bg-golden-50 text-golden-700' : 'border-gray-200 text-gray-500'}`}>{r}</button>
                    ))}
                </div>
            )}
            {isLogin ? (
                <>
                    <input type="email" placeholder="Email" required className="w-full p-3.5 rounded-lg border dark:bg-charcoal-700 dark:text-white" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" required className="w-full p-3.5 rounded-lg border dark:bg-charcoal-700 dark:text-white" value={password} onChange={e => setPassword(e.target.value)} />
                </>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                         <input type="text" placeholder="Full Name" required className="w-full p-3 rounded-lg border dark:bg-charcoal-700 dark:text-white" value={name} onChange={e => setName(e.target.value)} />
                         <input type="email" placeholder="Email" required className="w-full p-3 rounded-lg border dark:bg-charcoal-700 dark:text-white" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         <input type="text" placeholder="City" required className="w-full p-3 rounded-lg border dark:bg-charcoal-700 dark:text-white" value={city} onChange={e => setCity(e.target.value)} />
                         <input type="number" placeholder="Age" required className="w-full p-3 rounded-lg border dark:bg-charcoal-700 dark:text-white" value={age} onChange={e => setAge(parseInt(e.target.value))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         <select className="w-full p-3 rounded-lg border dark:bg-charcoal-700 dark:text-white" value={gender} onChange={e => setGender(e.target.value as any)}><option>Male</option><option>Female</option></select>
                         <select className="w-full p-3 rounded-lg border dark:bg-charcoal-700 dark:text-white" value={education} onChange={e => setEducation(e.target.value)}><option>High School</option><option>Undergraduate</option><option>Graduate</option></select>
                    </div>
                    <input type="text" placeholder="Field of Study" required className="w-full p-3 rounded-lg border dark:bg-charcoal-700 dark:text-white" value={academicBackground} onChange={e => setAcademicBackground(e.target.value)} />
                    <input type="password" placeholder="Create Password" required className="w-full p-3 rounded-lg border dark:bg-charcoal-700 dark:text-white" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
            )}
            
            {error && <p className="text-sm text-red-500 text-center font-bold bg-red-50 p-2 rounded">{error}</p>}
            <button type="submit" className="w-full bg-golden-500 text-white font-bold py-3.5 rounded-lg hover:bg-golden-600 transition-colors flex items-center justify-center gap-2 shadow-lg">
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />} {isLogin ? 'Enter' : 'Join'}
            </button>
            <button type="button" onClick={handleGoogleLogin} disabled={isGoogleLoading} className="w-full border-2 border-gray-200 dark:border-charcoal-600 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-charcoal-700 transition-colors">
                {isGoogleLoading ? 'Connecting...' : (
                    <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </>
                )}
            </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
