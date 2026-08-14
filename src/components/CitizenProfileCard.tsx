import React, { useState } from 'react';
import { User, Edit3, Check, RefreshCw, Award, Sparkles, UserCheck } from 'lucide-react';
import { CitizenProfile } from '../types';

interface CitizenProfileCardProps {
  profile: CitizenProfile;
  onUpdateProfile: (updated: CitizenProfile) => void;
  onResetProfile?: () => void;
}

export const CitizenProfileCard: React.FC<CitizenProfileCardProps> = ({
  profile,
  onUpdateProfile,
  onResetProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<CitizenProfile>(profile);

  // Calculate profile completion percentage
  const fields: (keyof CitizenProfile)[] = [
    'name', 'state', 'district', 'age', 'gender', 'annualIncome', 'occupation', 'caste'
  ];
  const filledCount = fields.filter(f => profile[f] !== undefined && profile[f] !== '').length;
  const completionPercentage = Math.round((filledCount / fields.length) * 100);

  const handleSave = () => {
    onUpdateProfile(formState);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden space-y-4">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Title Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span>{profile.name || 'Citizen Profile'}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                Verified AI Profile
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile.state || 'India'}, {profile.district || 'Select District'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onResetProfile && (
            <button
              onClick={onResetProfile}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
              title="Reset Profile"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={() => {
              if (isEditing) handleSave();
              else {
                setFormState(profile);
                setIsEditing(true);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isEditing
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Profile Completion Meter */}
      <div className="my-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          <span className="flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Profile Completeness</span>
          </span>
          <span className="text-amber-600 dark:text-amber-400">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Editing Form vs Display Mode */}
      {isEditing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={formState.name || ''}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              placeholder="Enter Full Name"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">State</label>
            <input
              type="text"
              value={formState.state || ''}
              onChange={(e) => setFormState({ ...formState, state: e.target.value })}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              placeholder="e.g. Telangana, UP, Maharashtra"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Age</label>
            <input
              type="number"
              value={formState.age || ''}
              onChange={(e) => setFormState({ ...formState, age: Number(e.target.value) })}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              placeholder="35"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Gender</label>
            <select
              value={formState.gender || 'Male'}
              onChange={(e) => setFormState({ ...formState, gender: e.target.value as any })}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Annual Income (₹)</label>
            <input
              type="number"
              value={formState.annualIncome || ''}
              onChange={(e) => setFormState({ ...formState, annualIncome: Number(e.target.value) })}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              placeholder="150000"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Occupation</label>
            <input
              type="text"
              value={formState.occupation || ''}
              onChange={(e) => {
                const val = e.target.value;
                const occLower = val.toLowerCase();
                const isFarmerNow = occLower.includes('farmer') || occLower.includes('agri') || occLower.includes('cultivat') || occLower.includes('rythu') || occLower.includes('kisan');
                const isStudentNow = occLower.includes('student') || occLower.includes('pupil') || occLower.includes('scholar') || occLower.includes('study') || occLower.includes('studying') || occLower.includes('college') || occLower.includes('school');
                setFormState({
                  ...formState,
                  occupation: val,
                  isFarmer: isFarmerNow,
                  isStudent: isStudentNow
                });
              }}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              placeholder="e.g. Farmer, Student, Small Business, Daily Wager"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Caste Category</label>
            <select
              value={formState.caste || 'General'}
              onChange={(e) => setFormState({ ...formState, caste: e.target.value as any })}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="Minority">Minority</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Landholding (Acres)</label>
            <input
              type="number"
              step="0.5"
              value={formState.landholdingAcres || ''}
              onChange={(e) => setFormState({ ...formState, landholdingAcres: Number(e.target.value) })}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              placeholder="2.0"
            />
          </div>

          {/* Special Status Toggles */}
          <div className="sm:col-span-2 pt-2 flex flex-wrap gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={formState.isFarmer || false}
                onChange={(e) => setFormState({ ...formState, isFarmer: e.target.checked })}
                className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
              />
              <span>Is Farmer</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={formState.isStudent || false}
                onChange={(e) => setFormState({ ...formState, isStudent: e.target.checked })}
                className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
              />
              <span>Is Student</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={formState.isBPL || false}
                onChange={(e) => setFormState({ ...formState, isBPL: e.target.checked })}
                className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
              />
              <span>Has Ration Card / BPL</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={formState.isWidow || false}
                onChange={(e) => setFormState({ ...formState, isWidow: e.target.checked })}
                className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
              />
              <span>Is Widow</span>
            </label>
          </div>
        </div>
      ) : (
        /* Display Grid */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Age & Gender</span>
            <span className="font-bold text-slate-900 dark:text-white">{profile.age ? `${profile.age} yrs` : 'N/A'}, {profile.gender || 'N/A'}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual Income</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {profile.annualIncome ? `₹${profile.annualIncome.toLocaleString('en-IN')}` : 'Not Specified'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Occupation</span>
            <span className="font-bold text-slate-900 dark:text-white">{profile.occupation || 'N/A'}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Caste & Category</span>
            <span className="font-bold text-slate-900 dark:text-white">{profile.caste || 'General'}</span>
          </div>
        </div>
      )}

    </div>
  );
};
