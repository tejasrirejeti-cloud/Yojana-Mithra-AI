import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  UserCheck
} from 'lucide-react';
import { CitizenProfile, GovernmentScheme, EligibilityResult, Language } from '../types';
import { CitizenProfileCard } from '../components/CitizenProfileCard';
import { SCHEMES_DATABASE } from '../data/schemes';
import { fetchSchemes } from '../lib/api';
import { evaluateSchemeEligibility } from '../utils/eligibilityEngine';
import { generateCitizenEligibilityPdf } from '../utils/pdfGenerator';
import { TRANSLATIONS } from '../utils/translations';

interface EligibilityResultsPageProps {
  profile: CitizenProfile;
  onUpdateProfile: (updated: CitizenProfile) => void;
  onViewSchemeDetails: (scheme: GovernmentScheme) => void;
  language: Language;
}

export const EligibilityResultsPage: React.FC<EligibilityResultsPageProps> = ({
  profile,
  onUpdateProfile,
  onViewSchemeDetails,
  language
}) => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>(SCHEMES_DATABASE);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    let isMounted = true;
    fetchSchemes({ profile }).then(data => {
      if (isMounted && data.length > 0) {
        setSchemes(data);
      }
    });
    return () => { isMounted = false; };
  }, [profile]);

  const t = TRANSLATIONS[language];

  const results = schemes.map(scheme => evaluateSchemeEligibility(profile, scheme))
    .sort((a, b) => b.score - a.score);

  const filteredResults = results.filter(r => {
    if (filterStatus === 'All') return true;
    return r.status === filterStatus;
  });

  const handleDownloadPdf = () => {
    generateCitizenEligibilityPdf(profile, results);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-7 h-7 text-[#22C55E]" />
            <span>AI Scheme Eligibility Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Real-time deterministic & AI reasoning engine calculating your exact eligibility match scores across all schemes.
          </p>
        </div>

        <button
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl purple-gradient-btn text-white font-extrabold text-xs shadow-lg transition-all self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Eligibility Card</span>
        </button>
      </div>

      {/* Citizen Profile Card */}
      <CitizenProfileCard
        profile={profile}
        onUpdateProfile={onUpdateProfile}
      />

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {['All', 'Highly Eligible', 'Moderately Eligible', 'Requires Documents', 'Ineligible'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                filterStatus === status
                  ? 'bg-[#6C5CE7] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
          Showing {filteredResults.length} Schemes
        </span>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.map((res) => {
          const s = res.scheme;
          const isExpanded = expandedId === s.id;

          let badgeColor = 'bg-slate-100 text-slate-700';
          if (res.score >= 80) badgeColor = 'bg-[#22C55E]/10 text-[#22C55E] dark:bg-[#22C55E]/20 border border-[#22C55E]/30';
          else if (res.score >= 60) badgeColor = 'bg-[#6C5CE7]/10 text-[#6C5CE7] dark:bg-[#6C5CE7]/20 border border-[#6C5CE7]/30';
          else if (res.score >= 35) badgeColor = 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/30';
          else badgeColor = 'bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/30';

          return (
            <div
              key={s.id}
              className="glass-card border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeColor}`}>
                      {res.score}% Match • {res.status}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {s.category}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {s.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {s.ministry}
                  </p>
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Reason Explanation Box */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                <span className="font-bold text-[#6C5CE7] dark:text-indigo-300 block mb-1">AI Reasoning Breakdown:</span>
                {res.explanation}
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in text-xs">
                  
                  {/* Matched vs Missing Criteria */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                      <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Matched Criteria ({res.matchedCriteria.length})</span>
                      </div>
                      <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300">
                        {res.matchedCriteria.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                      <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                        <span>Gaps / Missing Details ({res.missingCriteria.length})</span>
                      </div>
                      <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300">
                        {res.missingCriteria.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommended Action Steps */}
                  <div className="space-y-2">
                    <div className="font-bold text-slate-900 dark:text-white">Recommended Next Steps:</div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      {res.recommendedNextSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <button
                    onClick={() => onViewSchemeDetails(s)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl purple-gradient-btn text-white font-bold text-xs transition-all shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Required Documents & Official Link</span>
                  </button>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};

