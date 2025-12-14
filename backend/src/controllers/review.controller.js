import { StatusCodes } from "http-status-codes";
import { validationResult } from "express-validator";
import { Auction } from "../models/auction.model.js";
import { Review } from "../models/review.model.js";
import { User } from "../models/user.model.js";

export const createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, errors: errors.array() });
    }

    if (req.user.role !== "buyer") {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Only buyers can leave reviews" });
    }

    const { rating, comment } = req.body;

    const auction = await Auction.findById(req.params.auctionId);
    if (!auction) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Auction not found" });
    }

    if (!auction.lockedDeal?.isLocked) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Auction not closed yet" });
    }

    if (auction.lockedDeal.buyer.toString() !== req.user._id.toString()) {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Only the buyer of this deal can review" });
    }

    const existing = await Review.findOne({ auction: auction._id, buyer: req.user._id });
    if (existing) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Already reviewed" });
    }

    const review = await Review.create({
      auction: auction._id,
      farmer: auction.farmer,
      buyer: req.user._id,
      rating,
      comment
    });

    // Update farmer's average rating
    const allReviews = await Review.find({ farmer: auction.farmer });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(auction.farmer, {
      averageRating: avgRating,
      totalReviews: allReviews.length
    });

    return res.status(StatusCodes.CREATED).json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

export const getFarmerReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ farmer: req.params.farmerId })
      .populate("buyer", "name")
      .populate("auction", "title")
      .sort({ createdAt: -1 });

    return res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
};
