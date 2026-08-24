import React from 'react';
import { X, Sparkles, CheckCircle, FileText, Globe, Phone, ExternalLink, Download, ShieldCheck, Bookmark, ArrowUpRight } from 'lucide-react';
import { GovernmentScheme, EligibilityResult, CitizenProfile, Language } from '../types';

interface SchemeDetailModalProps {
  scheme: GovernmentScheme | null;
  isOpen?: boolean;
  isSaved?: boolean;
  onToggleSave?: () => void;
  eligibilityResult?: EligibilityResult;
  onClose: () => void;
  onDownloadPdf?: () => void;
  profile?: CitizenProfile;
  language?: Language;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  isOpen = true,
  isSaved = false,
  onToggleSave,
  eligibilityResult,
  onClose,
  onDownloadPdf,
  profile,
  language
}) => {
  if (!scheme || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Verified Status */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40">
            {scheme.category}
          </span>
          {scheme.isCentral ? (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#4F9DFF]/10 text-[#4F9DFF]">
              Central Scheme
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
              State Scheme ({scheme.targetStates?.join(', ') || 'State'})
            </span>
          )}

          <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-300 font-extrabold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 ml-auto mr-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Verified Official</span>
            <span className="text-slate-400">•</span>
            <span>{scheme.lastVerifiedAt || 'Feb 2026'}</span>
          </div>
        </div>

        {/* Header Title */}
        <h2 className="font-extrabold text-slate-900 dark:text-white text-xl sm:text-2xl leading-tight mb-1">
          {scheme.name}
        </h2>
        {scheme.hindiName && (
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            {scheme.hindiName}
          </p>
        )}
        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-6">
          {scheme.ministry}
        </p>

        {/* Eligibility Match Card if provided */}
        {eligibilityResult && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#22C55E]/10 to-teal-500/10 border border-[#22C55E]/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
                <span className="font-bold text-sm text-[#22C55E]">
                  AI Eligibility Analysis
                </span>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#22C55E] text-white shadow-sm">
                {eligibilityResult.score}% Match Score
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {eligibilityResult.explanation}
            </p>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
            <span>Scheme Benefits & Financial Coverage</span>
          </h3>
          <div className="text-sm text-slate-800 dark:text-slate-200 bg-emerald-50/80 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 leading-relaxed font-medium">
            {scheme.benefits}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            Detailed Overview
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {scheme.description}
          </p>
        </div>

        {/* Required Documents Grid */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#4F9DFF]" />
            <span>Required Verification Documents ({scheme.requiredDocuments.length})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scheme.requiredDocuments.map((doc, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-[#22C55E] shrink-0" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Process Steps */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Official Application Procedure
          </h3>
          <div className="space-y-2">
            {scheme.applicationProcess.map((step, idx) => (
              <div key={idx} className="flex gap-3 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-[#6C5CE7] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <p className="pt-0.5 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Official Links Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>Helpline: {scheme.helpline}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                onClick={onToggleSave}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isSaved
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-[#6C5CE7] dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#6C5CE7]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Bookmarked' : 'Save'}</span>
              </button>
            )}

            <a
              href={scheme.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl purple-gradient-btn text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Visit Official Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};


