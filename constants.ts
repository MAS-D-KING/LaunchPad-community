
import { Opportunity, UserProfile, SuccessStory, Partner, LearningResource, Community, Group, UserStats, CommunityProblem } from './types';

// Using reliable public URLs for preview environment
export const APP_LOGO = "https://cdn-icons-png.flaticon.com/512/2585/2585188.png";
export const APP_WALLPAPER = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop";

// Translation Dictionary (Truncated for brevity, assuming existing is kept)
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
    // New Translations
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
  // ... other languages (keeping existing logic)
  fr: { dashboard: "Tableau de Bord", community: "Communauté", teams: "Équipes", labs: "Labos" },
  pidgin: { dashboard: "Ma Corner", community: "Meeting Place", teams: "Ma Gees", labs: "Work Place" },
  de: { dashboard: "Armaturenbrett", community: "Gemeinschaft", teams: "Teams", labs: "Labore" },
  zh: { dashboard: "仪表板", community: "社区", teams: "团队", labs: "实验室" },
  es: { dashboard: "Tablero", community: "Comunidad", teams: "Equipos", labs: "Laboratorios" }
} as any;

export const CONTENT_TRANSLATIONS = {
    // ... existing content translations
} as any;

export const ADMIN_CREDENTIALS = [
  { email: 'azilmuluh@gmail.com', pass: '119402008', name: 'Muluh Azinwi Success' },
  { email: 'nellybong20@gmail.com', pass: 'Nels-12', name: 'Chang Nelly Brown Bong' },
  { email: 'nyingchoadih@gmail.com', pass: 'Ngwanyingchogodwin2014#11', name: 'Nyingcho Bianca Adih' },
  { email: 'fodjonelson22@gmail.com', pass: 'nelcoteaches#0735', name: 'Fodjo Nelson' }
];

export const MENTOR_CREDENTIALS = [
  { email: 'azinwindahi@gmail.com', pass: '119402008', name: 'Muluh Ndahi' }
];

// Ecosystem Mock Data

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
        memberCount: 1240, activityLevel: 'Very Active', tags: ['Tech', 'Coding', 'Cameroon'], category: 'Tech', educationLevel: 'All', isVerified: true, image: 'SM'
    },
    {
        id: 'c2', name: 'GDG Yaoundé', description: 'Google Developer Group Yaoundé. Android, Web, Cloud.',
        memberCount: 850, activityLevel: 'Active', tags: ['Tech', 'Google', 'University'], category: 'Tech', educationLevel: 'Undergraduate', isVerified: true, image: 'G'
    },
    {
        id: 'c3', name: 'Pre-U Math Help', description: 'Solving GCE A-Level Math problems together.',
        memberCount: 320, activityLevel: 'Active', tags: ['STEM', 'Math', 'High School'], category: 'STEM', educationLevel: 'High School', isVerified: false, image: 'M'
    },
    {
        id: 'c4', name: 'Open Dreams Scholars', description: 'Support for students applying to US/Canada universities.',
        memberCount: 2100, activityLevel: 'Very Active', tags: ['Scholarship', 'Study Abroad'], category: 'General', educationLevel: 'All', isVerified: true, image: 'OD'
    },
    {
        id: 'c5', name: 'Creative Arts Bamenda', description: 'Designers, writers, and artists connecting in the North West.',
        memberCount: 150, activityLevel: 'Quiet', tags: ['Art', 'Design'], category: 'Art', educationLevel: 'All', isVerified: false, image: 'CA'
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
  joinedCommunityIds: ['c1'], 
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
    {
    id: 'm1',
    name: "Dr. Chioma Okeke",
    username: "@dr_chioma",
    email: "chioma@example.com",
    role: 'Mentor',
    education: "PhD Computer Science",
    city: "Lagos",
    country: "Nigeria",
    age: 35,
    gender: "Female",
    interests: ["AI", "Research"],
    bio: "AI Researcher helping African students get into top global grad schools.",
    profession: "AI Researcher",
    currentRole: "Senior Lecturer, UNILAG",
    yearsExperience: 10,
    expertise: ["Artificial Intelligence", "Academic Research", "Grant Writing"],
    availability: "Weekly",
    services: ["Academic Guidance", "Project Mentorship", "Scholarship Guidance"],
    rating: 4.9,
    reviewCount: 45,
    linkedinLink: "#",
    achievements: ["Top Mentor 2023"]
  },
  {
    id: 'm2',
    name: "Sarah Tabe",
    username: "@sarah_pm",
    email: "sarah@example.com",
    role: 'Mentor',
    education: "MBA",
    city: "Douala",
    country: "Cameroon",
    age: 29,
    gender: "Female",
    interests: ["Business", "Fintech"],
    bio: "Fintech Product Manager at MTN. I help young pros navigate the corporate ladder.",
    profession: "Product Manager",
    currentRole: "Product Lead, MTN Cameroon",
    yearsExperience: 7,
    expertise: ["Product Management", "Fintech", "Career Strategy"],
    availability: "Monthly",
    services: ["CV Review", "Interview Prep", "Career Advice"],
    rating: 5.0,
    reviewCount: 28,
    linkedinLink: "#"
  },
  {
    id: 'm3',
    name: "Blaise Fomonyuy",
    username: "@blaise_dev",
    email: "blaise@example.com",
    role: 'Mentor',
    education: "B.Eng Software",
    city: "Buea",
    country: "Cameroon",
    age: 26,
    gender: "Male",
    interests: ["Software", "Startups"],
    bio: "Silicon Mountain Founder. Let's review your code and portfolio.",
    profession: "Software Engineer",
    currentRole: "CTO, Skylight Tech",
    yearsExperience: 5,
    expertise: ["Software Engineering", "React", "Startup Fundraising"],
    availability: "Weekly",
    services: ["Portfolio Review", "Project Mentorship"],
    rating: 4.8,
    reviewCount: 32,
    linkedinLink: "#"
  }
] as any;
export const INITIAL_SUCCESS_STORIES = [
    {
    id: 's1',
    authorName: 'Teboh Melvine',
    title: 'From Buea to Google!',
    content: 'Thanks to the LaunchPad mentorship program, I polished my CV and landed a remote role. The community support is real!',
    date: '2024-09-15',
    status: 'approved'
  }
] as any;
export const MOCK_PARTNERS = [
  { id: 'p1', name: 'MTN Cameroon', logo: 'M', description: 'Leading telecommunications provider.', category: 'Corporate', website: '#' },
  { id: 'p2', name: 'ActivSpaces', logo: 'AS', description: 'Tech hub supporting startups in Buea/Douala.', category: 'Tech', website: '#' },
  { id: 'p3', name: 'Silicon Mountain', logo: 'SM', description: 'Community of techies in Fako.', category: 'Tech', website: '#' },
  { id: 'p4', name: 'Orange Digital Center', logo: 'O', description: 'Free digital training.', category: 'Education', website: '#' },
  { id: 'p5', name: 'University of Buea', logo: 'UB', description: 'Student research grants.', category: 'Education', website: '#' },
] as any;
export const MOCK_RESOURCES = [
  { id: 'r1', title: 'Winning Chevening Essays', type: 'Guide', author: 'LaunchPad', category: 'Scholarship', link: '#' },
  { id: 'r2', title: 'Intro to Tech in Cameroon', type: 'Video', author: 'Silicon Mountain', duration: '1h 30m', category: 'Tech', link: '#' },
  { id: 'r3', title: 'CV Template', type: 'Guide', author: 'Sarah Tabe', category: 'Career', link: '#' },
] as any;
export const INITIAL_OPPORTUNITIES = [
  {
    id: '1',
    title: 'Silicon Mountain Code Fest 2024',
    organization: 'Silicon Mountain Community',
    logo: 'SM',
    category: 'Hackathon',
    regionScope: 'Specific City',
    location: 'Buea',
    isOnline: false,
    deadline: '2024-11-20',
    description: 'The biggest onsite coding competition in Buea. Gather your team and build solutions for local problems.',
    tags: ['Coding', 'Java', 'Community'],
    postedAt: '2h ago',
    status: 'approved',
    authorRole: 'Admin',
    cost: 'Free',
    eligibility: 'Students and Devs in Fako.',
    requirements: ['Laptop', 'Team of 3'],
    benefits: '1M XAF Prize Pool, Job Offers',
    applicationLink: '#',
    targetEducationLevels: ['Undergraduate', 'Self-Taught'],
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    title: 'Orange Cameroon Pulse Internship',
    organization: 'Orange Cameroon',
    logo: 'O',
    category: 'Internship',
    regionScope: 'Cameroon',
    location: 'Douala',
    isOnline: false,
    deadline: '2024-11-05',
    description: 'Join the digital team at Orange. Looking for frontend developers and UI/UX designers.',
    tags: ['Corporate', 'Tech', 'Telecom'],
    postedAt: '5h ago',
    status: 'approved',
    authorRole: 'Admin',
    cost: 'Free',
    eligibility: 'Final year students (Licence/Master).',
    requirements: ['CV', 'Portfolio', 'School Letter'],
    benefits: 'Monthly Allowance (80k XAF), Experience',
    applicationLink: '#',
    targetEducationLevels: ['Undergraduate', 'Graduate'],
    mediaType: 'video',
    mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
  },
  {
    id: '3',
    title: 'Presidential Excellence Grant',
    organization: 'MinESUP',
    logo: 'M',
    category: 'Grant',
    regionScope: 'Cameroon',
    location: 'Yaoundé',
    isOnline: false,
    deadline: '2024-12-31',
    description: 'Academic excellence grant for top performing university students in state universities.',
    tags: ['Government', 'Education'],
    postedAt: '1d ago',
    status: 'approved',
    authorRole: 'Admin',
    cost: 'Free',
    eligibility: 'GPA > 3.5/4.0.',
    requirements: ['Transcripts', 'ID'],
    benefits: '50,000 XAF Grant',
    applicationLink: '#',
    targetEducationLevels: ['Undergraduate', 'Graduate']
  },
  {
    id: '4',
    title: 'Mastercard Foundation Scholars Program',
    organization: 'Mastercard Foundation',
    logo: 'MF',
    category: 'Scholarship',
    regionScope: 'Africa',
    location: 'Cape Town',
    isOnline: false,
    deadline: '2025-01-15',
    description: 'Full scholarship for African students to study at UCT South Africa.',
    tags: ['Study Abroad', 'Full Ride'],
    postedAt: '3d ago',
    status: 'approved',
    authorRole: 'Admin',
    cost: 'Free',
    eligibility: 'Academically talented African youth.',
    requirements: ['Essays', 'References', 'Transcripts'],
    benefits: 'Full Tuition, Accommodation, Stipend, Flight',
    applicationLink: '#',
    targetEducationLevels: ['Graduate', 'Undergraduate'],
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '5',
    title: 'Bamenda Innovation Week Volunteer',
    organization: 'Bamenda Tech Hub',
    logo: 'BT',
    category: 'Volunteering',
    regionScope: 'Specific City',
    location: 'Bamenda',
    isOnline: false,
    deadline: '2024-10-30',
    description: 'Help organize the biggest tech event in the North West region.',
    tags: ['Event', 'Community'],
    postedAt: '6h ago',
    status: 'approved',
    authorRole: 'Admin',
    cost: 'Free',
    eligibility: 'Residents of Bamenda.',
    requirements: ['Availability'],
    benefits: 'Certificate, T-Shirt, Networking',
    applicationLink: '#',
    targetEducationLevels: ['High School', 'Undergraduate']
  },
  {
    id: '6',
    title: 'Remote Technical Writer',
    organization: 'AfriTech Blog',
    logo: 'AT',
    category: 'Job',
    regionScope: 'Africa',
    location: 'Remote',
    isOnline: true,
    deadline: 'Rolling',
    description: 'Write tutorials about using mobile money APIs in Africa.',
    tags: ['Writing', 'Fintech'],
    postedAt: '1w ago',
    status: 'approved',
    authorRole: 'Admin',
    cost: 'Free',
    eligibility: 'Strong English writing skills.',
    requirements: ['Writing Samples'],
    benefits: '$50 per article',
    applicationLink: '#',
    targetEducationLevels: ['All']
  }
] as any;
export const CATEGORIES = [
  'All',
  'Scholarship',
  'Internship',
  'Hackathon',
  'Grant',
  'Volunteering',
  'Fellowship',
  'Competition',
  'Job',
  'Event'
];
