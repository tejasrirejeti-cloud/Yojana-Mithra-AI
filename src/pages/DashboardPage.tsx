import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Compass, 
  FileText, 
  Bookmark, 
  Award, 
  Sparkles, 
  Bell, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  FileCheck,
  UserCheck,
  ShieldCheck,
  Zap,
  Layers
} from 'lucide-react';
import { Language, CitizenProfile, GovernmentScheme, EligibilityResult } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { SCHEMES_DATABASE } from '../data/schemes';
import { evaluateSchemeEligibility } from '../utils/eligibilityEngine';

interface DashboardPageProps {
  setActivePage: (page: string) => void;
  language: Language;
  profile: CitizenProfile;
  onUpdateProfile?: (updated: CitizenProfile) => void;
  savedSchemeIds: string[];
  onViewSchemeDetails: (scheme: GovernmentScheme) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setActivePage,
  language,
  profile,
  onUpdateProfile,
  savedSchemeIds,
  onViewSchemeDetails
}) => {
  const t = TRANSLATIONS[language];

  // Evaluate top eligible schemes
  const eligibilityResults: EligibilityResult[] = SCHEMES_DATABASE.map(scheme => 
    evaluateSchemeEligibility(profile, scheme)
  ).sort((a, b) => b.score - a.score);

  const topEligible = eligibilityResults.filter(r => r.score >= 60).slice(0, 4);

  // Filter saved schemes
  const savedSchemes = SCHEMES_DATABASE.filter(s => savedSchemeIds.includes(s.id));

  // Profile completion meter
  const fields: (keyof CitizenProfile)[] = [
    'name', 'state', 'district', 'age', 'gender', 'annualIncome', 'occupation', 'caste'
  ];
  const filledCount = fields.filter(f => profile[f] !== undefined && profile[f] !== '').length;
  const completionPercentage = Math.round((filledCount / fields.length) * 100);

  // Total potential annual benefit estimation
  const totalBenefitEst = topEligible.reduce((acc, curr) => acc + (curr.scheme.maxBenefitValueINR || 5000), 0);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#6C5CE7] via-indigo-600 to-[#4F9DFF] text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md text-xs font-bold mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Citizen Welfare Intelligence Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile.name || 'Citizen'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1 font-medium">
              State: {profile.state || 'Telangana'} | Occupation: {profile.occupation || 'Farmer'} | Income: {profile.annualIncome ? `₹${profile.annualIncome.toLocaleString('en-IN')}` : 'Not Specified'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActivePage('chat')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-[#6C5CE7] font-extrabold text-xs shadow-lg hover:bg-slate-50 transition-all"
            >
              <Bot className="w-4 h-4 text-[#6C5CE7]" />
              <span>Ask AI Assistant</span>
            </button>

            <button
              onClick={() => setActivePage('eligibility')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-bold text-xs backdrop-blur-md transition-all border border-white/20"
            >
              <UserCheck className="w-4 h-4" />
              <span>Update Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK STATS & GAUGES CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Profile Completion Meter */}
        <div className="glass-card p-5 rounded-3xl shadow-sm border border-indigo-100 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Profile Status</span>
              <Award className="w-4 h-4 text-[#6C5CE7]" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{completionPercentage}%</span>
              <span className="text-xs font-semibold text-emerald-600">Almost there!</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-[#6C5CE7] to-[#4F9DFF] h-full rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
            </div>
          </div>
          <button 
            onClick={() => setActivePage('eligibility')}
            className="mt-3 text-[11px] font-bold text-[#6C5CE7] hover:underline flex items-center gap-1"
          >
            <span>Complete Profile</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Eligible Schemes Card */}
        <div className="glass-card p-5 rounded-3xl shadow-sm border border-emerald-100 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Eligible Schemes</span>
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            </div>
            <div className="text-2xl font-black text-[#22C55E] mt-2">
              {topEligible.length} Available
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">High probability matches</p>
          </div>
          <button 
            onClick={() => setActivePage('eligibility')}
            className="mt-3 text-[11px] font-bold text-[#22C55E] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Potential Benefits Card */}
        <div className="glass-card p-5 rounded-3xl shadow-sm border border-sky-100 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Potential Benefits</span>
              <Zap className="w-4 h-4 text-[#4F9DFF]" />
            </div>
            <div className="text-2xl font-black text-[#4F9DFF] mt-2">
              ₹{totalBenefitEst.toLocaleString('en-IN')}+
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">Total annual value</p>
          </div>
          <button 
            onClick={() => setActivePage('reports')}
            className="mt-3 text-[11px] font-bold text-[#4F9DFF] hover:underline flex items-center gap-1"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Saved Applications Card */}
        <div className="glass-card p-5 rounded-3xl shadow-sm border border-purple-100 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Saved Schemes</span>
              <Bookmark className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
              {savedSchemes.length} Bookmarks
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">Ready for application</p>
          </div>
          <button 
            onClick={() => setActivePage('saved')}
            className="mt-3 text-[11px] font-bold text-amber-600 hover:underline flex items-center gap-1"
          >
            <span>Track Now</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* TOP ELIGIBLE SCHEMES FOR THIS CITIZEN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#6C5CE7]" />
            <span>Top Recommended Schemes For You</span>
          </h2>
          <button
            onClick={() => setActivePage('eligibility')}
            className="text-xs font-bold text-[#6C5CE7] hover:underline flex items-center gap-1"
          >
            <span>Full Eligibility Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topEligible.map((res) => {
            const s = res.scheme;
            return (
              <div 
                key={s.id}
                onClick={() => onViewSchemeDetails(s)}
                className="glass-card rounded-3xl p-5 shadow-sm hover:border-[#6C5CE7] transition-all cursor-pointer flex flex-col justify-between border border-indigo-100/70 dark:border-slate-800"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C5CE7] bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                      {s.category}
                    </span>
                    <span className="text-xs font-extrabold text-[#22C55E] bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {res.score}% Match
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {s.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {res.explanation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#22C55E]">
                    Max Value: ₹{s.maxBenefitValueINR ? s.maxBenefitValueINR.toLocaleString('en-IN') : 'Varies'}
                  </span>
                  <span className="text-[#6C5CE7] font-bold flex items-center gap-1">
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GOVERNMENT ALERTS & QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Alerts Box */}
        <div className="md:col-span-2 glass-card rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <span>Latest Government Notifications & Deadlines</span>
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-amber-800 dark:text-amber-300">
                <span>PM-KISAN 17th Installment KYC Update</span>
                <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">Active</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                Mandatory Aadhaar e-KYC deadline extended. Complete e-KYC at nearest CSC center to ensure continuous credit of ₹2,000.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                <span>Ayushman Bharat Senior Citizen 70+ Expansion</span>
                <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">New</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                All senior citizens aged 70 and above now qualify for ₹5 Lakh health insurance regardless of income status.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="glass-card rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#6C5CE7]" />
            <span>Quick Actions</span>
          </h3>

          <button
            onClick={() => setActivePage('ocr')}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-[#6C5CE7] transition-all text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50"
          >
            <FileText className="w-4 h-4 text-[#6C5CE7]" />
            <span>Scan Aadhaar / Income Cert</span>
          </button>

          <button
            onClick={() => setActivePage('services')}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-[#4F9DFF] transition-all text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50"
          >
            <Compass className="w-4 h-4 text-[#4F9DFF]" />
            <span>Explore All Welfare Services</span>
          </button>

          <button
            onClick={() => setActivePage('reports')}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-[#22C55E] transition-all text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50"
          >
            <FileCheck className="w-4 h-4 text-[#22C55E]" />
            <span>Generate PDF Eligibility Card</span>
          </button>
        </div>

      </div>

    </div>
  );
};

