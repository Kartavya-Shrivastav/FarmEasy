import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../app/hooks';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';
import { 
  ShieldCheck, 
  Clock, 
  User, 
  Package, 
  MapPin, 
  Tag, 
  IndianRupee, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';


const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [pendingAuctions, setPendingAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [approvalDates, setApprovalDates] = useState({
    auctionStartsAt: new Date().toISOString().slice(0, 16),
    auctionEndsAt: '',
  });


  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F5F2ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">{t('admin.accessDenied')}</h2>
          <p className="text-[#6B6B6B] mb-6">{t('admin.accessDeniedMessage')}</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
          >
            {t('admin.goToMarketplace')}
          </button>
        </div>
      </div>
    );
  }


  useEffect(() => {
    setIsVisible(true);
    fetchPendingAuctions();
  }, []);


  const fetchPendingAuctions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/auctions/pending');
      if (data.success) {
        setPendingAuctions(data.auctions);
      }
    } catch (error) {
      console.error('Error fetching pending auctions:', error);
      showError(t('admin.fetchError'));
    } finally {
      setLoading(false);
    }
  };


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
        fetchPendingAuctions();
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
        fetchPendingAuctions();
      }
    } catch (error) {
      showError(error.response?.data?.message || t('admin.rejectError'));
    }
  };


  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F5F2ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E5DED3] border-t-[#ea7f61] rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-[#6B6B6B] font-medium">{t('admin.loadingDashboard')}</p>
        </div>
      </div>
    );
  }


  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>


      <div className="min-h-screen bg-[#F5F2ED]">
        {/* Header */}
        <div className="bg-white border-b border-[#E5DED3]">
          <div className="container mx-auto px-4 py-8">
            <div 
              className={`flex items-center gap-3 ${isVisible ? 'opacity-0' : 'opacity-0'}`}
              style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.1s forwards' } : {}}
            >
              <div className="w-12 h-12 rounded-xl bg-[#ea7f61] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#2D2D2D]">{t('admin.dashboard')}</h1>
                <p className="text-[#6B6B6B]">{t('admin.dashboardSubtitle')}</p>
              </div>
            </div>
          </div>
        </div>


        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Stats Card */}
          <div 
            className={`bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3] mb-8 ${isVisible ? 'opacity-0' : 'opacity-0'}`}
            style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.2s forwards' } : {}}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#ea7f61]/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#ea7f61]" />
                </div>
                <div>
                  <p className="text-sm text-[#6B6B6B]">{t('admin.pendingApprovals')}</p>
                  <p className="text-3xl font-bold text-[#2D2D2D]">{pendingAuctions.length}</p>
                </div>
              </div>
              <button
                onClick={fetchPendingAuctions}
                className="text-[#ea7f61] hover:text-[#d85f3f] font-bold text-sm transition-colors"
              >
                {t('admin.refresh')}
              </button>
            </div>
          </div>


          {/* Pending Auctions List */}
          {pendingAuctions.length === 0 ? (
            <div 
              className="bg-white rounded-2xl shadow-lg p-12 border border-[#E5DED3] text-center"
              style={isVisible ? { animation: 'slideUp 0.6s ease-out 0.3s forwards' } : {}}
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">{t('admin.allCaughtUp')}</h3>
              <p className="text-[#6B6B6B]">{t('admin.noPendingAuctions')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingAuctions.map((auction, index) => (
                <div 
                  key={auction._id}
                  className={`bg-white rounded-2xl shadow-lg border border-[#E5DED3] overflow-hidden hover:shadow-xl transition-all ${isVisible ? 'opacity-0' : 'opacity-0'}`}
                  style={isVisible ? { animation: `slideUp 0.6s ease-out ${0.3 + index * 0.1}s forwards` } : {}}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Image */}
                      <div className="relative w-full lg:w-48 h-48 bg-linear-to-br from-[#F5F2ED] to-[#E5DED3] rounded-xl overflow-hidden shrink-0">
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
                        <div className="absolute top-3 left-3 bg-[#ea7f61] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                          {t(`categories.${auction.category.toLowerCase()}`, auction.category)}
                        </div>
                      </div>


                      {/* Details */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-[#2D2D2D] mb-2">{auction.title}</h3>
                          <p className="text-[#6B6B6B] line-clamp-2">{auction.description}</p>
                        </div>


                        {/* Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#ea7f61]/10 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-[#ea7f61]" />
                            </div>
                            <div>
                              <p className="text-xs text-[#6B6B6B]">{t('admin.farmer')}</p>
                              <p className="text-sm font-bold text-[#2D2D2D] truncate">{auction.farmer?.name}</p>
                            </div>
                          </div>


                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#ea7f61]/10 flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4 text-[#ea7f61]" />
                            </div>
                            <div>
                              <p className="text-xs text-[#6B6B6B]">{t('admin.quantity')}</p>
                              <p className="text-sm font-bold text-[#2D2D2D]">{auction.quantity} {t(`units.${auction.unit.toLowerCase()}`, auction.unit)}</p>
                            </div>
                          </div>


                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#ea7f61]/10 flex items-center justify-center shrink-0">
                              <IndianRupee className="w-4 h-4 text-[#ea7f61]" />
                            </div>
                            <div>
                              <p className="text-xs text-[#6B6B6B]">{t('admin.minPrice')}</p>
                              <p className="text-sm font-bold text-[#2D2D2D]">₹{auction.minPrice.toLocaleString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}</p>
                            </div>
                          </div>


                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#ea7f61]/10 flex items-center justify-center shrink-0">
                              <MapPin className="w-4 h-4 text-[#ea7f61]" />
                            </div>
                            <div>
                              <p className="text-xs text-[#6B6B6B]">{t('admin.location')}</p>
                              <p className="text-sm font-bold text-[#2D2D2D] truncate">
                                {auction.location?.district}, {auction.location?.state}
                              </p>
                            </div>
                          </div>


                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#ea7f61]/10 flex items-center justify-center shrink-0">
                              <Calendar className="w-4 h-4 text-[#ea7f61]" />
                            </div>
                            <div>
                              <p className="text-xs text-[#6B6B6B]">{t('admin.submitted')}</p>
                              <p className="text-sm font-bold text-[#2D2D2D]">
                                {new Date(auction.createdAt).toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN', {
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>


                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 pt-4">
                          <button
                            onClick={() => handleApproveClick(auction)}
                            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {t('admin.approveButton')}
                          </button>
                          <button
                            onClick={() => handleReject(auction._id)}
                            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg"
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
          )}
        </div>
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


export default AdminDashboard;
