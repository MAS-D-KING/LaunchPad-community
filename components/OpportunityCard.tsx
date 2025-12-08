
import React, { useState } from 'react';
import { Opportunity } from '../types';
import { MapPin, Calendar, Bookmark, Share2, Clock, ArrowRight, ChevronDown, ChevronUp, Globe, Edit2, Trash2, Tag } from 'lucide-react';

interface Props {
  data: Opportunity;
  onBookmark: (id: string) => void;
  isAdmin?: boolean;
  onEdit?: (op: Opportunity) => void;
  onDelete?: (id: string) => void;
}

const OpportunityCard: React.FC<Props> = ({ data, onBookmark, isAdmin, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isDeadLineSoon = () => {
    if (!data.deadline || data.deadline === 'TBD') return false;
    const deadlineDate = new Date(data.deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays >= 0 && diffDays <= 7;
  };

  return (
    <div className="bg-white dark:bg-charcoal-800 border-l-[6px] border-golden-500 shadow-sm rounded-r-xl p-4 md:p-5 mb-5 hover:shadow-md transition-all duration-200 group relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2 sm:gap-0">
        <div className="flex flex-col flex-1 w-full sm:pr-2">
          <div className="flex flex-wrap items-center gap-2 mb-3">
             <span className="text-[10px] font-bold tracking-wider uppercase text-coral-600 dark:text-coral-400 bg-coral-50 dark:bg-coral-900/20 px-2 py-1 rounded-md border border-coral-100 dark:border-coral-800/30">
                {data.category}
             </span>
             <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider ${data.cost === 'Free' ? 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400 border border-violet-100' : 'bg-golden-50 text-golden-700 border border-golden-100'}`}>
                {data.cost === 'Free' ? 'Free' : data.costAmount || 'Paid'}
             </span>
          </div>
          
          <div className="flex items-start gap-3">
            {data.logo && (
              <img src={data.logo} alt={data.organization} className="w-10 h-10 rounded-lg object-contain bg-white border border-gray-100 shrink-0" />
            )}
            <div className="min-w-0">
               <h3 className="text-lg sm:text-xl font-extrabold text-charcoal-900 dark:text-white leading-tight mb-1 break-words">
                {data.title}
              </h3>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1 flex-wrap">
                {data.organization} <span className="text-gray-300">•</span> <span className="text-golden-600 dark:text-golden-400">{data.regionScope}</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-start ml-auto sm:ml-2">
            {isAdmin && (
                <div className="flex items-center gap-1 bg-gray-50 dark:bg-charcoal-700 rounded-lg p-1 mr-2 border border-gray-100 dark:border-charcoal-600">
                     <button 
                        onClick={(e) => { e.stopPropagation(); onEdit && onEdit(data); }} 
                        className="p-3 md:p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        title="Edit"
                     >
                        <Edit2 size={16} />
                     </button>
                     <button 
                        onClick={(e) => { e.stopPropagation(); onDelete && onDelete(data.id); }} 
                        className="p-3 md:p-1.5 text-coral-600 hover:bg-coral-50 rounded-md transition-colors" 
                        title="Delete"
                     >
                        <Trash2 size={16} />
                     </button>
                </div>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(data.id);
              }}
              className={`p-3 md:p-2.5 rounded-full hover:bg-beige-100 dark:hover:bg-charcoal-700 transition-colors ${data.isBookmarked ? 'text-golden-500 fill-current' : 'text-gray-300'}`}
            >
              <Bookmark size={22} className={data.isBookmarked ? "fill-golden-500" : ""} />
            </button>
        </div>
      </div>

      {/* Description */}
      <p className={`text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed mt-2 ${isExpanded ? '' : 'line-clamp-2'}`}>
        {data.description}
      </p>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 mb-4 pt-4 border-t border-gray-100 dark:border-charcoal-700 space-y-4 animate-fadeIn bg-beige-50 dark:bg-charcoal-900/50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Eligibility</h4>
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{data.eligibility}</p>
                </div>
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Benefits</h4>
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{data.benefits}</p>
                </div>
            </div>
             <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Requirements</h4>
                <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-1">
                    {data.requirements.map((r, i) => <li key={i} className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-golden-500"></span>{r}</li>)}
                </ul>
            </div>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {data.tags.map((tag, idx) => (
          <span key={idx} className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-charcoal-700 text-gray-600 dark:text-gray-300 rounded flex items-center gap-1">
            <Tag size={10}/> {tag}
          </span>
        ))}
        <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-coral-500 flex items-center hover:underline ml-auto"
        >
            {isExpanded ? 'Show Less' : 'View Details'} {isExpanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
        </button>
      </div>

      {/* Footer Details */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-charcoal-700 gap-y-3 gap-x-2">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            {data.isOnline ? <Globe size={14} className="text-blue-400" /> : <MapPin size={14} className="text-coral-500" />}
            <span className="font-bold text-gray-700 dark:text-gray-300">{data.location}</span>
          </div>
          <div className={`flex items-center gap-1.5 font-medium ${isDeadLineSoon() ? 'text-red-500' : ''}`}>
            <Calendar size={14} />
            <span>Deadline: {data.deadline}</span>
          </div>
          <div className="flex items-center gap-1.5 hidden sm:flex">
            <Clock size={14} />
            <span>{data.postedAt}</span>
          </div>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex items-center justify-center sm:justify-start gap-1 hover:text-gray-800 dark:hover:text-gray-200 font-medium px-2 py-1">
                <Share2 size={16} />
            </button>
            <a 
                href={data.applicationLink} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 font-bold text-white bg-golden-500 hover:bg-golden-600 px-4 py-2 rounded-lg transition-all shadow-md shadow-golden-500/20 hover:shadow-lg text-center"
            >
                Apply Now <ArrowRight size={14} />
            </a>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
