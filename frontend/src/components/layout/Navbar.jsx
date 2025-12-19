import { useState } from 'react';
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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <span className="text-2xl">🌾</span>
            <span className="text-xl font-bold text-primary-600">FarmEasy</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              {t('nav.marketplace')}
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  {t('nav.myProfile')}
                </Link>
                
                {user?.role === 'farmer' && (
                  <Link to="/my-auctions" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    My Auctions
                  </Link>
                )}
                
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    {t('nav.admin')}
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                  {t('nav.login')}
                </Link>
                <Link to="/signup" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-primary-600 focus:outline-none"
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
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/marketplace"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-primary-600 font-medium py-2 px-4 hover:bg-gray-50 rounded transition-colors"
              >
                {t('nav.marketplace')}
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="text-gray-700 hover:text-primary-600 font-medium py-2 px-4 hover:bg-gray-50 rounded transition-colors"
                  >
                    {t('nav.myProfile')}
                  </Link>
                  
                  {user?.role === 'farmer' && (
                    <Link
                      to="/my-auctions"
                      onClick={closeMobileMenu}
                      className="text-gray-700 hover:text-primary-600 font-medium py-2 px-4 hover:bg-gray-50 rounded transition-colors"
                    >
                      My Auctions
                    </Link>
                  )}
                  
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className="text-gray-700 hover:text-primary-600 font-medium py-2 px-4 hover:bg-gray-50 rounded transition-colors"
                    >
                      {t('nav.admin')}
                    </Link>
                  )}
                </>
              )}

              <div className="border-t pt-3 px-4">
                <LanguageSwitcher />
              </div>

              {isAuthenticated ? (
                <div className="border-t pt-3 px-4 space-y-2">
                  <p className="text-sm text-gray-600">Logged in as: {user?.name}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="border-t pt-3 px-4 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="text-center bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMobileMenu}
                    className="text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
  );
};

export default Navbar;