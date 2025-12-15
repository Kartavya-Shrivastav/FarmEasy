import mongoose from "mongoose";

const { Schema } = mongoose;

const PAYMENT_STATUS = ["PENDING", "SUCCESS", "FAILED"];

const paymentSchema = new Schema(
  {
    auction: { type: Schema.Types.ObjectId, ref: "Auction", required: true, index: true },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    
    amount: { type: Number, required: true, min: 0 },
    
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: String,
    razorpaySignature: String,
    
    status: { type: String, enum: PAYMENT_STATUS, default: "PENDING", index: true },
    
    paidAt: Date
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);