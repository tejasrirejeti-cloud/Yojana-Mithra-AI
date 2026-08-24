import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Check, Sparkles, Send, X } from 'lucide-react';
import { ResponseFeedback } from '../types';
import { getCurrentUserToken } from '../lib/firebase';

interface FeedbackWidgetProps {
  messageId: string;
  userQuery?: string;
  aiResponseSnippet?: string;
  existingFeedback?: ResponseFeedback;
  onFeedbackSubmitted?: (feedback: ResponseFeedback) => void;
  citizenState?: string;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  messageId,
  userQuery,
  aiResponseSnippet,
  existingFeedback,
  onFeedbackSubmitted,
  citizenState = 'Telangana'
}) => {
  const [rating, setRating] = useState<'thumbs_up' | 'thumbs_down' | null>(
    existingFeedback?.rating || null
  );
  const [comment, setComment] = useState(existingFeedback?.comment || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(existingFeedback?.tags || []);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!existingFeedback);

  const availableTags = [
    'Accurate Rules',
    'Relevant Schemes',
    'Clear Language',
    'Voice Friendly',
    'Incomplete Details',
    'Incorrect Eligibility',
    'Need More State Rules'
  ];

  const handleRatingClick = (newRating: 'thumbs_up' | 'thumbs_down') => {
    setRating(newRating);
    setIsOpen(true);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    setIsSubmitting(true);
    try {
      const payload = {
        messageId,
        userQuery: userQuery || 'User Query',
        aiResponseSnippet: aiResponseSnippet ? aiResponseSnippet.slice(0, 200) : 'AI Response',
        rating,
        comment,
        tags: selectedTags,
        citizenState
      };

      const token = await getCurrentUserToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.feedback) {
        setSubmitted(true);
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted(data.feedback);
        }
      } else {
        // Optimistic success fallback
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      // Still show optimistic acknowledgement
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
      <div className="flex items-center justify-between">
        
        {/* Rating Controls */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Was this answer helpful?
          </span>

          <button
            onClick={() => handleRatingClick('thumbs_up')}
            className={`p-1.5 rounded-lg flex items-center gap-1 transition-all ${
              rating === 'thumbs_up'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Rate Thumbs Up"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            {rating === 'thumbs_up' && <span className="text-[10px]">Helpful</span>}
          </button>

          <button
            onClick={() => handleRatingClick('thumbs_down')}
            className={`p-1.5 rounded-lg flex items-center gap-1 transition-all ${
              rating === 'thumbs_down'
                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/30'
                : 'text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Rate Thumbs Down"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            {rating === 'thumbs_down' && <span className="text-[10px]">Needs Work</span>}
          </button>

          {!submitted && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold hover:underline ml-2 flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3" />
              <span>{isOpen ? 'Close' : 'Add Comment'}</span>
            </button>
          )}
        </div>

        {/* Confirmation Status */}
        {submitted && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <Check className="w-3 h-3" />
            <span>Feedback Saved</span>
            <button 
              onClick={() => setIsOpen(true)}
              className="text-[10px] text-slate-400 underline ml-1 hover:text-slate-600"
            >
              Edit
            </button>
          </div>
        )}

      </div>

      {/* Expandable Free-Text Feedback Drawer */}
      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-3 p-3.5 rounded-2xl bg-amber-500/5 dark:bg-slate-800/90 border border-amber-500/20 dark:border-slate-700 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {rating === 'thumbs_up' ? 'What was most helpful?' : 'How can Yojana Mitra AI improve this response?'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tag Pills */}
          <div className="flex flex-wrap gap-1.5">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
                  }`}
                >
                  {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                </button>
              );
            })}
          </div>

          {/* Comment Field */}
          <div>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your feedback or comment for our government portal admin review..."
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !rating}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs shadow-md hover:opacity-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              <span>{isSubmitting ? 'Saving...' : 'Submit Feedback'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
