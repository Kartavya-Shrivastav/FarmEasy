import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../app/hooks';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';
import { 
  Package, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Image as ImageIcon,
  Info,
  Upload,
  X,
  AlertCircle,
  Plus
} from 'lucide-react';


const CreateAuctionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'vegetables',
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


  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const categories = ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'other'];
  const units = ['kg', 'quintal', 'ton', 'piece', 'dozen'];


  // Redirect if not farmer
  if (user?.role !== 'farmer') {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F5F2ED] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">{t('createAuction.accessDenied')}</h2>
          <p className="text-[#6B6B6B] mb-6">{t('createAuction.accessDeniedMessage')}</p>
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


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      showError(t('createAuction.maxImagesError'));
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
    const formDataObj = new FormData();
    imageFiles.forEach((file) => {
      formDataObj.append('images', file);
    });


    try {
      const { data } = await api.post('/upload', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.images;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error(t('createAuction.imageUploadError'));
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
        showSuccess(t('createAuction.successMessage'));
        navigate('/my-auctions');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || t('createAuction.auctionError');
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#F5F2ED] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#ea7f61] flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2D2D2D]">{t('createAuction.title')}</h1>
              <p className="text-[#6B6B6B]">{t('createAuction.subtitle')}</p>
            </div>
          </div>
        </div>


        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-700 font-medium">{t('createAuction.reviewInfo')}</p>
            <p className="text-xs text-blue-600 mt-1">{t('createAuction.accuracyInfo')}</p>
          </div>
        </div>


        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#ea7f61]/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-[#ea7f61]" />
              </div>
              <h2 className="text-xl font-bold text-[#2D2D2D]">{t('createAuction.basicInfo')}</h2>
            </div>


            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                  {t('createAuction.productTitle')} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder={t('createAuction.productTitlePlaceholder')}
                  maxLength={120}
                  className="w-full h-12 px-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] placeholder:text-[#6B6B6B]"
                />
                <p className="text-xs text-[#6B6B6B] mt-1">{t('createAuction.charactersCount', { count: formData.title.length, max: 120 })}</p>
              </div>


              <div>
                <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                  {t('createAuction.description')} *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder={t('createAuction.descriptionPlaceholder')}
                  maxLength={2000}
                  className="w-full px-4 py-3 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] placeholder:text-[#6B6B6B] resize-none"
                />
                <p className="text-xs text-[#6B6B6B] mt-1">{t('createAuction.charactersCount', { count: formData.description.length, max: 2000 })}</p>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                    {t('createAuction.category')} *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
                    ))}
                  </select>
                </div>


                <div>
                  <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                    {t('createAuction.unit')} *
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] bg-white"
                  >
                    {units.map((unit) => (
                      <option key={unit} value={unit}>{t(`units.${unit}`)}</option>
                    ))}
                  </select>
                </div>
              </div>


              <div>
                <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                  {t('createAuction.quantity')} *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="100"
                  className="w-full h-12 px-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] placeholder:text-[#6B6B6B]"
                />
              </div>
            </div>
          </div>


          {/* Location */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#ea7f61]/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#ea7f61]" />
              </div>
              <h2 className="text-xl font-bold text-[#2D2D2D]">{t('createAuction.locationDetails')}</h2>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                  {t('createAuction.state')} *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder={t('createAuction.statePlaceholder')}
                  className="w-full h-12 px-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] placeholder:text-[#6B6B6B]"
                />
              </div>


              <div>
                <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                  {t('createAuction.district')} *
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  placeholder={t('createAuction.districtPlaceholder')}
                  className="w-full h-12 px-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] placeholder:text-[#6B6B6B]"
                />
              </div>


              <div>
                <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                  {t('createAuction.village')}
                </label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder={t('createAuction.villagePlaceholder')}
                  className="w-full h-12 px-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] placeholder:text-[#6B6B6B]"
                />
              </div>
            </div>
          </div>


          {/* Dates */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#ea7f61]/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#ea7f61]" />
              </div>
              <h2 className="text-xl font-bold text-[#2D2D2D]">{t('createAuction.auctionTiming')}</h2>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                  {t('createAuction.dateOfEntry')} *
                </label>
                <input
                  type="date"
                  name="dateOfEntry"
                  value={formData.dateOfEntry}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D]"
                />
              </div>


              <div>
                <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                  {t('createAuction.expiresAt')} *
                </label>
                <input
                  type="date"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-12 px-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D]"
                />
              </div>
            </div>
          </div>


          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#ea7f61]/10 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-[#ea7f61]" />
              </div>
              <h2 className="text-xl font-bold text-[#2D2D2D]">{t('createAuction.quantityAndPricing')}</h2>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                  {t('createAuction.minPrice')} *
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder={t('createAuction.minPricePlaceholder')}
                  className="w-full h-12 px-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] placeholder:text-[#6B6B6B]"
                />
              </div>


              <div>
                <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
                  {t('createAuction.minBidIncrement')} *
                </label>
                <input
                  type="number"
                  name="minBidHop"
                  value={formData.minBidHop}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="50"
                  className="w-full h-12 px-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] placeholder:text-[#6B6B6B]"
                />
              </div>
            </div>
          </div>


          {/* Images */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#ea7f61]/10 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-[#ea7f61]" />
              </div>
              <h2 className="text-xl font-bold text-[#2D2D2D]">{t('createAuction.uploadImages')}</h2>
            </div>


            <div className="space-y-4">
              <label className="block">
                <div className="border-2 border-dashed border-[#E5DED3] rounded-xl p-8 text-center hover:border-[#ea7f61] transition-colors cursor-pointer bg-[#F5F2ED]/30">
                  <Upload className="w-8 h-8 text-[#ea7f61] mx-auto mb-3" />
                  <p className="text-sm font-bold text-[#2D2D2D] mb-1">
                    {t('createAuction.clickToUpload')}
                  </p>
                  <p className="text-xs text-[#6B6B6B]">
                    {t('createAuction.maxImages')}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={imageFiles.length >= 5}
                  />
                </div>
              </label>


              {imageFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-28 object-cover rounded-xl border-2 border-[#E5DED3]"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>


          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate('/my-auctions')}
              disabled={loading || uploading}
              className="flex-1 border-2 border-[#E5DED3] text-[#2D2D2D] font-bold py-3 px-6 rounded-xl bg-white hover:bg-[#F5F2ED] transition-all disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading || uploading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>{uploading ? t('createAuction.uploading') : t('createAuction.creating')}</span>
                </>
              ) : (
                t('createAuction.createAuction')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default CreateAuctionPage;
