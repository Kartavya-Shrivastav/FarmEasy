import { useEffect, useRef } from 'react';
import { initSocket, connectSocket, disconnectSocket } from '../services/socket';

export const useSocket = (eventHandlers = {}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = initSocket();
    connectSocket();

    // Register event handlers
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socketRef.current.on(event, handler);
    });

    // Cleanup
    return () => {
      Object.keys(eventHandlers).forEach((event) => {
        socketRef.current.off(event);
      });
      disconnectSocket();
    };
  }, []);

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return {
    socket: socketRef.current,
    emit,
  };
};

// Hook for auction-specific socket events
export const useAuctionSocket = (auctionId, onNewBid, onAuctionClosed) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!auctionId) return;

    socketRef.current = initSocket();
    connectSocket();

    // Join auction room
    socketRef.current.emit('join-auction', auctionId);

    // Listen for events
    if (onNewBid) {
      socketRef.current.on('new-bid', onNewBid);
    }
    if (onAuctionClosed) {
      socketRef.current.on('auction-closed', onAuctionClosed);
    }

    // Cleanup
    return () => {
      socketRef.current.emit('leave-auction', auctionId);
      if (onNewBid) socketRef.current.off('new-bid');
      if (onAuctionClosed) socketRef.current.off('auction-closed');
    };
  }, [auctionId, onNewBid, onAuctionClosed]);

  return socketRef.current;
};
