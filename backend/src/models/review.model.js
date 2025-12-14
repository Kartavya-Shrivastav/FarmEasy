import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    auction: { type: Schema.Types.ObjectId, ref: "Auction", required: true },
    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 500 }
  },
  { timestamps: true }
);

reviewSchema.index({ auction: 1, buyer: 1 }, { unique: true }); // one review per buyer per auction

export const Review = mongoose.model("Review", reviewSchema);
