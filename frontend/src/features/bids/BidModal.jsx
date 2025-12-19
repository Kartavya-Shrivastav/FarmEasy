import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
      setError(`Minimum bid must be ₹${minAllowedBid}`);
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('auction.placeBid')}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Current Highest Bid: <span className="font-bold text-primary-600">₹{auction.currentHighestBidAmount || 0}</span>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Minimum Bid: <span className="font-bold">₹{minAllowedBid}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <Input
          label="Your Bid Amount (₹)"
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError('');
          }}
          placeholder={`Min: ₹${minAllowedBid}`}
          min={minAllowedBid}
          required
        />

        <div className="flex gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={loading} className="flex-1">
            {loading ? <LoadingSpinner size="sm" /> : t('common.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BidModal;
