import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { clearUser } from '../../features/auth/authSlice';
import LanguageSwitcher from '../common/LanguageSwitcher';
import api from '../../services/api';



const Navbar = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);



  useEffect(() => {
    setIsVisible(true);
  }, []);



  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('accessToken');
      dispatch(clearUser());
      navigate('/');
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };



  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };



  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInMobile {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
        }
      `}</style>



      <nav 
        className={`bg-linear-to-r from-[#F5F2ED] via-[#F5F2ED] to-[#F5F2ED] border-b border-[#ea7f61]/30 sticky top-0 z-50 shadow-md backdrop-blur-sm ${isVisible ? 'opacity-0' : 'opacity-0'}`}
        style={isVisible ? {
          animation: 'slideDown 0.6s ease-out forwards'
        } : {}}
      >
        <div className="container mx-auto px-4">
          <div className="relative flex items-center h-16">

            {/* Logo */}
            <Link 
              to="/" 
              className={`flex items-center gap-2 ${isVisible ? 'opacity-0' : 'opacity-0'}`}
              onClick={closeMobileMenu}
              style={isVisible ? {
                animation: 'fadeIn 0.6s ease-out 0.2s forwards'
              } : {}}
            >
              <span className="text-2xl">🌾</span>
              <span className="text-xl font-bold text-[#ea7f61]">FarmEasy</span>
            </Link>



            {/* Desktop Nav Links */}
            <div className=" hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
              <Link 
                to="/marketplace" 
                className={`text-[#1a1a1a] hover:text-[#ea7f61] font-bold transition-colors ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                style={isVisible ? {
                  animation: 'fadeIn 0.6s ease-out 0.3s forwards'
                } : {}}
              >
                {t('nav.marketplace')}
              </Link>
              
              {isAuthenticated && (
                <>
                  {/* ✅ FIXED: Hide My Profile for admin */}
                  {user?.role !== 'admin' && (
                    <Link 
                      to="/profile" 
                      className={`text-[#1a1a1a] hover:text-[#ea7f61] font-bold transition-colors ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                      style={isVisible ? {
                        animation: 'fadeIn 0.6s ease-out 0.4s forwards'
                      } : {}}
                    >
                      {t('nav.myProfile')}
                    </Link>
                  )}
                  
                  {user?.role === 'farmer' && (
                    <Link 
                      to="/my-auctions" 
                      className={`text-[#1a1a1a] hover:text-[#ea7f61] font-bold transition-colors ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                      style={isVisible ? {
                        animation: 'fadeIn 0.6s ease-out 0.5s forwards'
                      } : {}}
                    >
                      {t('nav.myAuctions')}
                    </Link>
                  )}
                  
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className={`text-[#1a1a1a] hover:text-[#ea7f61] font-bold transition-colors ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                      style={isVisible ? {
                        animation: 'fadeIn 0.6s ease-out 0.5s forwards'
                      } : {}}
                    >
                      {t('nav.admin')}
                    </Link>
                  )}
                </>
              )}
            </div>



            {/* Desktop Right Side */}
            <div className="ml-auto hidden md:flex items-center gap-4">

              <div className="hidden md:flex items-center gap-4">
                <div 
                  className={`${isVisible ? 'opacity-0' : 'opacity-0'}`}
                  style={isVisible ? {
                    animation: 'fadeIn 0.6s ease-out 0.4s forwards'
                  } : {}}
                >
                  <LanguageSwitcher />
                </div>
                
                {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    <span 
                      className={`text-sm text-[#3a3a3a] font-bold ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                      style={isVisible ? {
                        animation: 'fadeIn 0.6s ease-out 0.5s forwards'
                      } : {}}
                    >
                      {user?.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className={`bg-white hover:bg-[#ea7f61] text-[#1a1a1a] hover:text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 border-2 border-[#ea7f61] shadow-sm ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                      style={isVisible ? {
                        animation: 'fadeIn 0.6s ease-out 0.6s forwards'
                      } : {}}
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link 
                      to="/login" 
                      className={`bg-white hover:bg-[#ea7f61] text-[#1a1a1a] hover:text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 border-2 border-[#ea7f61] shadow-sm ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                      style={isVisible ? {
                        animation: 'fadeIn 0.6s ease-out 0.5s forwards'
                      } : {}}
                    >
                      {t('nav.login')}
                    </Link>
                    <Link 
                      to="/signup" 
                      className={`bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 shadow-md ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                      style={isVisible ? {
                        animation: 'fadeIn 0.6s ease-out 0.6s forwards'
                      } : {}}
                    >
                      {t('nav.signup')}
                    </Link>
                  </div>
                )}
              </div>
            </div>


            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden text-[#1a1a1a] hover:text-[#ea7f61] focus:outline-none ${isVisible ? 'opacity-0' : 'opacity-0'}`}
              style={isVisible ? {
                animation: 'fadeIn 0.6s ease-out 0.3s forwards'
              } : {}}
              aria-label={t('nav.toggleMenu')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>



          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div 
              className="md:hidden border-t border-[#ea7f61]/30 py-4 bg-white/80 backdrop-blur-md rounded-b-xl shadow-lg overflow-hidden"
              style={{
                animation: 'slideInMobile 0.3s ease-out forwards'
              }}
            >
              <div className="flex flex-col space-y-3">
                <Link
                  to="/marketplace"
                  onClick={closeMobileMenu}
                  className="text-[#1a1a1a] hover:text-[#ea7f61] font-bold py-2 px-4 hover:bg-white rounded-xl transition-colors"
                >
                  {t('nav.marketplace')}
                </Link>
                
                {isAuthenticated && (
                  <>
                    {/* ✅ FIXED: Hide My Profile for admin */}
                    {user?.role !== 'admin' && (
                      <Link
                        to="/profile"
                        onClick={closeMobileMenu}
                        className="text-[#1a1a1a] hover:text-[#ea7f61] font-bold py-2 px-4 hover:bg-white rounded-xl transition-colors"
                      >
                        {t('nav.myProfile')}
                      </Link>
                    )}
                    
                    {user?.role === 'farmer' && (
                      <Link
                        to="/my-auctions"
                        onClick={closeMobileMenu}
                        className="text-[#1a1a1a] hover:text-[#ea7f61] font-bold py-2 px-4 hover:bg-white rounded-xl transition-colors"
                      >
                        {t('nav.myAuctions')}
                      </Link>
                    )}
                    
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={closeMobileMenu}
                        className="text-[#1a1a1a] hover:text-[#ea7f61] font-bold py-2 px-4 hover:bg-white rounded-xl transition-colors"
                      >
                        {t('nav.admin')}
                      </Link>
                    )}
                  </>
                )}



                <div className="border-t border-[#ea7f61]/30 pt-3 px-4">
                  <LanguageSwitcher />
                </div>



                {isAuthenticated ? (
                  <div className="border-t border-[#ea7f61]/30 pt-3 px-4 space-y-2">
                    <p className="text-sm text-[#3a3a3a] font-bold">{t('nav.loggedInAs', { name: user?.name })}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-white hover:bg-[#ea7f61] text-[#1a1a1a] hover:text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 border-2 border-[#ea7f61]"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-[#ea7f61]/30 pt-3 px-4 flex flex-col gap-2">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="text-center bg-white hover:bg-[#ea7f61] text-[#1a1a1a] hover:text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 border-2 border-[#ea7f61]"
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMobileMenu}
                      className="text-center bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 shadow-md"
                    >
                      {t('nav.signup')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};



export default Navbar;
