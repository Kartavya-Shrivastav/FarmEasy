import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';


const Modal = ({ isOpen, onClose, title, children }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);


  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };


    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);


  if (!isOpen) return null;


  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>


      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        ></div>


        {/* Modal */}
        <div 
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 border border-[#E5DED3]"
          style={{ animation: 'slideUp 0.3s ease-out' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5DED3]">
            <h3 className="text-2xl font-bold text-[#2D2D2D]">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F2ED] text-[#6B6B6B] hover:text-[#ea7f61] transition-all"
              aria-label={t('common.closeModal')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>


          {/* Content */}
          <div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};


export default Modal;
