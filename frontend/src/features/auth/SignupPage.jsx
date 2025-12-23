import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';
import { Mail, Lock, User, Phone, ArrowRight, UserCheck, ShoppingCart } from 'lucide-react';
import kisanImage1 from '../../assets/kissan1.png';

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'buyer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setIsVisible(true);
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');


    try {
      const { data } = await api.post('/auth/signup', formData, {
        skipAuthRefresh: true
      });

      
      if (data.success) {
        showSuccess(t('auth.signupSuccessMessage'));
        navigate('/login');
      }


    } catch (err) {
      const errorMsg = err.response?.data?.message || t('auth.signupError');
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
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
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>


      <div className="min-h-[calc(100vh-4rem)] flex bg-[#F5F2ED]">
        {/* Left Side - Image/Info */}
        <div 
          className={`hidden lg:flex lg:w-1/2 p-12 items-center justify-center relative overflow-hidden ${isVisible ? 'opacity-0' : 'opacity-0'}`}
          style={isVisible ? {
            animation: 'fadeIn 0.8s ease-out forwards'
          } : {}}
        >
          {/* Background Image with Blur */}
          <div className="absolute inset-0">
            <img
              src={kisanImage1}
              alt="Farmer background"
              className="w-full h-full object-cover filter blur-sm"
            />
            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/60 to-black/70"></div>
          </div>


          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          </div>


          <div className="relative z-10 text-white max-w-md">
            <div className="mb-8">
              <span className="text-6xl mb-6 block drop-shadow-lg">🌾</span>
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
                {t('auth.joinTitle')}
              </h1>
              <p className="text-lg text-white/95 drop-shadow-md">
                {t('auth.joinSubtitle')}
              </p>
            </div>


            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 backdrop-blur-sm bg-white/10 rounded-lg p-3">
                <div className="w-10 h-10 rounded-full bg-[#ea7f61] flex items-center justify-center shrink-0">
                  <span className="text-2xl">🚜</span>
                </div>
                <p className="text-white drop-shadow-md">{t('auth.featureListProduce')}</p>
              </div>
              <div className="flex items-center gap-3 backdrop-blur-sm bg-white/10 rounded-lg p-3">
                <div className="w-10 h-10 rounded-full bg-[#ea7f61] flex items-center justify-center shrink-0">
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-white drop-shadow-md">{t('auth.featureGetBids')}</p>
              </div>
              <div className="flex items-center gap-3 backdrop-blur-sm bg-white/10 rounded-lg p-3">
                <div className="w-10 h-10 rounded-full bg-[#ea7f61] flex items-center justify-center shrink-0">
                  <span className="text-2xl">🤝</span>
                </div>
                <p className="text-white drop-shadow-md">{t('auth.featureConnectVerified')}</p>
              </div>
            </div>
          </div>
        </div>


        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div 
            className={`w-full max-w-md ${isVisible ? 'opacity-0 translate-y-4' : 'opacity-0'}`}
            style={isVisible ? {
              animation: 'slideUp 0.8s ease-out 0.2s forwards'
            } : {}}
          >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <span className="text-5xl">🌾</span>
              <h2 className="text-2xl font-bold text-[#2D2D2D] mt-2">FarmEasy</h2>
            </div>


            <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E5DED3]">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#2D2D2D] mb-2">
                  {t('auth.signupTitle')}
                </h2>
                <p className="text-[#6B6B6B]">
                  {t('auth.signupSubtitle')}
                </p>
              </div>


              {error && (
                <div 
                  className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6"
                  style={{
                    animation: 'slideInRight 0.3s ease-out'
                  }}
                >
                  <p className="font-medium">{t('common.error')}</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}


              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                    {t('auth.name')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={t('auth.namePlaceholder')}
                      className="w-full pl-11 pr-4 py-3 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all"
                    />
                  </div>
                </div>


                {/* Email Input */}
                <div>
                  <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={t('auth.emailPlaceholder')}
                      className="w-full pl-11 pr-4 py-3 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all"
                    />
                  </div>
                </div>


                {/* Password Input */}
                <div>
                  <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      placeholder={t('auth.passwordPlaceholderSignup')}
                      className="w-full pl-11 pr-4 py-3 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all"
                    />
                  </div>
                </div>


                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                    {t('auth.phone')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('auth.phonePlaceholder')}
                      className="w-full pl-11 pr-4 py-3 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all"
                    />
                  </div>
                </div>


                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-bold text-[#2D2D2D] mb-3">
                    {t('auth.role')}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.role === 'farmer' 
                        ? 'border-[#ea7f61] bg-[#ea7f61]/5' 
                        : 'border-[#E5DED3] hover:border-[#ea7f61]/50'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        value="farmer"
                        checked={formData.role === 'farmer'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <UserCheck className={`w-8 h-8 mb-2 ${
                        formData.role === 'farmer' ? 'text-[#ea7f61]' : 'text-[#6B6B6B]'
                      }`} />
                      <span className={`text-sm font-bold ${
                        formData.role === 'farmer' ? 'text-[#ea7f61]' : 'text-[#2D2D2D]'
                      }`}>
                        {t('auth.farmer')}
                      </span>
                      <span className="text-xs text-[#6B6B6B] mt-1">{t('auth.sellProduce')}</span>
                    </label>


                    <label className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.role === 'buyer' 
                        ? 'border-[#ea7f61] bg-[#ea7f61]/5' 
                        : 'border-[#E5DED3] hover:border-[#ea7f61]/50'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        value="buyer"
                        checked={formData.role === 'buyer'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <ShoppingCart className={`w-8 h-8 mb-2 ${
                        formData.role === 'buyer' ? 'text-[#ea7f61]' : 'text-[#6B6B6B]'
                      }`} />
                      <span className={`text-sm font-bold ${
                        formData.role === 'buyer' ? 'text-[#ea7f61]' : 'text-[#2D2D2D]'
                      }`}>
                        {t('auth.buyer')}
                      </span>
                      <span className="text-xs text-[#6B6B6B] mt-1">{t('auth.buyProduce')}</span>
                    </label>
                  </div>
                </div>


                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      {t('auth.signupButton')}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>


              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5DED3]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-[#6B6B6B]">{t('common.or')}</span>
                </div>
              </div>


              {/* Login Link */}
              <p className="text-center text-[#6B6B6B]">
                {t('auth.haveAccount')}{' '}
                <Link to="/login" className="text-[#ea7f61] hover:text-[#d85f3f] font-bold">
                  {t('auth.loginLink')}
                </Link>
              </p>
            </div>


            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link to="/" className="text-sm text-[#6B6B6B] hover:text-[#2D2D2D] flex items-center justify-center gap-2">
                <span>←</span> {t('common.backToHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default SignupPage;
