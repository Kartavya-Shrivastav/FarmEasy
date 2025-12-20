import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const FarmerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/profile/me');
      if (data.success) {
        setProfile(data.profile);
        
        // Calculate stats
        const auctions = data.profile.myAuctions || [];
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
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card">
          <div className="text-center mb-4">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-4xl">🧑‍🌾</span>
            </div>
            <h2 className="text-xl font-semibold">{profile?.name}</h2>
            <p className="text-sm text-gray-600">{profile?.email}</p>
            <p className="text-xs text-gray-500 mt-1">Farmer Account</p>
          </div>

          {/* Rating */}
          {profile?.averageRating > 0 && (
            <div className="border-t pt-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl">⭐</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {profile.averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {profile.totalReviews || 0} reviews
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-6">
            <Link to="/create-auction">
              <Button variant="primary" className="w-full">
                + Create New Auction
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Total Auctions */}
          <div className="card bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Auctions</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.totalAuctions || 0}</p>
              </div>
              <span className="text-4xl">📦</span>
            </div>
          </div>

          {/* Active Auctions */}
          <div className="card bg-green-50 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Auctions</p>
                <p className="text-3xl font-bold text-green-600">{stats?.activeAuctions || 0}</p>
              </div>
              <span className="text-4xl">🔥</span>
            </div>
          </div>

          {/* Completed Sales */}
          <div className="card bg-purple-50 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Sales</p>
                <p className="text-3xl font-bold text-purple-600">{stats?.completedSales || 0}</p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="card bg-yellow-50 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-yellow-600">₹{stats?.totalEarnings || 0}</p>
              </div>
              <span className="text-4xl">💰</span>
            </div>
          </div>

          {/* Pending Payments */}
          {stats?.pendingPayments > 0 && (
            <div className="card bg-orange-50 border border-orange-200 sm:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingPayments}</p>
                  <p className="text-xs text-gray-500 mt-1">Waiting for buyer payment</p>
                </div>
                <span className="text-4xl">⏳</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      {profile?.reviews && profile.reviews.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reviews from Buyers</h2>
          <div className="space-y-4">
            {profile.reviews.map((review) => (
              <div key={review._id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{review.buyer?.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">
                        {i < review.rating ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Auction: {review.auction?.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/my-auctions" className="flex-1">
            <Button variant="secondary" className="w-full">
              View My Auctions
            </Button>
          </Link>
          <Link to="/create-auction" className="flex-1">
            <Button variant="primary" className="w-full">
              Create New Auction
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
