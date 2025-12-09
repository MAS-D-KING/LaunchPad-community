
import React, { useState } from 'react';
import { Opportunity } from '../types';
import { Play, ArrowLeft, Heart, Share2, Info, X, Bookmark } from 'lucide-react';

interface Props {
    opportunities: Opportunity[];
    onBack: () => void;
}

const MediaFeed: React.FC<Props> = ({ opportunities, onBack }) => {
    // Filter strictly for valid media
    const [failedMediaIds, setFailedMediaIds] = useState<Set<string>>(new Set());
    const [liked, setLiked] = useState<Set<string>>(new Set());
    const [saved, setSaved] = useState<Set<string>>(new Set());
    const [activeMore, setActiveMore] = useState<Opportunity | null>(null);

    const mediaOpportunities = opportunities.filter(op => 
        op.mediaUrl && 
        (op.mediaType === 'video' || op.mediaType === 'image') &&
        !failedMediaIds.has(op.id)
    );

    const handleMediaError = (id: string) => {
        setFailedMediaIds(prev => new Set(prev).add(id));
    };

    const handleLike = (id: string) => {
        const newLiked = new Set(liked);
        if (newLiked.has(id)) newLiked.delete(id);
        else newLiked.add(id);
        setLiked(newLiked);
    };

    const handleSave = (id: string) => {
        const newSaved = new Set(saved);
        if (newSaved.has(id)) newSaved.delete(id);
        else newSaved.add(id);
        setSaved(newSaved);
        alert(newSaved.has(id) ? "Bookmarked!" : "Removed from bookmarks.");
    };

    const handleShare = (op: Opportunity) => {
        if (navigator.share) {
            navigator.share({
                title: op.title,
                text: op.description,
                url: op.applicationLink
            }).catch(console.error);
        } else {
            alert('Share link copied to clipboard!');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black text-white overflow-y-scroll snap-y snap-mandatory h-full w-full">
            <button 
                onClick={onBack}
                className="fixed top-4 left-4 z-50 p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors"
            >
                <ArrowLeft size={24} />
            </button>

            {mediaOpportunities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-gray-400">No media content available yet.</p>
                    <button onClick={onBack} className="mt-4 text-golden-500 font-bold">Go Back</button>
                </div>
            ) : (
                mediaOpportunities.map(op => (
                    <div key={op.id} className="h-screen w-full snap-start relative flex items-center justify-center bg-charcoal-900">
                        {op.mediaType === 'video' && op.mediaUrl ? (
                            <video 
                                src={op.mediaUrl} 
                                className="w-full h-full object-contain md:max-w-md mx-auto"
                                controls
                                loop
                                autoPlay
                                playsInline
                                muted // Auto-play usually requires muted initially
                                crossOrigin="anonymous"
                                onError={() => handleMediaError(op.id)}
                            />
                        ) : (
                            <img 
                                src={op.mediaUrl} 
                                alt={op.title} 
                                className="w-full h-full object-contain md:max-w-md mx-auto" 
                                onError={() => handleMediaError(op.id)}
                            />
                        )}

                        {/* Overlay Info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6 pb-12 pt-20">
                            <div className="max-w-2xl mx-auto">
                                <span className="inline-block px-2 py-1 bg-golden-500 text-black text-xs font-bold rounded mb-2 uppercase">{op.category}</span>
                                <h2 className="text-2xl font-bold mb-1 shadow-black drop-shadow-md">{op.title}</h2>
                                <p className="text-sm text-gray-200 mb-4 line-clamp-2">{op.description}</p>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {op.logo && <img src={op.logo} className="w-8 h-8 rounded-full bg-white"/>}
                                        <span className="font-bold text-sm">{op.organization}</span>
                                    </div>
                                    <a 
                                        href={op.applicationLink} 
                                        target="_blank" 
                                        className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
                                    >
                                        Apply Now
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Side Actions (Reels Style) */}
                        <div className="absolute right-4 bottom-24 flex flex-col gap-6 z-20">
                            <div className="flex flex-col items-center gap-1">
                                <button onClick={() => handleSave(op.id)} className={`p-3 backdrop-blur-sm rounded-full cursor-pointer hover:bg-white/20 ${saved.has(op.id) ? 'bg-golden-500 text-black' : 'bg-black/40 text-white'}`}>
                                    <Bookmark size={28} className={saved.has(op.id) ? "fill-black" : ""} />
                                </button>
                                <span className="text-xs font-bold shadow-black drop-shadow-md">{saved.has(op.id) ? 'Saved' : 'Bookmark'}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <button onClick={() => handleLike(op.id)} className={`p-3 backdrop-blur-sm rounded-full cursor-pointer hover:bg-white/20 ${liked.has(op.id) ? 'bg-red-500 text-white' : 'bg-black/40 text-white'}`}>
                                    <Heart size={28} className={liked.has(op.id) ? "fill-white" : ""} />
                                </button>
                                <span className="text-xs font-bold shadow-black drop-shadow-md">Like</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <button onClick={() => handleShare(op)} className="p-3 bg-black/40 backdrop-blur-sm rounded-full cursor-pointer hover:bg-white/20">
                                    <Share2 size={28} className="text-white" />
                                </button>
                                <span className="text-xs font-bold shadow-black drop-shadow-md">Share</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <button onClick={() => setActiveMore(op)} className="p-3 bg-black/40 backdrop-blur-sm rounded-full cursor-pointer hover:bg-white/20">
                                    <Info size={28} className="text-white" />
                                </button>
                                <span className="text-xs font-bold shadow-black drop-shadow-md">More</span>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {/* Slide-up Info Panel - Fixed Positioning */}
            {activeMore && (
                <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-end animate-fadeIn">
                    <div className="bg-white dark:bg-charcoal-800 w-full rounded-t-3xl p-6 h-[70vh] overflow-y-auto relative animate-slideUp border-t border-gray-200 dark:border-charcoal-700 shadow-2xl">
                        <button onClick={() => setActiveMore(null)} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-charcoal-900 rounded-full hover:bg-gray-200 transition-colors"><X size={20} className="text-gray-500"/></button>
                        <div className="mb-6">
                            <span className="text-golden-500 font-bold text-xs uppercase mb-1 block">{activeMore.category}</span>
                            <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2">{activeMore.title}</h2>
                            <p className="text-gray-500 text-sm font-medium">{activeMore.organization} • {activeMore.location}</p>
                        </div>
                        <div className="space-y-4 mb-8">
                             <div>
                                 <h4 className="font-bold text-gray-900 dark:text-white mb-1">Description</h4>
                                 <p className="text-sm text-gray-600 dark:text-gray-300">{activeMore.description}</p>
                             </div>
                             <div>
                                 <h4 className="font-bold text-gray-900 dark:text-white mb-1">Requirements</h4>
                                 <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                                     {activeMore.requirements.map(r => <li key={r}>{r}</li>)}
                                 </ul>
                             </div>
                             <div>
                                 <h4 className="font-bold text-gray-900 dark:text-white mb-1">Benefits</h4>
                                 <p className="text-sm text-gray-600 dark:text-gray-300">{activeMore.benefits}</p>
                             </div>
                        </div>
                        <a href={activeMore.applicationLink} target="_blank" className="w-full bg-golden-500 text-white font-bold py-3 rounded-lg block text-center mb-4 hover:bg-golden-600 transition-colors">Apply Now</a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaFeed;
