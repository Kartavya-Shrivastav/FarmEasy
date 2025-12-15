import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import auctionReducer from '../features/auctions/auctionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    auctions: auctionReducer,
  },
});