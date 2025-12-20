import { useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { showSuccess, showError } from '../../utils/toast';
import api from '../../services/api';

const PendingAuctions = ({ auctions, onUpdate }) => {
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
        showSuccess('Auction approved successfully!');
        setModalOpen(false);
        onUpdate();
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to approve auction');
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
        onUpdate();
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to reject auction');
    }
  };

  if (auctions.length === 0) {
    return (
      <div className="card text-center py-12">
        <span className="text-6xl mb-4 block">✅</span>
        <p className="text-xl text-gray-600">No pending auctions</p>
        <p className="text-sm text-gray-500 mt-2">All auctions have been reviewed</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {auctions.map((auction) => (
          <div key={auction._id} className="card border-2 border-yellow-200 bg-yellow-50">
            <div className="flex flex-col md:flex-row items-start gap-4">
              {/* Image */}
              <div className="w-full md:w-32 h-32 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
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
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{auction.title}</h3>
                  <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                    PENDING
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {auction.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
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
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="primary"
                    onClick={() => handleApproveClick(auction)}
                    className="flex-1"
                  >
                    ✓ Approve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleReject(auction._id)}
                    className="flex-1"
                  >
                    ✗ Reject
                  </Button>
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
    </>
  );
};

export default PendingAuctions;
