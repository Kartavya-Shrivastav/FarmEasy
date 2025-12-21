import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Star, Package } from 'lucide-react';
import api from '../../services/api';


const PublicProfile = () => {
  const { t, i18n } = useTranslation();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchProfile();
  }, [userId]);


  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/profile/${userId}`);
      if (data.success) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E5DED3] border-t-[#ea7f61] rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-[#6B6B6B] font-medium">{t('publicProfile.loading')}</p>
        </div>
      </div>
    );
  }


  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">{t('publicProfile.notFound')}</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#ea7f61] hover:bg-[#d85f3f] text-white font-bold py-2 px-6 rounded-xl transition-all"
          >
            {t('publicProfile.goBack')}
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#F5F2ED] py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#ea7f61] font-bold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('common.back')}
        </button>


        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E5DED3] mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#ea7f61] to-[#d85f3f] flex items-center justify-center shrink-0">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-[#2D2D2D] mb-2">{profile.name}</h1>
              <div className="flex items-center gap-4 mb-3">
                <span className="inline-block bg-[#ea7f61]/10 text-[#ea7f61] px-4 py-1 rounded-full text-sm font-bold capitalize">
                  {t(`publicProfile.role.${profile.role}`)}
                </span>
                {profile.averageRating > 0 && (
                  <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-[#2D2D2D]">{profile.averageRating.toFixed(1)}</span>
                    <span className="text-sm text-[#6B6B6B]">
                      ({t('publicProfile.reviewCount', { count: profile.totalReviews })})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* Farmer's Successful Auctions */}
        {profile.role === 'farmer' && profile.auctions && profile.auctions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3] mb-6">
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-[#ea7f61]" />
              {t('publicProfile.successfulAuctions')}
            </h2>
            <div className="space-y-3">
              {profile.auctions.map((auction) => (
                <div
                  key={auction._id}
                  className="p-4 bg-[#F5F2ED] rounded-xl hover:bg-[#E5DED3] transition-colors cursor-pointer"
                  onClick={() => navigate(`/auctions/${auction._id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[#2D2D2D] mb-1">{auction.title}</h3>
                      <p className="text-sm text-[#6B6B6B]">
                        {auction.category} • {auction.quantity} {t('publicProfile.units')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#ea7f61]">
                        ₹{auction.lockedDeal?.amount?.toLocaleString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}
                      </p>
                      <p className="text-xs text-[#6B6B6B]">
                        {new Date(auction.lockedDeal?.lockedAt).toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Reviews */}
        {profile.reviews && profile.reviews.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3]">
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-[#ea7f61]" />
              {t('publicProfile.reviews')}
            </h2>
            <div className="space-y-4">
              {profile.reviews.map((review) => (
                <div key={review._id} className="p-4 bg-[#F5F2ED] rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-[#6B6B6B]">
                      {t('publicProfile.reviewBy', { name: review.buyer?.name || t('publicProfile.anonymous') })}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-[#2D2D2D]">{review.comment}</p>
                  )}
                  {review.auction && (
                    <p className="text-xs text-[#6B6B6B] mt-2">
                      {t('publicProfile.forAuction', { title: review.auction.title })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Buyer's Purchases */}
        {profile.role === 'buyer' && profile.purchases && profile.purchases.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5DED3]">
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">{t('publicProfile.successfulPurchases')}</h2>
            <div className="space-y-3">
              {profile.purchases.map((purchase) => (
                <div
                  key={purchase._id}
                  className="p-4 bg-[#F5F2ED] rounded-xl hover:bg-[#E5DED3] transition-colors"
                >
                  <h3 className="font-bold text-[#2D2D2D] mb-1">{purchase.title}</h3>
                  <p className="text-sm text-[#6B6B6B]">
                    {t('publicProfile.fromFarmer', { name: purchase.farmer?.name })} • {purchase.category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default PublicProfile;
