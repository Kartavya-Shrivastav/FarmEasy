import { StatusCodes } from "http-status-codes";
import { Auction } from "../models/auction.model.js";
import { Bid } from "../models/bid.model.js";

export const placeBid = async (req, res, next) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Only buyers can bid" });
    }

    const { amount } = req.body;
    const bidAmount = Number(amount);

    if (!Number.isFinite(bidAmount) || bidAmount <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Invalid bid amount" });
    }

    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Auction not found" });
    }

    if (auction.status !== "APPROVED") {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Auction not open for bidding" });
    }
    if (auction.lockedDeal?.isLocked) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Auction already closed" });
    }
    if (auction.auctionEndsAt && new Date() > auction.auctionEndsAt) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Auction expired" });
    }

    const minAllowed =
      auction.currentHighestBidAmount > 0
        ? auction.currentHighestBidAmount + auction.minBidHop
        : auction.minPrice;

    if (bidAmount < minAllowed) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Bid too low. Minimum allowed is ${minAllowed}`
      });
    }

    // Atomic update: only update if bid beats currentHighestBidAmount
    const updated = await Auction.findOneAndUpdate(
      {
        _id: auction._id,
        status: "APPROVED",
        "lockedDeal.isLocked": { $ne: true },
        currentHighestBidAmount: { $lt: bidAmount }
      },
      {
        $set: {
          currentHighestBidAmount: bidAmount,
          currentHighestBidder: req.user._id
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "You were outbid. Refresh and try again."
      });
    }

    const bid = await Bid.create({
      auction: auction._id,
      bidder: req.user._id,
      amount: bidAmount
    });

    // Emit real-time update to all clients watching this auction
    const io = req.app.get("io");
    if (io) {
      io.to(`auction:${auction._id}`).emit("new-bid", {
        auctionId: updated._id,
        currentHighestBidAmount: updated.currentHighestBidAmount,
        currentHighestBidder: updated.currentHighestBidder,
        newBid: {
          amount: bidAmount,
          bidder: req.user.name,
          timestamp: new Date()
        }
      });
    }

    return res.status(StatusCodes.CREATED).json({ success: true, bid, auction: updated });
  } catch (err) {
    next(err);
  }
};
