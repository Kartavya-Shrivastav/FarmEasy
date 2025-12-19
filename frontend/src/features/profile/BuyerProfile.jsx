import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { openRazorpayCheckout } from '../../services/razorpay';
import { showSuccess, showError, showInfo } from '../../utils/toast';
import ReviewModal from '../../components/auction/ReviewModal';

const BuyerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // active, outbid, purchases
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAuctionForReview, setSelectedAuctionForReview] = useState(null); 

  useEffect(() => {
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
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (auction) => {

    // Double-check payment status before proceeding
    try {
      const { data: statusData } = await api.get(`/auctions/${auction._id}`);
      if (statusData.auction?.lockedDeal?.isPaid) {
        showInfo('This auction has already been paid for!');
        await fetchProfile();
        return;
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }

  try {
    // Create order
    const { data } = await api.post(`/auctions/${auction._id}/payment/create-order`);
    
    if (!data.success) {
      showError('Failed to create payment order');
      return;
    }

    // Open Razorpay checkout
    const options = {
      key: data.keyId,
      amount: data.amount * 100,
      currency: data.currency,
      order_id: data.orderId,
      name: 'FarmEasy',
      description: `Payment for ${auction.title}`,
      handler: async (response) => {
        // Verify payment
        try {
          const verifyData = await api.post('/payment/verify', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verifyData.data.success) {
            showSuccess('Payment successful! 🎉');
            await fetchProfile();
          }
        } catch (error) {
          showError('Payment verification failed');
          console.error(error);
        }
      },
      prefill: {
        name: profile.name,
        email: profile.email,
      },
      theme: {
        color: '#16a34a',
      },
      modal: {
        ondismiss: () => {
          // Check if payment might have succeeded even if modal was closed
          setTimeout(() => fetchProfile(), 1000);
        }
      }
    };

    openRazorpayCheckout(
      options,
      () => {}, // onSuccess handled in handler above
      () => {
        console.log('Payment cancelled');
        // Still refresh in case payment went through
        setTimeout(() => fetchProfile(), 1000);
      }
    );
  } catch (error) {
    showError(error.response?.data?.message || 'Failed to process payment');
  }
};


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeBids = profile?.activeBids || [];
  const outbidAuctions = profile?.outbidAuctions || [];
  const purchases = profile?.purchases || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="card">
          <div className="text-center mb-4">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">👤</span>
            </div>
            <h2 className="text-xl font-semibold">{profile?.name}</h2>
            <p className="text-sm text-gray-600">{profile?.email}</p>
            <p className="text-xs text-gray-500 mt-1">Buyer Account</p>
          </div>

          <div className="space-y-2 mt-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Bids:</span>
              <span className="font-semibold text-green-600">{activeBids.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Outbid:</span>
              <span className="font-semibold text-orange-600">{outbidAuctions.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Purchases:</span>
              <span className="font-semibold text-blue-600">{purchases.length}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'active'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Active Bids ({activeBids.length})
            </button>
            <button
              onClick={() => setActiveTab('outbid')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'outbid'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Outbid ({outbidAuctions.length})
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'purchases'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Purchases ({purchases.length})
            </button>
          </div>

          {/* Active Bids */}
          {activeTab === 'active' && (
            <div className="space-y-4">
              {activeBids.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-gray-600 mb-4">No active bids</p>
                  <Link to="/marketplace">
                    <Button variant="primary">Browse Marketplace</Button>
                  </Link>
                </div>
              ) : (
                activeBids.map((auction) => (
                  <div key={auction._id} className="card">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                        {auction.images?.[0] ? (
                          <img
                            src={auction.images[0].url}
                            alt={auction.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            🌾
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{auction.title}</h3>
                        <p className="text-sm text-gray-600">
                          {auction.quantity} {auction.unit} • {auction.location?.district}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div>
                            <p className="text-xs text-gray-600">Your Bid</p>
                            <p className="font-bold text-green-600">
                              ₹{auction.currentHighestBidAmount}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Ends</p>
                            <p className="text-sm font-semibold">
                              {new Date(auction.auctionEndsAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link to={`/auctions/${auction._id}`}>
                        <Button variant="secondary">View</Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Outbid */}
          {activeTab === 'outbid' && (
            <div className="space-y-4">
              {outbidAuctions.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-gray-600">No outbid auctions</p>
                </div>
              ) : (
                outbidAuctions.map((auction) => (
                  <div key={auction._id} className="card bg-orange-50 border border-orange-200">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                        {auction.images?.[0] ? (
                          <img
                            src={auction.images[0].url}
                            alt={auction.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            🌾
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{auction.title}</h3>
                        <p className="text-sm text-gray-600">
                          {auction.quantity} {auction.unit}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div>
                            <p className="text-xs text-gray-600">Current Highest</p>
                            <p className="font-bold text-orange-600">
                              ₹{auction.currentHighestBidAmount}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link to={`/auctions/${auction._id}`}>
                        <Button variant="primary">Bid Again</Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Purchases */}
          {activeTab === 'purchases' && (
            <div className="space-y-4">
              {purchases.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-gray-600">No purchases yet</p>
                </div>
              ) : (
                    purchases.map((auction) => (
                      <div key={auction._id} className="card">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                            {auction.images?.[0] ? (
                              <img
                                src={auction.images[0].url}
                                alt={auction.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl">
                                🌾
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{auction.title}</h3>
                            <p className="text-sm text-gray-600">
                              Farmer: {auction.farmer?.name}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <div>
                                <p className="text-xs text-gray-600">Purchase Price</p>
                                <p className="font-bold text-blue-600">
                                  ₹{auction.lockedDeal?.amount}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Status</p>
                                {auction.lockedDeal?.isPaid ? (
                                  <p className="text-sm font-semibold text-green-600">✓ Paid</p>
                                ) : (
                                  <p className="text-sm font-semibold text-red-600">Pending Payment</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Button Section */}
                          <div>
                            {auction.lockedDeal?.isPaid ? (
                              <div className="flex flex-col gap-2 items-end">
                                <span className="text-sm font-semibold text-green-600">✓ Completed</span>
                                <div className="flex gap-2">
                                  <Link to={`/auctions/${auction._id}`}>
                                    <Button variant="secondary">View</Button>
                                  </Link>
                                  <Button
                                    variant="primary"
                                    onClick={() => {
                                      setSelectedAuctionForReview(auction);
                                      setReviewModalOpen(true);
                                    }}
                                  >
                                    Rate Farmer
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                variant="primary"
                                onClick={() => handlePayment(auction)}
                              >
                                Pay Now
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Review Modal - ADD THIS HERE */}
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
        </div>
      );
};

export default BuyerProfile;
