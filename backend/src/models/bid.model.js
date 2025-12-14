import mongoose from "mongoose";

const { Schema } = mongoose;

const bidSchema = new Schema(
  {
    auction: { type: Schema.Types.ObjectId, ref: "Auction", required: true, index: true },
    bidder: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

bidSchema.index({ auction: 1, amount: -1, createdAt: -1 });

export const Bid = mongoose.model("Bid", bidSchema);
