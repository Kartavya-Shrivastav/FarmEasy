import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';
import { Mail, ArrowRight } from 'lucide-react';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | sent

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const { data } = await api.post(
        '/auth/forgot-password',
        { email },
        { skipAuthRefresh: true }
      );

      showSuccess(
        data.message || t('auth.resetEmailSentToast')
      );
      setStatus('sent');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        t('auth.resetEmailError');
      showError(msg);
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F5F2ED] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E5DED3]">
          <h1 className="text-2xl font-bold text-[#2D2D2D] mb-2">
            {t('auth.forgotPasswordTitle')}
          </h1>
          <p className="text-[#6B6B6B] mb-6">
            {t('auth.forgotPasswordSubtitle')}
          </p>

          {status === 'sent' && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6">
              <p className="font-medium">
                {t('auth.resetEmailSent')}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('auth.emailPlaceholder')}
                  className="w-full pl-11 pr-4 py-3 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || !email}
              className="w-full bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <span>{t('auth.sending')}</span>
              ) : (
                <>
                  {t('auth.sendResetLink')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
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

export default ForgotPasswordPage;
