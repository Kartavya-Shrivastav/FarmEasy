import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AuctionCard = ({ auction }) => {
  const { t } = useTranslation();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <Link to={`/auctions/${auction._id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
          {auction.images && auction.images.length > 0 ? (
            <img
              src={auction.images[0].url}
              alt={auction.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-6xl">🌾</span>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
            {auction.category}
          </div>
          
          {/* Image Count Badge */}
          {auction.images && auction.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <span>📷</span>
              <span>{auction.images.length}</span>
            </div>
          )}
        </div>


        {/* Content */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {auction.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>📦 {auction.quantity} {auction.unit}</span>
          <span>📍 {auction.location?.district || 'N/A'}</span>
        </div>

        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{t('auction.currentBid')}</span>
            <span className="text-xl font-bold text-primary-600">
              ₹{auction.currentHighestBidAmount || auction.minPrice}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {t('auction.endsAt')}: {formatDate(auction.auctionEndsAt)}
            </span>
            <span className="font-medium text-red-600">
              {getTimeRemaining(auction.auctionEndsAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;
