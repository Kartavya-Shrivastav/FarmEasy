import { Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middleware/auth.middleware.js";
import { createReview, getFarmerReviews } from "../controllers/review.controller.js";

const router = Router();

router.post(
  "/auctions/:auctionId/review",
  requireAuth,
  [
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
    body("comment").optional().isString().isLength({ max: 500 })
  ],
  createReview
);

router.get("/farmers/:farmerId/reviews", getFarmerReviews);

export default router;
