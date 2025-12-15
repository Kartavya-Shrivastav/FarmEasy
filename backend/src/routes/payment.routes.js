import { Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middleware/auth.middleware.js";
import { createPaymentOrder, verifyPayment, getPaymentStatus } from "../controllers/payment.controller.js";

const router = Router();

router.post("/auctions/:auctionId/payment/create-order", requireAuth, createPaymentOrder);

router.post(
  "/payment/verify",
  requireAuth,
  [
    body("razorpayOrderId").notEmpty().withMessage("Order ID required"),
    body("razorpayPaymentId").notEmpty().withMessage("Payment ID required"),
    body("razorpaySignature").notEmpty().withMessage("Signature required")
  ],
  verifyPayment
);

router.get("/auctions/:auctionId/payment/status", requireAuth, getPaymentStatus);

export default router;