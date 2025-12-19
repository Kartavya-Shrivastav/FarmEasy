import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { showSuccess, showError } from '../../utils/toast';
import api from '../../services/api';

const ReviewModal = ({ isOpen, onClose, auction, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post(`/auctions/${auction._id}/review`, {
        rating,
        comment,
      });

      if (data.success) {
        showSuccess('Review submitted successfully!');
        onSuccess();
        onClose();
        setRating(5);
        setComment('');
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate this Farmer">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            How was your experience buying from{' '}
            <span className="font-semibold">{auction.farmer?.name}</span>?
          </p>
        </div>

        {/* Star Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-3xl transition-all"
              >
                {star <= (hoveredRating || rating) ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {rating === 5 && 'Excellent!'}
            {rating === 4 && 'Very Good'}
            {rating === 3 && 'Good'}
            {rating === 2 && 'Fair'}
            {rating === 1 && 'Poor'}
          </p>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comment (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={500}
            className="input-field"
            placeholder="Share your experience..."
          />
          <p className="text-xs text-gray-500 mt-1">{comment.length}/500</p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Submit Review'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;
