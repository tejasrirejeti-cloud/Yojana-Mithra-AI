import React from 'react';
import { 
  Sparkles, 
  Bot, 
  Compass, 
  FileText, 
  Mic, 
  CheckCircle2, 
  ArrowRight,
  Award,
  Users,
  Building2,
  TrendingUp,
  Globe,
  Send,
  ShieldCheck,
  FileCheck,
  Layers,
  LogIn,
  Loader2
} from 'lucide-react';
import { Language, CitizenProfile } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { SCHEMES_DATABASE } from '../data/schemes';
import { SchemeCategoriesSection } from '../components/SchemeCategoriesSection';
import { SchemeCard, getCategoryBadgeStyle } from '../components/SchemeCard';

interface LandingPageProps {
  setActivePage: (page: string) => void;
  language: Language;
  profile: CitizenProfile;
  onOpenVoiceAssistant: () => void;
  onGoogleSignIn: () => Promise<void>;
  isGoogleSigningIn?: boolean;
  authError?: string;
  onSelectCategory?: (category: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setActivePage,
  language,
  profile,
  onOpenVoiceAssistant,
  onGoogleSignIn,
  isGoogleSigningIn = false,
  authError = '',
  onSelectCategory
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-16 pb-12">
      
      {/* HERO SECTION WITH PHONE PREVIEW MOCKUP */}
      <section className="relative overflow-hidden pt-6 pb-12 md:pt-12 md:pb-16">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Discover Government Schemes with <span className="purple-gradient-text">Yojana Mitra AI</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Your intelligent companion to check scheme eligibility, parse official documents, and receive personalized welfare assistance.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>AI Powered Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>Instant Document OCR</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>Voice Enabled Interaction</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>Document Scanner (OCR)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>Nearby Centers Locator</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>Downloadable Reports</span>
              </div>
            </div>

            {/* Google Sign-In / Create Profile */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => void onGoogleSignIn()}
                disabled={isGoogleSigningIn}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-extrabold text-sm hover:border-[#6C5CE7] hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGoogleSigningIn ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm font-black">G</span>
                )}
                <span>{isGoogleSigningIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
                {!isGoogleSigningIn && <LogIn className="w-4 h-4 text-[#6C5CE7]" />}
              </button>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                New users will automatically get a Yojana Mitra citizen profile form with their Google name pre-filled.
              </p>
              {authError && (
                <div className="max-w-xl rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-900/50 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300">
                  {authError}
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActivePage('chat')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl purple-gradient-btn text-white font-extrabold text-sm transition-all shadow-md"
              >
                <Bot className="w-5 h-5" />
                <span>Get Started (AI Chat)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setActivePage('services')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-md"
              >
                <Layers className="w-5 h-5" />
                <span>All Services Portal</span>
              </button>

              <button
                onClick={() => setActivePage('schemes')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-extrabold text-sm hover:border-[#6C5CE7] transition-all shadow-xs"
              >
                <Compass className="w-5 h-5 text-[#6C5CE7]" />
                <span>Explore Schemes</span>
              </button>
            </div>

          </div>

          {/* Right Phone Mockup Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-[32px] p-4 bg-slate-900 border-4 border-slate-800 shadow-2xl shadow-indigo-500/20 text-white relative">
              
              {/* Phone Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#4F9DFF] flex items-center justify-center text-white text-xs font-bold">
                    YM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Yojana Mitra AI</h4>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700">
                  Telugu / Eng
                </span>
              </div>

              {/* Mock Messages */}
              <div className="py-4 space-y-3 text-xs">
                
                {/* AI greeting */}
                <div className="bg-slate-800/80 p-3 rounded-2xl rounded-tl-none border border-slate-700/60 text-slate-200 space-y-1">
                  <p className="font-semibold text-indigo-300">Namaste Citizen! 🙏</p>
                  <p>How can I help you find government schemes today?</p>
                </div>

                {/* User Message */}
                <div className="bg-[#6C5CE7] text-white p-3 rounded-2xl rounded-tr-none ml-auto max-w-[85%] font-medium shadow-md">
                  I am a farmer from Telangana with 2 acres of land.
                </div>

                {/* AI Response Card */}
                <div className="bg-slate-800/80 p-3 rounded-2xl rounded-tl-none border border-slate-700/60 text-slate-200 space-y-2">
                  <p className="text-[11px] font-semibold text-emerald-400">Great! You match 2 high-priority schemes:</p>
                  
                  <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-700/80 text-[11px] flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">PM-KISAN Samman Nidhi</div>
                      <div className="text-slate-400 text-[10px]">₹6,000 / year income support</div>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded">98% Match</span>
                  </div>

                  <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-700/80 text-[11px] flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">Telangana Rythu Bandhu</div>
                      <div className="text-slate-400 text-[10px]">₹10,000 / acre per year</div>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded">95% Match</span>
                  </div>
                </div>

              </div>

              {/* Input Bar Mock */}
              <div className="pt-2">
                <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-2xl border border-slate-700">
                  <Mic className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-400 text-xs flex-1">Type or speak query...</span>
                  <div className="w-7 h-7 rounded-xl bg-[#6C5CE7] text-white flex items-center justify-center">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* STATS IMPACT TICKER */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 glass-card rounded-3xl shadow-sm text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#6C5CE7] flex items-center justify-center gap-1">
              <Users className="w-5 h-5 text-[#6C5CE7]" />
              <span>10K+</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Citizens Assisted</p>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#4F9DFF] flex items-center justify-center gap-1">
              <Building2 className="w-5 h-5 text-[#4F9DFF]" />
              <span>24+</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Schemes Covered</p>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#22C55E] flex items-center justify-center gap-1">
              <TrendingUp className="w-5 h-5 text-[#22C55E]" />
              <span>98%</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Satisfaction Rate</p>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-500 flex items-center justify-center gap-1">
              <Award className="w-5 h-5 text-amber-500" />
              <span>₹12 Cr+</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Benefits Identified</p>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Comprehensive AI Governance Suite
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
            From discovering eligibility to generating official PDF checklists and accessing welfare portals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div 
            onClick={() => setActivePage('chat')}
            className="group glass-card bg-white dark:bg-slate-900/95 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-[#6C5CE7] dark:hover:border-[#6C5CE7] transition-all cursor-pointer hover:-translate-y-1 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-[#6C5CE7] dark:text-indigo-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-50 text-lg mb-2 group-hover:text-[#6C5CE7] dark:group-hover:text-[#4F9DFF] transition-colors">
              Conversational AI Engine
            </h3>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
              Talk naturally with RAG intelligence. Our AI automatically extracts profile details like land, income, caste, and state to evaluate scheme eligibility.
            </p>
          </div>

          <div 
            onClick={() => setActivePage('ocr')}
            className="group glass-card bg-white dark:bg-slate-900/95 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-[#22C55E] dark:hover:border-[#22C55E] transition-all cursor-pointer hover:-translate-y-1 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-50 text-lg mb-2 group-hover:text-[#22C55E] dark:group-hover:text-emerald-400 transition-colors">
              Smart Document OCR
            </h3>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
              Upload photos of Aadhaar Card, Income Certificate, or Ration Card. AI parses key data fields instantly and updates your citizen profile.
            </p>
          </div>

          <div 
            onClick={() => setActivePage('eligibility')}
            className="group glass-card bg-white dark:bg-slate-900/95 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-[#4F9DFF] dark:hover:border-[#4F9DFF] transition-all cursor-pointer hover:-translate-y-1 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-50 text-lg mb-2 group-hover:text-[#4F9DFF] dark:group-hover:text-sky-300 transition-colors">
              Eligibility Engine
            </h3>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
              Multi-criteria matching engine evaluates land limits, income caps, student/farmer status, and state policies with 100% transparent reasoning.
            </p>
          </div>

        </div>
      </section>

      {/* SCHEME CATEGORIES SECTOR BROWSER (Match Figma Design) */}
      <section className="max-w-6xl mx-auto px-4">
        <SchemeCategoriesSection 
          onSelectCategory={(category) => {
            if (onSelectCategory) {
              onSelectCategory(category);
            } else {
              setActivePage('schemes');
            }
          }}
          onViewAll={() => setActivePage('schemes')}
        />
      </section>

      {/* POPULAR SCHEMES PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#E8640A] dark:text-amber-400 block mb-1">
              TOP BENEFIT PROGRAMMES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Government Welfare Schemes
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Direct Benefit Transfer (DBT), Healthcare, Housing, Agriculture & Loans
            </p>
          </div>
          <button
            onClick={() => setActivePage('schemes')}
            className="text-xs sm:text-sm font-extrabold text-[#6C5CE7] hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-white flex items-center gap-1.5 transition-colors group"
          >
            <span>View All 24+</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCHEMES_DATABASE.slice(0, 6).map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              onViewDetails={() => setActivePage('schemes')}
            />
          ))}
        </div>
      </section>

    </div>
  );
};

