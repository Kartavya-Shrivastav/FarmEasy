import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setAuctions, setLoading } from './auctionSlice';
import AuctionCard from '../../components/auction/AuctionCard';
import AuctionFilters from '../../components/auction/AuctionFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const MarketplacePage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { auctions, loading } = useAppSelector((state) => state.auctions);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    state: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchAuctions();
  }, [filters]);

  const fetchAuctions = async () => {
    dispatch(setLoading(true));
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('q', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.state) params.append('state', filters.state);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const { data } = await api.get(`/auctions?${params.toString()}`);
      if (data.success) {
        dispatch(setAuctions(data.auctions));
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      state: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('marketplace.title')}</h1>

      <AuctionFilters
        filters={filters}
        setFilters={setFilters}
        onClear={handleClearFilters}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : auctions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">{t('marketplace.noAuctions')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {auctions.map((auction) => (
            <AuctionCard key={auction._id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
