import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/Modal';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { showSuccess, showError } from '../../utils/toast';
import api from '../../services/api';
import { Star, X } from 'lucide-react';


const ReviewModal = ({ isOpen, onClose, auction, onSuccess }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);


  useEffect(() => {
    if (!isOpen) {
      setRating(5);
      setComment('');
      setHoveredRating(0);
    }
  }, [isOpen]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;


    setLoading(true);


    try {
      const { data } = await api.post(`/auctions/${auction._id}/review`, {
        rating,
        comment,
      });


      if (data.success) {
        showSuccess(t('review.submitSuccess'));
        onSuccess();
        onClose();
      }
    } catch (error) {
      showError(error.response?.data?.message || t('review.submitError'));
    } finally {
      setLoading(false);
    }
  };


  const getRatingLabel = (value) => {
    switch (value) {
      case 5:
        return t('review.ratingLabels.excellent');
      case 4:
        return t('review.ratingLabels.veryGood');
      case 3:
        return t('review.ratingLabels.good');
      case 2:
        return t('review.ratingLabels.fair');
      case 1:
        return t('review.ratingLabels.poor');
      default:
        return '';
    }
  };


  const activeRating = hoveredRating || rating;


  return (
    <>
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>


      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t('review.title')}
      >
        <div
          className="animate-[scaleIn_0.2s_ease-out]"
        >
          {/* Header text */}
          <div className="mb-4">
            <p className="text-sm text-[#6B6B6B]">
              {t('review.experienceQuestion', { name: auction.farmer?.name })}
            </p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                {t('review.ratingLabel')}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = star <= activeRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="group"
                    >
                      <Star
                        className={`w-8 h-8 transition-all drop-shadow-sm ${
                          filled
                            ? 'fill-[#ea7f61] text-[#ea7f61]'
                            : 'text-[#E5DED3] group-hover:text-[#ea7f61]'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-3 text-sm font-medium text-[#2D2D2D]">
                  {activeRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-[#6B6B6B] mt-1">
                {getRatingLabel(activeRating)}
              </p>
            </div>


            {/* Comment */}
            <div>
              <label className="block text-sm font-bold text-[#2D2D2D] mb-1">
                {t('review.commentLabel')} <span className="text-[#6B6B6B] font-normal">({t('review.optional')})</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={500}
                className="w-full rounded-xl border border-[#E5DED3] bg-white px-3 py-2 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent resize-none"
                placeholder={t('review.commentPlaceholder')}
              />
              <p className="text-xs text-[#6B6B6B] mt-1 text-right">
                {comment.length}/500
              </p>
            </div>


            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-[#E5DED3] text-[#2D2D2D] font-bold py-2.5 px-4 rounded-xl bg-white hover:bg-[#F5F2ED] transition-all disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  t('review.submitButton')
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};


export default ReviewModal;
