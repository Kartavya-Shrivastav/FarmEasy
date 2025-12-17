import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../app/hooks';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const CreateAuctionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Vegetables',
    quantity: '',
    unit: 'kg',
    state: '',
    district: '',
    village: '',
    dateOfEntry: new Date().toISOString().split('T')[0],
    expiresAt: '',
    minPrice: '',
    minBidHop: '',
  });

  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Other'];
  const units = ['kg', 'quintal', 'ton', 'piece', 'dozen'];

  // Redirect if not farmer
  if (user?.role !== 'farmer') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-red-600">Only farmers can create auctions</p>
        <Button onClick={() => navigate('/marketplace')} className="mt-4">
          Go to Marketplace
        </Button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setImageFiles([...imageFiles, ...files]);
  };

  const removeImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];

    setUploading(true);
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.images;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Upload images first
      const uploadedImages = await uploadImages();

      // Create auction
      const payload = {
        ...formData,
        location: {
          state: formData.state,
          district: formData.district,
          village: formData.village,
        },
        images: uploadedImages,
        quantity: Number(formData.quantity),
        minPrice: Number(formData.minPrice),
        minBidHop: Number(formData.minBidHop),
      };

      delete payload.state;
      delete payload.district;
      delete payload.village;

      const { data } = await api.post('/auctions', payload);

      if (data.success) {
        alert('Auction created successfully! Waiting for admin approval.');
        navigate('/my-auctions');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create auction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Create New Auction</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        {/* Basic Info */}
        <h2 className="text-xl font-semibold mb-4">Product Information</h2>

        <Input
          label="Product Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g., Fresh Organic Tomatoes"
          maxLength={120}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input-field"
            placeholder="Describe your product..."
            maxLength={2000}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            placeholder="100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="input-field"
            required
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <h2 className="text-xl font-semibold mb-4 mt-6">Location</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Punjab"
          />

          <Input
            label="District"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="Ludhiana"
          />

          <Input
            label="Village (Optional)"
            name="village"
            value={formData.village}
            onChange={handleChange}
            placeholder="Samrala"
          />
        </div>

        {/* Dates */}
        <h2 className="text-xl font-semibold mb-4 mt-6">Dates</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date of Entry"
            type="date"
            name="dateOfEntry"
            value={formData.dateOfEntry}
            onChange={handleChange}
            required
          />

          <Input
            label="Expires At"
            type="date"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Pricing */}
        <h2 className="text-xl font-semibold mb-4 mt-6">Pricing</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Minimum Price (₹)"
            type="number"
            name="minPrice"
            value={formData.minPrice}
            onChange={handleChange}
            required
            min="0"
            placeholder="1000"
          />

          <Input
            label="Minimum Bid Increment (₹)"
            type="number"
            name="minBidHop"
            value={formData.minBidHop}
            required
            onChange={handleChange}
            min="1"
            placeholder="50"
          />
        </div>

        {/* Images */}
        <h2 className="text-xl font-semibold mb-4 mt-6">Product Images</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images (Max 5, up to 5MB each)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="input-field"
            disabled={imageFiles.length >= 5}
          />
        </div>

        {imageFiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {imageFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-4 mt-8">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/my-auctions')}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || uploading}
            className="flex-1"
          >
            {loading || uploading ? (
              <LoadingSpinner size="sm" />
            ) : (
              'Create Auction'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAuctionPage;
