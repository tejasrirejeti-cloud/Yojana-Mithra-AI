import React from 'react';
import { FileCheck, Download, Sparkles, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { CitizenProfile, Language } from '../types';
import { SCHEMES_DATABASE } from '../data/schemes';
import { evaluateSchemeEligibility } from '../utils/eligibilityEngine';
import { generateCitizenEligibilityPdf } from '../utils/pdfGenerator';
import { TRANSLATIONS } from '../utils/translations';

interface PdfReportPageProps {
  profile: CitizenProfile;
  language: Language;
}

export const PdfReportPage: React.FC<PdfReportPageProps> = ({ profile, language }) => {
  const t = TRANSLATIONS[language];

  const results = SCHEMES_DATABASE.map(scheme => evaluateSchemeEligibility(profile, scheme))
    .sort((a, b) => b.score - a.score);

  const topMatches = results.filter(r => r.score >= 50);

  const handleDownloadPdf = () => {
    generateCitizenEligibilityPdf(profile, results);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-7 h-7 text-[#22C55E]" />
            <span>Official PDF Eligibility Card</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Generate a downloadable report for presenting at MeeSeva / Common Service Centers (CSC).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all"
          >
            <Printer className="w-4 h-4 text-[#6C5CE7]" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl purple-gradient-btn text-white font-extrabold text-xs shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Card</span>
          </button>
        </div>
      </div>

      {/* PDF REPORT PREVIEW SHEET */}
      <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl max-w-4xl mx-auto space-y-6 font-sans">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-[#6C5CE7] to-[#4F9DFF] text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div>
            <div className="text-xs font-bold text-indigo-100 uppercase tracking-widest">
              YOJANA MITRA AI • GOVERNMENT OF INDIA WELFARE ASSISTANT
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              CITIZEN SCHEME ELIGIBILITY CARD
            </h2>
          </div>

          <div className="text-right text-xs text-indigo-100 sm:border-r border-indigo-300/40 pr-4">
            <p className="font-bold">Report ID: YM-{Date.now().toString().slice(-6)}</p>
            <p className="mt-0.5">Date: {new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        {/* Citizen Profile Details */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>Citizen Demographic Verification Summary</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
            <div>
              <span className="font-bold text-slate-400 block text-[10px] uppercase">Name</span>
              <span className="font-bold text-slate-900">{profile.name || 'Citizen'}</span>
            </div>

            <div>
              <span className="font-bold text-slate-400 block text-[10px] uppercase">Age / Gender</span>
              <span className="font-bold text-slate-900">{profile.age ? `${profile.age} yrs` : 'N/A'}, {profile.gender || 'N/A'}</span>
            </div>

            <div>
              <span className="font-bold text-slate-400 block text-[10px] uppercase">State & District</span>
              <span className="font-bold text-slate-900">{profile.state || 'India'}, {profile.district || 'N/A'}</span>
            </div>

            <div>
              <span className="font-bold text-slate-400 block text-[10px] uppercase">Annual Income</span>
              <span className="font-bold text-[#22C55E]">
                {profile.annualIncome ? `₹${profile.annualIncome.toLocaleString('en-IN')}` : 'Not Specified'}
              </span>
            </div>
          </div>
        </div>

        {/* Top Matches Table */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-slate-900 text-base">
            Qualified Schemes ({topMatches.length})
          </h3>

          <div className="space-y-2">
            {topMatches.slice(0, 5).map((res, i) => {
              const s = res.scheme;
              return (
                <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900 text-sm">{i + 1}. {s.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      {res.score}% Match
                    </span>
                  </div>
                  <p className="text-slate-600">{s.benefits}</p>
                  <p className="text-slate-500 font-medium pt-1">
                    Docs: {s.requiredDocuments.join(', ')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification Footnote */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <p>This report is generated by Yojana Mitra AI for citizen guidance.</p>
          <p className="font-bold text-[#6C5CE7]">Verified by Gemini AI Core</p>
        </div>

      </div>

    </div>
  );
};

