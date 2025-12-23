// LanguageSwitcher.jsx

import { useTranslation } from 'react-i18next';
import { ChevronDown, Check } from 'lucide-react';

const LanguageSwitcher = ({ isTransparent = false }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  ];

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  // Dynamic styles based on transparent state
  const buttonBg = isTransparent ? 'hover:bg-white/20' : 'hover:bg-white/80';
  const buttonBorder = isTransparent ? 'hover:border-white/30' : 'hover:border-[#E5DED3]';
  const textColor = isTransparent ? 'text-white' : 'text-[#2D2D2D]';
  const iconColor = isTransparent ? 'text-white/80 group-hover:text-white' : 'text-[#6B6B6B] group-hover:text-[#ea7f61]';

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
        <button className={`flex items-center gap-2 px-3 py-2 rounded-xl ${buttonBg} transition-all duration-300 border border-transparent ${buttonBorder}`}>
          <span
            className={`text-md font-bold transition-colors duration-300
              ${isTransparent ? 'text-white' : 'text-[#2D2D2D]'}
            `}
          >
            {currentLanguage.flag}
          </span>


          <span className={`text-sm font-bold ${textColor} hidden md:block transition-colors duration-300`}>
            {currentLanguage.label}
          </span>
          <ChevronDown className={`w-4 h-4 ${iconColor} transition-colors duration-300`} />
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
                  <span className="text-sm font-bold text-[#2D2D2D]"> {lang.flag} </span>

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