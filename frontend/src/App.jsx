import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { setUser } from './features/auth/authSlice';
import Layout from './components/layout/Layout';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import VerifyEmailPage from './features/auth/VerifyEmailPage';
import MarketplacePage from './features/auctions/MarketplacePage';
import AuctionDetailPage from './features/auctions/AuctionDetailPage';
import api from './services/api';

import CreateAuctionPage from './features/auctions/CreateAuctionPage';
import MyAuctionsPage from './features/auctions/MyAuctionsPage';

const HomePage = () => (
  <div className="container mx-auto px-4 py-12 text-center">
    <h1 className="text-5xl font-bold mb-4">Welcome to FarmEasy 🌾</h1>
    <p className="text-xl text-gray-600 mb-8">Empowering farmers with better prices</p>
    <a href="/marketplace" className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-block text-lg">
      Browse Marketplace
    </a>

  </div>
);

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      console.log('Token exists:', !!token);
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          console.log('Fetched user data:', data);
          if (data.success) {
            dispatch(setUser(data.user));
            console.log('User set in Redux:', data.user);
          }
        } catch (error) {
          console.error('Auth check error:', error);
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
          <Route path="auctions/:id" element={<AuctionDetailPage />} />
          <Route path="create-auction" element={<CreateAuctionPage />} />
          <Route path="my-auctions" element={<MyAuctionsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
