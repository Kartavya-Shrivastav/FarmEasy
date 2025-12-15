import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import { razorpayInstance } from "../config/razorpay.js";
import { Auction } from "../models/auction.model.js";
import { Payment } from "../models/payment.model.js";
import { env } from "../config/env.js";

export const createPaymentOrder = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.auctionId);

    if (!auction) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Auction not found" });
    }

    if (!auction.lockedDeal?.isLocked) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Deal not locked yet" });
    }

    if (auction.lockedDeal.buyer.toString() !== req.user._id.toString()) {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Only the winning buyer can pay" });
    }

    if (auction.lockedDeal.isPaid) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Already paid" });
    }

    // Check if order already exists
    const existingPayment = await Payment.findOne({
      auction: auction._id,
      buyer: req.user._id,
      status: "PENDING"
    });

    if (existingPayment) {
      return res.json({
        success: true,
        orderId: existingPayment.razorpayOrderId,
        amount: existingPayment.amount,
        currency: "INR",
        keyId: env.razorpay.keyId
      });
    }

    // Create Razorpay order
    const amount = Math.round(auction.lockedDeal.amount * 100); // convert to paise

    // Generate short receipt (max 40 chars for Razorpay)
    const timestamp = Date.now().toString().slice(-8); // last 8 digits
    const auctionIdShort = auction._id.toString().slice(-8); // last 8 chars of auction ID
    const receipt = `rcpt_${auctionIdShort}_${timestamp}`; // total ~22 chars

    const options = {
      amount,
      currency: "INR",
      receipt
    };

    const order = await razorpayInstance.orders.create(options);

    // Save payment record
    await Payment.create({
      auction: auction._id,
      buyer: req.user._id,
      farmer: auction.farmer,
      amount: auction.lockedDeal.amount,
      razorpayOrderId: order.id,
      status: "PENDING"
    });

    return res.json({
      success: true,
      orderId: order.id,
      amount: auction.lockedDeal.amount,
      currency: "INR",
      keyId: env.razorpay.keyId
    });
  } catch (err) {
    next(err);
  }
};


export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Missing payment details"
      });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", env.razorpay.keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    // Update payment record
    const payment = await Payment.findOne({ razorpayOrderId });

    if (!payment) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Payment record not found" });
    }

    if (payment.status === "SUCCESS") {
      return res.json({ success: true, message: "Already verified" });
    }

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = "SUCCESS";
    payment.paidAt = new Date();
    await payment.save();

    // Update auction
    const auction = await Auction.findById(payment.auction);
    auction.lockedDeal.isPaid = true;
    auction.lockedDeal.paidAt = new Date();
    await auction.save();

    return res.json({
      success: true,
      message: "Payment verified successfully",
      payment
    });
  } catch (err) {
    next(err);
  }
};

export const getPaymentStatus = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.auctionId);

    if (!auction) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Auction not found" });
    }

    const payment = await Payment.findOne({ auction: auction._id })
      .populate("buyer", "name email")
      .populate("farmer", "name");

    if (!payment) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "No payment found" });
    }

    // Only buyer and farmer can see payment details
    const userId = req.user._id.toString();
    if (userId !== payment.buyer._id.toString() && userId !== payment.farmer._id.toString() && req.user.role !== "admin") {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Access denied" });
    }

    return res.json({ success: true, payment });
  } catch (err) {
    next(err);
  }
};