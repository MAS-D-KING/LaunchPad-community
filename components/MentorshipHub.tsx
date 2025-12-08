
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { Star, MapPin, Briefcase, Mail, CheckCircle, ArrowRight, UserPlus } from 'lucide-react';

interface Props {
    mentors?: UserProfile[];
    onBecomeMentorClick?: () => void;
    userRole?: UserRole;
}

const MentorshipHub: React.FC<Props> = ({ mentors = [], onBecomeMentorClick, userRole }) => {
  const [filterInterest, setFilterInterest] = useState('All');
  
  const allInterests = Array.from(new Set(mentors.flatMap(m => m.interests || [])));

  const displayedMentors = mentors.filter(m => 
      filterInterest === 'All' || m.interests?.includes(filterInterest)
  );

  const handleConnect = (email: string) => {
      window.location.href = `mailto:${email}?subject=Mentorship Request via LaunchPad`;
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-charcoal-900 dark:text-white">Mentorship Hub</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl mx-auto font-medium">Connect with verified Cameroonian experts and global guides to accelerate your career.</p>
          
          <div className="mt-6 flex justify-center">
              <button 
                onClick={onBecomeMentorClick}
                className="flex items-center gap-2 bg-charcoal-900 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-charcoal-800 transition-all"
              >
                  Become a Mentor <ArrowRight size={16}/>
              </button>
          </div>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-2 flex-wrap mb-10">
          <button 
              onClick={() => setFilterInterest('All')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filterInterest === 'All' ? 'bg-golden-500 text-white shadow-md' : 'bg-white dark:bg-charcoal-800 text-gray-600 hover:bg-golden-50'}`}
          >
              All Experts
          </button>
          {allInterests.map(interest => (
               <button 
                  key={interest}
                  onClick={() => setFilterInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filterInterest === interest ? 'bg-golden-500 text-white shadow-md' : 'bg-white dark:bg-charcoal-800 text-gray-600 hover:bg-golden-50'}`}
              >
                  {interest}
              </button>
          ))}
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMentors.map(mentor => (
              <div key={mentor.id} className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-sm border border-gray-100 dark:border-charcoal-700 p-6 flex flex-col hover:shadow-lg transition-shadow group">
                  <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-violet-500 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-md">
                          {mentor.name.charAt(0)}
                      </div>
                      <div>
                          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-1 group-hover:text-golden-600 transition-colors">
                              {mentor.name}
                              <CheckCircle size={14} className="text-blue-500" />
                          </h3>
                          <p className="text-sm text-coral-600 dark:text-coral-400 font-bold">{mentor.currentRole}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 font-medium">
                              <MapPin size={12} />
                              {mentor.city}, {mentor.country}
                          </div>
                      </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1 bg-beige-50 dark:bg-charcoal-900/50 p-3 rounded-lg border border-beige-100 dark:border-charcoal-700 italic">
                      "{mentor.bio}"
                  </p>

                  <div className="mb-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Can help with:</p>
                      <div className="flex flex-wrap gap-2">
                          {mentor.services?.slice(0, 3).map(service => (
                              <span key={service} className="px-2 py-1 bg-gray-100 dark:bg-charcoal-700 text-xs rounded-md text-gray-700 dark:text-gray-300 font-medium">
                                  {service}
                              </span>
                          ))}
                      </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-charcoal-700 mt-auto">
                       <div className="flex items-center gap-1 text-golden-500 text-sm font-bold">
                           <Star size={16} fill="currentColor" />
                           {mentor.rating}
                       </div>
                       
                       {userRole === 'Mentor' ? (
                           <button className="bg-gray-100 dark:bg-charcoal-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
                               <UserPlus size={16} /> Network
                           </button>
                       ) : (
                           <button 
                              onClick={() => handleConnect(mentor.email)}
                              className="bg-charcoal-900 dark:bg-white text-white dark:text-charcoal-900 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-golden-500 dark:hover:bg-golden-500 hover:text-white transition-colors"
                           >
                               <Mail size={16} /> Book Session
                           </button>
                       )}
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default MentorshipHub;
