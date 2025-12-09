
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

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  logo?: string; // Organization logo URL
  category: Category;
  regionScope: RegionScope;
  location: string; // Specific city or "Remote"
  deadline: string;
  description: string;
  image?: string; // Legacy field, mapped to mediaUrl if mediaType is image
  tags: string[];
  isBookmarked?: boolean;
  postedAt: string;
  status: 'approved' | 'pending';
  authorRole: UserRole;
  
  // Media Fields
  mediaUrl?: string;
  mediaType?: 'image' | 'video';

  // New specific fields
  cost: 'Free' | 'Paid';
  costAmount?: string;
  eligibility: string;
  requirements: string[];
  benefits: string;
  applicationLink: string;
  
  // Smart filter helpers
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
  city: string; // Critical for on-site filtering
  country: string;
  age: number;
  gender?: 'Male' | 'Female' | 'Prefer not to say'; // New field
  bio?: string;
  username?: string;
  image?: string;
  language?: Language; // New field
  
  // User Specific
  academicBackground?: string; // e.g. "Computer Science", "Economics"
  graduationYear?: string;
  interests: string[];
  specificNeeds?: string[]; // e.g. "Funding", "Mentorship"
  targetCategories?: Category[];
  
  // User Activity & Gamification
  opportunitiesApplied?: number;
  opportunitiesSaved?: number;
  achievements?: string[]; // e.g. "Profile Completed", "First Application"
  
  // Mentor Specific Fields
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
  
  // Admin Specific
  adminRole?: 'Super Admin' | 'Moderator' | 'Content Manager';
  permissions?: string[];

  // Settings
  settings?: {
      notifications: boolean;
      push: boolean;
      reminders: boolean;
      news: boolean;
      privacyProfile?: boolean;
      showActivity?: boolean;
      voicePreference?: AIVoice; // New field
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
  logo: string; // initials or url
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
