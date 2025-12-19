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

const AuctionDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentAuction } = useAppSelector((state) => state.auctions);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
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
        showSuccess('Bid placed successfully!');
      }
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentAuction) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-600">Auction not found</p>
      </div>
    );
  }

  const isBuyer = user?.role === 'buyer';
  const isFarmer = user?.role === 'farmer' && currentAuction.farmer._id === user._id;
  const isClosed = currentAuction.status === 'CLOSED' || currentAuction.lockedDeal?.isLocked;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-2"
      >
        ← Back
      </button>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Gallery */}
        <div>
          {/* Main Image */}
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center overflow-hidden mb-3">
            {currentAuction.images && currentAuction.images.length > 0 ? (
              <img
                src={currentAuction.images[selectedImageIndex || 0].url}
                alt={currentAuction.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-9xl">🌾</span>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {currentAuction.images && currentAuction.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {currentAuction.images.map((image, index) => (
                <button
                  key={image.publicId || index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-20 bg-gray-200 rounded-lg overflow-hidden border-2 transition-all ${
                    (selectedImageIndex || 0) === index
                      ? 'border-primary-600 ring-2 ring-primary-200'
                      : 'border-transparent hover:border-gray-400'
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


        {/* Details */}
        <div>
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold">{currentAuction.title}</h1>
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                {currentAuction.category}
              </span>
            </div>

            <p className="text-gray-600 mb-6">{currentAuction.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
              <div>
                <p className="text-sm text-gray-600">{t('auction.quantity')}</p>
                <p className="text-lg font-semibold">
                  {currentAuction.quantity} {currentAuction.unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('auction.location')}</p>
                <p className="text-lg font-semibold">
                  {currentAuction.location?.district}, {currentAuction.location?.state}
                </p>
              </div>
            </div>

            {/* Bidding Info */}
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-700">{t('auction.currentBid')}</span>
                <span className="text-3xl font-bold text-primary-600">
                  ₹{currentAuction.currentHighestBidAmount || currentAuction.minPrice}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Minimum Increment: ₹{currentAuction.minBidHop}</span>
                <span>
                  Ends: {new Date(currentAuction.auctionEndsAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions - THIS IS THE KEY SECTION */}
            <div className="mt-6">
              {isClosed ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  <p className="font-semibold">Auction Closed</p>
                  {currentAuction.lockedDeal?.isPaid && (
                    <p className="text-sm">Payment completed</p>
                  )}
                </div>
              ) : isAuthenticated && isBuyer ? (
                <Button
                  variant="primary"
                  onClick={() => setBidModalOpen(true)}
                  className="w-full text-lg py-3"
                >
                  {t('auction.placeBid')}
                </Button>
              ) : isAuthenticated && isFarmer ? (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                  This is your auction
                </div>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => navigate('/login')}
                  className="w-full text-lg py-3"
                >
                  Login to Bid
                </Button>
              )}
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
    </div>
  );
};

export default AuctionDetailPage;
