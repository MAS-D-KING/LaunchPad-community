
import React, { useState } from 'react';
import { UserProfile, UserRole, Category } from '../types';
import { ADMIN_CREDENTIALS, MENTOR_CREDENTIALS } from '../constants';
import { LogIn, UserPlus, Chrome } from 'lucide-react';

interface Props {
  onLogin: (user: UserProfile) => void;
}

const AuthScreen: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('User');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Cameroon');
  const [age, setAge] = useState<number>(20);
  const [education, setEducation] = useState('High School');
  const [academicBackground, setAcademicBackground] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [specificNeeds, setSpecificNeeds] = useState<string[]>([]);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [error, setError] = useState('');

  const availableInterests = ['Technology', 'Business', 'Arts', 'Science', 'Health', 'Agriculture', 'Social Impact'];
  
  const toggleSelection = <T extends string>(item: T, list: T[], setList: React.Dispatch<React.SetStateAction<T[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    // Mocking Google OAuth 2.0 flow
    // In a real app, this redirects to accounts.google.com
    // Then returns a token to the backend
    
    setTimeout(() => {
        const googleUser: UserProfile = {
            id: 'google-uid-12345',
            name: 'Chi Ndeh', 
            email: 'chi.ndeh@gmail.com',
            role: 'User',
            education: 'Undergraduate',
            academicBackground: 'Computer Science', 
            interests: ['Technology', 'Startups'],
            city: 'Yaoundé',
            country: 'Cameroon',
            age: 23,
            language: 'fr', // Infer language based on region
            achievements: ["Verified via Google"],
            opportunitiesApplied: 0,
            opportunitiesSaved: 0
        };
        onLogin(googleUser);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (role === 'Admin') {
        const admin = ADMIN_CREDENTIALS.find(a => a.email === email && a.pass === password);
        if (admin) {
          loginUser({ ...baseUser(admin.name), role: 'Admin', id: 'admin-1', adminRole: 'Super Admin', permissions: ['manage_users', 'manage_content'] });
        } else {
          setError('Invalid Admin Credentials.');
        }
      } else if (role === 'Mentor') {
          const mentor = MENTOR_CREDENTIALS.find(m => m.email === email && m.pass === password);
          if (mentor) {
               loginUser({ ...baseUser(mentor.name), role: 'Mentor', id: 'mentor-ndahi', services: ['Career Advice', 'Academic Guidance'], availability: 'Weekly', profession: 'Industry Expert' });
          } else if (email === 'mentor@example.com') { 
               loginUser({ ...baseUser('Mentor User'), role: 'Mentor', id: 'mentor-1', services: ['Career Advice'], availability: 'Weekly' });
          } else {
               setError('Invalid Mentor Credentials.');
          }
      } else {
        if (email && password) {
            loginUser({ ...baseUser('Returning User'), role: 'User', id: 'user-1' });
        }
      }
    } else {
        if (!name || !email || !city || !education) {
            setError("Please fill in all required fields.");
            return;
        }

        const inferredLang = (city.toLowerCase() === 'yaounde' || city.toLowerCase() === 'douala' || city.toLowerCase() === 'dschang') ? 'fr' : 'en';

        loginUser({
            id: 'new-' + Math.random(),
            name,
            email,
            role: 'User',
            education,
            academicBackground,
            interests,
            targetCategories: selectedCategories,
            specificNeeds,
            city,
            country,
            age,
            language: inferredLang,
            achievements: ["Profile Completed"]
        });
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
      age: 22
  });

  const loginUser = (u: UserProfile) => {
      setTimeout(() => onLogin(u), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-charcoal-900 px-4 py-8 overflow-y-auto">
      <div className="bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100 dark:border-charcoal-700 my-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-charcoal-900 dark:text-white">LaunchPad<span className="text-golden-500">.</span></h1>
            <p className="text-sm font-medium text-coral-500 mt-2 uppercase tracking-wide">Cameroon's Opportunity Engine</p>
        </div>

        <div className="flex bg-beige-100 dark:bg-charcoal-700 rounded-lg p-1.5 mb-6">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${isLogin ? 'bg-white dark:bg-charcoal-600 shadow-sm text-golden-600 dark:text-white' : 'text-gray-500'}`}>Log In</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isLogin ? 'bg-white dark:bg-charcoal-600 shadow-sm text-golden-600 dark:text-white' : 'text-gray-500'}`}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            
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
                    <input type="email" placeholder="Email Address" required className="w-full p-3.5 rounded-lg border-2 border-gray-100 dark:border-charcoal-600 bg-transparent dark:text-white text-base md:text-sm focus:border-golden-500 focus:ring-0 transition-colors outline-none font-medium" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" required className="w-full p-3.5 rounded-lg border-2 border-gray-100 dark:border-charcoal-600 bg-transparent dark:text-white text-base md:text-sm focus:border-golden-500 focus:ring-0 transition-colors outline-none font-medium" value={password} onChange={e => setPassword(e.target.value)} />
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
                         <input type="number" placeholder="Age" required className="w-full p-3 rounded-lg border border-gray-200 dark:border-charcoal-600 bg-transparent dark:text-white text-base md:text-sm" value={age} onChange={e => setAge(parseInt(e.target.value))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <select className="w-full p-3 rounded-lg border border-gray-200 dark:border-charcoal-600 bg-transparent dark:text-white text-base md:text-sm" value={education} onChange={e => setEducation(e.target.value)}>
                            <option>High School</option>
                            <option>Undergraduate</option>
                            <option>Graduate</option>
                            <option>PhD</option>
                        </select>
                        <input type="text" placeholder="Field (e.g. Law)" className="w-full p-3 rounded-lg border border-gray-200 dark:border-charcoal-600 bg-transparent dark:text-white text-base md:text-sm" value={academicBackground} onChange={e => setAcademicBackground(e.target.value)} />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Interests</label>
                        <div className="flex flex-wrap gap-2">
                            {availableInterests.map(i => (
                                <button key={i} type="button" onClick={() => toggleSelection(i, interests, setInterests)} className={`px-2 py-1 text-xs font-bold rounded-full border transition-colors ${interests.includes(i) ? 'bg-charcoal-800 text-white dark:bg-white dark:text-charcoal-900 border-charcoal-800' : 'border-gray-300 text-gray-500'}`}>{i}</button>
                            ))}
                        </div>
                    </div>

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
