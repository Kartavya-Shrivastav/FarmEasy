import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { showSuccess, showError } from '../../utils/toast';
import api from '../../services/api';
import { 
  CheckCircle, 
  XCircle, 
  User, 
  Package, 
  IndianRupee, 
  Tag,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';


const PendingAuctions = ({ auctions, onUpdate }) => {
  const { t, i18n } = useTranslation();
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [approvalDates, setApprovalDates] = useState({
    auctionStartsAt: new Date().toISOString().slice(0, 16),
    auctionEndsAt: '',
  });


  const handleApproveClick = (auction) => {
    setSelectedAuction(auction);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 15);
    setApprovalDates({
      auctionStartsAt: new Date().toISOString().slice(0, 16),
      auctionEndsAt: endDate.toISOString().slice(0, 16),
    });
    setModalOpen(true);
  };


  const handleApprove = async () => {
    try {
      const { data } = await api.post(
        `/admin/auctions/${selectedAuction._id}/approve`,
        approvalDates
      );
      if (data.success) {
        showSuccess(t('admin.approveSuccess'));
        setModalOpen(false);
        onUpdate();
      }
    } catch (error) {
      showError(error.response?.data?.message || t('admin.approveError'));
    }
  };


  const handleReject = async (auctionId) => {
    if (!window.confirm(t('admin.rejectConfirm'))) {
      return;
    }


    try {
      const { data } = await api.post(`/admin/auctions/${auctionId}/reject`);
      if (data.success) {
        showSuccess(t('admin.rejectSuccess'));
        onUpdate();
      }
    } catch (error) {
      showError(error.response?.data?.message || t('admin.rejectError'));
    }
  };


  if (auctions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 border border-[#E5DED3] text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">{t('admin.allCaughtUp')}</h3>
        <p className="text-[#6B6B6B]">{t('admin.noPendingAuctions')}</p>
        <p className="text-sm text-[#6B6B6B] mt-1">{t('admin.allAuctionsReviewed')}</p>
      </div>
    );
  }


  return (
    <>
      <div className="space-y-6">
        {auctions.map((auction) => (
          <div 
            key={auction._id} 
            className="bg-white rounded-2xl shadow-lg border-2 border-amber-200 overflow-hidden hover:shadow-xl transition-all"
          >
            {/* Pending Badge Bar */}
            <div className="bg-linear-to-r from-amber-400 to-amber-500 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-bold">{t('admin.pendingApprovalBadge')}</span>
              </div>
              <span className="text-xs text-white/90">{t('admin.awaitingReview')}</span>
            </div>


            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="relative w-full md:w-40 h-40 bg-linear-to-br from-[#F5F2ED] to-[#E5DED3] rounded-xl overflow-hidden shrink-0">
                  {auction.images?.[0] ? (
                    <img
                      src={auction.images[0].url}
                      alt={auction.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🌾
                    </div>
                  )}
                  {auction.images && auction.images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      {auction.images.length}
                    </div>
                  )}
                </div>


                {/* Details */}
                <div className="flex-1 space-y-4">
                  {/* Title */}
                  <div>
                    <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">{auction.title}</h3>
                    <p className="text-sm text-[#6B6B6B] line-clamp-2">
                      {auction.description}
                    </p>
                  </div>


                  {/* Info Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#ea7f61]/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-[#ea7f61]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6B6B6B]">{t('admin.farmer')}</p>
                        <p className="text-sm font-bold text-[#2D2D2D] truncate">
                          {auction.farmer?.name}
                        </p>
                      </div>
                    </div>


                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#ea7f61]/10 flex items-center justify-center shrink-0">
                        <Tag className="w-4 h-4 text-[#ea7f61]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6B6B6B]">{t('admin.category')}</p>
                        <p className="text-sm font-bold text-[#2D2D2D]">
                          {t(`categories.${auction.category.toLowerCase()}`, auction.category)}
                        </p>
                      </div>
                    </div>


                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#ea7f61]/10 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-[#ea7f61]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6B6B6B]">{t('admin.quantity')}</p>
                        <p className="text-sm font-bold text-[#2D2D2D]">
                          {auction.quantity} {t(`units.${auction.unit.toLowerCase()}`, auction.unit)}
                        </p>
                      </div>
                    </div>


                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#ea7f61]/10 flex items-center justify-center shrink-0">
                        <IndianRupee className="w-4 h-4 text-[#ea7f61]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6B6B6B]">{t('admin.minPrice')}</p>
                        <p className="text-sm font-bold text-[#2D2D2D]">
                          ₹{auction.minPrice.toLocaleString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>


                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => handleApproveClick(auction)}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {t('admin.approveButton')}
                    </button>
                    <button
                      onClick={() => handleReject(auction._id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      <XCircle className="w-4 h-4" />
                      {t('admin.rejectButton')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Approval Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('admin.approveModalTitle')}
      >
        <div className="space-y-5">
          <div className="bg-[#F5F2ED] rounded-xl p-4">
            <p className="text-sm text-[#6B6B6B] mb-1">{t('admin.approvingAuction')}:</p>
            <p className="font-bold text-[#2D2D2D]">{selectedAuction?.title}</p>
          </div>


          <div>
            <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
              {t('admin.auctionStartsAt')}
            </label>
            <input
              type="datetime-local"
              value={approvalDates.auctionStartsAt}
              onChange={(e) =>
                setApprovalDates({ ...approvalDates, auctionStartsAt: e.target.value })
              }
              required
              className="w-full h-12 px-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D]"
            />
          </div>


          <div>
            <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
              {t('admin.auctionEndsAt')}
            </label>
            <input
              type="datetime-local"
              value={approvalDates.auctionEndsAt}
              onChange={(e) =>
                setApprovalDates({ ...approvalDates, auctionEndsAt: e.target.value })
              }
              required
              min={approvalDates.auctionStartsAt}
              className="w-full h-12 px-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D]"
            />
          </div>


          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 border-2 border-[#E5DED3] text-[#2D2D2D] font-bold py-2.5 px-4 rounded-xl bg-white hover:bg-[#F5F2ED] transition-all"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleApprove}
              className="flex-1 bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              {t('admin.approveAuctionButton')}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};


export default PendingAuctions;
