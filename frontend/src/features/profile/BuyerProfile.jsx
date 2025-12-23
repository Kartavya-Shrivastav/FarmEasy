import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { openRazorpayCheckout } from '../../services/razorpay';
import { showSuccess, showError, showInfo } from '../../utils/toast';
import ReviewModal from '../../components/auction/ReviewModal';
import { 
  User, 
  Mail, 
  TrendingUp, 
  AlertTriangle, 
  ShoppingBag,
  Eye,
  Gavel,
  CheckCircle,
  Clock,
  CreditCard,
  Star,
  Package,
  MapPin,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';


const BuyerProfile = () => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAuctionForReview, setSelectedAuctionForReview] = useState(null);
  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    setIsVisible(true);
    fetchProfile();
  }, []);


  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/profile/me');
      if (data.success) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showError(t('profile.loadError'));
    } finally {
      setLoading(false);
    }
  };


  const handlePayment = async (auction) => {
    try {
      const { data: statusData } = await api.get(`/auctions/${auction._id}`);
      if (statusData.auction?.lockedDeal?.isPaid) {
        showInfo(t('profile.alreadyPaid'));
        await fetchProfile();
        return;
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }


    try {
      const { data } = await api.post(`/auctions/${auction._id}/payment/create-order`);
      
      if (!data.success) {
        showError(t('profile.paymentOrderFailed'));
        return;
      }


      const options = {
        key: data.keyId,
        amount: data.amount * 100,
        currency: data.currency,
        order_id: data.orderId,
        name: 'FarmEasy',
        description: `${t('profile.paymentFor')} ${auction.title}`,
        handler: async (response) => {
          try {
            const verifyData = await api.post('/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });


            if (verifyData.data.success) {
              showSuccess(t('profile.paymentSuccess'));
              await fetchProfile();
            }
          } catch (error) {
            showError(t('profile.paymentVerifyFailed'));
            console.error(error);
          }
        },
        prefill: {
          name: profile.name,
          email: profile.email,
        },
        theme: {
          color: '#ea7f61',
        },
        modal: {
          ondismiss: () => {
            setTimeout(() => fetchProfile(), 1000);
          }
        }
      };


      openRazorpayCheckout(options); // ✅ Just pass options

    } catch (error) {
      showError(error.response?.data?.message || t('profile.paymentFailed'));
    }
  };


  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F5F2ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E5DED3] border-t-[#ea7f61] rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-[#6B6B6B] font-medium">{t('profile.loading')}</p>
        </div>
      </div>
    );
  }


  const activeBids = profile?.activeBids || [];
  const outbidAuctions = profile?.outbidAuctions || [];
  const purchases = profile?.purchases || [];


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
            className={`mb-8 ${isVisible ? 'opacity-0' : 'opacity-0'}`}
            style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.1s forwards' } : {}}
          >
            <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2">{t('profile.title')}</h1>
            <p className="text-[#6B6B6B]">{t('profile.subtitle')}</p>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div 
              className={`${isVisible ? 'opacity-0' : 'opacity-0'}`}
              style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.2s forwards' } : {}}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3]">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-linear-to-br from-[#ea7f61] to-[#d85f3f] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#2D2D2D] mb-1">{profile?.name}</h2>
                  <div className="flex items-center justify-center gap-2 text-sm text-[#6B6B6B] mb-2">
                    <Mail className="w-4 h-4" />
                    <p>{profile?.email}</p>
                  </div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                    {t('profile.buyerAccount')}
                  </span>
                </div>


                <div className="space-y-3 pt-6 border-t border-[#E5DED3]">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-[#2D2D2D]">{t('profile.activeBids')}</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">{activeBids.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-[#2D2D2D]">{t('profile.outbid')}</span>
                    </div>
                    <span className="text-lg font-bold text-orange-600">{outbidAuctions.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-[#2D2D2D]">{t('profile.purchases')}</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{purchases.length}</span>
                  </div>
                </div>
              </div>
            </div>


            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div 
                className={`bg-white rounded-2xl shadow-lg border border-[#E5DED3] p-2 mb-6 ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.3s forwards' } : {}}
              >
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`flex-1 px-4 py-3 font-bold rounded-xl transition-all ${
                      activeTab === 'active'
                        ? 'bg-[#ea7f61] text-white shadow-md'
                        : 'text-[#6B6B6B] hover:bg-[#F5F2ED]'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('profile.activeBids')}</span>
                      <span className="sm:hidden">{t('profile.active')}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === 'active' ? 'bg-white/20' : 'bg-[#E5DED3]'
                      }`}>
                        {activeBids.length}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('outbid')}
                    className={`flex-1 px-4 py-3 font-bold rounded-xl transition-all ${
                      activeTab === 'outbid'
                        ? 'bg-[#ea7f61] text-white shadow-md'
                        : 'text-[#6B6B6B] hover:bg-[#F5F2ED]'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{t('profile.outbid')}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === 'outbid' ? 'bg-white/20' : 'bg-[#E5DED3]'
                      }`}>
                        {outbidAuctions.length}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('purchases')}
                    className={`flex-1 px-4 py-3 font-bold rounded-xl transition-all ${
                      activeTab === 'purchases'
                        ? 'bg-[#ea7f61] text-white shadow-md'
                        : 'text-[#6B6B6B] hover:bg-[#F5F2ED]'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('profile.purchases')}</span>
                      <span className="sm:hidden">{t('profile.bought')}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === 'purchases' ? 'bg-white/20' : 'bg-[#E5DED3]'
                      }`}>
                        {purchases.length}
                      </span>
                    </div>
                  </button>
                </div>
              </div>


              {/* Active Bids */}
              {activeTab === 'active' && (
                <div className="space-y-4">
                  {activeBids.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 border border-[#E5DED3] text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-10 h-10 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">{t('profile.noActiveBids')}</h3>
                      <p className="text-[#6B6B6B] mb-6">{t('profile.noActiveBidsMessage')}</p>
                      <Link to="/marketplace">
                        <button className="inline-flex items-center gap-2 bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl">
                          <Gavel className="w-5 h-5" />
                          {t('profile.browseMarketplace')}
                        </button>
                      </Link>
                    </div>
                  ) : (
                    activeBids.map((auction, index) => (
                      <div 
                        key={auction._id}
                        className={`bg-white rounded-2xl shadow-lg border-2 border-green-200 overflow-hidden hover:shadow-xl transition-all ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                        style={isVisible ? { animation: `slideUp 0.6s ease-out ${0.4 + index * 0.1}s forwards` } : {}}
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row items-start gap-6">
                            <div className="relative w-full md:w-32 h-32 bg-linear-to-br from-[#F5F2ED] to-[#E5DED3] rounded-xl overflow-hidden shrink-0">
                              {auction.images?.[0] ? (
                                <img
                                  src={auction.images[0].url}
                                  alt={auction.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl">
                                  🌾
                                </div>
                              )}
                              {auction.images && auction.images.length > 1 && (
                                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                  <ImageIcon className="w-3 h-3" />
                                  {auction.images.length}
                                </div>
                              )}
                              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                                <TrendingUp className="w-3 h-3" />
                                {t('profile.leading')}
                              </div>
                            </div>


                            <div className="flex-1 space-y-3">
                              <h3 className="text-xl font-bold text-[#2D2D2D]">{auction.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-[#6B6B6B]">
                                <div className="flex items-center gap-1">
                                  <Package className="w-4 h-4" />
                                  {auction.quantity} {t(`units.${auction.unit.toLowerCase()}`, auction.unit)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {auction.location?.district}
                                </div>
                              </div>


                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                    <Gavel className="w-4 h-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-[#6B6B6B]">{t('profile.yourBid')}</p>
                                    <p className="text-lg font-bold text-green-600">
                                      ₹{auction.currentHighestBidAmount.toLocaleString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}
                                    </p>
                                  </div>
                                </div>


                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-red-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-[#6B6B6B]">{t('profile.ends')}</p>
                                    <p className="text-sm font-bold text-[#2D2D2D]">
                                      {new Date(auction.auctionEndsAt).toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN', {
                                        day: 'numeric',
                                        month: 'short'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>


                            <Link to={`/auctions/${auction._id}`}>
                              <button className="inline-flex items-center gap-2 border-2 border-[#E5DED3] text-[#2D2D2D] font-bold py-2 px-4 rounded-xl bg-white hover:bg-[#F5F2ED] transition-all">
                                <Eye className="w-4 h-4" />
                                {t('profile.view')}
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}


              {/* Outbid Tab */}
              {activeTab === 'outbid' && (
                <div className="space-y-4">
                  {outbidAuctions.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 border border-[#E5DED3] text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">{t('profile.greatNews')}</h3>
                      <p className="text-[#6B6B6B]">{t('profile.noOutbid')}</p>
                    </div>
                  ) : (
                    outbidAuctions.map((auction, index) => (
                      <div 
                        key={auction._id}
                        className={`bg-white rounded-2xl shadow-lg border-2 border-orange-200 overflow-hidden hover:shadow-xl transition-all ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                        style={isVisible ? { animation: `slideUp 0.6s ease-out ${0.4 + index * 0.1}s forwards` } : {}}
                      >
                        <div className="bg-linear-to-r from-orange-100 to-orange-50 px-4 py-2 border-b border-orange-200">
                          <div className="flex items-center gap-2 text-orange-700 text-sm font-bold">
                            <AlertTriangle className="w-4 h-4" />
                            {t('profile.outbidMessage')}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row items-start gap-6">
                            <div className="relative w-full md:w-32 h-32 bg-linear-to-br from-[#F5F2ED] to-[#E5DED3] rounded-xl overflow-hidden shrink-0">
                              {auction.images?.[0] ? (
                                <img
                                  src={auction.images[0].url}
                                  alt={auction.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl">
                                  🌾
                                </div>
                              )}
                            </div>


                            <div className="flex-1 space-y-3">
                              <h3 className="text-xl font-bold text-[#2D2D2D]">{auction.title}</h3>
                              <p className="text-sm text-[#6B6B6B] flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                {auction.quantity} {t(`units.${auction.unit.toLowerCase()}`, auction.unit)}
                              </p>


                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                  <TrendingUp className="w-4 h-4 text-orange-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-[#6B6B6B]">{t('profile.currentHighestBid')}</p>
                                  <p className="text-lg font-bold text-orange-600">
                                    ₹{auction.currentHighestBidAmount.toLocaleString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}
                                  </p>
                                </div>
                              </div>
                            </div>


                            <Link to={`/auctions/${auction._id}`}>
                              <button className="inline-flex items-center gap-2 bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-2 px-4 rounded-xl transition-all shadow-md hover:shadow-lg">
                                <Gavel className="w-4 h-4" />
                                {t('profile.bidAgain')}
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}


              {/* Purchases Tab */}
              {activeTab === 'purchases' && (
                <div className="space-y-4">
                  {purchases.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 border border-[#E5DED3] text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-10 h-10 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">{t('profile.noPurchases')}</h3>
                      <p className="text-[#6B6B6B]">{t('profile.noPurchasesMessage')}</p>
                    </div>
                  ) : (
                    purchases.map((auction, index) => (
                      <div 
                        key={auction._id}
                        className={`bg-white rounded-2xl shadow-lg border border-[#E5DED3] overflow-hidden hover:shadow-xl transition-all ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                        style={isVisible ? { animation: `slideUp 0.6s ease-out ${0.4 + index * 0.1}s forwards` } : {}}
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row items-start gap-6">
                            <div className="relative w-full md:w-32 h-32 bg-linear-to-br from-[#F5F2ED] to-[#E5DED3] rounded-xl overflow-hidden shrink-0">
                              {auction.images?.[0] ? (
                                <img
                                  src={auction.images[0].url}
                                  alt={auction.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl">
                                  🌾
                                </div>
                              )}
                              {auction.lockedDeal?.isPaid && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  {t('profile.paid')}
                                </div>
                              )}
                            </div>


                            <div className="flex-1 space-y-3">
                              <h3 className="text-xl font-bold text-[#2D2D2D]">{auction.title}</h3>
                              <p className="text-sm text-[#6B6B6B] flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {t('profile.farmer')}: {auction.farmer?.name}
                              </p>


                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <CreditCard className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-[#6B6B6B]">{t('profile.purchasePrice')}</p>
                                    <p className="text-lg font-bold text-blue-600">
                                      ₹{auction.lockedDeal?.amount.toLocaleString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}
                                    </p>
                                  </div>
                                </div>


                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    auction.lockedDeal?.isPaid ? 'bg-green-100' : 'bg-red-100'
                                  }`}>
                                    {auction.lockedDeal?.isPaid ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Clock className="w-4 h-4 text-red-600" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs text-[#6B6B6B]">{t('profile.status')}</p>
                                    <p className={`text-sm font-bold ${
                                      auction.lockedDeal?.isPaid ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {auction.lockedDeal?.isPaid ? t('profile.paid') : t('profile.paymentPending')}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>


                            <div className="flex flex-col gap-2">
                              {auction.lockedDeal?.isPaid ? (
                                <>
                                  <Link to={`/auctions/${auction._id}`}>
                                    <button className="w-full inline-flex items-center justify-center gap-2 border-2 border-[#E5DED3] text-[#2D2D2D] font-bold py-2 px-4 rounded-xl bg-white hover:bg-[#F5F2ED] transition-all">
                                      <Eye className="w-4 h-4" />
                                      {t('profile.view')}
                                    </button>
                                  </Link>
                                  <button
                                    onClick={() => {
                                      setSelectedAuctionForReview(auction);
                                      setReviewModalOpen(true);
                                    }}
                                    className="w-full inline-flex items-center justify-center gap-2 bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-2 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
                                  >
                                    <Star className="w-4 h-4" />
                                    {t('profile.rateFarmer')}
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handlePayment(auction)}
                                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-5 rounded-xl transition-all shadow-md hover:shadow-lg"
                                >
                                  <CreditCard className="w-5 h-5" />
                                  {t('profile.payNow')}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Review Modal */}
      {selectedAuctionForReview && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedAuctionForReview(null);
          }}
          auction={selectedAuctionForReview}
          onSuccess={fetchProfile}
        />
      )}
    </>
  );
};


export default BuyerProfile;
