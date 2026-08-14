import React from 'react';
import { Sparkles, CheckCircle2, Bookmark, ArrowRight, FileText, ExternalLink } from 'lucide-react';
import { GovernmentScheme, EligibilityResult } from '../types';

interface SchemeCardProps {
  scheme: GovernmentScheme;
  eligibilityResult?: EligibilityResult;
  isSaved?: boolean;
  onToggleSave?: (schemeId: string) => void;
  onViewDetails: (scheme: GovernmentScheme) => void;
}

export function getCategoryBadgeStyle(category: string): string {
  switch (category) {
    case 'Agriculture':
      return 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/90 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700';
    case 'Healthcare':
    case 'Health':
      return 'bg-rose-100 text-rose-950 dark:bg-rose-900/90 dark:text-rose-100 border-rose-300 dark:border-rose-700';
    case 'Housing':
      return 'bg-amber-100 text-amber-950 dark:bg-amber-900/90 dark:text-amber-100 border-amber-300 dark:border-amber-700';
    case 'Education':
      return 'bg-sky-100 text-sky-950 dark:bg-sky-900/90 dark:text-sky-100 border-sky-300 dark:border-sky-700';
    case 'Energy':
      return 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/90 dark:text-yellow-100 border-yellow-300 dark:border-yellow-700';
    case 'Women & Child':
      return 'bg-pink-100 text-pink-950 dark:bg-pink-900/90 dark:text-pink-100 border-pink-300 dark:border-pink-700';
    case 'Senior Citizens':
    case 'Pension & Social':
      return 'bg-purple-100 text-purple-950 dark:bg-purple-900/90 dark:text-purple-100 border-purple-300 dark:border-purple-700';
    case 'Employment & Skill':
    case 'Employment':
    case 'Financial & Business':
      return 'bg-indigo-100 text-indigo-950 dark:bg-indigo-900/90 dark:text-indigo-100 border-indigo-300 dark:border-indigo-700';
    default:
      return 'bg-teal-100 text-teal-950 dark:bg-teal-900/90 dark:text-teal-100 border-teal-300 dark:border-teal-700';
  }
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  eligibilityResult,
  isSaved = false,
  onToggleSave,
  onViewDetails
}) => {
  const score = eligibilityResult?.score;

  let badgeColor = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
  if (score !== undefined) {
    if (score >= 80) badgeColor = 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700';
    else if (score >= 60) badgeColor = 'bg-indigo-100 text-indigo-950 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700';
    else if (score >= 35) badgeColor = 'bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700';
    else badgeColor = 'bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-700';
  }

  return (
    <div className="group glass-card bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden hover:border-[#6C5CE7] dark:hover:border-[#6C5CE7]">
      
      {/* Top Tag & Bookmark button */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full border shadow-2xs ${getCategoryBadgeStyle(scheme.category)}`}>
            {scheme.category}
          </span>

          <div className="flex items-center gap-2">
            {score !== undefined && (
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${badgeColor}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{score}% Match</span>
              </span>
            )}

            {onToggleSave && (
              <button
                onClick={() => onToggleSave(scheme.id)}
                className={`p-1.5 rounded-full transition-colors ${
                  isSaved
                    ? 'text-[#6C5CE7] bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isSaved ? 'Remove Bookmark' : 'Save Scheme'}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            )}
          </div>
        </div>

        {/* Scheme Title & Ministry */}
        <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base group-hover:text-[#6C5CE7] dark:group-hover:text-[#4F9DFF] transition-colors line-clamp-2 leading-snug">
          {scheme.name}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 mb-2 font-bold flex items-center gap-1">
          <span>{scheme.ministry}</span>
        </p>

        {/* Official Verification Badge */}
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-300 font-extrabold mb-3">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Verified Official Source</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 dark:text-slate-400 font-semibold">{scheme.lastVerifiedAt || 'Feb 2026'}</span>
        </div>

        {/* Benefit Highlight Box with High Contrast Color */}
        <div className="bg-emerald-50/90 dark:bg-emerald-950/70 border border-emerald-200/90 dark:border-emerald-800 p-3 rounded-2xl mb-4">
          <div className="text-[11px] font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Key Benefit</span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-emerald-100 line-clamp-2 leading-relaxed">
            {scheme.benefits}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {scheme.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-0.5 rounded-full font-bold border border-slate-200 dark:border-slate-700">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-[#6C5CE7]" />
          <span>{scheme.requiredDocuments.length} Verification Docs</span>
        </span>

        <button
          onClick={() => onViewDetails(scheme)}
          className="flex items-center gap-1.5 text-xs font-extrabold text-[#6C5CE7] dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-white transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

