import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Star, 
  Filter, 
  Search, 
  ShieldCheck, 
  Bot, 
  UserCheck 
} from 'lucide-react';
import { ResponseFeedback, Language, CitizenProfile } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { submitFeedbackToFirestore } from '../lib/firestoreService';

interface FeedbackPageProps {
  language: Language;
  profile: CitizenProfile;
  setActivePage: (page: string) => void;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({
  language,
  profile,
  setActivePage
}) => {
  const [feedbacks, setFeedbacks] = useState<ResponseFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'thumbs_up' | 'thumbs_down'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // General feedback form state
  const [rating, setRating] = useState<'thumbs_up' | 'thumbs_down'>('thumbs_up');
  const [category, setCategory] = useState('Scheme Accuracy');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');

  const t = TRANSLATIONS[language];

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (data.feedbacks) {
        setFeedbacks(data.feedbacks);
      }
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        messageId: `gen-${Date.now()}`,
        userQuery: `General Feedback regarding ${category}`,
        aiResponseSnippet: 'Citizen Portal Feedback Submission',
        rating,
        comment,
        tags: [category, 'Portal Review'],
        citizenState: profile.state || 'Telangana'
      };

      submitFeedbackToFirestore({
        rating: rating === 'thumbs_up' ? 5 : 2,
        comments: comment,
        category,
        userQuery: `General Feedback regarding ${category}`,
        aiResponseSnippet: 'Citizen Portal Feedback Submission'
      });

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedMessage('Thank you! Your feedback has been recorded for government portal administrators.');
        setComment('');
        fetchFeedbacks();
        setTimeout(() => setSubmittedMessage(''), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesFilter = filter === 'All' || fb.rating === filter;
    const matchesSearch =
      !searchQuery ||
      fb.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.userQuery?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.citizenState?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const positiveCount = feedbacks.filter((f) => f.rating === 'thumbs_up').length;
  const totalCount = feedbacks.length;
  const satisfactionRate = totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : 96;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-[#6C5CE7]" />
            <span>Citizen Feedback & Quality Portal</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Rate AI responses, submit comments, and review transparent feedback from citizens across India.
          </p>
        </div>

        <button
          onClick={() => setActivePage('chat')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl purple-gradient-btn text-white font-extrabold text-xs shadow-md transition-all self-start md:self-auto"
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* OVERVIEW STATS & GENERAL FORM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Information */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl purple-gradient-btn text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                AI System Accuracy Rating
              </span>
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>

            <div className="text-4xl font-black">{satisfactionRate}% Positive</div>

            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div className="bg-white h-full rounded-full" style={{ width: `${satisfactionRate}%` }} />
            </div>

            <div className="pt-2 flex justify-between text-xs font-medium border-t border-white/20">
              <span>{totalCount} Ratings Recorded</span>
              <span>{positiveCount} Thumbs Up 👍</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
              <span>Why Your Feedback Matters</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Yojana Mitra AI continuously learns from citizen feedback to ensure accurate state-level eligibility calculations, simple document checklists, and regional language support.
            </p>
          </div>
        </div>

        {/* Right Column: General Portal Feedback Form */}
        <div className="lg:col-span-2 glass-card border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#6C5CE7]" />
              <span>Submit Portal Feedback or Report Inaccuracy</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Have suggestions on scheme accuracy, regional language translation, or voice support?
            </p>
          </div>

          {submittedMessage && (
            <div className="p-3.5 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              <span>{submittedMessage}</span>
            </div>
          )}

          <form onSubmit={handleGeneralSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Rating selection */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRating('thumbs_up')}
                    className={`flex-1 py-2.5 px-3 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      rating === 'thumbs_up'
                        ? 'bg-[#22C55E]/10 border-[#22C55E] text-[#22C55E]'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Thumbs Up 👍</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRating('thumbs_down')}
                    className={`flex-1 py-2.5 px-3 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      rating === 'thumbs_down'
                        ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>Needs Improvement 👎</span>
                  </button>
                </div>
              </div>

              {/* Feedback Category */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Feedback Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50"
                >
                  <option value="Scheme Accuracy">Scheme Accuracy & Rules</option>
                  <option value="Voice Assistant">Voice Assistant & Audio</option>
                  <option value="Language Support">Hindi / Telugu Translation</option>
                  <option value="Document OCR">Document Scan (Aadhaar/Income)</option>
                  <option value="Application Process">Application Process Steps</option>
                  <option value="General Suggestion">General Suggestion</option>
                </select>
              </div>

            </div>

            {/* Comment Area */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Detailed Comments or Suggestions
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience or specify if any scheme rules in your state need updating..."
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="px-6 py-2.5 rounded-2xl purple-gradient-btn text-white font-extrabold text-xs shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
            </div>
          </form>

        </div>

      </div>

      {/* FEEDBACK FEED & SEARCH */}
      <div className="glass-card border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Recent Citizen Reviews & Feedback
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Feedback linked directly to AI responses and scheme inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setFilter('All')}
                className={`px-2.5 py-1 rounded-lg ${
                  filter === 'All' ? 'bg-[#6C5CE7] text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('thumbs_up')}
                className={`px-2.5 py-1 rounded-lg ${
                  filter === 'thumbs_up' ? 'bg-[#22C55E] text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                👍 Positive
              </button>
              <button
                onClick={() => setFilter('thumbs_down')}
                className={`px-2.5 py-1 rounded-lg ${
                  filter === 'thumbs_down' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                👎 Needs Work
              </button>
            </div>
          </div>
        </div>

        {/* FEEDBACK LIST */}
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
            Loading feedback stream...
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No feedback found matching search filters.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 ${
                        fb.rating === 'thumbs_up'
                          ? 'bg-[#22C55E]/10 text-[#22C55E] dark:bg-[#22C55E]/20'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                      }`}
                    >
                      {fb.rating === 'thumbs_up' ? <ThumbsUp className="w-3 h-3" /> : <ThumbsDown className="w-3 h-3" />}
                      <span>{fb.rating === 'thumbs_up' ? 'Helpful Response' : 'Needs Review'}</span>
                    </span>

                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      State: {fb.citizenState || 'India'}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400">
                    {new Date(fb.timestamp).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {fb.userQuery && (
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 italic">
                    Query: "{fb.userQuery}"
                  </div>
                )}

                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  "{fb.comment || 'No comment provided.'}"
                </p>

                {fb.tags && fb.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {fb.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-300 text-[10px] font-bold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

