import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const MyAuctionsPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not farmer
  if (user?.role !== 'farmer') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-red-600">Only farmers can access this page</p>
        <Button onClick={() => navigate('/marketplace')} className="mt-4">
          Go to Marketplace
        </Button>
      </div>
    );
  }

  useEffect(() => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleLockDeal = async (auctionId) => {
    if (!confirm('Are you sure you want to lock this deal with the current highest bidder?')) {
      return;
    }

    try {
      const { data } = await api.post(`/auctions/${auctionId}/lock`);
      if (data.success) {
        alert('Deal locked successfully!');
        fetchMyAuctions();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to lock deal');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      CLOSED: 'bg-red-100 text-red-800',
      REJECTED: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Auctions</h1>
        <Link to="/create-auction">
          <Button variant="primary">+ Create New Auction</Button>
        </Link>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-xl text-gray-600 mb-4">You haven't created any auctions yet</p>
          <Link to="/create-auction">
            <Button variant="primary">Create Your First Auction</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {auctions.map((auction) => (
            <div key={auction._id} className="card">
              <div className="flex items-start gap-4">
                {/* Image */}
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                  {auction.images && auction.images.length > 0 ? (
                    <img
                      src={auction.images[0].url}
                      alt={auction.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🌾
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold">{auction.title}</h3>
                      <p className="text-sm text-gray-600">
                        {auction.quantity} {auction.unit} • {auction.category}
                      </p>
                    </div>
                    {getStatusBadge(auction.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-gray-600">Min Price</p>
                      <p className="font-semibold">₹{auction.minPrice}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Current Bid</p>
                      <p className="font-semibold text-green-600">
                        ₹{auction.currentHighestBidAmount || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created</p>
                      <p className="font-semibold">
                        {new Date(auction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {auction.auctionEndsAt && (
                      <div>
                        <p className="text-gray-600">Ends</p>
                        <p className="font-semibold">
                          {new Date(auction.auctionEndsAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <Link to={`/auctions/${auction._id}`}>
                      <Button variant="secondary">View Details</Button>
                    </Link>

                    {auction.status === 'APPROVED' &&
                      auction.currentHighestBidAmount > 0 &&
                      !auction.lockedDeal?.isLocked && (
                        <Button
                          variant="primary"
                          onClick={() => handleLockDeal(auction._id)}
                        >
                          Lock Deal
                        </Button>
                      )}

                    {auction.lockedDeal?.isLocked && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-700">
                          ✓ Deal Locked
                        </span>
                        {auction.lockedDeal.isPaid && (
                          <span className="text-sm font-medium text-blue-700">
                            • Payment Received
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAuctionsPage;
