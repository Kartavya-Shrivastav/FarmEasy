import { StatusCodes } from "http-status-codes";
import { Auction } from "../models/auction.model.js";

export const listPendingAuctions = async (req, res, next) => {
  try {
    const auctions = await Auction.find({ status: "PENDING" })
      .populate("farmer", "name email")
      .sort({ createdAt: -1 });

    return res.json({ success: true, auctions });
  } catch (err) {
    next(err);
  }
};

export const approveAuction = async (req, res, next) => {
  try {
    const { auctionStartsAt, auctionEndsAt } = req.body;

    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Auction not found" });
    }
    if (auction.status !== "PENDING") {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Auction not in PENDING state" });
    }

    auction.status = "APPROVED";
    auction.approvedBy = req.user._id;
    auction.approvedAt = new Date();
    auction.auctionStartsAt = auctionStartsAt ? new Date(auctionStartsAt) : new Date();
    auction.auctionEndsAt = new Date(auctionEndsAt);

    await auction.save();

    // Emit auction approved event
    const io = req.app.get("io");
    if (io) {
      io.emit("auction-approved", {
        auctionId: auction._id,
        title: auction.title,
        category: auction.category,
        auctionEndsAt: auction.auctionEndsAt
      });
    }

    return res.json({ success: true, auction });
  } catch (err) {
    next(err);
  }
};

export const rejectAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Auction not found" });
    }

    auction.status = "REJECTED";
    await auction.save();

    return res.json({ success: true, auction });
  } catch (err) {
    next(err);
  }
};
