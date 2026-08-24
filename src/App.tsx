import React, { useState, useEffect } from 'react';
import { CitizenProfile, EMPTY_CITIZEN_PROFILE, Language, GovernmentScheme, ChatMessage } from './types';
import { Navbar } from './components/Navbar';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { BackgroundAnimationCanvas } from './components/BackgroundAnimationCanvas';
import { auth, loginWithGoogle, resolveGoogleRedirect } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  saveUserProfileToFirestore, 
  getUserProfileFromFirestore, 
  saveSchemeForUserInFirestore, 
  removeSavedSchemeForUserInFirestore, 
  getSavedSchemesFromFirestore, 
  saveChatMessageToFirestore, 
  getChatHistoryFromFirestore 
} from './lib/firestoreService';
import { SCHEMES_DATABASE } from './data/schemes';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { SchemeExplorerPage } from './pages/SchemeExplorerPage';
import { EligibilityResultsPage } from './pages/EligibilityResultsPage';
import { DocumentOCRPage } from './pages/DocumentOCRPage';
import { ServicesPortalPage } from './pages/ServicesPortalPage';
import { SavedSchemesPage } from './pages/SavedSchemesPage';
import { PdfReportPage } from './pages/PdfReportPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { MonitoringDashboardPage } from './pages/MonitoringDashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { OnboardingModal } from './components/OnboardingModal';
import { monitoring } from './lib/monitoring';

export default function App() {
  const [activePage, setActivePage] = useState<string>('landing');
  const [language, setLanguage] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState<GovernmentScheme | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string>('');

  // Saved scheme IDs
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(['pm-kisan', 'ayushman-bharat']);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Citizen Profile state - load from localStorage or default to new user profile
  const [profile, setProfile] = useState<CitizenProfile>(() => {
    const saved = localStorage.getItem('yojana_citizen_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Citizen User',
      state: 'Telangana',
      district: 'Hyderabad',
      age: 32,
      gender: 'Male',
      annualIncome: 120000,
      occupation: 'Farmer',
      education: '10th Pass',
      isFarmer: true,
      landholdingAcres: 1.5,
      caste: 'OBC',
      isBPL: true,
      hasDisability: false,
      hasAadhaar: true,
      hasBankAccount: true,
      hasRationCard: true
    };
  });

  // Chat message history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: 'Namaste! I am Yojana Mitra AI, your personal government scheme assistant. Tell me about yourself or ask any question about Central and State welfare programs (e.g. PM-KISAN, Ayushman Bharat, Rythu Bandhu). How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: 'en'
    }
  ]);

  // Initialize Production Monitoring SDK & Track Page Navigation
  useEffect(() => {
    monitoring.init();
  }, []);

  useEffect(() => {
    monitoring.trackPageView(activePage, `/${activePage}`);
  }, [activePage]);

  // Firebase Auth & Firestore Sync
  useEffect(() => {
    let mounted = true;

    const syncUser = async (user: FirebaseUser) => {
      try {
        const dbProfile = await getUserProfileFromFirestore(user.uid);
        if (!mounted) return;

        if (dbProfile) {
          const normalized = { ...profile, ...dbProfile };
          setProfile(normalized);

          const complete = Boolean(
            normalized.name &&
            normalized.state &&
            normalized.district &&
            normalized.age !== undefined &&
            normalized.gender &&
            normalized.occupation
          );

          if (!complete) {
            setIsOnboardingOpen(true);
          }
        } else {
          // First Google login: use only information Google actually provides.
          // The onboarding form then collects the welfare-specific details.
          const googleProfile: CitizenProfile = {
            ...EMPTY_CITIZEN_PROFILE,
            name: user.displayName || '',
          };

          setProfile(googleProfile);
          setIsOnboardingOpen(true);
          await saveUserProfileToFirestore(user.uid, googleProfile, user.email || undefined);
        }

        const dbSaved = await getSavedSchemesFromFirestore(user.uid);
        if (mounted) {
          setSavedSchemeIds(dbSaved.map((saved) => saved.schemeId));
        }

        const dbHistory = await getChatHistoryFromFirestore(user.uid);
        if (mounted && dbHistory.length > 0) {
          setMessages(dbHistory.map((m, idx) => ({
            id: `fs-msg-${idx}`,
            sender: m.sender === 'user' ? 'user' : 'ai',
            text: m.content,
            timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            language: 'en'
          })));
        }
      } catch (error) {
        console.error('Firebase profile synchronization failed:', error);
        if (mounted) {
          setAuthError('Google sign-in succeeded, but your cloud profile could not be loaded. Please check Firestore rules.');
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted) return;
      setCurrentUser(user);
      setAuthError('');

      if (!user) {
        setSavedSchemeIds([]);
        return;
      }

      await syncUser(user);
    });

    // Resolve a redirect-based Google login when popup fallback was used.
    void resolveGoogleRedirect().catch((error) => {
      if (mounted) {
        setAuthError(error instanceof Error ? error.message : 'Google sign-in failed.');
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    if (isGoogleSigningIn) return;
    setIsGoogleSigningIn(true);
    setAuthError('');

    try {
      const user = await loginWithGoogle();
      if (user) {
        setActivePage('dashboard');
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      const code = error?.code || '';
      let message = 'Google sign-in failed. Please try again.';

      if (code === 'auth/unauthorized-domain') {
        message = 'This domain is not authorized in Firebase Authentication. Add localhost and your deployed domain under Firebase → Authentication → Settings → Authorized domains.';
      } else if (code === 'auth/operation-not-allowed') {
        message = 'Google Sign-In is disabled in Firebase. Enable the Google provider under Firebase → Authentication → Sign-in method.';
      } else if (code === 'auth/invalid-api-key') {
        message = 'Firebase API configuration is invalid. Check firebase-applet-config.json.';
      } else if (error instanceof Error && error.message) {
        message = error.message;
      }

      setAuthError(message);
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  // Sync profile changes to localStorage & Firestore when profile updates
  useEffect(() => {
    localStorage.setItem('yojana_citizen_profile', JSON.stringify(profile));
    if (currentUser) {
      const profileComplete = Boolean(
        profile.name && profile.state && profile.district &&
        profile.age !== undefined && profile.gender && profile.occupation
      );
      if (profileComplete) {
        void saveUserProfileToFirestore(currentUser.uid, profile, currentUser.email || undefined);
      }
    }
  }, [profile, currentUser]);

  // Dark mode class toggle on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const [conversationSummary, setConversationSummary] = useState<string>('');

  // Handle Send Chat Message
  const handleSendMessage = async (userText: string): Promise<string> => {
    if (!userText.trim()) return '';

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoadingChat(true);

    if (currentUser) {
      saveChatMessageToFirestore(currentUser.uid, 'user', userText);
    }

    try {
      const historyPayload = messages.map(m => ({
        sender: m.sender === 'user' ? 'user' : 'assistant',
        text: m.text,
        timestamp: m.timestamp
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          profile,
          language,
          history: historyPayload,
          conversationSummary
        })
      });

      const data = await res.json();

      if (data.extractedProfile) {
        setProfile((prev) => ({ ...prev, ...data.extractedProfile }));
      }

      if (data.conversationSummary) {
        setConversationSummary(data.conversationSummary);
      }

      const aiText = data.replyText || 'I have processed your scheme eligibility query.';
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        extractedProfileData: data.extractedProfile,
        matchedSchemes: data.matchedSchemes,
        ragCitations: data.ragCitations,
        ragSources: data.ragSources,
        confidenceScore: data.confidenceScore,
        noInformationFound: data.noInformationFound,
        language
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (currentUser) {
        await saveChatMessageToFirestore(currentUser.uid, 'assistant', aiText);
      }

      return aiText;
    } catch (err) {
      console.error('Failed to send chat message:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'I am analyzing your profile against active welfare scheme rules. Please review the top matching schemes in the directory.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      return fallbackMsg.text;
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleToggleSaveScheme = async (schemeId: string) => {
    const scheme = SCHEMES_DATABASE.find(s => s.id === schemeId);
    if (savedSchemeIds.includes(schemeId)) {
      setSavedSchemeIds(savedSchemeIds.filter((id) => id !== schemeId));
      if (currentUser) {
        removeSavedSchemeForUserInFirestore(currentUser.uid, schemeId);
      }
    } else {
      setSavedSchemeIds([...savedSchemeIds, schemeId]);
      if (currentUser && scheme) {
        saveSchemeForUserInFirestore(currentUser.uid, scheme);
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-amber-500 selection:text-white">
      
      {/* Animated WebGL Shader Background Canvas */}
      <BackgroundAnimationCanvas />

      {/* Top Global Navigation Bar */}
      <div className="relative z-[1000] w-full overflow-visible">
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onOpenVoiceAssistant={() => setVoiceAssistantOpen(true)}
          profile={profile}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onGoogleSignIn={handleGoogleSignIn}
          isGoogleSigningIn={isGoogleSigningIn}
        />
      </div>

      {/* Main Page Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activePage === 'landing' && (
          <LandingPage
            setActivePage={setActivePage}
            language={language}
            profile={profile}
            onOpenVoiceAssistant={() => setVoiceAssistantOpen(true)}
            onGoogleSignIn={handleGoogleSignIn}
            isGoogleSigningIn={isGoogleSigningIn}
            authError={authError}
            onSelectCategory={(cat) => {
              setSelectedCategoryFilter(cat);
              setActivePage('schemes');
            }}
          />
        )}

        {activePage === 'services' && (
          <ServicesPortalPage
            language={language}
            profile={profile}
            setActivePage={setActivePage}
            onOpenVoiceAssistant={() => setVoiceAssistantOpen(true)}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            setActivePage={setActivePage}
            language={language}
            profile={profile}
            onUpdateProfile={(p) => setProfile(p)}
            savedSchemeIds={savedSchemeIds}
            onViewSchemeDetails={(s) => setSelectedSchemeForModal(s)}
          />
        )}

        {activePage === 'chat' && (
          <ChatPage
            messages={messages}
            onSendMessage={(text) => { void handleSendMessage(text); }}
            profile={profile}
            onUpdateProfile={(p) => setProfile(p)}
            language={language}
            onOpenVoiceAssistant={() => setVoiceAssistantOpen(true)}
            onViewSchemeDetails={(s) => setSelectedSchemeForModal(s)}
            isLoading={isLoadingChat}
          />
        )}

        {activePage === 'schemes' && (
          <SchemeExplorerPage
            profile={profile}
            savedSchemeIds={savedSchemeIds}
            onToggleSaveScheme={handleToggleSaveScheme}
            onViewSchemeDetails={(s) => setSelectedSchemeForModal(s)}
            language={language}
            initialCategory={selectedCategoryFilter}
          />
        )}

        {activePage === 'eligibility' && (
          <EligibilityResultsPage
            profile={profile}
            onUpdateProfile={(p) => setProfile(p)}
            onViewSchemeDetails={(s) => setSelectedSchemeForModal(s)}
            savedSchemeIds={savedSchemeIds}
            onToggleSaveScheme={handleToggleSaveScheme}
            language={language}
          />
        )}

        {activePage === 'ocr' && (
          <DocumentOCRPage
            language={language}
            profile={profile}
            onUpdateProfile={(p) => setProfile((prev) => ({ ...prev, ...p }))}
          />
        )}

        {activePage === 'saved' && (
          <SavedSchemesPage
            savedSchemeIds={savedSchemeIds}
            onToggleSaveScheme={handleToggleSaveScheme}
            onViewSchemeDetails={(s) => setSelectedSchemeForModal(s)}
            language={language}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'reports' && (
          <PdfReportPage
            profile={profile}
            language={language}
          />
        )}

        {activePage === 'feedback' && (
          <FeedbackPage
            language={language}
            profile={profile}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboardPage
            language={language}
          />
        )}

        {activePage === 'monitoring' && (
          <MonitoringDashboardPage
            language={language}
          />
        )}

        {activePage === 'settings' && (
          <SettingsPage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            onResetProfile={() => setProfile({ state: 'Telangana', caste: 'General' })}
            onClearSavedSchemes={() => setSavedSchemeIds([])}
          />
        )}
      </main>

      {/* Voice Assistant Modal Overlay */}
      <VoiceAssistantModal
        isOpen={voiceAssistantOpen}
        onClose={() => setVoiceAssistantOpen(false)}
        language={language}
        profile={profile}
        onSendMessage={handleSendMessage}
      />

      {/* Government Scheme Detail Modal */}
      {selectedSchemeForModal && (
        <SchemeDetailModal
          scheme={selectedSchemeForModal}
          isOpen={!!selectedSchemeForModal}
          onClose={() => setSelectedSchemeForModal(null)}
          isSaved={savedSchemeIds.includes(selectedSchemeForModal.id)}
          onToggleSave={() => handleToggleSaveScheme(selectedSchemeForModal.id)}
          profile={profile}
          language={language}
        />
      )}

      {/* Onboarding Profile Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        profile={profile}
        onSaveProfile={(updatedProfile, newLang) => {
          setProfile(updatedProfile);
          setLanguage(newLang);
        }}
        currentLanguage={language}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Yojana Mitra AI • Government Welfare Assistant for Indian Citizens</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setActivePage('feedback')} className="hover:underline text-amber-600 dark:text-amber-400 font-bold">
              Citizen Feedback & Quality Portal
            </button>
            <button onClick={() => setActivePage('admin')} className="hover:underline">
              Admin Analytics
            </button>
            <button onClick={() => setActivePage('monitoring')} className="hover:underline text-[#6C5CE7] font-bold">
              Live Monitoring
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
