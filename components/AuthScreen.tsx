
import React, { useState } from 'react';
import { UserProfile, UserRole, Category } from '../types';
import { ADMIN_CREDENTIALS, MENTOR_CREDENTIALS, APP_LOGO, APP_WALLPAPER } from '../constants';
import { LogIn, UserPlus, Chrome, Mail, ArrowLeft, CheckCircle, Lock, Sparkles, Target, ArrowRight } from 'lucide-react';

interface Props {
  onLogin: (user: UserProfile) => void;
}

type AuthStep = 'form' | 'verify' | 'onboarding-interests' | 'onboarding-categories' | 'onboarding-goals';

const AuthScreen: React.FC<Props> = ({ onLogin }) => {
  // Auth State
  const [isLogin, setIsLogin] = useState(true);
  const [authStep, setAuthStep] = useState<AuthStep>('form');
  
  // Form State
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
  
  // Onboarding State
  const [interests, setInterests] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState('');
  
  // Verification State
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);

  // Loading & Error
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const availableInterests = [
    'Technology', 'Business', 'Arts', 'Science', 'Health', 'Agriculture', 'Social Impact',
    'Engineering', 'Education', 'Law', 'Media & Journalism', 'Environment', 'Finance',
    'Sports', 'Research', 'Public Policy', 'Design', 'Data Science', 'Marketing'
  ];

  const availableCategories: Category[] = [
      'Scholarship', 'Internship', 'Hackathon', 'Grant', 'Volunteering', 
      'Fellowship', 'Competition', 'Job', 'Event'
  ];
  
  const toggleSelection = <T extends string>(item: T, list: T[], setList: React.Dispatch<React.SetStateAction<T[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const saveUserToRegistry = (user: UserProfile) => {
      const registry = JSON.parse(localStorage.getItem('launchpad_registry') || '[]');
      // Remove existing entry with same email if any
      const filtered = registry.filter((u: any) => u.email !== user.email);
      filtered.push({ email: user.email, password: password, profile: user }); // Storing password securely in real app, here mock
      localStorage.setItem('launchpad_registry', JSON.stringify(filtered));
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setError('');
    
    // Simulate Google OAuth delay
    setTimeout(() => {
        const googleEmail = prompt("Simulating Google Sign In:\nPlease enter your Google email address:", email || "");
        
        if (!googleEmail) {
            setIsGoogleLoading(false);
            return;
        }

        // Check if user exists in registry
        const registry = JSON.parse(localStorage.getItem('launchpad_registry') || '[]');
        const existing = registry.find((u: any) => u.email === googleEmail);

        if (existing) {
            setIsGoogleLoading(false);
            onLogin(existing.profile);
            return;
        }

        const userName = googleEmail.split('@')[0];
        const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1).replace(/[._]/g, ' ');

        const googleUser: UserProfile = {
            id: 'google-' + Math.random().toString(36).substr(2, 9),
            name: formattedName, 
            email: googleEmail,
            role: 'User',
            education: 'Undergraduate', // Default
            academicBackground: 'General Studies', 
            interests: ['Technology'],
            city: 'Yaoundé', // Default location, user can update later
            country: 'Cameroon',
            age: 20,
            gender: 'Prefer not to say',
            language: 'en',
            achievements: ["Verified via Google"],
            joinedCommunityIds: [],
            opportunitiesApplied: 0,
            opportunitiesSaved: 0,
            settings: {
                notifications: true,
                push: true,
                reminders: true,
                news: false,
                privacyProfile: true
            }
        };
        
        saveUserToRegistry(googleUser);
        setIsGoogleLoading(false);
        onLogin(googleUser);
    }, 1500);
  };

  const handleSignUpInitiation = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !city || !education || !password || !academicBackground) {
        setError("Please fill in all required fields.");
        return;
    }

    const inferredLang = (city.toLowerCase() === 'yaounde' || city.toLowerCase() === 'douala' || city.toLowerCase() === 'dschang') ? 'fr' : 'en';

    const newUser: UserProfile = {
        id: 'new-' + Math.random(),
        name,
        email,
        role: 'User',
        education,
        academicBackground,
        city,
        country,
        age,
        gender,
        language: inferredLang,
        // These will be filled in onboarding
        interests: [],
        targetCategories: [],
        specificNeeds: [],
        joinedCommunityIds: [],
        achievements: ["Profile Completed"],
        settings: {
            notifications: true,
            push: true,
            reminders: true,
            news: false,
            privacyProfile: true
        }
    };

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    setPendingUser(newUser);
    
    // Simulate Email Sending with specific template
    console.log(`Email sent to ${email} with code: ${code}`);
    alert(
`Hello ${name},
Welcome to LaunchPad! 🎉
To help you access your account, here is your temporary 6-digit login code:
🔐 Your Code: [${code}]
This code is temporary and expires soon.
For your security, please log in and immediately set a new password in your account settings.
If you did not request this code, simply ignore this message.
Thanks for being part of the LaunchPad community! 🚀
LaunchPad Team`
    );
    
    setAuthStep('verify');
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (verificationCode === sentCode) {
          // Verification Success, move to onboarding
          setAuthStep('onboarding-interests');
      } else {
          setError("Incorrect verification code. Please try again.");
      }
  };

  const handleInterestsSubmit = () => {
      if (interests.length === 0) {
          setError("Please select at least one interest.");
          return;
      }
      if (pendingUser) {
          setPendingUser({ ...pendingUser, interests });
          setError('');
          setAuthStep('onboarding-categories');
      }
  };

  const handleCategoriesSubmit = () => {
      if (selectedCategories.length === 0) {
          setError("Please select at least one opportunity type.");
          return;
      }
      if (pendingUser) {
          setPendingUser({ ...pendingUser, targetCategories: selectedCategories });
          setError('');
          setAuthStep('onboarding-goals');
      }
  };

  const handleGoalsSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!goals.trim()) {
          setError("Please share a brief goal.");
          return;
      }
      if (pendingUser) {
          const finalUser = { ...pendingUser, goals };
          saveUserToRegistry(finalUser);
          onLogin(finalUser);
      }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Check Admin
    if (role === 'Admin') {
      const admin = ADMIN_CREDENTIALS.find(a => a.email === email && a.pass === password);
      if (admin) {
        onLogin({ 
            ...baseUser(admin.name), 
            role: 'Admin', 
            id: 'admin-1', 
            adminRole: 'Super Admin', 
            permissions: ['manage_users', 'manage_content'] 
        });
        return;
      }
    } 
    
    // 2. Check Mentor
    if (role === 'Mentor') {
        const mentor = MENTOR_CREDENTIALS.find(m => m.email === email && m.pass === password);
        if (mentor) {
             onLogin({ 
                 ...baseUser(mentor.name), 
                 role: 'Mentor', 
                 id: 'mentor-ndahi', 
                 services: ['Career Advice', 'Academic Guidance'], 
                 availability: 'Weekly', 
                 profession: 'Industry Expert' 
            });
            return;
        } else if (email === 'mentor@example.com') { 
             onLogin({ 
                 ...baseUser('Mentor User'), 
                 role: 'Mentor', 
                 id: 'mentor-1', 
                 services: ['Career Advice'], 
                 availability: 'Weekly' 
            });
            return;
        }
    } 
    
    // 3. Check User Registry (Standard Users)
    if (email && password) {
        const registry = JSON.parse(localStorage.getItem('launchpad_registry') || '[]');
        const registeredUser = registry.find((u: any) => u.email === email && u.password === password);

        if (registeredUser) {
            onLogin(registeredUser.profile);
        } else if (email === 'test@example.com' && password === 'password') {
             // Fallback for demo without sign up
             onLogin({ 
                ...baseUser('Demo User'), 
                role: 'User', 
                id: 'user-demo' 
            });
        } else {
            setError('Invalid Credentials. Please sign up if you have no account.');
        }
    }
  };

  const baseUser = (userName: string): UserProfile => ({
      id: 'u-' + Math.random(),
      name: userName,
      email: email,
      role: role,
      education: 'Undergraduate',
      interests: ['Technology'],
      city: 'Yaoundé',
      country: 'Cameroon',
      language: 'en',
      age: 22,
      gender: 'Male',
      joinedCommunityIds: [],
      settings: {
          notifications: true,
          push: true,
          reminders: true,
          news: true,
          privacyProfile: true
      }
  });

  // --- VIEW: Verification Screen ---
  if (authStep === 'verify') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-charcoal-900 px-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url("${APP_WALLPAPER}")`, backgroundSize: 'cover' }}></div>
            <div className="relative z-10 bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-charcoal-700">
                <button onClick={() => setAuthStep('form')} className="flex items-center text-gray-500 hover:text-charcoal-900 dark:hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={16} className="mr-2"/> Back
                </button>
                
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-golden-100 rounded-full flex items-center justify-center mx-auto mb-4 text-golden-600">
                        <Mail size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white">Verify Your Email</h2>
                    <p className="text-sm text-gray-500 mt-2">
                        We sent a 6-digit code to <span className="font-bold text-charcoal-900 dark:text-white">{email}</span>.
                        <br/>Enter it below to confirm your account.
                    </p>
                </div>

                <form onSubmit={handleVerificationSubmit} className="space-y-6">
                    <div>
                        <input 
                            type="text" 
                            maxLength={6}
                            className="w-full text-center text-3xl font-mono tracking-[0.5em] p-4 border-2 border-gray-200 dark:border-charcoal-600 rounded-xl focus:border-golden-500 focus:ring-0 outline-none bg-transparent dark:text-white"
                            placeholder="000000"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                            autoFocus
                        />
                    </div>
                    
                    {error && <p className="text-sm text-red-500 text-center font-bold">{error}</p>}

                    <button type="submit" className="w-full bg-golden-500 text-white font-bold py-3.5 rounded-lg hover:bg-golden-600 transition-colors shadow-lg shadow-golden-500/20">
                        Verify
                    </button>
                    
                    <p className="text-xs text-center text-gray-400">
                        Didn't receive the email? <button type="button" onClick={() => alert(`Resent code: ${sentCode}`)} className="text-golden-600 font-bold hover:underline">Resend Code</button>
                    </p>
                </form>
            </div>
        </div>
      );
  }

  // --- VIEW: Onboarding (Interests) ---
  if (authStep === 'onboarding-interests') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-charcoal-900 px-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url("${APP_WALLPAPER}")`, backgroundSize: 'cover' }}></div>
            <div className="relative z-10 bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 dark:border-charcoal-700 animate-fadeIn">
                <div className="text-center mb-8">
                     <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2">What are you interested in?</h2>
                     <p className="text-gray-500">Select topics to personalize your feed.</p>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center mb-8 max-h-96 overflow-y-auto p-2">
                    {availableInterests.map(i => (
                        <button 
                            key={i} 
                            onClick={() => toggleSelection(i, interests, setInterests)} 
                            className={`px-4 py-2 text-sm font-bold rounded-full border-2 transition-all ${interests.includes(i) ? 'bg-golden-500 border-golden-500 text-white shadow-md transform scale-105' : 'border-gray-200 dark:border-charcoal-600 text-gray-600 dark:text-gray-300 hover:border-golden-300'}`}
                        >
                            {i}
                        </button>
                    ))}
                </div>

                {error && <p className="text-sm text-red-500 text-center font-bold mb-4">{error}</p>}

                <button onClick={handleInterestsSubmit} className="w-full bg-charcoal-900 dark:bg-white text-white dark:text-charcoal-900 font-bold py-3.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    Next Step <ArrowRight size={18}/>
                </button>
            </div>
          </div>
      );
  }

  // --- VIEW: Onboarding (Categories) ---
  if (authStep === 'onboarding-categories') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-charcoal-900 px-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url("${APP_WALLPAPER}")`, backgroundSize: 'cover' }}></div>
            <div className="relative z-10 bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 dark:border-charcoal-700 animate-fadeIn">
                <div className="text-center mb-8">
                     <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2">What are you looking for?</h2>
                     <p className="text-gray-500">We'll show you these opportunities first.</p>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center mb-8">
                    {availableCategories.map(c => (
                        <button 
                            key={c} 
                            onClick={() => toggleSelection(c, selectedCategories, setSelectedCategories)} 
                            className={`px-4 py-2 text-sm font-bold rounded-lg border-2 transition-all ${selectedCategories.includes(c) ? 'bg-coral-500 border-coral-500 text-white shadow-md transform scale-105' : 'border-gray-200 dark:border-charcoal-600 text-gray-600 dark:text-gray-300 hover:border-coral-300'}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {error && <p className="text-sm text-red-500 text-center font-bold mb-4">{error}</p>}

                <button onClick={handleCategoriesSubmit} className="w-full bg-charcoal-900 dark:bg-white text-white dark:text-charcoal-900 font-bold py-3.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    Next Step <ArrowRight size={18}/>
                </button>
            </div>
          </div>
      );
  }

  // --- VIEW: Onboarding (Goals) ---
  if (authStep === 'onboarding-goals') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-charcoal-900 px-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url("${APP_WALLPAPER}")`, backgroundSize: 'cover' }}></div>
            <div className="relative z-10 bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-charcoal-700 animate-fadeIn">
                <div className="text-center mb-6">
                     <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600">
                        <Target size={32} />
                    </div>
                     <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2">One Last Thing...</h2>
                     <p className="text-gray-500">What is your main goal right now?</p>
                </div>
                
                <form onSubmit={handleGoalsSubmit}>
                    <textarea 
                        className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-charcoal-600 bg-transparent dark:text-white focus:border-violet-500 focus:ring-0 outline-none resize-none mb-6 text-center text-lg"
                        placeholder="e.g., Get a full scholarship to MIT, Find a remote internship, Build a startup..."
                        rows={3}
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        autoFocus
                    />

                    {error && <p className="text-sm text-red-500 text-center font-bold mb-4">{error}</p>}

                    <button type="submit" className="w-full bg-golden-500 text-white font-bold py-3.5 rounded-lg hover:bg-golden-600 transition-colors shadow-lg shadow-golden-500/20 flex items-center justify-center gap-2">
                        <Sparkles size={18}/> Finish & Launch
                    </button>
                </form>
            </div>
          </div>
      );
  }

  // --- VIEW: Main Login/Signup Form ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-charcoal-900 px-4 py-8 overflow-y-auto relative">
      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10 pointer-events-none" style={{ backgroundImage: `url("${APP_WALLPAPER}")`, backgroundSize: 'cover' }}></div>
      
      <div className="relative z-10 bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100 dark:border-charcoal-700 my-auto">
        <div className="text-center mb-8 flex flex-col items-center">
            <img src={APP_LOGO} alt="LaunchPad Logo" className="w-24 h-24 mb-4 drop-shadow-xl hover:scale-110 transition-transform" />
            <h1 className="text-4xl font-extrabold tracking-tight text-charcoal-900 dark:text-white">LaunchPad<span className="text-golden-500">.</span></h1>
            <p className="text-sm font-medium text-coral-500 mt-2 uppercase tracking-wide">Cameroon's Opportunity Engine</p>
        </div>

        <div className="flex bg-beige-100 dark:bg-charcoal-700 rounded-lg p-1.5 mb-6">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${isLogin ? 'bg-white dark:bg-charcoal-600 shadow-sm text-golden-600 dark:text-white' : 'text-gray-500'}`}>Log In</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isLogin ? 'bg-white dark:bg-charcoal-600 shadow-sm text-golden-600 dark:text-white' : 'text-gray-500'}`}>Sign Up</button>
        </div>

        <form onSubmit={isLogin ? handleLoginSubmit : handleSignUpInitiation} className="space-y-4">
            
            {isLogin && (
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">I am a</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['User', 'Mentor', 'Admin'] as UserRole[]).map(r => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`py-2 px-1 text-xs font-bold rounded border-2 transition-all ${role === r ? 'border-golden-500 bg-golden-50 text-golden-700 dark:bg-golden-900/20 dark:text-golden-400' : 'border-gray-200 dark:border-charcoal-600 text-gray-500'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isLogin && (
                <>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input type="email" placeholder="Email Address" required className="w-full pl-10 p-3.5 rounded-lg border-2 border-gray-100 dark:border-charcoal-600 bg-transparent dark:text-white text-base md:text-sm focus:border-golden-500 focus:ring-0 transition-colors outline-none font-medium" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input type="password" placeholder="Password" required className="w-full pl-10 p-3.5 rounded-lg border-2 border-gray-100 dark:border-charcoal-600 bg-transparent dark:text-white text-base md:text-sm focus:border-golden-500 focus:ring-0 transition-colors outline-none font-medium" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                </>
            )}

            {!isLogin && (
                <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-3">
                         <input type="text" placeholder="Full Name" required className="w-full p-3 rounded-lg border border-gray-200 dark:border-charcoal-600 bg-transparent dark:text-white text-base md:text-sm" value={name} onChange={e => setName(e.target.value)} />
                         <input type="email" placeholder="Email" required className="w-full p-3 rounded-lg border border-gray-200 dark:border-charcoal-600 bg-transparent dark:text-white text-base md:text-sm" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         <input type="text" placeholder="City (e.g. Buea)" required className="w-full p-3 rounded-lg border border-gray-200 dark:border-charcoal-600 bg-transparent dark:text-white text-base md:text-sm" value={city} onChange={e => setCity(e.target.value)} />
                         <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Age</label>
                            <input type="number" placeholder="Age" required className="w-full p-3 rounded-lg border border-gray-200 dark:border-charcoal-600 bg-transparent dark:text-white text-base md:text-sm" value={age} onChange={e => setAge(parseInt(e.target.value))} />
                         </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         <div>
                             <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Gender</label>
                             <select className="w-full p-3 rounded-lg border border-gray-200 dark:border-charcoal-600 bg-transparent dark:text-white text-base md:text-sm" value={gender} onChange={e => setGender(e.target.value as any)}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Prefer not to say</option>
                             </select>
                         </div>
                         <div>
                             <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Education</label>
                             <select className="w-full p-3 rounded-lg border border-gray-200 dark:border-charcoal-600 bg-transparent dark:text-white text-base md:text-sm" value={education} onChange={e => setEducation(e.target.value)}>
                                <option>High School</option>
                                <option>Undergraduate</option>
                                <option>Graduate</option>
                                <option>PhD</option>
                            </select>
                         </div>
                    </div>
                    
                    <input type="text" placeholder="Field of Study (e.g. Law)" required className="w-full p-3 rounded-lg border border-gray-200 dark:border-charcoal-600 bg-transparent dark:text-white text-base md:text-sm" value={academicBackground} onChange={e => setAcademicBackground(e.target.value)} />

                    <input type="password" placeholder="Create Password" required className="w-full p-3 rounded-lg border border-gray-200 dark:border-charcoal-600 bg-transparent dark:text-white text-base md:text-sm" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
            )}

            {role === 'Admin' && isLogin && <p className="text-xs text-coral-600 bg-coral-50 p-2 rounded font-medium border border-coral-200">⚠️ Admin access restricted.</p>}
            
            {error && <p className="text-sm text-red-500 text-center font-bold bg-red-50 p-2 rounded">{error}</p>}

            <button type="submit" className="w-full bg-golden-500 text-white font-bold py-3.5 rounded-lg hover:bg-golden-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-golden-500/20">
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                {isLogin ? 'Enter Platform' : 'Join LaunchPad'}
            </button>
            
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200 dark:border-charcoal-600"></span></div>
                <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest"><span className="bg-white dark:bg-charcoal-800 px-3 text-gray-400">Or</span></div>
            </div>

            <button 
                type="button" 
                onClick={handleGoogleLogin} 
                disabled={isGoogleLoading}
                className="w-full border-2 border-gray-200 dark:border-charcoal-600 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-charcoal-700 transition-colors flex items-center justify-center gap-2 relative overflow-hidden"
            >
                {isGoogleLoading ? (
                    <span className="animate-pulse">Connecting to Google...</span>
                ) : (
                    <>
                        <Chrome size={20} className="text-blue-500" /> Continue with Google
                    </>
                )}
            </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
