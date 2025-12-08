
import React from 'react';
import { MOCK_PARTNERS, MOCK_MENTORS } from '../constants';
import { ExternalLink, Handshake, Users, Globe } from 'lucide-react';

const PartnersHub: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Partners & Ecosystem</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                We collaborate with leading Cameroonian organizations and global tech giants to bring you the best opportunities.
            </p>
        </div>

        {/* Partners Section */}
        <section>
            <div className="flex items-center gap-2 mb-6">
                <Handshake className="text-golden-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Our Partners</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_PARTNERS.map(partner => (
                    <div key={partner.id} className="bg-white dark:bg-charcoal-800 p-6 rounded-2xl border border-gray-100 dark:border-charcoal-700 shadow-sm hover:shadow-lg transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-beige-100 dark:bg-charcoal-600 flex items-center justify-center text-xl font-bold text-golden-600 dark:text-golden-400">
                                {partner.logo}
                            </div>
                            <span className="px-2 py-1 bg-gray-100 dark:bg-charcoal-900 text-[10px] rounded-md font-bold text-gray-500 uppercase tracking-wide">
                                {partner.category}
                            </span>
                        </div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-golden-600 transition-colors">{partner.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{partner.description}</p>
                        <a href={partner.website} className="text-coral-500 text-sm font-bold flex items-center gap-1 hover:underline">
                            Visit Website <ExternalLink size={14}/>
                        </a>
                    </div>
                ))}
                
                {/* Become a Partner Card */}
                <div className="bg-golden-50 dark:bg-golden-900/10 p-6 rounded-2xl border-2 border-dashed border-golden-300 dark:border-golden-800 flex flex-col items-center justify-center text-center">
                    <Handshake size={32} className="text-golden-500 mb-2"/>
                    <h4 className="font-bold text-lg text-golden-900 dark:text-golden-100">Become a Partner</h4>
                    <p className="text-sm text-golden-800 dark:text-golden-200 mt-2 mb-4 font-medium">Help us empower more youth.</p>
                    <a href="contact.html" className="px-4 py-2 bg-golden-500 text-white rounded-lg text-sm font-bold hover:bg-golden-600 transition-colors">Contact Us</a>
                </div>
            </div>
        </section>

        {/* Experts Section */}
        <section>
            <div className="flex items-center gap-2 mb-6">
                <Users className="text-golden-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Featured Industry Experts</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_MENTORS.slice(0, 4).map(mentor => (
                    <div key={mentor.id} className="flex items-center gap-4 bg-white dark:bg-charcoal-800 p-4 rounded-xl border border-gray-100 dark:border-charcoal-700 shadow-sm">
                        <div className="w-14 h-14 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                            {mentor.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{mentor.name}</h4>
                            <p className="text-sm text-coral-600 dark:text-coral-400 font-medium">{mentor.profession}</p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 font-medium">
                                <Globe size={12}/> {mentor.country}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

    </div>
  );
};

export default PartnersHub;
