import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { 
  User, 
  Mail, 
  Star, 
  Package, 
  TrendingUp, 
  CheckCircle, 
  IndianRupee,
  Clock,
  Plus,
  Eye,
  MessageSquare,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const FarmerProfile = () => {
  const { t, i18n } = useTranslation();
  const { userId } = useParams(); // Get userId from URL params
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);



  useEffect(() => {
    setIsVisible(true);
    fetchProfile();
  }, [userId]);



  const fetchProfile = async () => {
    setLoading(true);
    try {
      // If userId exists in URL, fetch that user's public profile
      // Otherwise, fetch logged-in user's own profile
      const endpoint = userId ? `/profile/${userId}` : '/profile/me';
      const { data } = await api.get(endpoint);
      
      if (data.success) {
        const profileData = data.profile;
        setProfile(profileData);
        setIsOwnProfile(!userId); // It's own profile if no userId in URL
        
        const auctions = profileData.myAuctions || profileData.auctions || [];
        const completed = auctions.filter(a => a.lockedDeal?.isPaid);
        const totalEarnings = completed.reduce((sum, a) => sum + (a.lockedDeal?.amount || 0), 0);
        
        setStats({
          totalAuctions: auctions.length,
          activeAuctions: auctions.filter(a => a.status === 'APPROVED' && !a.lockedDeal?.isLocked).length,
          completedSales: completed.length,
          totalEarnings,
          pendingPayments: auctions.filter(a => a.lockedDeal?.isLocked && !a.lockedDeal?.isPaid).length,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F5F2ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E5DED3] border-t-[#ea7f61] rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-[#6B6B6B] font-medium">{t('farmerProfile.loading')}</p>
        </div>
      </div>
    );
  }



  return (
    <>
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
      `}</style>



      <div className="min-h-screen bg-[#F5F2ED]">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button - Show only for public profiles */}
          {!isOwnProfile && (
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#ea7f61] font-bold mb-6 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {t('common.back')}
            </button>
          )}


          {/* Header */}
          <div 
            className={`mb-8 ${isVisible ? 'opacity-0' : 'opacity-0'}`}
            style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.1s forwards' } : {}}
          >
            <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2">
              {isOwnProfile ? t('farmerProfile.myProfile') : t('farmerProfile.userProfile', { name: profile?.name })}
            </h1>
            <p className="text-[#6B6B6B]">
              {isOwnProfile ? t('farmerProfile.manageAccount') : t('farmerProfile.viewDetails')}
            </p>
          </div>



          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div 
              className={`${isVisible ? 'opacity-0' : 'opacity-0'}`}
              style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.2s forwards' } : {}}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3]">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-5xl">🧑‍🌾</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#2D2D2D] mb-1">{profile?.name}</h2>
                  {isOwnProfile && (
                    <div className="flex items-center justify-center gap-2 text-sm text-[#6B6B6B] mb-2">
                      <Mail className="w-4 h-4" />
                      <p>{profile?.email}</p>
                    </div>
                  )}
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    {t('farmerProfile.farmerAccount')}
                  </span>
                </div>



                {/* Rating */}
                {profile?.averageRating > 0 && (
                  <div className="border-t border-[#E5DED3] pt-6 mb-6">
                    <div className="bg-linear-to-br from-amber-50 to-yellow-50 rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                        <span className="text-3xl font-bold text-[#2D2D2D]">
                          {profile.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-[#6B6B6B]">
                        {t('farmerProfile.basedOnReviews', { count: profile.totalReviews || 0 })}
                      </p>
                    </div>
                  </div>
                )}



                {/* Action Button - Only show for own profile */}
                {isOwnProfile && (
                  <Link to="/create-auction">
                    <button className="w-full inline-flex items-center justify-center gap-2 bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl">
                      <Plus className="w-5 h-5" />
                      {t('farmerProfile.createNewAuction')}
                    </button>
                  </Link>
                )}
              </div>
            </div>



            {/* Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total Auctions */}
              <div 
                className={`bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200 hover:shadow-xl transition-all ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.3s forwards' } : {}}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#6B6B6B] mb-2">{t('farmerProfile.totalAuctions')}</p>
                    <p className="text-4xl font-bold text-blue-600">{stats?.totalAuctions || 0}</p>
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>



              {/* Active Auctions */}
              <div 
                className={`bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200 hover:shadow-xl transition-all ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.35s forwards' } : {}}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#6B6B6B] mb-2">{t('farmerProfile.activeAuctions')}</p>
                    <p className="text-4xl font-bold text-green-600">{stats?.activeAuctions || 0}</p>
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>



              {/* Completed Sales */}
              <div 
                className={`bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200 hover:shadow-xl transition-all ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.4s forwards' } : {}}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#6B6B6B] mb-2">{t('farmerProfile.completedSales')}</p>
                    <p className="text-4xl font-bold text-purple-600">{stats?.completedSales || 0}</p>
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>



              {/* Total Earnings - Only show for own profile */}
              {isOwnProfile && (
                <div 
                  className={`bg-linear-to-br from-amber-400 to-yellow-500 rounded-2xl shadow-lg p-6 border-2 border-yellow-300 hover:shadow-xl transition-all ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                  style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.45s forwards' } : {}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white/90 mb-2">{t('farmerProfile.totalEarnings')}</p>
                      <p className="text-4xl font-bold text-white">
                        ₹{(stats?.totalEarnings || 0).toLocaleString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <IndianRupee className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              )}



              {/* Pending Payments - Only for own profile */}
              {isOwnProfile && stats?.pendingPayments > 0 && (
                <div 
                  className={`bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200 ${!isOwnProfile ? 'sm:col-span-1' : 'sm:col-span-2'} hover:shadow-xl transition-all ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                  style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.5s forwards' } : {}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#6B6B6B] mb-2">{t('farmerProfile.pendingPayments')}</p>
                      <p className="text-4xl font-bold text-orange-600 mb-1">{stats.pendingPayments}</p>
                      <p className="text-xs text-[#6B6B6B]">{t('farmerProfile.waitingForPayment')}</p>
                    </div>
                    <div className="w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center">
                      <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>



          {/* Reviews Section */}
          {profile?.reviews && profile.reviews.length > 0 && (
            <div 
              className={`mt-8 ${isVisible ? 'opacity-0' : 'opacity-0'}`}
              style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.6s forwards' } : {}}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#ea7f61]/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#ea7f61]" />
                </div>
                <h2 className="text-2xl font-bold text-[#2D2D2D]">{t('farmerProfile.reviewsFromBuyers')}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.reviews.map((review, index) => (
                  <div 
                    key={review._id}
                    className={`bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3] hover:shadow-xl transition-all ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                    style={isVisible ? { animation: `slideUp 0.6s ease-out ${0.65 + index * 0.05}s forwards` } : {}}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#ea7f61]/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-[#ea7f61]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#2D2D2D]">{review.buyer?.name}</p>
                          <div className="flex items-center gap-1 text-xs text-[#6B6B6B]">
                            <Calendar className="w-3 h-3" />
                            {new Date(review.createdAt).toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {review.comment && (
                      <p className="text-[#6B6B6B] text-sm mb-3 leading-relaxed">
                        "{review.comment}"
                      </p>
                    )}
                    
                    <div className="pt-3 border-t border-[#E5DED3]">
                      <p className="text-xs text-[#6B6B6B] flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {t('farmerProfile.auctionLabel')}: <span className="font-medium text-[#2D2D2D]">{review.auction?.title}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}



          {/* Quick Actions - Only for own profile */}
          {isOwnProfile && (
            <div 
              className={`mt-8 bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3] ${isVisible ? 'opacity-0' : 'opacity-0'}`}
              style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.7s forwards' } : {}}
            >
              <h3 className="text-lg font-bold text-[#2D2D2D] mb-4">{t('farmerProfile.quickActions')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/my-auctions">
                  <button className="w-full inline-flex items-center justify-center gap-2 border-2 border-[#E5DED3] text-[#2D2D2D] font-bold py-3 px-6 rounded-xl bg-white hover:bg-[#F5F2ED] transition-all">
                    <Eye className="w-5 h-5" />
                    {t('farmerProfile.viewMyAuctions')}
                  </button>
                </Link>
                <Link to="/create-auction">
                  <button className="w-full inline-flex items-center justify-center gap-2 bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg">
                    <Plus className="w-5 h-5" />
                    {t('farmerProfile.createNewAuction')}
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};


export default FarmerProfile;
