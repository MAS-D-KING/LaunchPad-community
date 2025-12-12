
export type Category = 
  | 'Scholarship' 
  | 'Internship' 
  | 'Hackathon' 
  | 'Grant' 
  | 'Volunteering' 
  | 'Fellowship' 
  | 'Competition' 
  | 'Job' 
  | 'Event';

export type UserRole = 'User' | 'Admin' | 'Mentor';

export type RegionScope = 'Global' | 'Africa' | 'Cameroon' | 'Specific City';

export type MentorService = 'CV Review' | 'Portfolio Review' | 'Interview Prep' | 'Career Advice' | 'Academic Guidance' | 'Project Mentorship' | 'Scholarship Guidance' | 'Personal Statement Review';

export type Language = 'en' | 'fr' | 'pidgin' | 'de' | 'zh' | 'es';

export type AIVoice = 'Kore' | 'Puck' | 'Fenrir' | 'Charon' | 'Aoede';

// Added new specialized labs
export type LabsType = 'Code' | 'Design' | 'Eng' | 'Writer' | 'Audio' | 'Artist' | 'Health' | 'Science' | 'Film' | 'Music';

// --- Ecosystem Types ---

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: number;
  read: boolean;
}

export interface UserStats {
  xp: number;
  rank: string; // e.g. "Novice", "Explorer", "Master"
  problemsSolved: number;
  solutionsPosted: number;
  projectsCompleted: number;
  communityScore: number; // 0-100
  streakDays: number;
  activityData: { day: string; activity: number }[]; // For charts
}

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  activityLevel: 'Quiet' | 'Active' | 'Very Active';
  tags: string[];
  category: 'Tech' | 'Art' | 'STEM' | 'Business' | 'General';
  educationLevel: 'High School' | 'Undergraduate' | 'Graduate' | 'All';
  isVerified?: boolean; 
  image?: string;
  type: 'Public' | 'Private';
}

export interface CommunityProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  authorName: string;
  date: string;
  likes: number;
  comments: number;
  solutions?: { id: string, author: string, content: string, aiFeedback?: string }[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[]; // Names or IDs
  type: 'Study' | 'Project' | 'Hackathon' | 'Social';
  nextMeeting?: string;
  tasksPending: number;
}

export interface LabSession {
  id: string;
  name: string;
  type: LabsType;
  lastEdited: string;
  collaborators: string[];
  status: 'Active' | 'Saved';
}

export interface ApplicationMaterials {
    cv: string;
    coverLetter: string;
    emailDraft: string;
}

// --- End Ecosystem Types ---

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  logo?: string; 
  category: Category;
  regionScope: RegionScope;
  location: string; 
  deadline: string;
  description: string;
  image?: string; 
  tags: string[];
  isBookmarked?: boolean;
  postedAt: string;
  status: 'approved' | 'pending';
  authorRole: UserRole;
  
  mediaUrl?: string;
  mediaType?: 'image' | 'video';

  cost: 'Free' | 'Paid';
  costAmount?: string;
  eligibility: string;
  requirements: string[];
  benefits: string;
  applicationLink: string;
  
  targetEducationLevels: string[];
  isOnline: boolean;
}

export interface MentorshipRequest {
  id: string;
  menteeName: string;
  menteeId: string;
  topic: string;
  message: string;
  status: 'Pending' | 'Accepted' | 'Completed';
  date: string;
}

export interface MentorApplication {
  id: string;
  userId: string;
  name: string;
  email: string;
  profession: string;
  bio: string;
  expertise: string[];
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  education: string;
  city: string; 
  country: string;
  age: number;
  gender?: 'Male' | 'Female' | 'Prefer not to say';
  bio?: string;
  username?: string;
  image?: string;
  language?: Language;
  
  academicBackground?: string; 
  graduationYear?: string;
  interests: string[];
  specificNeeds?: string[]; 
  targetCategories?: Category[];
  goals?: string; 
  
  opportunitiesApplied?: number;
  opportunitiesSaved?: number;
  achievements?: string[]; 
  
  joinedCommunityIds?: string[]; // Added for persistence

  // Stats for Dashboard
  stats?: UserStats;

  profession?: string;
  yearsExperience?: number;
  currentRole?: string;
  pastRoles?: string[];
  expertise?: string[];
  availability?: 'Weekly' | 'Monthly' | 'Not Available' | 'On Request' | 'Unavailable'; 
  availabilitySlots?: string[];
  services?: MentorService[];
  rating?: number;
  reviewCount?: number;
  linkedinLink?: string;
  portfolioLink?: string;
  requests?: MentorshipRequest[];
  
  adminRole?: 'Super Admin' | 'Moderator' | 'Content Manager';
  permissions?: string[];

  settings?: {
      notifications: boolean;
      push: boolean;
      reminders: boolean;
      news: boolean;
      privacyProfile?: boolean;
      showActivity?: boolean;
      voicePreference?: AIVoice;
      // New Settings
      darkMode?: boolean;
      themeColor?: string;
      twoFactor?: boolean;
  }
}

export interface SuccessStory {
  id: string;
  authorName: string;
  title: string;
  content: string;
  date: string;
  status: 'pending' | 'approved';
}

export interface FilterState {
  category: Category | 'All';
  searchQuery: string;
  targetRegion: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string; 
  description: string;
  category: 'Tech' | 'Education' | 'NGO' | 'Corporate';
  website: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'Video' | 'Article' | 'Guide' | 'Course';
  author: string;
  duration?: string;
  category: string;
  link: string;
}
