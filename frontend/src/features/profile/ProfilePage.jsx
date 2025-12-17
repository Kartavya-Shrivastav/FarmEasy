import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import BuyerProfile from './BuyerProfile';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (user.role === 'buyer') {
    return <BuyerProfile />;
  }

  if (user.role === 'farmer') {
    navigate('/my-auctions');
    return null;
  }

  if (user.role === 'admin') {
    navigate('/admin');
    return null;
  }

  return null;
};

export default ProfilePage;