import React, { useState } from 'react';
import { 
  FileText, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  Download, 
  Sparkles, 
  Newspaper, 
  Zap, 
  ArrowRight, 
  Bot, 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  X,
  CreditCard,
  UserCheck,
  Building2,
  HeartPulse,
  HelpCircle
} from 'lucide-react';
import { Language, CitizenProfile } from '../types';

interface ServicesPortalPageProps {
  language: Language;
  profile: CitizenProfile;
  setActivePage: (page: string) => void;
  onOpenVoiceAssistant?: () => void;
}

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  description: string;
  actionText: string;
  iconType: string;
  officialUrl: string;
  docsNeeded: string[];
  processingTime: string;
  fee: string;
  steps: string[];
}

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  stepsToApply: string[];
}

export const ServicesPortalPage: React.FC<ServicesPortalPageProps> = ({
  language,
  profile,
  setActivePage,
  onOpenVoiceAssistant
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);
  const [activeNewsModal, setActiveNewsModal] = useState<NewsItem | null>(null);
  const [applicationSuccessMsg, setApplicationSuccessMsg] = useState<string | null>(null);

  // Verified Services Dataset (Matching screenshot & expanded)
  const servicesList: ServiceItem[] = [
    {
      id: 'srv-1',
      title: 'Aadhaar Download',
      category: 'UIDAI',
      categoryColor: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/90 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700',
      description: 'Download e-Aadhaar card PDF using your Enrollment ID (EID) or Aadhaar Number (UID) verified via OTP.',
      actionText: 'Download',
      iconType: 'aadhaar',
      officialUrl: 'https://myaadhaar.uidai.gov.in/',
      docsNeeded: ['Aadhaar Number / Enrollment ID', 'Registered Mobile Number for OTP'],
      processingTime: 'Instant (2 Minutes)',
      fee: 'Free of Cost',
      steps: [
        'Visit official myAadhaar UIDAI Portal',
        'Enter 12-digit Aadhaar Number or 28-digit Enrollment ID',
        'Enter Captcha and click Send OTP to registered mobile',
        'Enter OTP received and click Download e-Aadhaar PDF'
      ]
    },
    {
      id: 'srv-2',
      title: 'Chiranjivi Health Yojana',
      category: 'Health Scheme',
      categoryColor: 'bg-rose-100 text-rose-950 dark:bg-rose-900/90 dark:text-rose-100 border-rose-300 dark:border-rose-700',
      description: 'Cashless medical treatment insurance up to ₹25 Lakhs per family per year in empanelled hospitals.',
      actionText: 'Apply Now',
      iconType: 'health',
      officialUrl: 'https://chira.rajasthan.gov.in/',
      docsNeeded: ['Janadhar / Aadhaar Card', 'Ration Card', 'Income Certificate'],
      processingTime: '3 - 5 Working Days',
      fee: 'Free for BPL/NFSA; ₹850/yr for others',
      steps: [
        'Login via Janadhar ID or SSO Portal',
        'Select family members to enroll in Cashless Health Cover',
        'Upload Category proof (NFSA/BPL/Small Farmer)',
        'E-Sign using OTP and download Chiranjivi Health Card'
      ]
    },
    {
      id: 'srv-3',
      title: 'Janadhar Family ID',
      category: 'Citizen ID',
      categoryColor: 'bg-sky-100 text-sky-950 dark:bg-sky-900/90 dark:text-sky-100 border-sky-300 dark:border-sky-700',
      description: 'Single unified family identity card for receiving direct benefit transfers and state welfare schemes.',
      actionText: 'Apply Now',
      iconType: 'citizen',
      officialUrl: 'https://janadhan.rajasthan.gov.in/',
      docsNeeded: ['Aadhaar Card of Female Head', 'Bank Passbook', 'Address Proof'],
      processingTime: '7 - 10 Working Days',
      fee: 'Free of Cost',
      steps: [
        'Select Female Head of the family as Primary Card Holder',
        'Add details of all family members with individual Aadhaar IDs',
        'Link bank account for Direct Benefit Transfer (DBT)',
        'Submit at MeeSeva / CSC or Online Portal for e-Verification'
      ]
    },
    {
      id: 'srv-4',
      title: 'CM Farmer Loan Yojana',
      category: 'Farmer Loan',
      categoryColor: 'bg-amber-100 text-amber-950 dark:bg-amber-900/90 dark:text-amber-100 border-amber-300 dark:border-amber-700',
      description: 'Zero interest short-term crop loans up to ₹2 Lakhs for small and marginal agricultural landowners.',
      actionText: 'Apply Now',
      iconType: 'farmer',
      officialUrl: 'https://prajapalana.telangana.gov.in/',
      docsNeeded: ['Pattadar Passbook (Land Record)', 'Aadhaar Card', 'Crop Inspection Slip'],
      processingTime: '5 - 7 Working Days',
      fee: 'Free of Cost',
      steps: [
        'Submit land extent details (Pattadar Passbook / Adangal)',
        'Select local Primary Agricultural Credit Society (PACS) or Lead Bank',
        'Verify digital land records online via Meebhoomi / Dharani portal',
        'Receive loan sanction notice via SMS and direct bank credit'
      ]
    },
    {
      id: 'srv-5',
      title: 'Aadhaar Address Update',
      category: 'UIDAI',
      categoryColor: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/90 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700',
      description: 'Update residential address in Aadhaar online using valid address proof or Head of Family (HOF) consent.',
      actionText: 'Apply Now',
      iconType: 'aadhaar',
      officialUrl: 'https://myaadhaar.uidai.gov.in/',
      docsNeeded: ['Valid Address Proof (Electricity Bill, Rent Agreement, Passbook) or HOF Aadhaar'],
      processingTime: '2 - 7 Working Days',
      fee: '₹50 Portal Fee',
      steps: [
        'Login to myAadhaar Portal using Aadhaar & OTP',
        'Select "Address Update" -> "Update Address Online"',
        'Upload scanned proof of address or enter Head of Family details',
        'Pay ₹50 fee and track SRN status'
      ]
    },
    {
      id: 'srv-6',
      title: 'Caste Certificate Online Apply',
      category: 'Document Service',
      categoryColor: 'bg-purple-100 text-purple-950 dark:bg-purple-900/90 dark:text-purple-100 border-purple-300 dark:border-purple-700',
      description: 'Official SC / ST / OBC / BC community certificate for education admissions and reservation benefits.',
      actionText: 'Apply Now',
      iconType: 'document',
      officialUrl: 'https://meeseva.gov.in/',
      docsNeeded: ['Aadhaar Card', 'Ration Card / School Transfer Certificate', 'Ancestral Property / Caste Proof'],
      processingTime: '7 - 15 Working Days',
      fee: '₹35 Service Charge',
      steps: [
        'Fill online application form with applicant & father details',
        'Attach local revenue official / VRO enquiry report or school TC',
        'Submit application through MeeSeva / CSC portal',
        'Download digitally signed Caste Certificate upon VRO / Tehsildar approval'
      ]
    },
    {
      id: 'srv-7',
      title: 'Income Certificate Online Apply',
      category: 'Document Service',
      categoryColor: 'bg-purple-100 text-purple-950 dark:bg-purple-900/90 dark:text-purple-100 border-purple-300 dark:border-purple-700',
      description: 'Official annual family income proof required for fee reimbursement, scholarship, and BPL benefits.',
      actionText: 'Apply Now',
      iconType: 'document',
      officialUrl: 'https://meeseva.gov.in/',
      docsNeeded: ['Salary Slip / IT Return / VRO Declaration', 'Aadhaar Card', 'Ration Card'],
      processingTime: '5 - 10 Working Days',
      fee: '₹35 Service Charge',
      steps: [
        'Upload Aadhaar, Salary proof or Self-declaration of agriculture/labor income',
        'Application routed to Village Revenue Officer (VRO) for field verification',
        'Tehsildar approves application digitally',
        'Download certified Income Certificate with QR code verification'
      ]
    },
    {
      id: 'srv-8',
      title: 'Domicile / Residence Certificate',
      category: 'Document Service',
      categoryColor: 'bg-purple-100 text-purple-950 dark:bg-purple-900/90 dark:text-purple-100 border-purple-300 dark:border-purple-700',
      description: 'Certificate proving continuous residence in the state for local quota seats and government job applications.',
      actionText: 'Apply Now',
      iconType: 'document',
      officialUrl: 'https://meeseva.gov.in/',
      docsNeeded: ['7 Years School Study Certificates / Electricity Bills', 'Aadhaar Card'],
      processingTime: '7 Working Days',
      fee: '₹35 Service Charge',
      steps: [
        'Fill residential tenure details from birth or last 7 years',
        'Attach study certificates or voter ID proof of parents',
        'Submit via CSC MeeSeva platform for Tehsildar endorsement',
        'Download digital residence certificate'
      ]
    },
    {
      id: 'srv-9',
      title: 'Ration Card Member Addition',
      category: 'Citizen Services',
      categoryColor: 'bg-teal-100 text-teal-950 dark:bg-teal-900/90 dark:text-teal-100 border-teal-300 dark:border-teal-700',
      description: 'Add new family member, newborn child, or spouse name to existing National Food Security (NFSA) Ration Card.',
      actionText: 'Apply Now',
      iconType: 'citizen',
      officialUrl: 'https://epos.telangana.gov.in/',
      docsNeeded: ['Birth Certificate (for infant) / Marriage Certificate (for spouse)', 'Aadhaar Card of member'],
      processingTime: '10 - 15 Working Days',
      fee: 'Free of Cost',
      steps: [
        'Select "Ration Card Amendment" service',
        'Enter existing Ration Card Number & verify Head of Family OTP',
        'Enter new member name, relationship, and Aadhaar number',
        'Upload supporting birth or marriage certificate and submit'
      ]
    }
  ];

  // Latest News / Apply Guides List
  const newsList: NewsItem[] = [
    {
      id: 'news-1',
      title: 'Birth Certificate Online Apply Guide',
      category: 'Civil Registration',
      date: 'Updated July 2026',
      readTime: '3 Min Read',
      summary: 'Complete guide to registering birth within 21 days online via CRS Govt portal without visiting municipal offices.',
      stepsToApply: [
        'Visit official Civil Registration System (crsorgi.gov.in) portal.',
        'Register as user with hospital discharge slip details.',
        'Fill child name, parents Aadhaar numbers, and place of birth.',
        'Download digital Birth Certificate with instant QR verification.'
      ]
    },
    {
      id: 'news-2',
      title: 'Rajasthan Scooty Yojana 2025-26 Apply Process',
      category: 'Student Welfare',
      date: 'Active Scheme',
      readTime: '4 Min Read',
      summary: 'Free electric scooty scheme for meritorious girl students scoring 60%+ in 10th and 12th board exams.',
      stepsToApply: [
        'Login to SSO Portal Rajasthan with Janadhar ID.',
        'Select "Kalibai Bhil Scooty Yojana" application.',
        'Upload 10th/12th marksheets and college admission fee receipt.',
        'Submit for institutional & district nod officer approval.'
      ]
    },
    {
      id: 'news-3',
      title: 'PAN Card Online Apply Step-by-Step',
      category: 'Financial Services',
      date: 'Instant e-PAN',
      readTime: '2 Min Read',
      summary: 'Get instant paperless e-PAN card in 10 minutes using Aadhaar e-KYC without uploading documents.',
      stepsToApply: [
        'Go to Income Tax e-Filing portal -> Instant e-PAN.',
        'Enter 12-digit Aadhaar Number and accept consent.',
        'Enter OTP received on Aadhaar linked mobile number.',
        'Download instant PDF e-PAN card free of cost.'
      ]
    },
    {
      id: 'news-4',
      title: 'Scholarship Portal Application Guide 2026',
      category: 'Education Welfare',
      date: 'Open Applications',
      readTime: '5 Min Read',
      summary: 'Pre-Matric & Post-Matric fee reimbursement portal guide for SC, ST, OBC, EBC, and Minority students.',
      stepsToApply: [
        'Register on ePASS / NSP National Scholarship Portal.',
        'Link Aadhaar with Bank Account for NPCI Direct Credit.',
        'Upload Income Certificate, Caste Proof, and College Admission Slip.',
        'Submit online and get biometric authenticated at college.'
      ]
    },
    {
      id: 'news-5',
      title: 'Ayushman Card Online Apply & KYC Guide',
      category: 'Health Care',
      date: 'Live Portal',
      readTime: '3 Min Read',
      summary: 'How to check eligibility and generate Ayushman Card using Ayushman App or Beneficiary Portal.',
      stepsToApply: [
        'Open beneficiary.nha.gov.in or Ayushman App.',
        'Search family by Ration Card Number or Aadhaar.',
        'Complete Face Authentication or OTP e-KYC.',
        'Download Ayushman Golden Card for ₹5 Lakh free health treatment.'
      ]
    }
  ];

  // Quick Links List
  const quickLinks = [
    { title: 'Aadhaar Download', targetId: 'srv-1' },
    { title: 'PAN Card Apply', targetId: 'srv-3' },
    { title: 'Scholarship Status', targetId: 'srv-7' },
    { title: 'Ration Card Services', targetId: 'srv-9' },
    { title: 'Voter ID Services', targetId: 'srv-8' },
    { title: 'PM Kisan Yojana', targetId: 'srv-4' },
    { title: 'Ayushman Bharat Card', targetId: 'srv-2' },
    { title: 'Income Certificate', targetId: 'srv-7' },
  ];

  const categories = ['All', 'UIDAI', 'Health Scheme', 'Citizen ID', 'Farmer Loan', 'Document Service', 'Citizen Services'];

  const filteredServices = servicesList.filter((service) => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSimulateApply = (service: ServiceItem) => {
    setActiveServiceModal(service);
  };

  const handleConfirmAction = () => {
    if (!activeServiceModal) return;
    setApplicationSuccessMsg(`Request initiated for ${activeServiceModal.title}! Yojana Mitra AI will assist you step-by-step.`);
    setTimeout(() => {
      setApplicationSuccessMsg(null);
      setActiveServiceModal(null);
    }, 3500);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner Header */}
      <div className="glass-card-purple rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-indigo-200/80 dark:border-indigo-800/80">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-300 text-xs font-black border border-emerald-300 dark:border-emerald-700">
            <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>DIRECT GOVERNMENT SERVICES & E-CERTIFICATES PORTAL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            All Government Services Portal
          </h1>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
            Choose from 25+ verified citizen services. Download identity cards, apply for agricultural loans, request caste & income certificates, and track official government applications with step-by-step AI guidance.
          </p>

          {/* Quick Search Bar */}
          <div className="pt-2 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search services (e.g. Aadhaar, Caste Certificate, Loan, Ration Card)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              />
            </div>
            {onOpenVoiceAssistant && (
              <button 
                onClick={onOpenVoiceAssistant}
                className="px-4 py-2.5 rounded-2xl bg-[#6C5CE7] hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-md"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">Ask Voice AI</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {applicationSuccessMsg && (
        <div className="bg-emerald-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow-xl animate-fade-in font-bold text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{applicationSuccessMsg}</span>
        </div>
      )}

      {/* MAIN 3-COLUMN PORTAL LAYOUT (Matching Screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Latest News & Application Guides */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card bg-white dark:bg-slate-900/95 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
              <Newspaper className="w-4 h-4 text-[#6C5CE7]" />
              <h2 className="font-extrabold text-slate-900 dark:text-white text-sm">
                Latest News & Guides
              </h2>
            </div>

            <div className="space-y-3">
              {newsList.map((news) => (
                <div 
                  key={news.id}
                  onClick={() => setActiveNewsModal(news)}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer group"
                >
                  <span className="text-[9px] font-black uppercase text-[#E8640A] dark:text-amber-400 block mb-0.5">
                    {news.category} • {news.readTime}
                  </span>
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-[#6C5CE7] dark:group-hover:text-[#4F9DFF] transition-colors leading-snug">
                    {news.title}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {news.summary}
                  </p>
                  <div className="mt-2 text-[10px] font-extrabold text-[#6C5CE7] dark:text-indigo-300 flex items-center gap-1">
                    <span>Read Step-by-Step Guide</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: All Services Main Grid */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Header & Category Filters */}
          <div className="space-y-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                All Services
              </h2>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Choose from verified services to apply online or download official records
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#6C5CE7] text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid (2 Columns on medium) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <div 
                key={service.id}
                className="glass-card bg-white dark:bg-slate-900/95 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between items-center text-center relative pt-7 group hover:border-[#6C5CE7]"
              >
                {/* Category Badge Floating Top Center */}
                <span className={`absolute -top-3 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-xs ${service.categoryColor}`}>
                  {service.category}
                </span>

                <div className="w-full space-y-3 my-2">
                  {/* Service Mock Illustration Container */}
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 flex items-center justify-center text-[#6C5CE7] dark:text-indigo-300 group-hover:scale-105 transition-transform">
                    {service.iconType === 'aadhaar' && <CreditCard className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />}
                    {service.iconType === 'health' && <HeartPulse className="w-7 h-7 text-rose-600 dark:text-rose-400" />}
                    {service.iconType === 'citizen' && <UserCheck className="w-7 h-7 text-sky-600 dark:text-sky-400" />}
                    {service.iconType === 'farmer' && <Building2 className="w-7 h-7 text-amber-600 dark:text-amber-400" />}
                    {service.iconType === 'document' && <FileText className="w-7 h-7 text-purple-600 dark:text-purple-400" />}
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-[#6C5CE7] transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed px-1">
                    {service.description}
                  </p>
                </div>

                {/* Primary Action Button (Green Download / Apply) */}
                <button
                  onClick={() => handleSimulateApply(service)}
                  className="w-full mt-3 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  {service.actionText === 'Download' ? <Download className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{service.actionText}</span>
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Quick Links Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card bg-white dark:bg-slate-900/95 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
              <Zap className="w-4 h-4 text-amber-500" />
              <h2 className="font-extrabold text-slate-900 dark:text-white text-sm">
                Quick Links
              </h2>
            </div>

            <div className="space-y-2">
              {quickLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const found = servicesList.find((s) => s.id === link.targetId) || servicesList[0];
                    setActiveServiceModal(found);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-800 text-xs font-extrabold text-slate-800 dark:text-slate-200 hover:text-[#6C5CE7] dark:hover:text-[#4F9DFF] border border-slate-200/80 dark:border-slate-700/80 transition-colors flex items-center justify-between group"
                >
                  <span>{link.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6C5CE7] group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            {/* AI Assistant Help Prompt Box */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-50 dark:from-indigo-950/60 dark:to-slate-900 border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#6C5CE7] dark:text-indigo-300">
                <Bot className="w-4 h-4" />
                <span>Need Application Help?</span>
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Unsure which document to upload or need local center assistance?
              </p>
              <button
                onClick={() => setActivePage('chat')}
                className="w-full py-2 px-3 rounded-xl bg-[#6C5CE7] hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <span>Ask Yojana Mitra AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* SERVICE APPLICATION MODAL */}
      {activeServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setActiveServiceModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${activeServiceModal.categoryColor}`}>
                {activeServiceModal.category}
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white pt-1">
                {activeServiceModal.title}
              </h2>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {activeServiceModal.description}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6C5CE7]" />
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Processing Time</div>
                  <div>{activeServiceModal.processingTime}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Govt Fee</div>
                  <div>{activeServiceModal.fee}</div>
                </div>
              </div>
            </div>

            {/* Steps required */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#6C5CE7]" />
                <span>Process Steps</span>
              </h3>
              <ol className="space-y-1.5 pl-4 list-decimal text-xs font-semibold text-slate-700 dark:text-slate-300">
                {activeServiceModal.steps.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ol>
            </div>

            {/* Required Documents */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Documents Required
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {activeServiceModal.docsNeeded.map((doc, i) => (
                  <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">
                    ✓ {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <a 
                href={activeServiceModal.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
              >
                <span>Official Govt Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleConfirmAction}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Proceed with AI Help</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEWS / GUIDE MODAL */}
      {activeNewsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setActiveNewsModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-[#E8640A] dark:text-amber-400">
                {activeNewsModal.category} • {activeNewsModal.date}
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {activeNewsModal.title}
              </h2>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {activeNewsModal.summary}
              </p>
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Steps to Apply Online</span>
              </h3>
              <ol className="space-y-2 pl-4 list-decimal text-xs font-semibold text-slate-800 dark:text-slate-200">
                {activeNewsModal.stepsToApply.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            <button
              onClick={() => {
                setActiveNewsModal(null);
                setActivePage('chat');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#6C5CE7] hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Yojana Mitra AI to Help Fill This</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
