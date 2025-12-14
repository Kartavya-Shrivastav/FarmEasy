import { Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createAuctionRequest,
  listMarketAuctions,
  getAuctionById,
  lockDeal
} from "../controllers/auction.controller.js";

const router = Router();

router.get("/", listMarketAuctions);
router.get("/:id", getAuctionById);

router.post(
  "/",
  requireAuth,
  [
    body("title").isString().isLength({ min: 3 }).withMessage("Title required"),
    body("category").isString().notEmpty().withMessage("Category required"),
    body("quantity").isNumeric().custom((v) => Number(v) > 0),
    body("unit").isString().notEmpty(),
    body("dateOfEntry").isISO8601().withMessage("dateOfEntry must be a valid date"),
    body("expiresAt").isISO8601().withMessage("expiresAt must be a valid date"),
    body("minPrice").isNumeric().custom((v) => Number(v) >= 0),
    body("minBidHop").isNumeric().custom((v) => Number(v) >= 1)
  ],
  createAuctionRequest
);

router.post("/:id/lock", requireAuth, lockDeal);

export default router;
