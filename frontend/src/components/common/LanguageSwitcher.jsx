import { useTranslation } from 'react-i18next';
import { ChevronDown, Check } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  ];

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="relative group">
        {/* Trigger Button */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/80 transition-all border border-transparent hover:border-[#E5DED3]">
          <span className="text-xl">{currentLanguage.flag}</span>
          <span className="text-sm font-bold text-[#2D2D2D] hidden md:block">
            {currentLanguage.label}
          </span>
          <ChevronDown className="w-4 h-4 text-[#6B6B6B] group-hover:text-[#ea7f61] transition-colors" />
        </button>
        
        {/* Dropdown Menu */}
        <div 
          className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-[#E5DED3] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
          style={{
            animation: 'slideDown 0.2s ease-out'
          }}
        >
          {languages.map((lang, index) => {
            const isActive = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 transition-all ${
                  index === 0 ? 'rounded-t-xl' : ''
                } ${
                  index === languages.length - 1 ? 'rounded-b-xl' : ''
                } ${
                  isActive
                    ? 'bg-[#ea7f61]/10 text-[#ea7f61]'
                    : 'hover:bg-[#F5F2ED] text-[#2D2D2D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <span className={`text-sm font-bold ${isActive ? 'text-[#ea7f61]' : 'text-[#2D2D2D]'}`}>
                    {lang.label}
                  </span>
                </div>
                {isActive && (
                  <Check className="w-4 h-4 text-[#ea7f61]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LanguageSwitcher;
