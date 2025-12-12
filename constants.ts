
import { Opportunity, UserProfile, SuccessStory, Partner, LearningResource, Community, Group, UserStats, CommunityProblem } from './types';

// Removed external images
export const APP_LOGO = "";
export const APP_WALLPAPER = "";

// 30+ Diverse Interests
export const ALL_INTERESTS = [
    'Technology', 'Software Engineering', 'Data Science', 'AI', 'Robotics', 'Cybersecurity', 
    'Business', 'Finance', 'Marketing', 'Entrepreneurship', 'Accounting', 
    'Arts', 'Graphic Design', 'Fine Art', 'Fashion', 'Music', 'Film', 'Photography', 'Animation',
    'Science', 'Biology', 'Chemistry', 'Physics', 'Environmental Science', 
    'Health', 'Medicine', 'Nursing', 'Public Health', 'Pharmacy', 
    'Agriculture', 'AgriTech', 
    'Engineering', 'Civil Eng', 'Mechanical Eng', 'Electrical Eng', 
    'Education', 'Law', 'Media', 'Journalism', 
    'Sports', 'Esports', 'Writing', 'History', 'Politics'
];

export const TRANSLATIONS = {
  en: {
    welcome: "Guiding Youths Into Opportunity",
    platform: "Platform",
    feed: "Opportunities Feed",
    watch: "Watch & Discover",
    mentorship: "Mentorship Hub",
    partners: "Partners & Experts",
    learning: "Learning Center",
    personal: "Personal",
    profile: "My Profile",
    contribute: "Contribute",
    settings: "Settings",
    admin: "Admin Dashboard",
    mentorDash: "Mentor Dashboard",
    topExperts: "Top Experts This Week",
    signOut: "Sign Out",
    searchPlaceholder: "Search opportunities...",
    aiOn: "AI Active",
    aiOff: "Enable AI",
    dashboard: "Dashboard",
    community: "Community Hub",
    teams: "Groups & Teams",
    labs: "LaunchPad Labs",
    successStories: "Success Stories",
    verifiedMentors: "Verified Mentors",
    viewAll: "View All",
    noOpportunities: "No opportunities found.",
    tryAdjusting: "Try adjusting your search or check back later for posts in"
  },
  fr: { dashboard: "Tableau de Bord", community: "Communauté", teams: "Équipes", labs: "Labos" },
  pidgin: { dashboard: "Ma Corner", community: "Meeting Place", teams: "Ma Gees", labs: "Work Place" },
  de: { dashboard: "Armaturenbrett", community: "Gemeinschaft", teams: "Teams", labs: "Labore" },
  zh: { dashboard: "仪表板", community: "社区", teams: "团队", labs: "实验室" },
  es: { dashboard: "Tablero", community: "Comunidad", teams: "Equipos", labs: "Laboratorios" }
} as any;

export const CONTENT_TRANSLATIONS = {} as any;

export const ADMIN_CREDENTIALS = [
  { email: 'azilmuluh@gmail.com', pass: '119402008', name: 'Muluh Azinwi Success' },
  { email: 'nellybong20@gmail.com', pass: 'Nels-12', name: 'Chang Nelly Brown Bong' },
  { email: 'nyingchoadih@gmail.com', pass: 'Ngwanyingchogodwin2014#11', name: 'Nyingcho Bianca Adih' },
  { email: 'fodjonelson22@gmail.com', pass: 'nelcoteaches#0735', name: 'Fodjo Nelson' }
];

export const MENTOR_CREDENTIALS = [
  { email: 'azinwindahi@gmail.com', pass: '119402008', name: 'Muluh Ndahi' }
];

export const MOCK_USER_STATS: UserStats = {
    xp: 2450,
    rank: "Explorer",
    problemsSolved: 15,
    solutionsPosted: 4,
    projectsCompleted: 2,
    communityScore: 85,
    streakDays: 12,
    activityData: [
        { day: 'Mon', activity: 4 },
        { day: 'Tue', activity: 7 },
        { day: 'Wed', activity: 3 },
        { day: 'Thu', activity: 9 },
        { day: 'Fri', activity: 5 },
        { day: 'Sat', activity: 2 },
        { day: 'Sun', activity: 6 },
    ]
};

export const MOCK_COMMUNITIES: Community[] = [
    {
        id: 'c1', name: 'Silicon Mountain Devs', description: 'The heartbeat of Cameroon tech. Discuss code, startups, and events.',
        memberCount: 1240, activityLevel: 'Very Active', tags: ['Tech', 'Coding', 'Cameroon'], category: 'Tech', educationLevel: 'All', isVerified: true, image: 'SM', type: 'Public'
    },
    {
        id: 'c2', name: 'GDG Yaoundé', description: 'Google Developer Group Yaoundé. Android, Web, Cloud.',
        memberCount: 850, activityLevel: 'Active', tags: ['Tech', 'Google', 'University'], category: 'Tech', educationLevel: 'Undergraduate', isVerified: true, image: 'G', type: 'Public'
    },
    {
        id: 'c3', name: 'Pre-U Math Help', description: 'Solving GCE A-Level Math problems together.',
        memberCount: 320, activityLevel: 'Active', tags: ['STEM', 'Math', 'High School'], category: 'STEM', educationLevel: 'High School', isVerified: false, image: 'M', type: 'Public'
    },
    {
        id: 'c4', name: 'Open Dreams Scholars', description: 'Support for students applying to US/Canada universities.',
        memberCount: 2100, activityLevel: 'Very Active', tags: ['Scholarship', 'Study Abroad'], category: 'General', educationLevel: 'All', isVerified: true, image: 'OD', type: 'Private'
    },
    {
        id: 'c5', name: 'Creative Arts Bamenda', description: 'Designers, writers, and artists connecting in the North West.',
        memberCount: 150, activityLevel: 'Quiet', tags: ['Art', 'Design'], category: 'Art', educationLevel: 'All', isVerified: false, image: 'CA', type: 'Public'
    },
    {
        id: 'c6', name: 'CineCamer Filmmakers', description: 'Collaborate on short films and documentaries.',
        memberCount: 80, activityLevel: 'Active', tags: ['Film', 'Art', 'Media'], category: 'Art', educationLevel: 'All', isVerified: false, image: 'CC', type: 'Public'
    }
];

export const MOCK_GROUPS: Group[] = [
    { id: 'g1', name: 'Hackathon Team Alpha', description: 'Building the next big fintech app.', members: ['You', 'Blaise', 'Sarah'], type: 'Hackathon', nextMeeting: 'Tomorrow, 5 PM', tasksPending: 3 },
    { id: 'g2', name: 'Calculus Study Group', description: 'Prep for Semester 1 exams.', members: ['You', 'John', 'Mary', 'Peter'], type: 'Study', nextMeeting: 'Fri, 2 PM', tasksPending: 0 },
];

export const MOCK_PROBLEMS: CommunityProblem[] = [
    { id: 'p1', title: 'Calculus Integration Help', description: 'Can someone explain integration by parts?', difficulty: 'Medium', tags: ['Math', 'Calculus'], authorName: 'John Doe', date: '2h ago', likes: 5, comments: 2 },
    { id: 'p2', title: 'React Hook Error', description: 'Getting an infinite loop in useEffect. Code attached.', difficulty: 'Easy', tags: ['Coding', 'React'], authorName: 'Sarah Tabe', date: '5h ago', likes: 12, comments: 8 },
];

export const MOCK_USER: UserProfile = {
  id: 'u1',
  name: "Arrey Etta",
  username: "@arrey_tech",
  email: "arrey@example.com",
  role: 'User',
  education: "Undergraduate",
  academicBackground: "Software Engineering",
  graduationYear: "2025",
  interests: ["Technology", "Startups", "Community Development", "Arts", "Music"], 
  specificNeeds: ["Mentorship", "Funding"],
  targetCategories: ["Internship", "Hackathon"],
  goals: "Build a tech startup in Buea",
  city: "Buea",
  country: "Cameroon",
  age: 21,
  gender: "Male",
  bio: "UB Student. Silicon Mountain enthusiast. Building for Africa.",
  language: 'en',
  opportunitiesApplied: 8,
  opportunitiesSaved: 12,
  achievements: ["Profile Completed", "Hackathon Finalist"],
  joinedCommunityIds: [], 
  stats: MOCK_USER_STATS,
  settings: {
      notifications: true,
      push: true,
      reminders: true,
      news: false,
      privacyProfile: true,
      darkMode: false,
      voicePreference: 'Kore'
  }
};

export const MOCK_MENTORS = [
    { id: 'm1', name: "Dr. Chioma Okeke", username: "@dr_chioma", email: "chioma@example.com", role: 'Mentor', education: "PhD", city: "Lagos", country: "Nigeria", age: 35, gender: "Female", interests: ["AI"], bio: "AI Researcher.", profession: "AI Researcher", currentRole: "Senior Lecturer", yearsExperience: 10, expertise: ["AI"], availability: "Weekly", services: ["Academic Guidance"], rating: 4.9, reviewCount: 45 },
    { id: 'm2', name: "Sarah Tabe", username: "@sarah_pm", email: "sarah@example.com", role: 'Mentor', education: "MBA", city: "Douala", country: "Cameroon", age: 29, gender: "Female", interests: ["Fintech"], bio: "Fintech PM.", profession: "Product Manager", currentRole: "Product Lead", yearsExperience: 7, expertise: ["Product"], availability: "Monthly", services: ["CV Review"], rating: 5.0, reviewCount: 28 },
    { id: 'm3', name: "Blaise Fomonyuy", username: "@blaise_dev", email: "blaise@example.com", role: 'Mentor', education: "B.Eng", city: "Buea", country: "Cameroon", age: 26, gender: "Male", interests: ["Software"], bio: "Software Engineer.", profession: "Software Engineer", currentRole: "CTO", yearsExperience: 5, expertise: ["React"], availability: "Weekly", services: ["Portfolio Review"], rating: 4.8, reviewCount: 32 }
] as any;

export const INITIAL_SUCCESS_STORIES = [
    { id: 's1', authorName: 'Teboh Melvine', title: 'From Buea to Google!', content: 'Mentorship changed my life.', date: '2024-09-15', status: 'approved' }
] as any;

export const MOCK_PARTNERS = [
  { id: 'p1', name: 'MTN Cameroon', logo: 'M', description: 'Leading telecommunications provider.', category: 'Corporate', website: '#' },
  { id: 'p2', name: 'ActivSpaces', logo: 'AS', description: 'Tech hub.', category: 'Tech', website: '#' },
  { id: 'p3', name: 'Silicon Mountain', logo: 'SM', description: 'Community of techies in Fako.', category: 'Tech', website: '#' },
  { id: 'p4', name: 'Orange Digital Center', logo: 'O', description: 'Free digital training.', category: 'Education', website: '#' },
  { id: 'p5', name: 'University of Buea', logo: 'UB', description: 'Student research grants.', category: 'Education', website: '#' },
] as any;

export const MOCK_RESOURCES = [
  { id: 'r1', title: 'Winning Essays', type: 'Guide', author: 'LaunchPad', category: 'Scholarship', link: '#' },
  { id: 'r2', title: 'Intro to Tech', type: 'Video', author: 'Silicon Mountain', duration: '1h 30m', category: 'Tech', link: '#' },
  { id: 'r3', title: 'CV Template', type: 'Guide', author: 'Sarah Tabe', category: 'Career', link: '#' },
] as any;

// Updated Opportunities including Artists, Health, etc.
export const INITIAL_OPPORTUNITIES = [
  {
    id: 'deepmind-1',
    title: 'DeepMind Research Internship',
    organization: 'Google DeepMind',
    logo: '',
    category: 'Internship',
    regionScope: 'Global',
    location: 'London / Remote',
    isOnline: true,
    deadline: new Date().toISOString().split('T')[0], // Today
    description: 'Work on cutting-edge AGI research with the world\'s leading AI team. Solving intelligence to advance science.',
    tags: ['AI', 'Research', 'Python'],
    postedAt: '1h ago',
    status: 'approved',
    authorRole: 'Admin',
    cost: 'Free',
    eligibility: 'Open to Undergraduates, Master\'s and PhD students in CS, Math, or Physics.',
    requirements: ['Python', 'Strong Math Background', 'Research Experience'],
    benefits: 'Competitive Stipend, Mentorship from top scientists',
    applicationLink: 'https://deepmind.google/careers/',
    targetEducationLevels: ['Undergraduate', 'Graduate', 'PhD'],
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'art-1',
    title: 'Pan-African Digital Art Grant',
    organization: 'AfriArts Foundation',
    logo: '',
    category: 'Grant',
    regionScope: 'Africa',
    location: 'Remote',
    isOnline: true,
    deadline: '2024-12-15',
    description: 'Funding for digital artists creating works that celebrate African heritage.',
    tags: ['Arts', 'Graphic Design', 'Funding'],
    postedAt: '2d ago',
    status: 'approved',
    authorRole: 'Admin',
    cost: 'Free',
    eligibility: 'African digital artists.',
    requirements: ['Portfolio', 'Project Proposal'],
    benefits: '$2000 Grant, Exhibition',
    applicationLink: '#',
    targetEducationLevels: ['All'],
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'health-1',
    title: 'Nursing Elective at Douala General',
    organization: 'Douala General Hospital',
    logo: '',
    category: 'Internship',
    regionScope: 'Cameroon',
    location: 'Douala',
    isOnline: false,
    deadline: '2024-11-30',
    description: 'Practical clinical experience for nursing students.',
    tags: ['Health', 'Nursing', 'Medicine'],
    postedAt: '3d ago',
    status: 'approved',
    authorRole: 'Admin',
    cost: 'Free',
    eligibility: 'Nursing students (2nd year+).',
    requirements: ['School Letter', 'Vaccination Record'],
    benefits: 'Clinical Hours, Mentorship',
    applicationLink: '#',
    targetEducationLevels: ['Undergraduate'],
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'film-1',
    title: 'Short Film Competition: Stories of Change',
    organization: 'Canal+',
    logo: '',
    category: 'Competition',
    regionScope: 'Africa',
    location: 'Remote',
    isOnline: true,
    deadline: '2025-01-20',
    description: 'Submit a 5-minute short film about social change in your community.',
    tags: ['Film', 'Media', 'Arts'],
    postedAt: '1w ago',
    status: 'approved',
    authorRole: 'Admin',
    cost: 'Free',
    eligibility: 'Young filmmakers under 30.',
    requirements: ['Video File (MP4)'],
    benefits: 'Broadcast on TV, Cash Prize',
    applicationLink: '#',
    targetEducationLevels: ['All'],
    mediaType: 'video',
    mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
  },
  {
    id: '1',
    title: 'Silicon Mountain Code Fest 2024',
    organization: 'Silicon Mountain',
    category: 'Hackathon',
    regionScope: 'Specific City',
    location: 'Buea',
    isOnline: false,
    deadline: '2024-11-20',
    description: 'The biggest onsite coding competition in Buea.',
    tags: ['Coding', 'Java', 'Technology'],
    postedAt: '2h ago',
    status: 'approved',
    authorRole: 'Admin',
    cost: 'Free',
    eligibility: 'Students and Devs in Fako.',
    requirements: ['Laptop', 'Team of 3'],
    benefits: '1M XAF Prize',
    applicationLink: '#',
    targetEducationLevels: ['Undergraduate', 'Self-Taught'],
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    title: 'Orange Cameroon Pulse Internship',
    organization: 'Orange Cameroon',
    category: 'Internship',
    regionScope: 'Cameroon',
    location: 'Douala',
    isOnline: false,
    deadline: '2024-11-05',
    description: 'Looking for frontend developers.',
    tags: ['Corporate', 'Tech', 'Technology'],
    postedAt: '5h ago',
    status: 'approved',
    authorRole: 'Admin',
    cost: 'Free',
    eligibility: 'Final year students.',
    requirements: ['CV', 'Portfolio'],
    benefits: 'Monthly Allowance',
    applicationLink: '#',
    targetEducationLevels: ['Undergraduate', 'Graduate'],
    mediaType: 'video',
    mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
  }
] as any;

export const CATEGORIES = ['All', 'Scholarship', 'Internship', 'Hackathon', 'Grant', 'Volunteering', 'Fellowship', 'Competition', 'Job', 'Event'];
