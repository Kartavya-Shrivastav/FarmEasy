import { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const BidHistory = ({ auctionId }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auctionId) {
      fetchBids();
    }
  }, [auctionId]);

  const fetchBids = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/auctions/${auctionId}/bids`);
      if (data.success) {
        setBids(data.bids);
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No bids placed yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-4">Bid History ({bids.length})</h3>
      
      {bids.map((bid, index) => (
        <div
          key={bid._id}
          className={`card ${index === 0 ? 'bg-green-50 border-green-200' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{bid.buyer?.name}</span>
                {index === 0 && (
                  <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                    Highest Bid
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {new Date(bid.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-xl font-bold ${index === 0 ? 'text-green-600' : 'text-gray-700'}`}>
                ₹{bid.amount}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BidHistory;
