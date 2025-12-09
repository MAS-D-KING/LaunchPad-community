
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Menu, X, Moon, Sun, User as UserIcon, LayoutDashboard, 
  Home, Sparkles, LogOut, Users, BookOpen, Handshake, Briefcase, Star, Settings, Languages, PlaySquare,
  PieChart, Cpu, MessageSquare
} from 'lucide-react';
import OpportunityCard from './OpportunityCard';
import AdminDashboard from './AdminDashboard';
import AuthScreen from './AuthScreen';
import UserSubmission from './UserSubmission';
import MentorshipHub from './MentorshipHub';
import MentorDashboard from './MentorDashboard';
import ProfileSettings from './ProfileSettings';
import PartnersHub from './PartnersHub';
import LearningCenter from './LearningCenter';
import SettingsPage from './SettingsPage';
import MediaFeed from './MediaFeed';
import VoiceAssistant from './VoiceAssistant';
import Dashboard from './Dashboard';
import CommunityHub from './CommunityHub';
import GroupsHub from './GroupsHub';
import LaunchPadLabs from './LaunchPadLabs';
import ApplicationHelper from './ApplicationHelper';

import { generateSmartOpportunities } from '../services/geminiService';
import { MOCK_USER, INITIAL_OPPORTUNITIES, CATEGORIES, INITIAL_SUCCESS_STORIES, MOCK_MENTORS, TRANSLATIONS, APP_LOGO } from '../constants';
import { Opportunity, Category, FilterState, UserProfile, SuccessStory, Language, MentorApplication } from '../types';

type AppView = 'dashboard' | 'community' | 'groups' | 'labs' | 'feed' | 'profile' | 'admin' | 'submit' | 'mentorship' | 'mentor-dashboard' | 'partners' | 'learning' | 'settings' | 'media-feed';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('en');
  
  const [currentView, setCurrentView] = useState<AppView>('feed');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Data State with Persistence (Offline First)
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
      const saved = localStorage.getItem('launchpad_opportunities');
      return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });
  const [stories, setStories] = useState<SuccessStory[]>(() => {
      const saved = localStorage.getItem('launchpad_stories');
      return saved ? JSON.parse(saved) : INITIAL_SUCCESS_STORIES;
  });
  const [mentors, setMentors] = useState<UserProfile[]>(() => {
      const saved = localStorage.getItem('launchpad_mentors');
      return saved ? JSON.parse(saved) : MOCK_MENTORS;
  });

  const [mentorApps, setMentorApps] = useState<MentorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ category: 'All', searchQuery: '', targetRegion: 'My Region' });
  
  const [selectedOpForHelp, setSelectedOpForHelp] = useState<Opportunity | null>(null);

  // Persistence Effects (Save to phone storage for bad network)
  useEffect(() => { localStorage.setItem('launchpad_opportunities', JSON.stringify(opportunities)); }, [opportunities]);
  useEffect(() => { localStorage.setItem('launchpad_mentors', JSON.stringify(mentors)); }, [mentors]);
  useEffect(() => { localStorage.setItem('launchpad_stories', JSON.stringify(stories)); }, [stories]);

  useEffect(() => {
    const savedUser = localStorage.getItem('launchpad_user');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
      if (user) {
          localStorage.setItem('launchpad_user', JSON.stringify(user));
      } else {
          localStorage.removeItem('launchpad_user');
      }
  }, [user]);

  useEffect(() => { if (user?.language) setLanguage(user.language); }, [user]);
  useEffect(() => { if (darkMode) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [darkMode]);

  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  const toggleBookmark = (id: string) => { setOpportunities(prev => prev.map(op => op.id === id ? { ...op, isBookmarked: !op.isBookmarked } : op)); };
  const handleLogout = () => { setUser(null); setCurrentView('feed'); localStorage.removeItem('launchpad_user'); };
  
  const handleUpdateProfile = (data: Partial<UserProfile>) => { 
      if (user) { 
          if (data.language) setLanguage(data.language); 
          const updatedUser = data.settings && user.settings ? { ...user, ...data, settings: { ...user.settings, ...data.settings } } : { ...user, ...data };
          setUser(updatedUser); 
          
          const registry = JSON.parse(localStorage.getItem('launchpad_registry') || '[]');
          const updatedRegistry = registry.map((u: any) => u.email === user.email ? { ...u, profile: updatedUser } : u);
          localStorage.setItem('launchpad_registry', JSON.stringify(updatedRegistry));
      } 
  };
  
  const handleDeleteOpportunity = (id: string) => { if(confirm('Are you sure?')) setOpportunities(prev => prev.filter(o => o.id !== id)); };
  const handleEditOpportunity = (op: Opportunity) => { const newTitle = prompt("Edit Title:", op.title); const newDesc = prompt("Edit Description:", op.description); if(newTitle && newDesc) setOpportunities(prev => prev.map(o => o.id === op.id ? { ...o, title: newTitle, description: newDesc } : o)); };
  
  const handleJoinCommunity = (communityId: string) => {
      if (user) {
          const currentJoins = user.joinedCommunityIds || [];
          if (!currentJoins.includes(communityId)) {
              handleUpdateProfile({ joinedCommunityIds: [...currentJoins, communityId] });
          }
      }
  };

  const handleCreateOpportunity = (op: Partial<Opportunity>) => { 
      const newOp: Opportunity = {
        id: Math.random().toString(),
        title: op.title || 'New Opportunity',
        organization: 'Admin Posted',
        category: op.category || 'Job',
        description: op.description || '',
        location: 'Cameroon',
        regionScope: 'Cameroon',
        deadline: '2024-12-31',
        isOnline: false,
        postedAt: 'Just now',
        status: 'approved',
        authorRole: 'Admin',
        tags: [],
        requirements: [],
        cost: 'Free',
        eligibility: 'Open',
        benefits: 'N/A',
        applicationLink: '#',
        targetEducationLevels: []
      };
      setOpportunities(prev => [newOp, ...prev]);
  };
  
  const handleMentorReview = (appId: string, approved: boolean) => { 
      setMentorApps(prev => prev.map(app => app.id === appId ? { ...app, status: approved ? 'approved' : 'rejected' } : app));
      if (approved) {
          const app = mentorApps.find(a => a.id === appId);
          if (app) {
              const newMentor: UserProfile = {
                  id: `m-${Date.now()}`,
                  name: app.name,
                  email: app.email,
                  role: 'Mentor',
                  education: 'N/A',
                  city: 'Cameroon',
                  country: 'Cameroon',
                  age: 25,
                  bio: app.bio,
                  profession: app.profession,
                  currentRole: app.profession,
                  expertise: app.expertise,
                  availability: 'Weekly',
                  services: ['Career Advice'],
                  interests: [],
                  rating: 5.0,
                  reviewCount: 0
              };
              setMentors(prev => [...prev, newMentor]);
          }
      }
  };
  
  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    if (aiMode && user) {
      const newOps = await generateSmartOpportunities(filters.searchQuery, user, language);
      if (newOps.length > 0) setOpportunities(prev => [...newOps, ...prev]);
    }
    setIsLoading(false);
  }, [filters.searchQuery, aiMode, user, language]);

  useEffect(() => { if (!filters.searchQuery) return; const timer = setTimeout(() => handleSearch(), 800); return () => clearTimeout(timer); }, [filters.searchQuery, handleSearch]);

  // --- STRICT FILTERING ENGINE ---
  const displayedOpportunities = opportunities.filter(op => {
      if (op.status !== 'approved') return false;
      
      if (user && user.role === 'User') {
         const userEdu = user.education;
         const opLevels = op.targetEducationLevels || [];
         const opCats = op.category;
         const userCats = user.targetCategories || [];

         // 1. ELIGIBILITY LOCK: Strict Education Level Blocking
         if (userEdu === 'High School') {
             // High schoolers CANNOT see Grad/PhD/Undergrad-only
             if (opLevels.includes('Graduate') || opLevels.includes('PhD') || opLevels.includes('Undergraduate')) {
                 // But check if it ALSO includes High School or All
                 if (!opLevels.includes('High School') && !opLevels.includes('All')) return false;
             }
         } else if (userEdu === 'Undergraduate') {
             // Undergrads cannot see PhD or Graduate only
             if (opLevels.includes('PhD')) return false;
             if (opLevels.includes('Graduate') && !opLevels.includes('Undergraduate')) return false;
         }

         // 2. CATEGORY LOCK: If no search query, STRICTLY show preferred categories
         if (filters.category === 'All' && !filters.searchQuery && userCats.length > 0) {
             if (!userCats.includes(opCats)) return false;
         }
      }

      if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          if (!(op.title.toLowerCase().includes(q) || op.description.toLowerCase().includes(q) || op.location.toLowerCase().includes(q))) return false;
      }
      
      if (filters.category !== 'All' && op.category !== filters.category) return false;
      
      return true;
  });

  const handleUserSubmission = {
      op: (op: Partial<Opportunity>) => {
          setOpportunities(prev => [{
             ...op,
             id: Math.random().toString(),
             postedAt: 'Just now',
             tags: [],
             requirements: [],
             cost: 'Free',
             regionScope: 'Cameroon',
             location: 'Remote',
             deadline: 'TBD',
             isOnline: true,
             targetEducationLevels: [],
             eligibility: '',
             benefits: '',
             organization: user?.name || 'Community Member',
             title: op.title || 'Untitled',
             category: 'Job',
             description: op.description || '',
             applicationLink: op.applicationLink || '#',
             status: 'pending',
             authorRole: 'User'
          } as Opportunity, ...prev]);
      },
      story: (story: Partial<SuccessStory>) => {
          setStories(prev => [{
              ...story,
              id: Math.random().toString(),
              authorName: user?.name || 'Anonymous',
              status: 'pending',
              title: story.title || '',
              content: story.content || '',
              date: new Date().toISOString()
          } as SuccessStory, ...prev]);
      },
      mentor: (app: Partial<MentorApplication>) => {
          if (user) {
              setMentorApps(prev => [{
                  id: Math.random().toString(),
                  userId: user.id,
                  name: user.name,
                  email: user.email,
                  status: 'pending',
                  date: new Date().toISOString().split('T')[0],
                  profession: app.profession || '',
                  bio: app.bio || '',
                  expertise: app.expertise || []
              } as MentorApplication, ...prev]);
          }
      }
  };

  if (!user) return <AuthScreen onLogin={(u) => setUser(u)} />;
  if (currentView === 'media-feed') return <MediaFeed opportunities={opportunities} onBack={() => setCurrentView('feed')} />;

  return (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row bg-beige-50 dark:bg-charcoal-900 transition-colors duration-300 overflow-hidden relative" style={{ overscrollBehaviorY: 'none' }}>
      <VoiceAssistant user={user} opportunities={opportunities} mentorApps={mentorApps} onBookmark={toggleBookmark} language={language} setDarkMode={setDarkMode} onPostOpportunity={handleCreateOpportunity} onReviewMentorApp={handleMentorReview}/>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)} />}
      
      {selectedOpForHelp && (
          <ApplicationHelper user={user} opportunity={selectedOpForHelp} onClose={() => setSelectedOpForHelp(null)} />
      )}

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-charcoal-800 border-b border-gray-200 dark:border-charcoal-700 shrink-0 z-30">
        <button onClick={() => setCurrentView('feed')} className="text-xl font-bold tracking-tight text-charcoal-900 dark:text-white flex items-center gap-2">
            <img src={APP_LOGO} alt="Logo" className="w-8 h-8 object-contain" />
            <span>LaunchPad<span className="text-golden-500">.</span></span>
        </button>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600 dark:text-gray-300">{isSidebarOpen ? <X /> : <Menu />}</button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-charcoal-800 border-r border-gray-200 dark:border-charcoal-700 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static h-full flex flex-col shadow-lg md:shadow-none shrink-0`}>
        <div className="p-6 hidden md:block border-b border-gray-100 dark:border-charcoal-700">
          <button onClick={() => setCurrentView('feed')} className="flex items-center gap-3 text-2xl font-bold tracking-tight text-charcoal-900 dark:text-white block text-left">
             <img src={APP_LOGO} alt="Logo" className="w-10 h-10 object-contain" />
             <span>LaunchPad<span className="text-golden-500">.</span></span>
          </button>
          <p className="text-xs text-coral-500 font-medium mt-1 uppercase tracking-wide">Cameroon Edition</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto no-scrollbar">
          <NavButton active={currentView === 'dashboard'} onClick={() => { setCurrentView('dashboard'); setIsSidebarOpen(false); }} icon={<PieChart size={18} />} label={t.dashboard} />
          <NavButton active={currentView === 'feed'} onClick={() => { setCurrentView('feed'); setIsSidebarOpen(false); }} icon={<Home size={18} />} label={t.feed} />
          <NavButton active={false} onClick={() => { setCurrentView('media-feed'); setIsSidebarOpen(false); }} icon={<PlaySquare size={18} />} label={t.watch} />

          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Collaborate</p>
          <NavButton active={currentView === 'community'} onClick={() => { setCurrentView('community'); setIsSidebarOpen(false); }} icon={<Users size={18} />} label={t.community} />
          <NavButton active={currentView === 'groups'} onClick={() => { setCurrentView('groups'); setIsSidebarOpen(false); }} icon={<MessageSquare size={18} />} label={t.teams} />
          <NavButton active={currentView === 'labs'} onClick={() => { setCurrentView('labs'); setIsSidebarOpen(false); }} icon={<Cpu size={18} />} label={t.labs} />

          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Grow</p>
          <NavButton active={currentView === 'mentorship'} onClick={() => { setCurrentView('mentorship'); setIsSidebarOpen(false); }} icon={<Star size={18} />} label={t.mentorship} />
          <NavButton active={currentView === 'learning'} onClick={() => { setCurrentView('learning'); setIsSidebarOpen(false); }} icon={<BookOpen size={18} />} label={t.learning} />
          <NavButton active={currentView === 'partners'} onClick={() => { setCurrentView('partners'); setIsSidebarOpen(false); }} icon={<Handshake size={18} />} label={t.partners} />
          
          <div className="my-4 border-t border-gray-100 dark:border-charcoal-700"></div>
          
          <NavButton active={currentView === 'profile'} onClick={() => { setCurrentView('profile'); setIsSidebarOpen(false); }} icon={<UserIcon size={18} />} label={t.profile} />
          <NavButton active={currentView === 'settings'} onClick={() => { setCurrentView('settings'); setIsSidebarOpen(false); }} icon={<Settings size={18} />} label={t.settings} />
          
          {user.role === 'Admin' && <NavButton active={currentView === 'admin'} onClick={() => { setCurrentView('admin'); setIsSidebarOpen(false); }} icon={<LayoutDashboard size={18} />} label={t.admin} />}
          {(user.role === 'Mentor' || user.role === 'Admin') && <NavButton active={currentView === 'mentor-dashboard'} onClick={() => { setCurrentView('mentor-dashboard'); setIsSidebarOpen(false); }} icon={<Briefcase size={18} />} label={t.mentorDash} />}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-charcoal-700 bg-beige-50 dark:bg-charcoal-900/50 shrink-0">
           <button onClick={() => { setCurrentView('profile'); setIsSidebarOpen(false); }} className="flex items-center gap-3 mb-4 px-2 w-full hover:bg-white dark:hover:bg-charcoal-800 p-2 rounded-lg transition-all group">
             {user.image ? <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-charcoal-800 shadow-md group-hover:scale-105 transition-transform" /> : <div className="w-9 h-9 rounded-full bg-golden-500 flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white dark:border-charcoal-800 group-hover:scale-105 transition-transform">{user.name.charAt(0)}</div>}
              <div className="flex-1 min-w-0 text-left"><p className="text-sm font-bold text-charcoal-900 dark:text-white truncate group-hover:text-golden-600 transition-colors">{user.name}</p><p className="text-xs text-gray-500 truncate">{user.role}</p></div>
           </button>
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-coral-600 hover:bg-coral-50 dark:hover:bg-charcoal-800 rounded-lg transition-colors"><LogOut size={14} /> {t.signOut}</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {currentView !== 'labs' && (
            <header className="h-16 bg-white dark:bg-charcoal-800 border-b border-gray-200 dark:border-charcoal-700 flex items-center justify-between px-4 md:px-6 z-10 shrink-0">
            <div className="flex-1 max-w-xl relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder={t.searchPlaceholder} className="w-full pl-10 pr-4 py-2 bg-beige-50 dark:bg-charcoal-900 border-none rounded-full text-sm focus:ring-2 focus:ring-golden-500 dark:text-white transition-all shadow-inner" value={filters.searchQuery} onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2 md:gap-4 ml-4">
                <div className="relative group">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-charcoal-700 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 transition-colors">
                        <Languages size={14} /> 
                        <select value={language} onChange={(e) => { const newLang = e.target.value as Language; setLanguage(newLang); handleUpdateProfile({ language: newLang }); }} className="bg-transparent outline-none appearance-none cursor-pointer w-full uppercase">
                            <option value="en">EN</option><option value="fr">FR</option><option value="pidgin">PID</option><option value="de">DE</option><option value="zh">ZH</option><option value="es">ES</option>
                        </select>
                    </div>
                </div>
                <button onClick={() => setAiMode(!aiMode)} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${aiMode ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white' : 'bg-gray-100 dark:bg-charcoal-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}><Sparkles size={14} className={aiMode ? 'animate-pulse' : ''} /><span className="hidden sm:inline">{aiMode ? t.aiOn : t.aiOff}</span></button>
                <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-charcoal-700 rounded-full transition-colors">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            </div>
            </header>
        )}

        <div className={`flex-1 overflow-y-auto no-scrollbar bg-beige-50 dark:bg-charcoal-900 touch-pan-y ${currentView !== 'labs' ? 'p-4 md:p-8 pb-24 md:pb-8' : ''}`}>
          
          {currentView === 'dashboard' && <Dashboard user={user} />}
          {currentView === 'community' && <CommunityHub user={user} joinedCommunities={user.joinedCommunityIds} onJoin={handleJoinCommunity} />}
          {currentView === 'groups' && <GroupsHub />}
          {currentView === 'labs' && <LaunchPadLabs user={user} />}
          
          {currentView === 'feed' && (
            <div className="max-w-4xl mx-auto animate-fadeIn">
               <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
                 {CATEGORIES.map(cat => (
                   <button key={cat} onClick={() => setFilters(prev => ({ ...prev, category: cat as Category | 'All' }))} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${filters.category === cat ? 'bg-golden-500 text-white transform scale-105' : 'bg-white dark:bg-charcoal-800 text-gray-600 dark:text-gray-300 hover:bg-golden-50 dark:hover:bg-charcoal-700 border border-transparent hover:border-golden-200'}`}>{cat}</button>
                 ))}
               </div>
               {stories.length > 0 && (
                   <div className="mb-8">
                       <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Star size={12} className="text-golden-500"/> {t.successStories}</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {stories.filter(s => s.status === 'approved').slice(0, 2).map(s => (<div key={s.id} className="bg-white dark:bg-charcoal-800 p-4 rounded-xl border-l-4 border-violet-500 shadow-sm hover:shadow-md transition-shadow"><p className="text-sm font-bold text-gray-900 dark:text-white mb-1">"{s.title}"</p><p className="text-xs text-violet-600 dark:text-violet-400 font-medium">- {s.authorName}</p></div>))}
                       </div>
                   </div>
               )}
               {isLoading ? ( <div className="text-center py-20 animate-pulse flex flex-col items-center"><Sparkles className="text-golden-500 mb-2 animate-spin" size={32}/><p className="text-gray-500 font-medium">Curating opportunities...</p></div> ) : displayedOpportunities.length > 0 ? ( <> {displayedOpportunities.map((op, index) => (<React.Fragment key={op.id}><OpportunityCard data={op} onBookmark={toggleBookmark} isAdmin={user.role === 'Admin'} onDelete={handleDeleteOpportunity} onEdit={handleEditOpportunity} onHelpApply={setSelectedOpForHelp} /> {index === 1 && <div className="bg-gradient-to-r from-charcoal-900 to-charcoal-800 rounded-xl p-6 mb-6 text-white shadow-lg border border-charcoal-700"><div className="flex justify-between items-center mb-4"><h3 className="font-bold flex items-center gap-2 text-golden-400"><Sparkles size={18} fill="currentColor"/> {t.verifiedMentors}</h3><button onClick={() => setCurrentView('mentorship')} className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-colors">{t.viewAll}</button></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{mentors.slice(0, 3).map(m => (<div key={m.id} className="bg-white/5 p-3 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors border border-white/5"><div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-sm font-bold shadow-md">{m.name.charAt(0)}</div><div className="min-w-0"><p className="text-xs font-bold text-white truncate">{m.name}</p><p className="text-[10px] text-gray-300 truncate">{m.currentRole}</p></div></div></div>))}</div></div>}</React.Fragment>))} </> ) : ( <div className="text-center py-20"><p className="text-gray-500 font-medium text-lg">{t.noOpportunities}</p>{user.city && <p className="text-sm text-gray-400 mt-2">{t.tryAdjusting} '{user.city}' or clearing filters.</p>}<button onClick={() => { setFilters({category: 'All', searchQuery: '', targetRegion: ''}); }} className="mt-4 px-4 py-2 bg-golden-500 text-white rounded-full text-sm font-bold">Clear Filters</button></div> )}
            </div>
          )}

          {currentView === 'admin' && user.role === 'Admin' && <AdminDashboard opportunities={opportunities} setOpportunities={setOpportunities} stories={stories} setStories={setStories} mentors={mentors} setMentors={setMentors} mentorApps={mentorApps} onReviewMentorApp={handleMentorReview} />}
          {currentView === 'mentor-dashboard' && (user.role === 'Mentor' || user.role === 'Admin') && <MentorDashboard user={user} />}
          {currentView === 'mentorship' && <MentorshipHub mentors={mentors} onBecomeMentorClick={() => setCurrentView('submit')} userRole={user.role} />}
          {currentView === 'partners' && <PartnersHub />}
          {currentView === 'learning' && <LearningCenter />}
          {currentView === 'settings' && <SettingsPage user={user} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} />}
          {currentView === 'submit' && <div className="max-w-2xl mx-auto"><UserSubmission onSubmitOp={handleUserSubmission.op} onSubmitStory={handleUserSubmission.story} onSubmitMentorApp={handleUserSubmission.mentor} /></div>}
          {currentView === 'profile' && <ProfileSettings user={user} onUpdateProfile={handleUpdateProfile} />}
        </div>
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${active ? 'bg-golden-500 text-white shadow-md transform scale-[1.02]' : 'text-gray-600 dark:text-gray-400 hover:bg-golden-50 dark:hover:bg-charcoal-700 hover:text-golden-600'}`}>{icon}<span>{label}</span></button>
);

export default App;
