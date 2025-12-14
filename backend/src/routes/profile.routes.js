import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getPublicProfile, getMyProfile } from "../controllers/profile.controller.js";

const router = Router();

router.get("/me", requireAuth, getMyProfile);
router.get("/:userId", getPublicProfile);

export default router;
