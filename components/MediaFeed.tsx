
import React from 'react';
import { Opportunity } from '../types';
import { Play, ArrowLeft, Heart, Share2, Info } from 'lucide-react';

interface Props {
    opportunities: Opportunity[];
    onBack: () => void;
}

const MediaFeed: React.FC<Props> = ({ opportunities, onBack }) => {
    const mediaOpportunities = opportunities.filter(op => op.mediaUrl && (op.mediaType === 'video' || op.mediaType === 'image'));

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
                        {op.mediaType === 'video' ? (
                            <video 
                                src={op.mediaUrl} 
                                className="w-full h-full object-contain md:max-w-md mx-auto"
                                controls
                                loop
                                autoPlay
                                playsInline
                                muted // Auto-play usually requires muted initially
                            />
                        ) : (
                            <img src={op.mediaUrl} alt={op.title} className="w-full h-full object-contain md:max-w-md mx-auto" />
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
                        <div className="absolute right-4 bottom-24 flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-1">
                                <div className="p-3 bg-black/40 backdrop-blur-sm rounded-full cursor-pointer hover:bg-white/20">
                                    <Heart size={28} className="text-white" />
                                </div>
                                <span className="text-xs font-bold">Save</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="p-3 bg-black/40 backdrop-blur-sm rounded-full cursor-pointer hover:bg-white/20">
                                    <Share2 size={28} className="text-white" />
                                </div>
                                <span className="text-xs font-bold">Share</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="p-3 bg-black/40 backdrop-blur-sm rounded-full cursor-pointer hover:bg-white/20">
                                    <Info size={28} className="text-white" />
                                </div>
                                <span className="text-xs font-bold">More</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MediaFeed;
