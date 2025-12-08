
import React, { useState } from 'react';
import { Opportunity, SuccessStory, MentorApplication } from '../types';

interface Props {
  onSubmitOp: (op: Partial<Opportunity>) => void;
  onSubmitStory: (story: Partial<SuccessStory>) => void;
  onSubmitMentorApp: (app: Partial<MentorApplication>) => void;
}

const UserSubmission: React.FC<Props> = ({ onSubmitOp, onSubmitStory, onSubmitMentorApp }) => {
  const [type, setType] = useState<'story' | 'opportunity' | 'mentor'>('story');
  
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');

  const [opTitle, setOpTitle] = useState('');
  const [opLink, setOpLink] = useState('');
  const [opDesc, setOpDesc] = useState('');

  const [mentorProfession, setMentorProfession] = useState('');
  const [mentorBio, setMentorBio] = useState('');
  const [mentorExpertise, setMentorExpertise] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'story') {
        onSubmitStory({
            title: storyTitle,
            content: storyContent,
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        });
        alert('Story submitted for review!');
        setStoryTitle(''); setStoryContent('');
    } else if (type === 'opportunity') {
        onSubmitOp({
            title: opTitle,
            applicationLink: opLink,
            description: opDesc,
            status: 'pending',
            category: 'Scholarship',
            authorRole: 'User'
        });
        alert('Opportunity suggestion submitted!');
        setOpTitle(''); setOpLink(''); setOpDesc('');
    } else if (type === 'mentor') {
        onSubmitMentorApp({
            profession: mentorProfession,
            bio: mentorBio,
            expertise: mentorExpertise.split(',').map(s => s.trim())
        });
        alert('Mentor application submitted!');
        setMentorProfession(''); setMentorBio(''); setMentorExpertise('');
    }
  };

  return (
    <div className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-sm border border-gray-100 dark:border-charcoal-700 p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contribute to LaunchPad</h3>
        
        <div className="flex gap-4 mb-8 border-b border-gray-100 dark:border-charcoal-700 overflow-x-auto">
            <button onClick={() => setType('story')} className={`pb-3 text-sm font-bold transition-colors whitespace-nowrap ${type === 'story' ? 'text-golden-500 border-b-2 border-golden-500' : 'text-gray-500 hover:text-gray-700'}`}>Share Success Story</button>
            <button onClick={() => setType('opportunity')} className={`pb-3 text-sm font-bold transition-colors whitespace-nowrap ${type === 'opportunity' ? 'text-golden-500 border-b-2 border-golden-500' : 'text-gray-500 hover:text-gray-700'}`}>Suggest Opportunity</button>
            <button onClick={() => setType('mentor')} className={`pb-3 text-sm font-bold transition-colors whitespace-nowrap ${type === 'mentor' ? 'text-golden-500 border-b-2 border-golden-500' : 'text-gray-500 hover:text-gray-700'}`}>Become a Mentor</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            {type === 'story' && (
                <>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                        <input 
                            className="w-full p-3.5 bg-beige-50 dark:bg-charcoal-700 rounded-lg border border-gray-200 dark:border-charcoal-600 dark:text-white focus:ring-2 focus:ring-golden-500 outline-none"
                            placeholder="e.g., How I won the hackathon..."
                            value={storyTitle} onChange={e => setStoryTitle(e.target.value)} required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Story</label>
                        <textarea 
                            className="w-full p-3.5 bg-beige-50 dark:bg-charcoal-700 rounded-lg border border-gray-200 dark:border-charcoal-600 dark:text-white focus:ring-2 focus:ring-golden-500 outline-none"
                            placeholder="Share your experience and inspire others..." rows={6}
                            value={storyContent} onChange={e => setStoryContent(e.target.value)} required
                        />
                    </div>
                </>
            )} 
            
            {type === 'opportunity' && (
                <>
                     <input 
                        className="w-full p-3.5 bg-beige-50 dark:bg-charcoal-700 rounded-lg border border-gray-200 dark:border-charcoal-600 dark:text-white focus:ring-2 focus:ring-golden-500 outline-none"
                        placeholder="Opportunity Title"
                        value={opTitle} onChange={e => setOpTitle(e.target.value)} required
                    />
                     <input 
                        className="w-full p-3.5 bg-beige-50 dark:bg-charcoal-700 rounded-lg border border-gray-200 dark:border-charcoal-600 dark:text-white focus:ring-2 focus:ring-golden-500 outline-none"
                        placeholder="Link to details"
                        value={opLink} onChange={e => setOpLink(e.target.value)} required
                    />
                     <textarea 
                        className="w-full p-3.5 bg-beige-50 dark:bg-charcoal-700 rounded-lg border border-gray-200 dark:border-charcoal-600 dark:text-white focus:ring-2 focus:ring-golden-500 outline-none"
                        placeholder="Brief description..." rows={4}
                        value={opDesc} onChange={e => setOpDesc(e.target.value)} required
                    />
                </>
            )}

            {type === 'mentor' && (
                <>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Join our Expert Network</h4>
                    <p className="text-xs text-gray-500">Mentors are vetted professionals who guide students.</p>
                     <input 
                        className="w-full p-3.5 bg-beige-50 dark:bg-charcoal-700 rounded-lg border border-gray-200 dark:border-charcoal-600 dark:text-white focus:ring-2 focus:ring-golden-500 outline-none"
                        placeholder="Profession (e.g. Software Engineer)"
                        value={mentorProfession} onChange={e => setMentorProfession(e.target.value)} required
                    />
                     <textarea 
                        className="w-full p-3.5 bg-beige-50 dark:bg-charcoal-700 rounded-lg border border-gray-200 dark:border-charcoal-600 dark:text-white focus:ring-2 focus:ring-golden-500 outline-none"
                        placeholder="Professional Bio..." rows={4}
                        value={mentorBio} onChange={e => setMentorBio(e.target.value)} required
                    />
                    <input 
                        className="w-full p-3.5 bg-beige-50 dark:bg-charcoal-700 rounded-lg border border-gray-200 dark:border-charcoal-600 dark:text-white focus:ring-2 focus:ring-golden-500 outline-none"
                        placeholder="Areas of Expertise (comma separated)"
                        value={mentorExpertise} onChange={e => setMentorExpertise(e.target.value)} required
                    />
                </>
            )}

            <button className="bg-golden-500 text-white px-8 py-3 rounded-lg hover:bg-golden-600 font-bold w-full sm:w-auto shadow-lg shadow-golden-500/20 transition-all">
                Submit for Approval
            </button>
        </form>
    </div>
  );
};

export default UserSubmission;
