import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Gavel, TrendingUp, IndianRupee, Info, AlertCircle, X } from 'lucide-react';

const BidModal = ({ isOpen, onClose, auction, onBidSuccess }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const minAllowedBid =
    auction.currentHighestBidAmount > 0
      ? auction.currentHighestBidAmount + auction.minBidHop
      : auction.minPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const bidAmount = Number(amount);

    if (!bidAmount || bidAmount < minAllowedBid) {
      setError(`Minimum bid must be ₹${minAllowedBid.toLocaleString('en-IN')}`);
      return;
    }

    setLoading(true);
    try {
      await onBidSuccess(bidAmount);
      setAmount('');
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to place bid';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const suggestedBids = [
    minAllowedBid,
    minAllowedBid + auction.minBidHop,
    minAllowedBid + auction.minBidHop * 2,
    minAllowedBid + auction.minBidHop * 3,
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('auction.placeBid')}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Auction Info */}
        <div className="bg-linear-to-br from-[#ea7f61] to-[#d85f3f] rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Gavel className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Bidding on</span>
          </div>
          <h3 className="text-xl font-bold mb-4">{auction.title}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs opacity-75 mb-1">Current Highest Bid</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <p className="text-2xl font-bold">
                  ₹{(auction.currentHighestBidAmount || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs opacity-75 mb-1">Minimum Next Bid</p>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                <p className="text-2xl font-bold">₹{minAllowedBid.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-700 font-medium">Bid Increment: ₹{auction.minBidHop}</p>
            <p className="text-xs text-blue-600 mt-1">Your bid must be at least ₹{minAllowedBid.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Bid Amount Input */}
        <div>
          <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
            Your Bid Amount (₹) *
          </label>
          <div className="relative">
            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              placeholder={`Min: ${minAllowedBid.toLocaleString('en-IN')}`}
              min={minAllowedBid}
              required
              className="w-full h-14 pl-12 pr-4 border-2 border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] placeholder:text-[#6B6B6B] text-lg font-bold"
            />
          </div>
        </div>

        {/* Quick Bid Suggestions */}
        <div>
          <p className="text-sm font-bold text-[#2D2D2D] mb-3">Quick Bid Suggestions</p>
          <div className="grid grid-cols-2 gap-2">
            {suggestedBids.map((suggestedBid, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setAmount(suggestedBid.toString())}
                className="px-4 py-2.5 border-2 border-[#E5DED3] rounded-xl text-sm font-bold text-[#2D2D2D] hover:border-[#ea7f61] hover:bg-[#ea7f61]/5 transition-all"
              >
                ₹{suggestedBid.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-[#E5DED3] text-[#2D2D2D] font-bold py-3 px-4 rounded-xl bg-white hover:bg-[#F5F2ED] transition-all disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Gavel className="w-4 h-4" />
                {t('common.submit')}
              </>
            )}
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-[#6B6B6B] text-center">
          By placing a bid, you agree to purchase if you win the auction.
        </p>
      </form>
    </Modal>
  );
};

export default BidModal;
