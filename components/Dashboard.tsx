
import React from 'react';
import { UserProfile } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Trophy, TrendingUp, Calendar, Zap, MessageSquare, Briefcase, Star, Clock } from 'lucide-react';

interface Props {
  user: UserProfile;
}

const Dashboard: React.FC<Props> = ({ user }) => {
  const stats = user.stats || {
      xp: 0,
      rank: "Newbie",
      problemsSolved: 0,
      solutionsPosted: 0,
      projectsCompleted: 0,
      communityScore: 0,
      streakDays: 0,
      activityData: []
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Welcome & XP Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-r from-charcoal-900 to-charcoal-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl font-extrabold mb-1">Welcome back, {user.name.split(' ')[0]}!</h2>
                <p className="text-gray-300 mb-6">You're on a <span className="text-golden-400 font-bold">{stats.streakDays} day streak</span>. Keep it up!</p>
                
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Current Rank</p>
                        <p className="text-2xl font-bold text-golden-400 flex items-center gap-2">
                            <Trophy size={20} fill="currentColor"/> {stats.rank}
                        </p>
                    </div>
                    <div className="h-10 w-px bg-white/20"></div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Total XP</p>
                        <p className="text-2xl font-bold text-white">{stats.xp.toLocaleString()}</p>
                    </div>
                     <div className="h-10 w-px bg-white/20"></div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Community Score</p>
                        <p className="text-2xl font-bold text-green-400">{stats.communityScore}</p>
                    </div>
                </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-golden-500/20 to-transparent"></div>
        </div>

        <div className="bg-white dark:bg-charcoal-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-charcoal-700 flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400"><Zap size={20}/></div>
                 <h3 className="font-bold text-gray-900 dark:text-white">AI Coach Suggestions</h3>
             </div>
             <ul className="space-y-3">
                 <li className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                     <span className="text-golden-500 font-bold">•</span>
                     Apply to the "Orange Pulse Internship" - it fits your profile perfectly.
                 </li>
                 <li className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                     <span className="text-golden-500 font-bold">•</span>
                     Review "Calculus Integration" in the Learning Hub to boost your STEM score.
                 </li>
             </ul>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-charcoal-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-charcoal-700">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                      <TrendingUp size={20} className="text-coral-500"/> Activity Overview
                  </h3>
                  <select className="text-xs bg-gray-100 dark:bg-charcoal-700 rounded-lg px-2 py-1 outline-none border-none">
                      <option>Last 7 Days</option>
                      <option>Last Month</option>
                  </select>
              </div>
              <div className="h-64 w-full">
                  {stats.activityData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={stats.activityData}>
                              <defs>
                                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5}/>
                              <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} stroke="#9CA3AF" />
                              <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#9CA3AF" />
                              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                              <Area type="monotone" dataKey="activity" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  ) : <div className="flex items-center justify-center h-full text-gray-400">No activity data available</div>}
              </div>
          </div>

          {/* Quick Panels */}
          <div className="space-y-6">
              <div className="bg-white dark:bg-charcoal-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-charcoal-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Clock size={18} className="text-red-500"/> Upcoming Deadlines
                  </h3>
                  <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
                          <div className="flex-col flex items-center bg-white dark:bg-charcoal-900 p-1 rounded border border-red-200">
                              <span className="text-[10px] font-bold text-red-500 uppercase">Nov</span>
                              <span className="text-lg font-bold text-gray-900 dark:text-white leading-none">20</span>
                          </div>
                          <div className="min-w-0">
                              <p className="text-sm font-bold truncate text-gray-900 dark:text-white">Silicon Mountain Code Fest</p>
                              <p className="text-xs text-red-500 font-medium">Expires in 2 days</p>
                          </div>
                      </div>
                  </div>
              </div>

               <div className="bg-white dark:bg-charcoal-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-charcoal-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Briefcase size={18} className="text-blue-500"/> My Applications
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Pending Review</span>
                      <span className="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-charcoal-700 px-2 py-1 rounded">3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-600 dark:text-gray-300">Interviews</span>
                      <span className="font-bold text-golden-600 bg-golden-50 dark:bg-golden-900/20 px-2 py-1 rounded">1</span>
                  </div>
              </div>
          </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
