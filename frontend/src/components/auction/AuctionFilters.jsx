import { useTranslation } from 'react-i18next';
import { Search, X, MapPin, Tag } from 'lucide-react';


const AuctionFilters = ({ filters, setFilters, onClear }) => {
  const { t } = useTranslation();


  const categories = [
    'vegetables',
    'fruits',
    'grains',
    'pulses',
    'spices',
    'other',
  ];


  const states = [
    'Maharashtra',
    'Punjab',
    'Haryana',
    'Uttar Pradesh',
    'Karnataka',
    'Gujarat',
    'Rajasthan',
    'Other',
  ];


  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#2D2D2D] flex items-center gap-2">
          <Search className="w-5 h-5 text-[#ea7f61]" />
          {t('common.filter')}
        </h3>
        {(filters.search || filters.category || filters.state || filters.minPrice || filters.maxPrice) && (
          <button
            onClick={onClear}
            className="text-sm text-[#6B6B6B] hover:text-[#ea7f61] font-bold flex items-center gap-2 transition-colors"
          >
            <X className="w-4 h-4" />
            {t('marketplace.clearAll')}
          </button>
        )}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
            {t('common.search')}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
            <input
              type="text"
              placeholder={t('marketplace.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full h-12 pl-11 pr-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] placeholder:text-[#6B6B6B]"
            />
          </div>
        </div>


        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
            {t('marketplace.category')}
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B] pointer-events-none z-10" />
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full h-12 pl-11 pr-10 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] bg-white appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B6B6B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.25rem'
              }}
            >
              <option value="">{t('marketplace.allCategories')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`categories.${cat}`)}
                </option>
              ))}
            </select>
          </div>
        </div>


        {/* State */}
        <div>
          <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
            {t('marketplace.location')}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B] pointer-events-none z-10" />
            <select
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              className="w-full h-12 pl-11 pr-10 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] bg-white appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B6B6B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.25rem'
              }}
            >
              <option value="">{t('marketplace.allLocations')}</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>


        {/* Price Range */}
        <div>
          <label className="block text-sm font-bold text-[#2D2D2D] mb-2">
            {t('marketplace.priceRange')}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={t('marketplace.minPricePlaceholder')}
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="w-full h-12 px-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] placeholder:text-[#6B6B6B]"
            />
            <input
              type="number"
              placeholder={t('marketplace.maxPricePlaceholder')}
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="w-full h-12 px-4 border border-[#E5DED3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea7f61] focus:border-transparent transition-all text-[#2D2D2D] placeholder:text-[#6B6B6B]"
            />
          </div>
        </div>
      </div>


      {/* Active Filters Display */}
      {(filters.search || filters.category || filters.state || filters.minPrice || filters.maxPrice) && (
        <div className="mt-6 pt-6 border-t border-[#E5DED3]">
          <p className="text-sm font-bold text-[#2D2D2D] mb-3">{t('marketplace.activeFilters')}:</p>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ea7f61]/10 text-[#ea7f61] rounded-lg text-sm font-medium">
                {t('marketplace.searchLabel')}: "{filters.search}"
                <button 
                  onClick={() => setFilters({ ...filters, search: '' })}
                  className="hover:bg-[#ea7f61]/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ea7f61]/10 text-[#ea7f61] rounded-lg text-sm font-medium">
                {t('marketplace.categoryLabel')}: {t(`categories.${filters.category}`)}
                <button 
                  onClick={() => setFilters({ ...filters, category: '' })}
                  className="hover:bg-[#ea7f61]/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {filters.state && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ea7f61]/10 text-[#ea7f61] rounded-lg text-sm font-medium">
                {t('marketplace.locationLabel')}: {filters.state}
                <button 
                  onClick={() => setFilters({ ...filters, state: '' })}
                  className="hover:bg-[#ea7f61]/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ea7f61]/10 text-[#ea7f61] rounded-lg text-sm font-medium">
                {t('marketplace.priceLabel')}: ₹{filters.minPrice || '0'} - ₹{filters.maxPrice || '∞'}
                <button 
                  onClick={() => setFilters({ ...filters, minPrice: '', maxPrice: '' })}
                  className="hover:bg-[#ea7f61]/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionFilters;
