import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Package, Clock, TrendingUp, Image as ImageIcon, Calendar } from 'lucide-react';


const AuctionCard = ({ auction }) => {
  const { t, i18n } = useTranslation();


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };


  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;


    if (diff <= 0) return { text: t('auction.ended'), urgent: false };


    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));


    if (days > 0) return { 
      text: t('time.daysHoursLeft', { days, hours }), 
      urgent: days < 2 
    };
    return { 
      text: t('time.hoursLeft', { hours }), 
      urgent: true 
    };
  };


  const timeRemaining = getTimeRemaining(auction.auctionEndsAt);


  return (
    <Link to={`/auctions/${auction._id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#E5DED3] group-hover:border-[#ea7f61]/30 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-52 bg-linear-to-br from-[#F5F2ED] to-[#E5DED3] overflow-hidden">
          {auction.images && auction.images.length > 0 ? (
            <img
              src={auction.images[0].url}
              alt={auction.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#ea7f61]/30">
              <span className="text-7xl">🌾</span>
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>


          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-[#ea7f61] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
            {t(`categories.${auction.category.toLowerCase()}`, auction.category)}
          </div>
          
          {/* Image Count Badge */}
          {auction.images && auction.images.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{auction.images.length}</span>
            </div>
          )}


          {/* Time Remaining Badge */}
          {timeRemaining.text !== t('auction.ended') && (
            <div className={`absolute bottom-3 right-3 ${timeRemaining.urgent ? 'bg-red-500' : 'bg-green-500'} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1.5 animate-pulse`}>
              <Clock className="w-3.5 h-3.5" />
              {timeRemaining.text}
            </div>
          )}
        </div>


        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold text-[#2D2D2D] mb-3 line-clamp-2 group-hover:text-[#ea7f61] transition-colors min-h-[3.5rem]">
            {auction.title}
          </h3>


          {/* Info Row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B] bg-[#F5F2ED] px-3 py-1.5 rounded-lg">
              <Package className="w-4 h-4 text-[#ea7f61]" />
              <span className="font-medium">{auction.quantity} {t(`units.${auction.unit.toLowerCase()}`, auction.unit)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B] bg-[#F5F2ED] px-3 py-1.5 rounded-lg flex-1">
              <MapPin className="w-4 h-4 text-[#ea7f61]" />
              <span className="font-medium truncate">{auction.location?.district || 'N/A'}</span>
            </div>
          </div>


          {/* Divider */}
          <div className="border-t border-[#E5DED3] pt-4 mt-auto">
            {/* Current Bid */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                <TrendingUp className="w-4 h-4" />
                <span>{t('auction.currentBid')}</span>
              </div>
              <span className="text-2xl font-bold text-[#ea7f61]">
                ₹{(auction.currentHighestBidAmount || auction.minPrice).toLocaleString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}
              </span>
            </div>


            {/* End Date */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-[#6B6B6B]">
                <Calendar className="w-4 h-4" />
                <span>{t('auction.endsAt')}:</span>
              </div>
              <span className="font-bold text-[#2D2D2D]">
                {formatDate(auction.auctionEndsAt)}
              </span>
            </div>
          </div>


          {/* Hover CTA */}
          <div className="mt-4 pt-4 border-t border-[#E5DED3] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-center gap-2 text-[#ea7f61] font-bold text-sm">
              <span>{t('auction.viewDetails')}</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};


export default AuctionCard;
