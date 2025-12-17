import { useTranslation } from 'react-i18next';
import Input from '../common/Input';
import Button from '../common/Button';

const AuctionFilters = ({ filters, setFilters, onClear }) => {
  const { t } = useTranslation();

  const categories = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Pulses',
    'Spices',
    'Other',
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
    <div className="card mb-6">
      <h3 className="text-lg font-semibold mb-4">{t('common.filter')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <Input
          placeholder={t('marketplace.searchPlaceholder')}
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        {/* Category */}
        <select
          className="input-field"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">{t('marketplace.category')} - All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* State */}
        <select
          className="input-field"
          value={filters.state}
          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
        >
          <option value="">{t('marketplace.location')} - All</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-4">
        <Button variant="secondary" onClick={onClear}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default AuctionFilters;
