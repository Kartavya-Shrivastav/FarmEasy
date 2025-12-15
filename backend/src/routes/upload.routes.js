import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { upload, handleUploadError } from "../utils/upload.js";
import { uploadImages } from "../controllers/upload.controller.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole("farmer"),
  upload.array("images", 5), // max 5 images
  handleUploadError,
  uploadImages
);

export default router;
