import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [pendingAuctions, setPendingAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [approvalDates, setApprovalDates] = useState({
    auctionStartsAt: new Date().toISOString().slice(0, 16),
    auctionEndsAt: '',
  });

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-red-600">Access denied: Admin only</p>
        <Button onClick={() => navigate('/marketplace')} className="mt-4">
          Go to Marketplace
        </Button>
      </div>
    );
  }

  useEffect(() => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (auction) => {
    setSelectedAuction(auction);
    // Set default end date to 15 days from now
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
        showSuccess('Auction approved successfully!');
        setModalOpen(false);
        fetchPendingAuctions();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve auction');
    }
  };

  const handleReject = async (auctionId) => {
    if (!window.confirm('Are you sure you want to reject this auction?')) {
      return;
    }

    try {
      const { data } = await api.post(`/admin/auctions/${auctionId}/reject`);
      if (data.success) {
        showSuccess('Auction rejected');
        fetchPendingAuctions();
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to reject auction');
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
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Pending Auctions ({pendingAuctions.length})
        </h2>

        {pendingAuctions.length === 0 ? (
          <p className="text-gray-600">No pending auctions</p>
        ) : (
          <div className="space-y-4">
            {pendingAuctions.map((auction) => (
              <div key={auction._id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="w-32 h-32 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                    {auction.images?.[0] ? (
                      <img
                        src={auction.images[0].url}
                        alt={auction.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🌾
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{auction.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {auction.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Farmer</p>
                        <p className="font-semibold">{auction.farmer?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Category</p>
                        <p className="font-semibold">{auction.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Quantity</p>
                        <p className="font-semibold">
                          {auction.quantity} {auction.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Min Price</p>
                        <p className="font-semibold">₹{auction.minPrice}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Location</p>
                        <p className="font-semibold">
                          {auction.location?.district}, {auction.location?.state}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Created</p>
                        <p className="font-semibold">
                          {new Date(auction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="primary"
                        onClick={() => handleApproveClick(auction)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleReject(auction._id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Approve Auction"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Set the auction start and end dates for:{' '}
            <span className="font-semibold">{selectedAuction?.title}</span>
          </p>

          <Input
            label="Auction Starts At"
            type="datetime-local"
            value={approvalDates.auctionStartsAt}
            onChange={(e) =>
              setApprovalDates({ ...approvalDates, auctionStartsAt: e.target.value })
            }
            required
          />

          <Input
            label="Auction Ends At"
            type="datetime-local"
            value={approvalDates.auctionEndsAt}
            onChange={(e) =>
              setApprovalDates({ ...approvalDates, auctionEndsAt: e.target.value })
            }
            required
            min={approvalDates.auctionStartsAt}
          />

          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApprove} className="flex-1">
              Approve
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;