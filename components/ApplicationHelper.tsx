
import React, { useState } from 'react';
import { Opportunity, UserProfile, ApplicationMaterials } from '../types';
import { generateApplicationMaterials } from '../services/geminiService';
import { X, Sparkles, Copy, Check, FileText } from 'lucide-react';

interface Props {
    user: UserProfile;
    opportunity: Opportunity;
    onClose: () => void;
}

const ApplicationHelper: React.FC<Props> = ({ user, opportunity, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ApplicationMaterials | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        const materials = await generateApplicationMaterials(user, opportunity);
        setResult(materials);
        setIsLoading(false);
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-charcoal-800 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-charcoal-700">
                <div className="p-6 border-b border-gray-100 dark:border-charcoal-700 flex justify-between items-center bg-gray-50 dark:bg-charcoal-900">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Sparkles className="text-golden-500" size={20}/> Application Helper
                        </h3>
                        <p className="text-sm text-gray-500">Drafting for: <span className="font-bold text-gray-700 dark:text-gray-300">{opportunity.title}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-charcoal-700 rounded-full transition-colors"><X size={20}/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {!result ? (
                        <div className="text-center py-10">
                            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ready to apply?</h4>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                AI will analyze your profile and the job description to create a tailored CV structure and cover letter.
                            </p>
                            <button 
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="bg-golden-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-golden-600 transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
                            >
                                {isLoading ? <Sparkles className="animate-spin" /> : <Sparkles />} 
                                {isLoading ? 'Generating Drafts...' : 'Generate Documents'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-charcoal-900 dark:text-white">Cover Letter</h4>
                                    <button onClick={() => copyToClipboard(result.coverLetter, 'letter')} className="text-xs font-bold text-golden-600 hover:underline flex items-center gap-1">
                                        {copied === 'letter' ? <Check size={14}/> : <Copy size={14}/>} {copied === 'letter' ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-charcoal-900 rounded-xl border border-gray-100 dark:border-charcoal-700 text-sm whitespace-pre-wrap font-mono text-gray-700 dark:text-gray-300 max-h-60 overflow-y-auto">
                                    {result.coverLetter}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-charcoal-900 dark:text-white">CV Structure</h4>
                                    <button onClick={() => copyToClipboard(result.cv, 'cv')} className="text-xs font-bold text-golden-600 hover:underline flex items-center gap-1">
                                        {copied === 'cv' ? <Check size={14}/> : <Copy size={14}/>} {copied === 'cv' ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-charcoal-900 rounded-xl border border-gray-100 dark:border-charcoal-700 text-sm whitespace-pre-wrap font-mono text-gray-700 dark:text-gray-300 max-h-60 overflow-y-auto">
                                    {result.cv}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationHelper;
