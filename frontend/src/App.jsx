import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { setUser } from './features/auth/authSlice';
import Layout from './components/layout/Layout';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import VerifyEmailPage from './features/auth/VerifyEmailPage';
import api from './services/api';

// Placeholder pages (we'll build these next)
const HomePage = () => <div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Welcome to FarmEasy</h1></div>;
const MarketplacePage = () => <div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Marketplace</h1></div>;

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          if (data.success) {
            dispatch(setUser(data.user));
          }
        } catch (error) {
          localStorage.removeItem('accessToken');
        }
      }
    };
    checkAuth();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={isAuthenticated ? <Navigate to="/marketplace" /> : <LoginPage />} />
          <Route path="signup" element={isAuthenticated ? <Navigate to="/marketplace" /> : <SignupPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
