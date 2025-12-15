import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  auctions: [],
  currentAuction: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    state: '',
  },
};

const auctionSlice = createSlice({
  name: 'auctions',
  initialState,
  reducers: {
    setAuctions: (state, action) => {
      state.auctions = action.payload;
    },
    setCurrentAuction: (state, action) => {
      state.currentAuction = action.payload;
    },
    updateAuctionBid: (state, action) => {
      const { auctionId, currentHighestBidAmount, currentHighestBidder } = action.payload;
      
      // Update in list
      const auction = state.auctions.find(a => a._id === auctionId);
      if (auction) {
        auction.currentHighestBidAmount = currentHighestBidAmount;
        auction.currentHighestBidder = currentHighestBidder;
      }
      
      // Update current auction if viewing it
      if (state.currentAuction?._id === auctionId) {
        state.currentAuction.currentHighestBidAmount = currentHighestBidAmount;
        state.currentAuction.currentHighestBidder = currentHighestBidder;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setAuctions,
  setCurrentAuction,
  updateAuctionBid,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = auctionSlice.actions;

export default auctionSlice.reducer;
