import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Bot, 
  Compass, 
  CheckCircle2, 
  FileText, 
  Bookmark, 
  FileCheck, 
  BarChart3, 
  Settings, 
  Mic, 
  Moon, 
  Sun, 
  Menu, 
  X,
  User,
  Home,
  LayoutDashboard,
  MessageSquare,
  Layers,
  ChevronDown,
  Cloud,
  LogOut,
  LogIn,
  Activity
} from 'lucide-react';
import { CitizenProfile } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { YojanaMitraLogo } from './YojanaMitraLogo';
import { loginWithGoogle, logoutUser, auth } from '../lib/firebase';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenVoiceAssistant: () => void;
  profile: CitizenProfile;
  onOpenOnboarding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  isDarkMode,
  setIsDarkMode,
  onOpenVoiceAssistant,
  profile,
  onOpenOnboarding
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS['en'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Primary navigation tabs shown directly in navbar
  const primaryNavItems = [
    { id: 'landing', label: t.navHome, icon: Home },
    { id: 'services', label: 'All Services', icon: Layers, badge: 'New' },
    { id: 'chat', label: t.navChat, icon: Bot, badge: 'AI' },
    { id: 'schemes', label: t.navSchemes, icon: Compass },
    { id: 'eligibility', label: t.navEligibility, icon: CheckCircle2 },
    { id: 'ocr', label: t.navOcr, icon: FileText },
  ];

  // Secondary navigation items inside 'More' dropdown
  const secondaryNavItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'saved', label: t.navSaved, icon: Bookmark },
    { id: 'reports', label: t.navReports, icon: FileCheck },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'admin', label: t.navAdmin, icon: BarChart3 },
    { id: 'monitoring', label: 'System Monitoring', icon: Activity, badge: 'Live' },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  // All items combined for mobile drawer
  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isMoreActive = secondaryNavItems.some(item => item.id === activePage);

  return (
    <header className="sticky top-0 w-full z-[1000] backdrop-blur-2xl bg-white/75 dark:bg-slate-950/75 border-b border-slate-200/60 dark:border-slate-800/60 transition-all shadow-xs overflow-visible">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 h-16 flex items-center justify-between gap-2 sm:gap-4 overflow-visible">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActivePage('landing')}
          className="flex items-center cursor-pointer group shrink-0 whitespace-nowrap"
        >
          <YojanaMitraLogo size="md" showSubtext={true} />
        </div>

        {/* Desktop Navigation - Responsive, Horizontally Scrollable on smaller viewports, No Overlap */}
        <nav className="hidden lg:flex items-center gap-1.5 flex-1 min-w-0 justify-center mx-2 xl:mx-4 overflow-visible">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth py-1 max-w-full">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#6C5CE7] text-white shadow-md shadow-indigo-500/20 scale-[1.02]'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/25 text-white' : 'bg-gradient-to-r from-[#6C5CE7] to-[#4F9DFF] text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* More Dropdown Menu - Positioned above hero with z-[99999] */}
          <div className="relative shrink-0 overflow-visible z-[99999]" ref={dropdownRef}>
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                isMoreActive
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-[#6C5CE7] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {moreDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-1.5 z-[99999] overflow-hidden animate-fade-in">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActivePage(item.id);
                        setMoreDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-left transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/80 text-[#6C5CE7] dark:text-indigo-300 font-extrabold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Voice Assistant Launcher */}
          <button
            onClick={onOpenVoiceAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#4F9DFF] text-white text-xs font-bold shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95 shrink-0"
            title={t.voiceAssistant}
          >
            <Mic className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            <span className="hidden xl:inline">{t.voiceAssistant}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/60 dark:border-slate-700/60 shrink-0"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#6C5CE7]" />}
          </button>

          {/* Profile Onboarding Trigger */}
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-bold text-[#6C5CE7] dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors shrink-0"
              title="Edit Onboarding Profile"
            >
              <User className="w-3.5 h-3.5" />
              <span className="max-w-[70px] truncate">{profile.name || 'Profile'}</span>
            </button>
          )}

          {/* Cloud Sync & Firebase Auth Pill */}
          {user ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActivePage('eligibility')}
                className="hidden md:flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-xs shrink-0"
                title={`Cloud Synced as ${user.email}`}
              >
                <Cloud className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span className="max-w-[80px] truncate">{user.displayName || profile.name || 'Citizen'}</span>
              </button>
              <button
                onClick={logoutUser}
                className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => loginWithGoogle().catch(err => console.error(err))}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shrink-0"
              title="Sign in with Google to sync cloud data"
            >
              <LogIn className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1 relative z-[1000]">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-[#6C5CE7]/10 text-[#6C5CE7] dark:text-indigo-400 font-extrabold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 text-[#6C5CE7]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

