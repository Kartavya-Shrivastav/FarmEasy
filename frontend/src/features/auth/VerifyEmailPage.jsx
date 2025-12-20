import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  
  // Prevent double execution in React StrictMode
  const hasVerified = useRef(false);

  useEffect(() => {
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
      setMessage('No verification token provided');
      return;
    }

    try {
      console.log('Verifying token:', token);

      const { data } = await api.get(`/auth/verify-email?token=${token}`);
      
      console.log('Verification response:', data);

      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      console.error('Error response:', error.response?.data);
      
      // Check if error is because token was already used
      const errorMsg = error.response?.data?.message || '';
      
      if (errorMsg.includes('Invalid or expired token')) {
        setStatus('error');
        setMessage('This verification link has already been used or has expired. If you already verified, please try logging in.');
      } else {
        setStatus('error');
        setMessage(errorMsg || 'Verification failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          {status === 'verifying' && (
            <>
              <LoadingSpinner size="lg" />
              <h2 className="text-2xl font-bold mt-4 mb-2">Verifying Email</h2>
              <p className="text-gray-600">Please wait while we verify your email...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
              <Link 
                to="/login" 
                className="text-primary-600 hover:text-primary-700 font-medium mt-4 inline-block"
              >
                Click here if not redirected automatically
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">❌</span>
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Link to="/login">
                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Try Logging In
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors">
                    Back to Signup
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
