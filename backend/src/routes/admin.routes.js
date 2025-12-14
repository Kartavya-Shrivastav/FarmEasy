import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { listPendingAuctions, approveAuction, rejectAuction } from "../controllers/admin.controller.js";

const router = Router();

router.get("/auctions/pending", requireAuth, requireRole("admin"), listPendingAuctions);
router.post("/auctions/:id/approve", requireAuth, requireRole("admin"), approveAuction);
router.post("/auctions/:id/reject", requireAuth, requireRole("admin"), rejectAuction);

export default router;
