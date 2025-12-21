import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../app/hooks';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';
import { 
  Plus, 
  Package, 
  IndianRupee, 
  Calendar, 
  Eye,
  Lock,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';


const MyAuctionsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);


  // Redirect if not farmer
  if (user?.role !== 'farmer') {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F5F2ED] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">{t('myAuctions.accessDenied')}</h2>
          <p className="text-[#6B6B6B] mb-6">{t('myAuctions.accessDeniedMessage')}</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
          >
            {t('admin.goToMarketplace')}
          </button>
        </div>
      </div>
    );
  }


  useEffect(() => {
    setIsVisible(true);
    fetchMyAuctions();
  }, []);


  const fetchMyAuctions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/profile/me');
      if (data.success && data.profile.myAuctions) {
        setAuctions(data.profile.myAuctions);
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
      showError(t('myAuctions.loadError'));
    } finally {
      setLoading(false);
    }
  };


  const handleLockDeal = async (auctionId) => {
    if (!window.confirm(t('myAuctions.lockDealConfirm'))) {
      return;
    }


    try {
      const { data } = await api.post(`/auctions/${auctionId}/lock`);
      if (data.success) {
        showSuccess(t('myAuctions.lockDealSuccess'));
        fetchMyAuctions();
      }
    } catch (error) {
      showError(error.response?.data?.message || t('myAuctions.lockDealError'));
    }
  };


  const getStatusBadge = (auction) => {
    if (auction.status === 'CLOSED' && auction.lockedDeal?.isPaid) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
          <CheckCircle className="w-3.5 h-3.5" />
          {t('myAuctions.statusCompleted')}
        </div>
      );
    }
    
    if (auction.status === 'CLOSED' && !auction.lockedDeal?.isPaid) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
          <Clock className="w-3.5 h-3.5" />
          {t('myAuctions.statusAwaitingPayment')}
        </div>
      );
    }


    const statusConfig = {
      PENDING: { 
        bg: 'bg-amber-100', 
        text: 'text-amber-700', 
        icon: Clock,
        label: t('myAuctions.statusPending')
      },
      APPROVED: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-700', 
        icon: CheckCircle,
        label: t('myAuctions.statusApproved')
      },
      REJECTED: { 
        bg: 'bg-gray-100', 
        text: 'text-gray-700', 
        icon: XCircle,
        label: t('myAuctions.statusRejected')
      },
    };
    
    const config = statusConfig[auction.status] || statusConfig.PENDING;
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </div>
    );
  };


  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F5F2ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E5DED3] border-t-[#ea7f61] rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-[#6B6B6B] font-medium">{t('myAuctions.loading')}</p>
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
          {/* Header */}
          <div 
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 ${isVisible ? 'opacity-0' : 'opacity-0'}`}
            style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.1s forwards' } : {}}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#ea7f61] flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#2D2D2D]">{t('myAuctions.title')}</h1>
                <p className="text-[#6B6B6B]">{t('myAuctions.subtitle')}</p>
              </div>
            </div>
            <Link to="/create-auction">
              <button className="inline-flex items-center gap-2 bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                <Plus className="w-5 h-5" />
                {t('myAuctions.createNew')}
              </button>
            </Link>
          </div>


          {/* Stats Card */}
          {auctions.length > 0 && (
            <div 
              className={`bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3] mb-8 ${isVisible ? 'opacity-0' : 'opacity-0'}`}
              style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.2s forwards' } : {}}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">{t('myAuctions.totalAuctions')}</p>
                    <p className="text-2xl font-bold text-[#2D2D2D]">{auctions.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">{t('myAuctions.approved')}</p>
                    <p className="text-2xl font-bold text-[#2D2D2D]">
                      {auctions.filter(a => a.status === 'APPROVED').length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">{t('myAuctions.pending')}</p>
                    <p className="text-2xl font-bold text-[#2D2D2D]">
                      {auctions.filter(a => a.status === 'PENDING').length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">{t('myAuctions.completed')}</p>
                    <p className="text-2xl font-bold text-[#2D2D2D]">
                      {auctions.filter(a => a.status === 'CLOSED' && a.lockedDeal?.isPaid).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Auctions List */}
          {auctions.length === 0 ? (
            <div 
              className="bg-white rounded-2xl shadow-lg p-12 border border-[#E5DED3] text-center"
              style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.3s forwards' } : {}}
            >
              <div className="w-20 h-20 bg-[#ea7f61]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-[#ea7f61]" />
              </div>
              <h3 className="text-2xl font-bold text-[#2D2D2D] mb-2">{t('myAuctions.noAuctions')}</h3>
              <p className="text-[#6B6B6B] mb-6">{t('myAuctions.noAuctionsMessage')}</p>
              <Link to="/create-auction">
                <button className="inline-flex items-center gap-2 bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                  <Plus className="w-5 h-5" />
                  {t('myAuctions.createFirst')}
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {auctions.map((auction, index) => (
                <div 
                  key={auction._id}
                  className={`bg-white rounded-2xl shadow-lg border border-[#E5DED3] overflow-hidden hover:shadow-xl transition-all ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                  style={isVisible ? { animation: `slideUp 0.6s ease-out ${0.3 + index * 0.1}s forwards` } : {}}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Image */}
                      <div className="relative w-full lg:w-40 h-40 bg-linear-to-br from-[#F5F2ED] to-[#E5DED3] rounded-xl overflow-hidden shrink-0">
                        {auction.images && auction.images.length > 0 ? (
                          <img
                            src={auction.images[0].url}
                            alt={auction.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            🌾
                          </div>
                        )}
                        {auction.images && auction.images.length > 1 && (
                          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" />
                            {auction.images.length}
                          </div>
                        )}
                      </div>


                      {/* Details */}
                      <div className="flex-1 space-y-4">
                        {/* Title & Status */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-[#2D2D2D] mb-1">{auction.title}</h3>
                            <p className="text-sm text-[#6B6B6B] flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              {auction.quantity} {t(`units.${auction.unit.toLowerCase()}`, auction.unit)} • {t(`categories.${auction.category.toLowerCase()}`, auction.category)}
                            </p>
                          </div>
                          {getStatusBadge(auction)}
                        </div>


                        {/* Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#ea7f61]/10 flex items-center justify-center">
                              <IndianRupee className="w-4 h-4 text-[#ea7f61]" />
                            </div>
                            <div>
                              <p className="text-xs text-[#6B6B6B]">{t('myAuctions.minPrice')}</p>
                              <p className="text-sm font-bold text-[#2D2D2D]">₹{auction.minPrice.toLocaleString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}</p>
                            </div>
                          </div>


                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-[#6B6B6B]">{t('myAuctions.currentBid')}</p>
                              <p className="text-sm font-bold text-green-600">
                                ₹{(auction.currentHighestBidAmount || 0).toLocaleString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}
                              </p>
                            </div>
                          </div>


                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-[#6B6B6B]">{t('myAuctions.created')}</p>
                              <p className="text-sm font-bold text-[#2D2D2D]">
                                {new Date(auction.createdAt).toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN', {
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </p>
                            </div>
                          </div>


                          {auction.auctionEndsAt && (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-red-600" />
                              </div>
                              <div>
                                <p className="text-xs text-[#6B6B6B]">{t('myAuctions.ends')}</p>
                                <p className="text-sm font-bold text-[#2D2D2D]">
                                  {new Date(auction.auctionEndsAt).toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN', {
                                    day: 'numeric',
                                    month: 'short'
                                  })}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>


                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <Link to={`/auctions/${auction._id}`}>
                            <button className="inline-flex items-center gap-2 border-2 border-[#E5DED3] text-[#2D2D2D] font-bold py-2 px-4 rounded-xl bg-white hover:bg-[#F5F2ED] transition-all">
                              <Eye className="w-4 h-4" />
                              {t('myAuctions.viewDetails')}
                            </button>
                          </Link>


                          {auction.status === 'APPROVED' &&
                            auction.currentHighestBidAmount > 0 &&
                            !auction.lockedDeal?.isLocked && (
                              <button
                                onClick={() => handleLockDeal(auction._id)}
                                className="inline-flex items-center gap-2 bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-2 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
                              >
                                <Lock className="w-4 h-4" />
                                {t('myAuctions.lockDeal')}
                              </button>
                            )}


                          {auction.lockedDeal?.isLocked && (
                            <div className="flex items-center gap-3">
                              {auction.lockedDeal.isPaid ? (
                                <>
                                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-bold">
                                    <CheckCircle className="w-4 h-4" />
                                    {t('myAuctions.paid')} - ₹{auction.lockedDeal.amount.toLocaleString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}
                                  </div>
                                  <span className="text-xs text-[#6B6B6B]">
                                    {new Date(auction.lockedDeal.paidAt).toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}
                                  </span>
                                </>
                              ) : (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-xl text-sm font-bold">
                                  <Clock className="w-4 h-4" />
                                  {t('myAuctions.paymentPending')}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};


export default MyAuctionsPage;
