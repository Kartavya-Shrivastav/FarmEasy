import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setCurrentAuction, updateAuctionBid } from './auctionSlice';
import BidModal from '../bids/BidModal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { initSocket, connectSocket } from '../../services/socket';
import { showSuccess, showError } from '../../utils/toast';
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  Calendar, 
  Clock, 
  TrendingUp, 
  User, 
  CheckCircle, 
  XCircle,
  Gavel,
  Info
} from 'lucide-react';


const AuctionDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentAuction } = useAppSelector((state) => state.auctions);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);


  const [loading, setLoading] = useState(true);
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    setIsVisible(true);
    fetchAuction();
    
    // Initialize Socket.io
    const socket = initSocket();
    connectSocket();


    socket.emit('join-auction', id);


    // Listen for real-time bid updates
    socket.on('new-bid', (data) => {
      if (data.auctionId === id) {
        dispatch(updateAuctionBid(data));
      }
    });


    socket.on('auction-closed', (data) => {
      if (data.auctionId === id) {
        fetchAuction(); // Refresh to show closed status
      }
    });


    return () => {
      socket.emit('leave-auction', id);
      socket.off('new-bid');
      socket.off('auction-closed');
    };
  }, [id]);


  const fetchAuction = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/auctions/${id}`);
      if (data.success) {
        dispatch(setCurrentAuction(data.auction));
      }
    } catch (error) {
      console.error('Error fetching auction:', error);
    } finally {
      setLoading(false);
    }
  };


  const handlePlaceBid = async (amount) => {
    try {
      const { data } = await api.post(`/${id}/bids`, { amount });
      if (data.success) {
        showSuccess(t('bid.bidSuccess'));
      }
    } catch (error) {
      throw error;
    }
  };


  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;


    if (diff <= 0) return { text: t('auction.ended'), urgent: false };


    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));


    if (days > 0) return { 
      text: t('time.daysHoursMinutes', { days, hours, minutes }), 
      urgent: days < 2 
    };
    if (hours > 0) return { 
      text: t('time.hoursMinutes', { hours, minutes }), 
      urgent: true 
    };
    return { 
      text: t('time.minutesShort', { minutes }), 
      urgent: true 
    };
  };


  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F5F2ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E5DED3] border-t-[#ea7f61] rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-[#6B6B6B] font-medium">{t('auctionDetail.loading')}</p>
        </div>
      </div>
    );
  }


  if (!currentAuction) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F5F2ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">{t('auctionDetail.notFound')}</h2>
          <p className="text-[#6B6B6B] mb-6">{t('auctionDetail.notFoundMessage')}</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
          >
            {t('common.backToMarketplace')}
          </button>
        </div>
      </div>
    );
  }


  const isBuyer = user?.role === 'buyer';
  const isFarmer = user?.role === 'farmer' && currentAuction.farmer._id === user._id;
  const isClosed = currentAuction.status === 'CLOSED' || currentAuction.lockedDeal?.isLocked;
  const timeRemaining = getTimeRemaining(currentAuction.auctionEndsAt);


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
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#ea7f61] font-bold mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {t('common.backToMarketplace')}
          </button>


          <div 
            className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${isVisible ? 'opacity-0' : 'opacity-0'}`}
            style={isVisible ? {
              animation: 'slideUp 0.6s ease-out 0.1s forwards'
            } : {}}
          >
            {/* Left Column - Images Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-[#E5DED3] h-[500px] group">
                {currentAuction.images && currentAuction.images.length > 0 ? (
                  <img
                    src={currentAuction.images[selectedImageIndex || 0].url}
                    alt={currentAuction.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-[#F5F2ED] to-[#E5DED3]">
                    <span className="text-9xl">🌾</span>
                  </div>
                )}


                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-[#ea7f61] text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                    {t(`categories.${currentAuction.category.toLowerCase()}`, currentAuction.category)}
                  </span>
                  {isClosed ? (
                    <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                      {t('auction.closed')}
                    </span>
                  ) : (
                    <span className={`${timeRemaining.urgent ? 'bg-red-500 animate-pulse' : 'bg-green-500'} text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1.5`}>
                      <Clock className="w-4 h-4" />
                      {timeRemaining.text}
                    </span>
                  )}
                </div>
              </div>


              {/* Thumbnail Gallery */}
              {currentAuction.images && currentAuction.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {currentAuction.images.map((image, index) => (
                    <button
                      key={image.publicId || index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-20 bg-gray-200 rounded-xl overflow-hidden border-3 transition-all ${
                        (selectedImageIndex || 0) === index
                          ? 'border-[#ea7f61] ring-2 ring-[#ea7f61]/30 scale-105'
                          : 'border-[#E5DED3] hover:border-[#ea7f61]/50'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${currentAuction.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>


            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Title Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3]">
                <h1 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-4">
                  {currentAuction.title}
                </h1>
                <p className="text-[#6B6B6B] leading-relaxed">
                  {currentAuction.description}
                </p>
              </div>


              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl shadow-lg p-5 border border-[#E5DED3]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#ea7f61]/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-[#ea7f61]" />
                    </div>
                    <span className="text-sm text-[#6B6B6B] font-medium">{t('auction.quantity')}</span>
                  </div>
                  <p className="text-2xl font-bold text-[#2D2D2D] ml-13">
                    {currentAuction.quantity} {t(`units.${currentAuction.unit.toLowerCase()}`, currentAuction.unit)}
                  </p>
                </div>


                <div className="bg-white rounded-2xl shadow-lg p-5 border border-[#E5DED3]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#ea7f61]/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#ea7f61]" />
                    </div>
                    <span className="text-sm text-[#6B6B6B] font-medium">{t('auction.location')}</span>
                  </div>
                  <p className="text-lg font-bold text-[#2D2D2D] ml-13 truncate">
                    {currentAuction.location?.district}, {currentAuction.location?.state}
                  </p>
                </div>
              </div>


              {/* Farmer Info - Clickable */}
              <button
                onClick={() => navigate(`/profile/${currentAuction.farmer._id}`)}
                className="w-full bg-white hover:bg-[#FFF8F3] rounded-2xl shadow-lg hover:shadow-xl p-5 border border-[#E5DED3] hover:border-[#ea7f61] transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#ea7f61]/10 group-hover:bg-[#ea7f61]/20 flex items-center justify-center transition-colors">
                    <User className="w-6 h-6 text-[#ea7f61]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-[#6B6B6B]">{t('auctionDetail.sellerClickToView')}</p>
                    <p className="text-lg font-bold text-[#2D2D2D] group-hover:text-[#ea7f61] transition-colors">
                      {currentAuction.farmer?.name || t('auctionDetail.notAvailable')}
                    </p>
                  </div>
                </div>
              </button>



              {/* Bidding Info Card */}
              <div className="bg-linear-to-br from-[#ea7f61] to-[#d85f3f] rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Gavel className="w-5 h-5" />
                  <span className="text-sm font-medium opacity-90">{t('auction.currentBid')}</span>
                </div>
                <div className="text-5xl font-bold mb-6">
                  ₹{(currentAuction.currentHighestBidAmount || currentAuction.minPrice).toLocaleString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                  <div>
                    <p className="text-xs opacity-75 mb-1">{t('auctionDetail.minIncrement')}</p>
                    <p className="text-lg font-bold">₹{currentAuction.minBidHop.toLocaleString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75 mb-1">{t('auctionDetail.endsOn')}</p>
                    <p className="text-lg font-bold">
                      {new Date(currentAuction.auctionEndsAt).toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                  </div>
                </div>
              </div>


              {/* Action Buttons */}
              <div>
                {isClosed ? (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold text-red-700 mb-1">{t('auction.auctionClosed')}</p>
                      <p className="text-sm text-red-600">{t('auction.auctionClosedMessage')}</p>
                      {currentAuction.lockedDeal?.isPaid && (
                        <p className="text-sm text-red-600 mt-2">{t('auction.paymentCompleted')}</p>
                      )}
                    </div>
                  </div>
                ) : isAuthenticated && isBuyer ? (
                  <button
                    onClick={() => setBidModalOpen(true)}
                    className="w-full bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
                  >
                    <Gavel className="w-6 h-6" />
                    {t('auction.placeBid')}
                  </button>
                ) : isAuthenticated && isFarmer ? (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Info className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-700 mb-1">{t('auction.yourAuction')}</p>
                      <p className="text-sm text-blue-600">{t('auction.yourAuctionMessage')}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                    >
                      {t('auction.loginToBid')}
                    </button>
                    <p className="text-center text-sm text-[#6B6B6B]">
                      {t('auctionDetail.noAccount')} <a href="/signup" className="text-[#ea7f61] hover:text-[#d85f3f] font-bold">{t('auctionDetail.signUp')}</a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Bid Modal */}
      <BidModal
        isOpen={bidModalOpen}
        onClose={() => setBidModalOpen(false)}
        auction={currentAuction}
        onBidSuccess={handlePlaceBid}
      />
    </>
  );
};


export default AuctionDetailPage;
