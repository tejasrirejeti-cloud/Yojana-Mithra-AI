import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Copy, 
  RotateCcw, 
  Volume2, 
  Mic, 
  Check, 
  ArrowRight,
  ShieldCheck,
  FileText,
  UserCheck
} from 'lucide-react';
import { ChatMessage, Language, CitizenProfile, GovernmentScheme, EligibilityResult, ResponseFeedback } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { SCHEMES_DATABASE } from '../data/schemes';
import { evaluateSchemeEligibility } from '../utils/eligibilityEngine';
import { FeedbackWidget } from '../components/FeedbackWidget';

interface ChatPageProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  profile: CitizenProfile;
  onUpdateProfile: (updated: CitizenProfile) => void;
  language: Language;
  onOpenVoiceAssistant: () => void;
  onViewSchemeDetails: (scheme: GovernmentScheme) => void;
  isLoading: boolean;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  messages,
  onSendMessage,
  profile,
  onUpdateProfile,
  language,
  onOpenVoiceAssistant,
  onViewSchemeDetails,
  isLoading
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    onSendMessage(text);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'te') utterance.lang = 'te-IN';
      else utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const suggestedPrompts = [
    'I am a farmer from Telangana with 2 acres. What schemes can I get?',
    'Find education scholarships for SC student in UP with income below 2 Lakhs.',
    'What schemes provide free gas connection and monthly money for women?',
    'Explain how to get Ayushman Bharat health card up to 5 Lakhs.',
    'I want a collateral-free loan for starting a small shop.'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-12">
      
      {/* MAIN CHAT WINDOW (3 Cols on Desktop) */}
      <div className="lg:col-span-3 glass-card border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col h-[78vh] overflow-hidden relative">
        
        {/* Chat Window Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#4F9DFF] text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <span>Yojana Mitra AI Assistant</span>
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reasoning over 25+ Central & State Schemes in English, Hindi & Telugu
              </p>
            </div>
          </div>

          <button
            onClick={onOpenVoiceAssistant}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 text-[#6C5CE7] dark:bg-indigo-950/60 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all border border-indigo-200/60 dark:border-indigo-800/60"
          >
            <Mic className="w-4 h-4 text-[#6C5CE7]" />
            <span className="hidden sm:inline">Voice Assistant</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm ${
                    isAI
                      ? 'bg-gradient-to-tr from-[#6C5CE7] to-[#4F9DFF]'
                      : 'bg-[#22C55E]'
                  }`}
                >
                  {isAI ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                {/* Message Content Bubble */}
                <div className="space-y-3 flex-1">
                  <div
                    className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                      isAI
                        ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                        : 'purple-gradient-btn text-white rounded-tr-none shadow-md font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* RAG Grounding & Confidence Score Pill */}
                    {isAI && msg.confidenceScore !== undefined && (
                      <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-1 font-bold text-[#6C5CE7] dark:text-indigo-400">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <span>Verified RAG Grounding</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          msg.confidenceScore > 80 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                        }`}>
                          {msg.confidenceScore}% RAG Accuracy
                        </span>
                      </div>
                    )}

                    {/* RAG Citations & Source Attribution */}
                    {isAI && msg.ragCitations && msg.ragCitations.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700 space-y-2">
                        <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <FileText className="w-3 h-3 text-[#6C5CE7]" />
                          <span>Knowledge Base Sources ({msg.ragCitations.length})</span>
                        </div>
                        <div className="space-y-1.5">
                          {msg.ragCitations.map((cite, cIdx) => (
                            <div 
                              key={cIdx} 
                              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1 shadow-2xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 dark:text-white">{cite.schemeName}</span>
                                <span className="text-[10px] font-bold text-[#6C5CE7]">{cite.section}</span>
                              </div>
                              <p className="text-[10px] text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                "{cite.relevantExcerpt}"
                              </p>
                              <div className="flex items-center justify-between pt-0.5 text-[9px] text-slate-400">
                                <span>Helpline: {cite.helpline}</span>
                                <a 
                                  href={cite.officialWebsite} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-[#6C5CE7] hover:underline font-bold"
                                >
                                  Official Portal ↗
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Controls for AI message */}
                    {isAI && (
                      <>
                        <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-slate-400">
                          <span className="text-[10px]">{msg.timestamp}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyText(msg.id, msg.text)}
                              className="p-1 hover:text-slate-600 dark:hover:text-white transition-colors"
                              title="Copy Message"
                            >
                              {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleSpeakText(msg.text)}
                              className="p-1 hover:text-slate-600 dark:hover:text-white transition-colors"
                              title="Read Aloud"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Interactive Thumbs Up/Down & Comment Feedback Widget */}
                        <FeedbackWidget
                          messageId={msg.id}
                          userQuery={messages.find((m) => m.id === msg.id)?.text || 'Citizen Query'}
                          aiResponseSnippet={msg.text}
                          existingFeedback={msg.feedback}
                          citizenState={profile.state || 'Telangana'}
                        />
                      </>
                    )}
                  </div>

                  {/* Embedded Matched Schemes Cards */}
                  {isAI && msg.matchedSchemes && msg.matchedSchemes.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="text-[11px] font-bold text-[#6C5CE7] dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7]" />
                        <span>Top Eligible Schemes Identified ({msg.matchedSchemes.length})</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.matchedSchemes.map((res) => {
                          const s = res.scheme;
                          return (
                            <div
                              key={s.id}
                              onClick={() => onViewSchemeDetails(s)}
                              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-700 hover:border-[#6C5CE7] transition-all cursor-pointer shadow-sm text-xs space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                                  {s.name}
                                </span>
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                  {res.score}% Match
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                                {s.benefits}
                              </p>
                              <div className="pt-1 flex items-center justify-between text-[10px] font-bold text-[#6C5CE7]">
                                <span>{s.category}</span>
                                <span className="flex items-center gap-1">
                                  <span>View Details</span>
                                  <ArrowRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-500 text-xs italic animate-pulse">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#4F9DFF] text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <span>Yojana Mitra AI is reasoning over government eligibility rules...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pill Bar */}
        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 overflow-x-auto flex items-center gap-2 text-xs no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Prompts:</span>
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(prompt)}
              className="px-3.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#6C5CE7] hover:text-[#6C5CE7] transition-colors whitespace-nowrap shrink-0 font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about any government scheme, eligibility, documents, or application process..."
            className="flex-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3.5 rounded-2xl purple-gradient-btn text-white shadow-md disabled:opacity-50 transition-all flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

      </div>

      {/* LIVE CITIZEN PROFILE SIDEBAR (1 Col on Desktop) */}
      <div className="space-y-4">
        
        {/* Profile Card */}
        <div className="glass-card border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#22C55E]" />
              <span>Active Profile Context</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              Verified
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            AI automatically updates your profile parameters as you chat!
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Name:</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile.name || 'Citizen'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">State:</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile.state || 'India'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Age & Gender:</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile.age ? `${profile.age} yrs` : 'N/A'}, {profile.gender || 'N/A'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Annual Income:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {profile.annualIncome ? `₹${profile.annualIncome.toLocaleString('en-IN')}` : 'Not Specified'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Occupation:</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile.occupation || 'N/A'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Landholding:</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile.landholdingAcres ? `${profile.landholdingAcres} Acres` : '0 Acres'}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-400">Caste Category:</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile.caste || 'General'}</span>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="p-4 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs space-y-2">
          <div className="font-bold text-[#6C5CE7] dark:text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
            <span>AI Reasoning Tip</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Specify your exact landholding in acres and annual income to get precise eligibility calculations for PM-KISAN, Rythu Bandhu, or PMAY.
          </p>
        </div>

      </div>

    </div>
  );
};

