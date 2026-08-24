import React from 'react';
import { Settings as SettingsIcon, Moon, Sun, Trash2, Key, RefreshCw } from 'lucide-react';

interface SettingsPageProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onResetProfile: () => void;
  onClearSavedSchemes: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isDarkMode,
  setIsDarkMode,
  onResetProfile,
  onClearSavedSchemes
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-[#6C5CE7]" />
          <span>System & Preferences Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Customize dark mode theme, citizen data preferences, and API configuration.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Theme Preference */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Sun className="w-5 h-5 text-[#6C5CE7]" />
            <span>Theme & Display Settings</span>
          </h3>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Dark Mode
              </label>
              <span className="text-slate-400 text-[11px] font-medium">Toggle high-contrast eye-safe dark theme</span>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-300 font-bold hover:bg-indigo-100 transition-all"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[#6C5CE7]" />}
            </button>
          </div>
        </div>

        {/* Data & Reset Controls */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-500" />
            <span>Citizen Profile & Saved Data Management</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <button
              onClick={onResetProfile}
              className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 font-bold hover:bg-rose-500/20 transition-all text-left space-y-1"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Reset Extracted Profile</span>
              </div>
              <p className="text-[11px] font-medium text-rose-600/80 dark:text-rose-300/80">
                Clear extracted income, state, and occupation profile values.
              </p>
            </button>

            <button
              onClick={onClearSavedSchemes}
              className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold hover:bg-amber-500/20 transition-all text-left space-y-1"
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span>Clear Bookmarked Schemes</span>
              </div>
              <p className="text-[11px] font-medium text-amber-600/80 dark:text-amber-300/80">
                Remove all saved schemes and notes from your session.
              </p>
            </button>
          </div>
        </div>

        {/* OpenAI Endpoint Status */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Key className="w-5 h-5 text-[#6C5CE7]" />
              <span>OpenAI API Endpoint Bridge (/chat/completions)</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E] dark:bg-[#22C55E]/20 text-[10px] font-extrabold">
              Active
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            This instance exposes an OpenAI-compatible endpoint at <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-[11px] text-[#6C5CE7]">POST /chat/completions</code> backed by Gemini Flash models.
          </p>
        </div>

      </div>

    </div>
  );
};

