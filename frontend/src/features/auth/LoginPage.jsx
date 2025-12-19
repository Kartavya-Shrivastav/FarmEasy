import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/hooks';
import { setUser } from './authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', formData);
      
      if (data.success) {
        localStorage.setItem('accessToken', data.accessToken);
        dispatch(setUser(data.user));
        showSuccess(`Welcome back, ${data.user.name}!`);
        navigate('/marketplace');
      }

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Signup failed';
      setError(errorMsg);
      showError(errorMsg);
    }

  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="card">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            {t('auth.loginTitle')}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label={t('auth.email')}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="farmer@example.com"
            />

            <Input
              label={t('auth.password')}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? <LoadingSpinner size="sm" /> : t('auth.loginButton')}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            {t('auth.noAccount')}{' '}
            <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              {t('auth.signupButton')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
