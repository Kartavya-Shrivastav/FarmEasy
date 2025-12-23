import { StatusCodes } from "http-status-codes";
import { validationResult } from "express-validator";
import { Auction } from "../models/auction.model.js";

export const createAuctionRequest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, errors: errors.array() });
    }

    if (req.user.role !== "farmer") {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Only farmers can create listings" });
    }

    // Parse images if they come as JSON string (from form-data)
    let images = [];
    if (req.body.images) {
      try {
        images = typeof req.body.images === "string" ? JSON.parse(req.body.images) : req.body.images;
      } catch (e) {
        images = req.body.images;
      }
    }

    const payload = {
      farmer: req.user._id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      quantity: req.body.quantity,
      unit: req.body.unit,
      location: req.body.location,
      dateOfEntry: req.body.dateOfEntry,
      expiresAt: req.body.expiresAt,
      minPrice: req.body.minPrice,
      minBidHop: req.body.minBidHop,
      images,
      status: "PENDING"
    };

    const auction = await Auction.create(payload);

    return res.status(StatusCodes.CREATED).json({ success: true, auction });
  } catch (err) {
    next(err);
  }
};


export const listMarketAuctions = async (req, res, next) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      state,
      status = "APPROVED"
    } = req.query;

    const filter = { status };

    if (category) filter.category = category;
    if (state) filter["location.state"] = state;

    //Use $expr to check currentHighestBidAmount OR minPrice
    if (minPrice || maxPrice) {
      filter.$expr = { $and: [] };
      
      // Use currentHighestBidAmount if it exists, otherwise fall back to minPrice
      const currentPrice = {
        $cond: {
          if: { $gt: ['$currentHighestBidAmount', 0] },
          then: '$currentHighestBidAmount',
          else: '$minPrice'
        }
      };
      
      if (minPrice) {
        filter.$expr.$and.push({
          $gte: [currentPrice, Number(minPrice)]
        });
      }
      
      if (maxPrice) {
        filter.$expr.$and.push({
          $lte: [currentPrice, Number(maxPrice)]
        });
      }
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ];
    }

    const auctions = await Auction.find(filter)
      .populate("farmer", "name role")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ success: true, auctions });
  } catch (err) {
    next(err);
  }
};

export const getAuctionById = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate("farmer", "name role")
      .populate("currentHighestBidder", "name");

    if (!auction) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Auction not found" });
    }

    return res.json({ success: true, auction });
  } catch (err) {
    next(err);
  }
};

export const lockDeal = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Auction not found" });
    }
    if (auction.farmer.toString() !== req.user._id.toString()) {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Only owner farmer can lock deal" });
    }
    if (auction.lockedDeal?.isLocked) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Deal already locked" });
    }
    if (!auction.currentHighestBidder) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "No bids placed yet" });
    }

    auction.status = "CLOSED";
    auction.lockedDeal = {
      isLocked: true,
      lockedAt: new Date(),
      buyer: auction.currentHighestBidder,
      amount: auction.currentHighestBidAmount,
      isPaid: false,        
      paidAt: null          
    };

    await auction.save();

    // Emit auction closed event
    const io = req.app.get("io");
    if (io) {
      io.to(`auction:${auction._id}`).emit("auction-closed", {
        auctionId: auction._id,
        winner: auction.lockedDeal.buyer,
        finalAmount: auction.lockedDeal.amount,
        lockedAt: auction.lockedDeal.lockedAt
      });
    }

    return res.json({ success: true, auction });
  } catch (err) {
    next(err);
  }
};
