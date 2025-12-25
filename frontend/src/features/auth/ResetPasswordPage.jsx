import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';
import { Lock } from 'lucide-react';

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError(t('auth.invalidResetToken'));
    }
  }, [token, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    if (!password || password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }
    if (password !== confirm) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    setStatus('submitting');
    setError('');

    try {
      const { data } = await api.post(
        `/auth/reset-password?token=${token}`,
        { password },
        { skipAuthRefresh: true }
      );

      showSuccess(data.message || t('auth.resetPasswordSuccess'));
      setStatus('success');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message || t('auth.resetPasswordError');
      showError(msg);
      setError(msg);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F5F2ED] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E5DED3]">
          <h1 className="text-2xl font-bold text-[#2D2D2D] mb-2">
            {t('auth.resetPasswordTitle')}
          </h1>
          <p className="text-[#6B6B6B] mb-6">
            {t('auth.resetPasswordSubtitle')}
          </p>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                {t('auth.newPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting' || !token}
              className="w-full bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting'
                ? t('auth.resetting')
                : t('auth.resetPasswordButton')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-[#6B6B6B] hover:text-[#2D2D2D]"
            >
              ← {t('auth.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
