export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'bn'

export interface LanguageOption {
  code: SupportedLanguage
  label: string
  nativeName: string
  flag: string
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
]

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navigation
    diseaseMap: 'Disease Map',
    howItWorks: 'How It Works',
    safetyFeatures: 'Safety Features',
    rolePortals: 'Role Portals',
    openPortals: 'Open Portals',
    signIn: 'Sign in',

    // Map & Surveillance
    liveSurveillance: 'Live India Surveillance',
    mapTitle: 'Interactive State Disease Map',
    mapSubtitle: 'Real-time epidemiological heat map tracking disease transmission, vector hotspots, and waterborne outbreaks across Indian states.',
    riskFilter: 'Risk Filter:',
    all: 'All',
    highRisk: 'High Risk',
    mediumRisk: 'Medium Risk',
    lowRisk: 'Low Risk',
    clickState: 'Click or hover states for AI insights',
    exportReport: 'Export Report',
    downloadPdf: 'Download Epidemiological Report',

    // Assistant
    aiAssistant: 'AI Health Assistant',
    liveIntelligence: 'Live Intelligence',
    status: 'Outbreak Status',
    askQuestion: 'Ask AI assistant about outbreaks...',

    // Toast Alert
    alertTitle: '🚨 Real-Time Outbreak Alert Broadcast',
  },
  hi: {
    diseaseMap: 'रोग का नक्शा',
    howItWorks: 'यह कैसे काम करता है',
    safetyFeatures: 'सुरक्षा विशेषताएं',
    rolePortals: 'भूमिका पोर्टल',
    openPortals: 'पोर्टल खोलें',
    signIn: 'साइन इन करें',

    liveSurveillance: 'लाइव भारत स्वास्थ्य निगरानी',
    mapTitle: 'इंटरएक्टिव राज्य रोग मानचित्र',
    mapSubtitle: 'भारतीय राज्यों में बीमारी के संचरण, वैक्टर हॉटस्पॉट और जलजनित प्रकोप का वास्तविक समय का नक्शा।',
    riskFilter: 'जोखिम फ़िल्टर:',
    all: 'सभी',
    highRisk: 'उच्च जोखिम',
    mediumRisk: 'मध्यम जोखिम',
    lowRisk: 'कम जोखिम',
    clickState: 'एआई अंतर्दृष्टि के लिए राज्यों पर क्लिक करें या होवर करें',
    exportReport: 'रिपोर्ट निर्यात करें',
    downloadPdf: 'महामारी विज्ञान रिपोर्ट डाउनलोड करें',

    aiAssistant: 'एआई स्वास्थ्य सहायक',
    liveIntelligence: 'लाइव इंटेलिजेंस',
    status: 'प्रकोप स्थिति',
    askQuestion: 'प्रकोप के बारे में एआई से पूछें...',

    alertTitle: '🚨 वास्तविक समय प्रकोप चेतावनी प्रसारित',
  },
  ta: {
    diseaseMap: 'நோய் வரைபடம்',
    howItWorks: 'எப்படி இயங்குகிறது',
    safetyFeatures: 'பாதுகாப்பு அம்சங்கள்',
    rolePortals: 'பங்கு இணையதளங்கள்',
    openPortals: 'போர்ட்டலை திறக்கவும்',
    signIn: 'உள்நுழைக',

    liveSurveillance: 'நேரலை இந்திய சுகாதார கண்காணிப்பு',
    mapTitle: 'இன்டராக்டிவ் மாநில நோய் வரைபடம்',
    mapSubtitle: 'இந்திய மாநிலங்களில் நோய் பரவல் மற்றும் வெடிப்புகளை நிகழ்நேரத்தில் கண்காணிக்கும் வரைபடம்.',
    riskFilter: 'ஆபத்து வடிப்பான்:',
    all: 'அனைத்தும்',
    highRisk: 'அதிக ஆபத்து',
    mediumRisk: 'மிதமான ஆபத்து',
    lowRisk: 'குறைந்த ஆபத்து',
    clickState: 'AI தகவல்களுக்கு மாநிலத்தை கிளிக் செய்யவும்',
    exportReport: 'அறிக்கையை ஏற்றுமதி செய்',
    downloadPdf: 'தொற்றுநோயியல் அறிக்கையைப் பதிவிறக்கவும்',

    aiAssistant: 'AI சுகாதார உதவியாளர்',
    liveIntelligence: 'நேரலை நுண்ணறிவு',
    status: 'நோய் நிலை',
    askQuestion: 'AI உதவியாளரிடம் கேட்கவும்...',

    alertTitle: '🚨 நேரலை நோய் பரவல் எச்சரிக்கை',
  },
  bn: {
    diseaseMap: 'রোগের মানচিত্র',
    howItWorks: 'কীভাবে কাজ করে',
    safetyFeatures: 'নিরাপত্তা বৈশিষ্ট্য',
    rolePortals: 'ভূমিকা পোর্টাল',
    openPortals: 'পোর্টাল খুলুন',
    signIn: 'সাইন ইন করুন',

    liveSurveillance: 'লাইভ ভারত স্বাস্থ্য নজরদারি',
    mapTitle: 'ইন্টারেক্টিভ রাজ্য রোগ মানচিত্র',
    mapSubtitle: 'ভারতীয় রাজ্যগুলিতে রিয়েল-টাইম মহামারী সংক্রান্ত মানচিত্র এবং রোগ প্রাদুর্ভাব ট্র্যাকিং।',
    riskFilter: 'ঝুঁকি ফিল্টার:',
    all: 'সব',
    highRisk: 'উচ্চ ঝুঁকি',
    mediumRisk: 'মাঝারি ঝুঁকি',
    lowRisk: 'কম ঝুঁকি',
    clickState: 'AI ইনসাইটের জন্য রাজ্যে ক্লিক করুন',
    exportReport: 'রিপোর্ট এক্সপোর্ট করুন',
    downloadPdf: 'মহামারী সংক্রান্ত রিপোর্ট ডাউনলোড করুন',

    aiAssistant: 'AI স্বাস্থ্য সহকারী',
    liveIntelligence: 'লাইভ ইনটেলিজেন্স',
    status: 'প্রাদুর্ভাব অবস্থা',
    askQuestion: 'AI সহকারীকে প্রশ্ন করুন...',

    alertTitle: '🚨 রিয়েল-টাইম প্রাদুর্ভাব সতর্কতা সম্প্রচার',
  },
}
