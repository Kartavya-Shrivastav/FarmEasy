import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { setUser } from './features/auth/authSlice';
import Layout from './components/layout/Layout';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import VerifyEmailPage from './features/auth/VerifyEmailPage';
import MarketplacePage from './features/auctions/MarketplacePage';
import AuctionDetailPage from './features/auctions/AuctionDetailPage';
import api from './services/api';
import ProfilePage from './features/profile/ProfilePage';
import AdminDashboard from './features/admin/AdminDashboard';
import CreateAuctionPage from './features/auctions/CreateAuctionPage';
import MyAuctionsPage from './features/auctions/MyAuctionsPage';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  TrendingUp, 
  Shield, 
  Users, 
  Gavel, 
  Star,
  CheckCircle2,
  Truck,
  BadgeCheck
} from 'lucide-react';

// REDESIGNED HOMEPAGE COMPONENT
const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  // Refs for scroll animation
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Visibility states
  const [statsVisible, setStatsVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [stepsVisible, setStepsVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  // Intersection Observer setup
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === statsRef.current) setStatsVisible(true);
          if (entry.target === featuresRef.current) setFeaturesVisible(true);
          if (entry.target === stepsRef.current) setStepsVisible(true);
          if (entry.target === ctaRef.current) setCtaVisible(true);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (statsRef.current) observer.observe(statsRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (stepsRef.current) observer.observe(stepsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: "Better Prices",
      description: "Farmers get fair market value through competitive bidding from multiple buyers.",
    },
    {
      icon: Shield,
      title: "Verified Quality",
      description: "Admin-approved listings ensure authenticity and quality of all products.",
    },
    {
      icon: Users,
      title: "Direct Connection",
      description: "Eliminating middlemen to connect farmers directly with buyers.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "List Your Produce",
      description: "Farmers upload product details, photos, and set minimum prices.",
      icon: BadgeCheck,
    },
    {
      number: "02",
      title: "Admin Approval",
      description: "Our team verifies listings and sets auction duration based on freshness.",
      icon: CheckCircle2,
    },
    {
      number: "03",
      title: "Buyers Bid",
      description: "Registered buyers compete with bids, driving fair market prices.",
      icon: Gavel,
    },
    {
      number: "04",
      title: "Seal the Deal",
      description: "Farmers lock in when satisfied, buyer gets connected for delivery.",
      icon: Truck,
    },
  ];

  const stats = [
    { value: "5,000+", label: "Active Farmers" },
    { value: "₹2.5Cr+", label: "Total Trade Value" },
    { value: "15,000+", label: "Successful Deals" },
    { value: "4.8", label: "Average Rating", icon: Star },
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === 'farmer') {
        navigate('/create-auction');
      } else {
        navigate('/marketplace');
      }
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED]">
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
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">

        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 overflow-hidden opacity-0"
          style={{
            animation: 'fadeIn 1s ease-in forwards'
          }}
        >
          <img
            src="src/assets/kissan1.jpg"
            alt="Indian farmer with fresh vegetables"
            className="w-full h-full object-cover scale-105 filter blur-[3px]"
          />

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-r 
            from-black/65 via-black/40 to-transparent"
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="space-y-8">

              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 
                bg-[#7FB8A5]/90 backdrop-blur-sm 
                rounded-full text-[#0F2A24] text-sm font-semibold shadow-lg
                opacity-0 translate-y-4"
                style={{
                  animation: 'slideUp 0.6s ease-out 0.2s forwards'
                }}
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Empowering Indian Agriculture
              </div>

              {/* Heading */}
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight 
                text-[#F9FAF7] tracking-tight 
                drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]
                opacity-0 translate-y-4"
                style={{
                  animation: 'slideUp 0.6s ease-out 0.4s forwards'
                }}
              >
                Sell Your Harvest at the{" "}
                <span className="text-[#F4A261]">
                  Best Prices
                </span>
              </h1>

              {/* Description */}
              <p
                className="text-lg md:text-xl text-[#E6E7E3] max-w-2xl 
                leading-relaxed 
                drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]
                opacity-0 translate-y-4"
                style={{
                  animation: 'slideUp 0.6s ease-out 0.6s forwards'
                }}
              >
                FarmEasy connects farmers directly with buyers through a transparent
                bidding system. No middlemen, fair prices, verified quality.
              </p>

              {/* Buttons */}
              <div 
                className="flex flex-wrap gap-4 opacity-0 translate-y-4"
                style={{
                  animation: 'slideUp 0.6s ease-out 0.8s forwards'
                }}
              >
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center gap-2 
                    bg-[#E76F51] hover:bg-[#D85C43] 
                    text-[#FFF7F3] font-semibold px-8 py-4 
                    rounded-xl transition-all duration-200 
                    shadow-xl hover:scale-[1.03] active:scale-[0.98]"
                >
                  Start Selling
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => navigate('/marketplace')}
                  className="inline-flex items-center gap-2 
                    bg-white/85 hover:bg-white 
                    text-[#E76F51] font-semibold px-8 py-4 
                    rounded-xl border-2 border-[#E76F51] 
                    transition-all duration-200 shadow-lg 
                    backdrop-blur-sm"
                >
                  Browse Market
                </button>
              </div>

              {/* Social Proof */}
              <div 
                className="flex items-center gap-6 pt-4 opacity-0 translate-y-4"
                style={{
                  animation: 'slideUp 0.6s ease-out 1s forwards'
                }}
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-[#F9FAF7] 
                        border-2 border-[#E76F51] 
                        flex items-center justify-center 
                        text-xs font-medium text-[#5F5F5F] 
                        shadow-md"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>

                <div
                  className="text-sm bg-white/75 backdrop-blur-sm 
                  px-4 py-2 rounded-lg shadow-md"
                >
                  <p className="font-semibold text-[#2D2D2D]">
                    Join 5,000+ farmers
                  </p>
                  <p className="text-[#5F5F5F]">
                    who trust FarmEasy
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-12 bg-white border-y border-[#E5DED3]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center ${statsVisible ? 'opacity-0 scale-90' : 'opacity-0'}`}
                style={statsVisible ? {
                  animation: `scaleIn 0.5s ease-out ${0.1 + index * 0.1}s forwards`
                } : {}}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl md:text-4xl font-bold text-[#2D2D2D]">
                    {stat.value}
                  </span>
                  {stat.icon && <Star className="w-6 h-6 text-[#FFB800] fill-[#FFB800]" />}
                </div>
                <p className="text-[#6B6B6B] text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 md:py-28 bg-[#F5F2ED]">
        <div className="container mx-auto px-4">
          <div 
            className={`text-center max-w-2xl mx-auto mb-16 ${featuresVisible ? 'opacity-0 translate-y-4' : 'opacity-0'}`}
            style={featuresVisible ? {
              animation: 'slideUp 0.6s ease-out 0.1s forwards'
            } : {}}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-4">
              Why Choose FarmEasy?
            </h2>
            <p className="text-[#6B6B6B] text-lg">
              We're revolutionizing how agricultural trade works in India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl hover:shadow-lg transition-all duration-300 overflow-hidden group border border-[#E5DED3] ${featuresVisible ? 'opacity-0 translate-y-4' : 'opacity-0'}`}
                style={featuresVisible ? {
                  animation: `slideUp 0.6s ease-out ${0.3 + index * 0.15}s forwards`
                } : {}}
              >
                <div className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-[#E8704F] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">{feature.title}</h3>
                  <p className="text-[#6B6B6B]">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={stepsRef} className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div 
            className={`text-center max-w-2xl mx-auto mb-16 ${stepsVisible ? 'opacity-0 translate-y-4' : 'opacity-0'}`}
            style={stepsVisible ? {
              animation: 'slideUp 0.6s ease-out 0.1s forwards'
            } : {}}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-4">
              How It Works
            </h2>
            <p className="text-[#6B6B6B] text-lg">
              From farm to table in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative h-full">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-[#E5DED3] z-0" />
                )}
                
                <div 
                  className={`relative z-10 bg-white rounded-2xl border border-[#E5DED3] text-center p-8 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col ${stepsVisible ? 'opacity-0 translate-y-4' : 'opacity-0'}`}
                  style={stepsVisible ? {
                    animation: `slideUp 0.6s ease-out ${0.3 + index * 0.15}s forwards`
                  } : {}}
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#E8704F] mx-auto mb-6 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-[#E8704F]/20 mb-2">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-[#2D2D2D] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#6B6B6B] text-sm flex-grow">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 md:py-28 bg-[#F5F2ED]">
        <div className="container mx-auto px-4">
          <div 
            className={`bg-[#E8704F] rounded-3xl overflow-hidden relative ${ctaVisible ? 'opacity-0 scale-95' : 'opacity-0'}`}
            style={ctaVisible ? {
              animation: 'scaleIn 0.6s ease-out 0.2s forwards'
            } : {}}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
            </div>
            
            <div className="relative z-10 py-16 md:py-20 px-8 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Farm Business?
              </h2>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                Join thousands of farmers who are already getting better prices for their produce.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate(isAuthenticated ? (user?.role === 'farmer' ? '/create-auction' : '/marketplace') : '/signup')}
                  className="bg-white hover:bg-gray-100 text-[#E8704F] font-semibold px-8 py-4 rounded-xl transition-all duration-200"
                >
                  {isAuthenticated ? (user?.role === 'farmer' ? 'Create Listing' : 'Browse Market') : 'Register as Farmer'}
                </button>
                <button 
                  onClick={() => navigate(isAuthenticated ? '/marketplace' : '/signup')}
                  className="bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200"
                >
                  {isAuthenticated ? 'View Marketplace' : 'Register as Buyer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};



// APP COMPONENT - KEEP ALL THIS ROUTING LOGIC INTACT
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
          <Route path="profile" element={<ProfilePage />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
