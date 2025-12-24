import mongoose from "mongoose";

const { Schema } = mongoose;

const AUCTION_STATUS = ["PENDING", "APPROVED", "LIVE", "CLOSED", "REJECTED"];

const auctionSchema = new Schema(
  {
    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 2000 },

    category: { type: String, required: true, trim: true, index: true }, // e.g. Vegetables, Fruits
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true, trim: true }, // kg, quintal, etc.

    location: {
      state: { type: String, trim: true },
      district: { type: String, trim: true },
      village: { type: String, trim: true }
    },

    images: [{ url: String, publicId: String }], 

    dateOfEntry: { type: Date, required: true },
    expiresAt: { type: Date, required: true },

    minPrice: { type: Number, required: true, min: 0 },
    minBidHop: { type: Number, required: true, min: 1 },

    status: { type: String, enum: AUCTION_STATUS, default: "PENDING", index: true },

    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },

    auctionStartsAt: { type: Date },
    auctionEndsAt: { type: Date, index: true },

    currentHighestBidAmount: { type: Number, default: 0 },
    currentHighestBidder: { type: Schema.Types.ObjectId, ref: "User" },

    lockedDeal: {
      isLocked: { type: Boolean, default: false },
      lockedAt: Date,
      buyer: { type: Schema.Types.ObjectId, ref: "User" },
      amount: Number,
      isPaid: { type: Boolean, default: false },
      paidAt: Date
    }
  },
  { timestamps: true }
);

auctionSchema.index({ status: 1, category: 1, auctionEndsAt: 1 });

export const Auction = mongoose.model("Auction", auctionSchema);
