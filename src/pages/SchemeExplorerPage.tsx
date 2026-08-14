import React, { useState, useEffect } from 'react';
import { Search, Filter, Compass, Sparkles, Building2, Globe } from 'lucide-react';
import { GovernmentScheme, CitizenProfile, EligibilityResult, Language } from '../types';
import { SCHEMES_DATABASE } from '../data/schemes';
import { fetchSchemes } from '../lib/api';
import { SchemeCard } from '../components/SchemeCard';
import { evaluateSchemeEligibility } from '../utils/eligibilityEngine';
import { TRANSLATIONS } from '../utils/translations';

interface SchemeExplorerPageProps {
  profile: CitizenProfile;
  savedSchemeIds: string[];
  onToggleSaveScheme: (schemeId: string) => void;
  onViewSchemeDetails: (scheme: GovernmentScheme) => void;
  language: Language;
  initialCategory?: string;
}

export const SchemeExplorerPage: React.FC<SchemeExplorerPageProps> = ({
  profile,
  savedSchemeIds,
  onToggleSaveScheme,
  onViewSchemeDetails,
  language,
  initialCategory = 'All'
}) => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>(SCHEMES_DATABASE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [schemeScope, setSchemeScope] = useState<'All' | 'Central' | 'State'>('All');

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

  const categories = [
    'All',
    'Agriculture',
    'Health',
    'Education',
    'Housing',
    'Women & Child',
    'Energy',
    'Employment',
    'Senior Citizens',
    'Pension & Social',
    'Financial & Business'
  ];

  // Evaluate eligibility scores for all schemes
  const resultsMap = new Map<string, EligibilityResult>();
  schemes.forEach(s => {
    resultsMap.set(s.id, evaluateSchemeEligibility(profile, s));
  });

  const filteredSchemes = schemes.filter(scheme => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter with alias matching
    let matchesCategory = selectedCategory === 'All';
    if (!matchesCategory) {
      if (selectedCategory === 'Health' || selectedCategory === 'Healthcare') {
        matchesCategory = scheme.category === 'Health' || scheme.category === 'Healthcare';
      } else if (selectedCategory === 'Employment' || selectedCategory === 'Employment & Skill') {
        matchesCategory = scheme.category === 'Employment' || scheme.category === 'Employment & Skill';
      } else if (selectedCategory === 'Senior Citizens' || selectedCategory === 'Pension & Social') {
        matchesCategory = scheme.category === 'Senior Citizens' || scheme.category === 'Pension & Social';
      } else {
        matchesCategory = scheme.category === selectedCategory;
      }
    }

    // Scope filter
    const matchesScope = schemeScope === 'All' || 
      (schemeScope === 'Central' && scheme.isCentral) ||
      (schemeScope === 'State' && !scheme.isCentral);

    return matchesSearch && matchesCategory && matchesScope;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-7 h-7 text-[#6C5CE7]" />
            <span>Government Scheme Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Browse 25+ Central and State welfare schemes with real-time AI eligibility matching.
          </p>
        </div>

        {/* Scope Filter Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 self-start md:self-auto text-xs font-bold">
          <button
            onClick={() => setSchemeScope('All')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              schemeScope === 'All'
                ? 'bg-[#6C5CE7] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            All Schemes
          </button>
          <button
            onClick={() => setSchemeScope('Central')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              schemeScope === 'Central'
                ? 'bg-[#6C5CE7] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Central Only
          </button>
          <button
            onClick={() => setSchemeScope('State')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              schemeScope === 'State'
                ? 'bg-[#6C5CE7] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            State Only
          </button>
        </div>
      </div>

      {/* SEARCH BAR & CATEGORY PILLS */}
      <div className="space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'purple-gradient-btn text-white shadow-md'
                  : 'glass-card border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#6C5CE7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* SCHEMES GRID */}
      {filteredSchemes.length === 0 ? (
        <div className="p-12 text-center glass-card border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-3">
          <Compass className="w-12 h-12 text-[#6C5CE7] mx-auto opacity-50" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">No Schemes Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or switching categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              eligibilityResult={resultsMap.get(scheme.id)}
              isSaved={savedSchemeIds.includes(scheme.id)}
              onToggleSave={onToggleSaveScheme}
              onViewDetails={onViewSchemeDetails}
            />
          ))}
        </div>
      )}

    </div>
  );
};

