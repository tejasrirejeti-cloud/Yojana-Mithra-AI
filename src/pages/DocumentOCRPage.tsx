import React, { useEffect, useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  FileSearch,
  UserRound,
  GraduationCap,
  IndianRupee
} from 'lucide-react';
import { CitizenProfile, Language } from '../types';
import confetti from 'canvas-confetti';
import { auth } from '../lib/firebase';
import { saveOcrScanToFirestore } from '../lib/firestoreService';

interface DocumentOCRPageProps {
  profile: CitizenProfile;
  onUpdateProfile: (updated: Partial<CitizenProfile>) => void;
  language: Language;
}

interface ExtractedDocumentData {
  documentType?: string;
  name?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other' | 'All';
  state?: string;
  district?: string;
  annualIncome?: number;
  caste?: CitizenProfile['caste'];
  occupation?: string;
  education?: CitizenProfile['education'];
  isStudent?: boolean;
  isFarmer?: boolean;
  landholdingAcres?: number;
  isBPL?: boolean;
  hasAadhaar?: boolean;
  hasBankAccount?: boolean;
  hasRationCard?: boolean;
  confidenceScore?: number;
  rawText?: string;
}

export const DocumentOCRPage: React.FC<DocumentOCRPageProps> = ({
  profile,
  onUpdateProfile,
  language
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewIsPdf, setPreviewIsPdf] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedDocumentData | null>(null);
  const [error, setError] = useState('');
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const supported = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'application/pdf'
    ];

    if (!supported.includes(file.type)) {
      setError('Please upload a PNG, JPG, JPEG, WEBP image, or PDF document.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('Please keep the document below 15 MB for reliable Gemini OCR processing.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPreviewIsPdf(file.type === 'application/pdf');
    setExtractedData(null);
    setSynced(false);
    setError('');
  };

  const handleScanDocument = async () => {
    if (!selectedFile) {
      setError('Select a document first.');
      return;
    }

    setIsProcessing(true);
    setSynced(false);
    setError('');

    try {
      const imageBase64 = await fileToDataUrl(selectedFile);

      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType: selectedFile.type || 'application/octet-stream'
        })
      });

      const data = await safeJson(res);

      if (!res.ok || !data.success) {
        throw new Error(data.error || `Gemini OCR failed with status ${res.status}.`);
      }

      if (!data.extractedData || typeof data.extractedData !== 'object') {
        throw new Error('Gemini returned no structured document data. Try a clearer document image.');
      }

      setExtractedData(data.extractedData as ExtractedDocumentData);

      if (auth.currentUser) {
        void saveOcrScanToFirestore(
          auth.currentUser.uid,
          data.extractedData.documentType || 'Scanned Document',
          JSON.stringify(data.extractedData),
          data.extractedData
        );
      }
    } catch (err) {
      console.error('Gemini OCR error:', err);
      setError(err instanceof Error ? err.message : 'Unable to process this document with Gemini OCR.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSyncToProfile = () => {
    if (!extractedData) return;

    const updated: Partial<CitizenProfile> = {
      name: extractedData.name || undefined,
      age: extractedData.age,
      gender: extractedData.gender,
      state: extractedData.state,
      district: extractedData.district,
      annualIncome: extractedData.annualIncome,
      caste: extractedData.caste,
      occupation: extractedData.occupation,
      education: extractedData.education,
      isStudent: extractedData.isStudent,
      isFarmer: extractedData.isFarmer,
      landholdingAcres: extractedData.landholdingAcres,
      isBPL: extractedData.isBPL,
      hasAadhaar: extractedData.hasAadhaar,
      hasBankAccount: extractedData.hasBankAccount,
      hasRationCard: extractedData.hasRationCard
    };

    // Remove undefined values so an OCR field that was not present does not
    // accidentally erase an existing profile value.
    const cleaned = Object.fromEntries(
      Object.entries(updated).filter(([, value]) => value !== undefined && value !== '')
    ) as Partial<CitizenProfile>;

    onUpdateProfile(cleaned);
    setSynced(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-7 h-7 text-[#6C5CE7]" />
          <span>AI Document OCR Scanner</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Gemini reads official documents and extracts profile fields without inventing missing information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#6C5CE7]" />
            Upload Document
          </h2>

          <div className="border-2 border-dashed border-indigo-200 dark:border-slate-700 rounded-3xl p-6 text-center hover:border-[#6C5CE7] transition-colors bg-slate-50/50 dark:bg-slate-800/40 relative min-h-[220px] flex items-center justify-center">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {previewUrl ? (
              previewIsPdf ? (
                <div className="w-full space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                    <FileText className="w-10 h-10" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white break-all">{selectedFile?.name}</p>
                  <p className="text-xs text-slate-500">PDF selected — Gemini will analyze the document directly.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <img src={previewUrl} alt="Document preview" className="max-h-56 max-w-full mx-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md object-contain" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 break-all">{selectedFile?.name}</p>
                </div>
              )
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-[#6C5CE7] flex items-center justify-center mx-auto">
                  <FileSearch className="w-7 h-7" />
                </div>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Choose Aadhaar, income certificate, ration card, land record, marksheet, or student ID</p>
                <p className="text-xs text-slate-400">PNG, JPG, WEBP or PDF • maximum 15 MB</p>
              </div>
            )}
          </div>

          <button
            onClick={handleScanDocument}
            disabled={!selectedFile || isProcessing}
            className="w-full py-3.5 rounded-2xl purple-gradient-btn text-white font-extrabold text-sm shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isProcessing ? 'Gemini is reading the document...' : 'Extract Data with Gemini OCR'}</span>
          </button>

          {error && (
            <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs font-semibold text-rose-700 dark:text-rose-300 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="glass-card rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-3">
            <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
              Extracted Attributes
            </h2>
            {extractedData?.confidenceScore !== undefined && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {extractedData.confidenceScore}% confidence
              </span>
            )}
          </div>

          {extractedData ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 font-bold text-[#6C5CE7] dark:text-indigo-300">
                Detected: {extractedData.documentType || 'Official Document'}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Attribute icon={<UserRound className="w-4 h-4" />} label="Name" value={extractedData.name} />
                <Attribute icon={<UserRound className="w-4 h-4" />} label="Gender / Age" value={[extractedData.gender, extractedData.age].filter(Boolean).join(' • ')} />
                <Attribute icon={<IndianRupee className="w-4 h-4" />} label="Annual Income" value={extractedData.annualIncome !== undefined ? `₹${Number(extractedData.annualIncome).toLocaleString('en-IN')}` : undefined} />
                <Attribute icon={<FileText className="w-4 h-4" />} label="State / District" value={[extractedData.state, extractedData.district].filter(Boolean).join(', ')} />
                <Attribute icon={<GraduationCap className="w-4 h-4" />} label="Education" value={extractedData.education} />
                <Attribute icon={<UserRound className="w-4 h-4" />} label="Occupation" value={extractedData.occupation} />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <p><b>Student:</b> {extractedData.isStudent === undefined ? 'Not detected' : extractedData.isStudent ? 'Yes' : 'No'}</p>
                <p><b>Farmer:</b> {extractedData.isFarmer === undefined ? 'Not detected' : extractedData.isFarmer ? 'Yes' : 'No'}</p>
                <p><b>BPL:</b> {extractedData.isBPL === undefined ? 'Not detected' : extractedData.isBPL ? 'Yes' : 'No'}</p>
                <p><b>Caste:</b> {extractedData.caste || 'Not detected'}</p>
              </div>

              <button
                onClick={handleSyncToProfile}
                disabled={synced}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-500 text-white font-extrabold flex items-center justify-center gap-2"
              >
                {synced ? <CheckCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                {synced ? 'Profile Updated from OCR' : 'Review & Sync to Citizen Profile'}
              </button>
            </div>
          ) : (
            <div className="min-h-[300px] flex items-center justify-center text-center text-sm text-slate-400">
              <div>
                <FileSearch className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-bold">No document data yet</p>
                <p className="text-xs mt-1">Upload a document and run Gemini OCR.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function Attribute({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
      <span className="text-[10px] text-slate-400 block font-bold uppercase mb-1 flex items-center gap-1">{icon}{label}</span>
      <span className="font-bold text-slate-900 dark:text-white text-sm">{value || 'Not detected'}</span>
    </div>
  );
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });
}

async function safeJson(response: Response): Promise<any> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: text || 'Server returned an invalid response.' };
  }
}
