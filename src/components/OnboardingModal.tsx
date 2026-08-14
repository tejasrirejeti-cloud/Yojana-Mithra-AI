import React, { useState } from 'react';
import { CitizenProfile, Language, CasteCategory, EducationLevel } from '../types';
import { UserCheck, Sparkles, X, Check, Globe } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CitizenProfile;
  onSaveProfile: (profile: CitizenProfile, lang: Language) => void;
  currentLanguage: Language;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  currentLanguage
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(profile.name || '');
  const [age, setAge] = useState<number | string>(profile.age || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(
    profile.gender === 'Female' ? 'Female' : profile.gender === 'Other' ? 'Other' : 'Male'
  );
  const [state, setState] = useState(profile.state || '');
  const [district, setDistrict] = useState(profile.district || '');
  const [occupation, setOccupation] = useState(profile.occupation || '');
  const [annualIncome, setAnnualIncome] = useState<number | string>(profile.annualIncome ?? '');
  const [landholdingAcres, setLandholdingAcres] = useState<number | string>(profile.landholdingAcres ?? '');
  const [education, setEducation] = useState<EducationLevel>(profile.education || '10th Pass');
  const [category, setCategory] = useState<CasteCategory>(profile.caste || 'General');
  const [hasDisability, setHasDisability] = useState<boolean>(Boolean(profile.hasDisability));
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentLanguage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const occLower = (occupation || '').toLowerCase();
    const isFarmerNow = occLower.includes('farmer') || occLower.includes('agri') || occLower.includes('cultivat') || occLower.includes('rythu') || occLower.includes('kisan');
    const isStudentNow = occLower.includes('student') || occLower.includes('pupil') || occLower.includes('scholar') || occLower.includes('study') || occLower.includes('studying') || occLower.includes('college') || occLower.includes('school');

    const updatedProfile: CitizenProfile = {
      ...profile,
      name,
      age: age ? Number(age) : undefined,
      gender,
      state,
      district,
      occupation,
      annualIncome: annualIncome ? Number(annualIncome) : undefined,
      landholdingAcres: landholdingAcres ? Number(landholdingAcres) : 0,
      education,
      caste: category,
      hasDisability,
      isFarmer: isFarmerNow,
      isStudent: isStudentNow,
      isBPL: annualIncome ? Number(annualIncome) <= 150000 : false
    };

    onSaveProfile(updatedProfile, selectedLanguage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#6C5CE7]/10 text-[#6C5CE7] flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6 text-[#6C5CE7]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Citizen Onboarding Profile</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-[#6C5CE7] dark:bg-indigo-950 dark:text-indigo-300">
                Live Engine
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provide your details to calculate 100% accurate scheme eligibility & recommendations
            </p>
          </div>
        </div>

        {/* Form Grid */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Name */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">1. Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6C5CE7] outline-none"
                placeholder="Enter your full name"
              />
            </div>

            {/* 2. Age */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">2. Age (Years) *</label>
              <input
                type="number"
                required
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6C5CE7] outline-none"
              />
            </div>

            {/* 3. Gender */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">3. Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6C5CE7] outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* 4. State */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">4. State *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6C5CE7] outline-none"
                placeholder="e.g. Telangana, Andhra Pradesh, UP"
              />
            </div>

            {/* 5. District */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">5. District *</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6C5CE7] outline-none"
                placeholder="e.g. Hyderabad, Warangal, Rangareddy"
              />
            </div>

            {/* 6. Occupation */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">6. Primary Occupation *</label>
              <input
                type="text"
                required
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6C5CE7] outline-none"
                placeholder="e.g. Farmer, Student, Small Business, Daily Wager"
              />
            </div>

            {/* 7. Annual Income */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">7. Annual Household Income (₹) *</label>
              <input
                type="number"
                required
                min="0"
                step="5000"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6C5CE7] outline-none"
              />
            </div>

            {/* 8. Landholding */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">8. Landholding (Acres)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={landholdingAcres}
                onChange={(e) => setLandholdingAcres(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6C5CE7] outline-none"
                placeholder="0 if landless"
              />
            </div>

            {/* 9. Education */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">9. Highest Education Level</label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value as EducationLevel)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6C5CE7] outline-none"
              >
                <option value="Illiterate">Illiterate</option>
                <option value="Below 10th">Below 10th</option>
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
                <option value="Graduate">Graduate</option>
                <option value="Post Graduate">Post Graduate</option>
              </select>
            </div>

            {/* 10. Category (Caste) */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">10. Social Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CasteCategory)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6C5CE7] outline-none"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="Minority">Minority</option>
              </select>
            </div>

            {/* 11. Disability */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">11. Person with Disability (PwD)</label>
              <select
                value={hasDisability ? 'Yes' : 'No'}
                onChange={(e) => setHasDisability(e.target.value === 'Yes')}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6C5CE7] outline-none"
              >
                <option value="No">No (Able-bodied)</option>
                <option value="Yes">Yes (Person with Disability)</option>
              </select>
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#6C5CE7] to-[#4F9DFF] text-white font-extrabold shadow-md hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save & Calculate Eligibility</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
