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

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('accessToken');
      dispatch(clearUser());
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="text-xl font-bold text-primary-600">FarmEasy</span>
          </Link>

          {/* Nav Links */}
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

          {/* Right side */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden md:block">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;