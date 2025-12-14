import { Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middleware/auth.middleware.js";
import { placeBid } from "../controllers/bid.controller.js";

const router = Router();

router.post(
  "/:id/bids",
  requireAuth,
  [body("amount").isNumeric().withMessage("amount must be number")],
  placeBid
);

export default router;
