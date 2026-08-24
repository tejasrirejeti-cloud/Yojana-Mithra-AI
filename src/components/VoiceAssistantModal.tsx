import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Send } from 'lucide-react';
import { Language, CitizenProfile } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  profile: CitizenProfile;
  onSendMessage: (msg: string) => Promise<string>;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  profile,
  onSendMessage
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponseText, setAiResponseText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      if (language === 'hi') recognition.lang = 'hi-IN';
      else if (language === 'te') recognition.lang = 'te-IN';
      else recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
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

  const handleSendVoiceQuery = async () => {
    if (!transcript.trim()) return;
    setIsProcessing(true);
    try {
      const reply = await onSendMessage(transcript);
      setAiResponseText(reply);
      handleSpeakText(reply);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6C5CE7]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#22C55E]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl purple-gradient-btn text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {t.voiceAssistant}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Language: {language === 'hi' ? 'हिंदी (Hindi)' : language === 'te' ? 'తెలుగు (Telugu)' : 'English'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mic Pulse Animation Visualizer */}
        <div className="my-8 flex flex-col items-center justify-center text-center">
          <button
            onClick={toggleListening}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 animate-pulse scale-110'
                : 'purple-gradient-btn text-white shadow-lg shadow-indigo-500/30 hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            {isListening && (
              <span className="absolute inset-0 rounded-full border-4 border-rose-400 animate-ping opacity-75" />
            )}
          </button>

          <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
            {isListening ? t.voiceListening : 'Tap microphone to speak your question'}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            e.g. "I am a farmer from Telangana with 2 acres. What schemes can I get?"
          </p>
        </div>

        {/* Live Speech Transcript Box */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-3 min-h-[100px] flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Your Voice Input:
          </div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic">
            {transcript || 'Your spoken words will appear here...'}
          </p>
          {transcript && (
            <button
              onClick={handleSendVoiceQuery}
              disabled={isProcessing}
              className="self-end flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#22C55E] hover:opacity-95 text-white text-xs font-bold shadow-md transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Analyzing...' : 'Ask AI'}</span>
            </button>
          )}
        </div>

        {/* AI Voice Answer Output Box */}
        {aiResponseText && (
          <div className="mt-4 bg-[#6C5CE7]/10 border border-[#6C5CE7]/30 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#6C5CE7]">
              <span>AI Voice Response:</span>
              <button
                onClick={() => handleSpeakText(aiResponseText)}
                className="flex items-center gap-1 text-xs text-[#6C5CE7] hover:underline"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Replay Voice</span>
              </button>
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {aiResponseText}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

