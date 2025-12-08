
import React, { useState } from 'react';
import { MOCK_RESOURCES } from '../constants';
import { BookOpen, Video, FileText, Download, PlayCircle, ExternalLink } from 'lucide-react';

const LearningCenter: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Career', 'Scholarship', 'Tech', 'Research', 'Business'];
  
  const filteredResources = MOCK_RESOURCES.filter(r => filter === 'All' || r.category === filter);

  const handleOpenLink = (url: string) => {
      window.open(url, '_blank');
  };

  const handleDownload = (title: string) => {
      alert(`Downloading: ${title}... (Simulated)`);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Center</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">Curated resources to help you prepare for opportunities.</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar max-w-full">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === cat ? 'bg-golden-500 text-white shadow-md' : 'bg-white dark:bg-charcoal-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Featured Tracks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-charcoal-800 to-charcoal-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BookOpen size={100}/></div>
                <h3 className="text-lg font-bold mb-2">Scholarship Mastery</h3>
                <p className="text-sm text-gray-300 mb-4 font-medium">A step-by-step guide to winning international scholarships like Chevening and Mastercard.</p>
                <button onClick={() => handleOpenLink('#track-scholarship')} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors">Start Track</button>
            </div>
            <div className="bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Video size={100}/></div>
                <h3 className="text-lg font-bold mb-2">Tech Career Starter</h3>
                <p className="text-sm text-white/90 mb-4 font-medium">From zero coding knowledge to your first internship in Douala or Buea.</p>
                <button onClick={() => handleOpenLink('#track-tech')} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors">Start Track</button>
            </div>
            <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><FileText size={100}/></div>
                <h3 className="text-lg font-bold mb-2">Grant Writing 101</h3>
                <p className="text-sm text-white/90 mb-4 font-medium">How to write proposals that get funded by international donors.</p>
                <button onClick={() => handleOpenLink('#track-grant')} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors">Start Track</button>
            </div>
        </div>

        {/* Resource List */}
        <div className="space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Latest Resources</h3>
            {filteredResources.map(resource => (
                <div key={resource.id} className="bg-white dark:bg-charcoal-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700 flex items-center justify-between group hover:border-golden-300 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm ${resource.type === 'Video' ? 'bg-red-500' : resource.type === 'Guide' ? 'bg-blue-500' : 'bg-green-500'}`}>
                            {resource.type === 'Video' ? <PlayCircle size={24}/> : <FileText size={24}/>}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-golden-600 transition-colors">{resource.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-1">
                                <span className="text-coral-500">{resource.author}</span>
                                <span>•</span>
                                <span className="bg-gray-100 dark:bg-charcoal-700 px-1.5 py-0.5 rounded">{resource.category}</span>
                                {resource.duration && (
                                    <>
                                        <span>•</span>
                                        <span>{resource.duration}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleOpenLink(resource.link)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="View">
                            <ExternalLink size={20}/>
                        </button>
                        <button onClick={() => handleDownload(resource.title)} className="p-2 text-gray-400 hover:text-golden-500 transition-colors" title="Download">
                            <Download size={20}/>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default LearningCenter;
