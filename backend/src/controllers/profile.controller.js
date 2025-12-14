import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model.js";
import { Auction } from "../models/auction.model.js";
import { Bid } from "../models/bid.model.js";
import { Review } from "../models/review.model.js";

// Get any user's public profile
export const getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "User not found" });
    }

    let profileData = {
      id: user._id,
      name: user.name,
      role: user.role,
      averageRating: user.averageRating,
      totalReviews: user.totalReviews
    };

    if (user.role === "farmer") {
      // show public auction history (only successful deals)
      const successfulAuctions = await Auction.find({
        farmer: user._id,
        "lockedDeal.isLocked": true
      })
        .select("title category quantity lockedDeal createdAt")
        .sort({ createdAt: -1 })
        .limit(10);

      // show reviews
      const reviews = await Review.find({ farmer: user._id })
        .populate("buyer", "name")
        .populate("auction", "title")
        .sort({ createdAt: -1 })
        .limit(20);

      profileData.auctions = successfulAuctions;
      profileData.reviews = reviews;
    }

    if (user.role === "buyer") {
      // show only successful purchases (public)
      const purchases = await Auction.find({
        "lockedDeal.isLocked": true,
        "lockedDeal.buyer": user._id
      })
        .populate("farmer", "name")
        .select("title category lockedDeal createdAt")
        .sort({ createdAt: -1 })
        .limit(10);

      profileData.purchases = purchases;
    }

    return res.json({ success: true, profile: profileData });
  } catch (err) {
    next(err);
  }
};

// Get logged-in user's own detailed profile
export const getMyProfile = async (req, res, next) => {
  try {
    const user = req.user;

    let profileData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      averageRating: user.averageRating,
      totalReviews: user.totalReviews
    };

    if (user.role === "farmer") {
      // all my listings
      const myAuctions = await Auction.find({ farmer: user._id })
        .sort({ createdAt: -1 })
        .limit(50);

      profileData.myAuctions = myAuctions;
    }

    if (user.role === "buyer") {
      // my active bids (where I'm highest bidder and auction still open)
      const myActiveBids = await Auction.find({
        currentHighestBidder: user._id,
        status: "APPROVED",
        "lockedDeal.isLocked": false
      })
        .populate("farmer", "name")
        .sort({ auctionEndsAt: 1 });

      // auctions where I bid but got outbid
      const myBids = await Bid.find({ bidder: user._id }).distinct("auction");

      const outbidAuctions = await Auction.find({
        _id: { $in: myBids },
        currentHighestBidder: { $ne: user._id },
        status: "APPROVED",
        "lockedDeal.isLocked": false
      })
        .populate("farmer", "name")
        .sort({ auctionEndsAt: 1 });

      // my successful purchases
      const myPurchases = await Auction.find({
        "lockedDeal.isLocked": true,
        "lockedDeal.buyer": user._id
      })
        .populate("farmer", "name")
        .sort({ "lockedDeal.lockedAt": -1 });

      profileData.activeBids = myActiveBids;
      profileData.outbidAuctions = outbidAuctions;
      profileData.purchases = myPurchases;
    }

    return res.json({ success: true, profile: profileData });
  } catch (err) {
    next(err);
  }
};
