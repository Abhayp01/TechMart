import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  reviewerName: { type: String, required: true },
  reviewerEmail: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  isVerifiedPurchase: { type: Boolean, default: false },
  helpfulVotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
export default Review;
