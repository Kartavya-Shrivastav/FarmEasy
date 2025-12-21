import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { CheckCircle, XCircle, Mail, ArrowRight } from 'lucide-react';


const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  
  // Prevent double execution in React StrictMode
  const hasVerified = useRef(false);


  useEffect(() => {
    setIsVisible(true);
    // Only verify once
    if (!hasVerified.current) {
      hasVerified.current = true;
      verifyEmail();
    }
  }, []);


  const verifyEmail = async () => {
    const token = searchParams.get('token');


    if (!token) {
      setStatus('error');
      setMessage(t('verifyEmail.noToken'));
      return;
    }


    try {
      console.log('Verifying token:', token);


      const { data } = await api.get(`/auth/verify-email?token=${token}`);
      
      console.log('Verification response:', data);


      if (data.success) {
        setStatus('success');
        setMessage(data.message || t('verifyEmail.successMessage'));
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || t('verifyEmail.errorMessage'));
      }
    } catch (error) {
      console.error('Verification error:', error);
      console.error('Error response:', error.response?.data);
      
      // Check if error is because token was already used
      const errorMsg = error.response?.data?.message || '';
      
      if (errorMsg.includes('Invalid or expired token')) {
        setStatus('error');
        setMessage(t('verifyEmail.tokenExpired'));
      } else {
        setStatus('error');
        setMessage(errorMsg || t('verifyEmail.errorMessage'));
      }
    }
  };


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
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>


      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F5F2ED] px-4 py-12">
        <div 
          className={`max-w-md w-full ${isVisible ? 'opacity-0 translate-y-4' : 'opacity-0'}`}
          style={isVisible ? {
            animation: 'slideUp 0.6s ease-out 0.2s forwards'
          } : {}}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-5xl">🌾</span>
            <h2 className="text-2xl font-bold text-[#2D2D2D] mt-2">FarmEasy</h2>
          </div>


          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E5DED3]">
            {/* Verifying State */}
            {status === 'verifying' && (
              <div 
                className="text-center"
                style={{
                  animation: 'fadeIn 0.6s ease-out'
                }}
              >
                <div className="w-20 h-20 mx-auto mb-6 relative">
                  <div className="w-20 h-20 rounded-full border-4 border-[#E5DED3] border-t-[#ea7f61]" 
                    style={{
                      animation: 'spin 1s linear infinite'
                    }}
                  />
                  <Mail className="w-8 h-8 text-[#ea7f61] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h2 className="text-2xl font-bold text-[#2D2D2D] mb-3">
                  {t('verifyEmail.verifying')}
                </h2>
                <p className="text-[#6B6B6B]">
                  {t('verifyEmail.verifyingMessage')}
                </p>
                <div className="mt-6 flex justify-center gap-1">
                  <div className="w-2 h-2 bg-[#ea7f61] rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="w-2 h-2 bg-[#ea7f61] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-[#ea7f61] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}


            {/* Success State */}
            {status === 'success' && (
              <div 
                className="text-center"
                style={{
                  animation: 'scaleIn 0.6s ease-out'
                }}
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-3">
                  {t('verifyEmail.success')}
                </h2>
                <p className="text-[#6B6B6B] mb-6">{message}</p>
                
                {/* Success Animation */}
                <div className="mb-6">
                  <div className="w-full bg-[#E5DED3] rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        animation: 'slideRight 3s ease-out forwards',
                        width: '0%'
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-[#6B6B6B] mt-2">
                    {t('verifyEmail.redirecting')}
                  </p>
                </div>


                <Link 
                  to="/login"
                  className="inline-flex items-center gap-2 bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {t('verifyEmail.goToLogin')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}


            {/* Error State */}
            {status === 'error' && (
              <div 
                className="text-center"
                style={{
                  animation: 'scaleIn 0.6s ease-out'
                }}
              >
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-3">
                  {t('verifyEmail.failed')}
                </h2>
                <p className="text-[#6B6B6B] mb-8">{message}</p>
                
                <div className="space-y-3">
                  <Link to="/login" className="block">
                    <button className="w-full bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                      {t('verifyEmail.tryLogin')}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                  <Link to="/signup" className="block">
                    <button className="w-full bg-white hover:bg-[#F5F2ED] text-[#2D2D2D] font-bold py-3 px-6 rounded-xl border-2 border-[#E5DED3] transition-all duration-200">
                      {t('verifyEmail.backToSignup')}
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>


          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-[#6B6B6B] hover:text-[#2D2D2D] flex items-center justify-center gap-2">
              <span>←</span> {t('common.backToHome')}
            </Link>
          </div>
        </div>
      </div>


      <style>{`
        @keyframes slideRight {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </>
  );
};


export default VerifyEmailPage;
