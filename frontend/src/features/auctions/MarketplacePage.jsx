import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setAuctions, setLoading } from './auctionSlice';
import AuctionCard from '../../components/auction/AuctionCard';
import AuctionFilters from '../../components/auction/AuctionFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { Search, Package, TrendingUp } from 'lucide-react';


const MarketplacePage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { auctions, loading } = useAppSelector((state) => state.auctions);
  const [isVisible, setIsVisible] = useState(false);
  const auctionsRef = useRef(null);
  const [auctionsVisible, setAuctionsVisible] = useState(false);


  const [filters, setFilters] = useState({
    search: '',
    category: '',
    state: '',
    minPrice: '',
    maxPrice: '',
  });


  useEffect(() => {
    setIsVisible(true);
    fetchAuctions();
  }, [filters]);


  // Intersection Observer for auction cards
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };


    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAuctionsVisible(true);
        }
      });
    };


    const observer = new IntersectionObserver(observerCallback, observerOptions);


    if (auctionsRef.current) {
      observer.observe(auctionsRef.current);
    }


    return () => observer.disconnect();
  }, [auctions]);


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
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>


      <div className="min-h-screen bg-[#F5F2ED]">
        {/* Header Section */}
        <div className="bg-white border-b border-[#E5DED3]">
          <div className="container mx-auto px-4 py-12">
            <div 
              className={`text-center max-w-3xl mx-auto ${isVisible ? 'opacity-0 translate-y-4' : 'opacity-0'}`}
              style={isVisible ? {
                animation: 'slideUp 0.6s ease-out 0.1s forwards'
              } : {}}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ea7f61]/10 rounded-full text-[#ea7f61] text-sm font-bold mb-4">
                <Package className="w-4 h-4" />
                {t('marketplace.freshFromFarms')}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-4">
                {t('marketplace.title')}
              </h1>
              <p className="text-lg text-[#6B6B6B]">
                {t('marketplace.subtitle')}
              </p>
            </div>
          </div>
        </div>


        {/* Stats Bar */}
        <div 
          className={`bg-white border-b border-[#E5DED3] ${isVisible ? 'opacity-0' : 'opacity-0'}`}
          style={isVisible ? {
            animation: 'fadeIn 0.6s ease-out 0.3s forwards'
          } : {}}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#ea7f61]/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#ea7f61]" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-[#2D2D2D]">{auctions.length}</p>
                  <p className="text-sm text-[#6B6B6B]">{t('marketplace.activeAuctions')}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#ea7f61]/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#ea7f61]" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-[#2D2D2D]">{t('marketplace.live')}</p>
                  <p className="text-sm text-[#6B6B6B]">{t('marketplace.realTimeBidding')}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#ea7f61]/10 flex items-center justify-center">
                  <Search className="w-6 h-6 text-[#ea7f61]" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-[#2D2D2D]">{t('marketplace.filter')}</p>
                  <p className="text-sm text-[#6B6B6B]">{t('marketplace.findWhatYouNeed')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Filters Section */}
          <div 
            className={`mb-8 ${isVisible ? 'opacity-0 translate-y-4' : 'opacity-0'}`}
            style={isVisible ? {
              animation: 'slideUp 0.6s ease-out 0.4s forwards'
            } : {}}
          >
            <AuctionFilters
              filters={filters}
              setFilters={setFilters}
              onClear={handleClearFilters}
            />
          </div>


          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-[#E5DED3] border-t-[#ea7f61] rounded-full animate-spin mb-4"></div>
              <p className="text-[#6B6B6B] font-medium">{t('marketplace.loadingAuctions')}</p>
            </div>
          ) : auctions.length === 0 ? (
            /* Empty State */
            <div 
              className="text-center py-20"
              style={{
                animation: 'fadeIn 0.6s ease-out'
              }}
            >
              <div className="w-24 h-24 bg-[#ea7f61]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-[#ea7f61]" />
              </div>
              <h3 className="text-2xl font-bold text-[#2D2D2D] mb-3">
                {t('marketplace.noAuctions')}
              </h3>
              <p className="text-[#6B6B6B] mb-6 max-w-md mx-auto">
                {t('marketplace.noAuctionsMessage')}
              </p>
              {(filters.search || filters.category || filters.state || filters.minPrice || filters.maxPrice) && (
                <button
                  onClick={handleClearFilters}
                  className="bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {t('marketplace.clearAllFilters')}
                </button>
              )}
            </div>
          ) : (
            /* Auction Cards Grid */
            <div ref={auctionsRef}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {auctions.map((auction, index) => (
                  <div
                    key={auction._id}
                    className={`${auctionsVisible ? 'opacity-0 translate-y-4' : 'opacity-0'}`}
                    style={auctionsVisible ? {
                      animation: `slideUp 0.6s ease-out ${0.1 + index * 0.05}s forwards`
                    } : {}}
                  >
                    <AuctionCard auction={auction} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};


export default MarketplacePage;
