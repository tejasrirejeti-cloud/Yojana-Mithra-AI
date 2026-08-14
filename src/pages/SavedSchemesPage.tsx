import React from 'react';
import { Bookmark, ArrowRight, Trash2, CheckCircle2, Clock, FileText, ExternalLink } from 'lucide-react';
import { GovernmentScheme, CitizenProfile, Language } from '../types';
import { SCHEMES_DATABASE } from '../data/schemes';
import { TRANSLATIONS } from '../utils/translations';

interface SavedSchemesPageProps {
  savedSchemeIds: string[];
  onToggleSaveScheme: (schemeId: string) => void;
  onViewSchemeDetails: (scheme: GovernmentScheme) => void;
  language: Language;
}

export const SavedSchemesPage: React.FC<SavedSchemesPageProps> = ({
  savedSchemeIds,
  onToggleSaveScheme,
  onViewSchemeDetails,
  language
}) => {
  const t = TRANSLATIONS[language];

  const savedSchemes = SCHEMES_DATABASE.filter(s => savedSchemeIds.includes(s.id));

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Bookmark className="w-7 h-7 text-[#6C5CE7] fill-current" />
          <span>Bookmarked Schemes & Application Tracker</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Track your application workflow progress from bookmarked schemes to document submission and benefit receipt.
        </p>
      </div>

      {savedSchemes.length === 0 ? (
        <div className="p-12 text-center glass-card border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-3">
          <Bookmark className="w-12 h-12 text-[#6C5CE7] opacity-40 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">No Saved Schemes Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse the Scheme Explorer or chat with Yojana Mitra AI to bookmark schemes for quick reference.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="glass-card border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-[#6C5CE7] border border-indigo-200/50 dark:border-indigo-800/50">
                    {scheme.category}
                  </span>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg mt-1">
                    {scheme.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {scheme.ministry}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewSchemeDetails(scheme)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl purple-gradient-btn text-white font-bold text-xs shadow-md transition-all"
                  >
                    <span>View Checklist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onToggleSaveScheme(scheme.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Tracker Stepper */}
              <div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Application Journey Workflow:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] dark:text-[#22C55E] font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span>1. Bookmarked</span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#6C5CE7] shrink-0" />
                    <span>2. Docs Prepared</span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>3. Submitted at MeeSeva</span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>4. Benefit Credited</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

