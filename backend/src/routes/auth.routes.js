import { Router } from "express";
import { body } from "express-validator";
import { 
  signup,
  verifyEmail,
  login,
  logout,
  refresh,
  me,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

const signupValidation = [
  body("name").isString().isLength({ min: 2 }).withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["farmer", "buyer"])
    .withMessage("Role must be farmer or buyer"),
  body("phone")
    .optional()
    .isString()
    .isLength({ min: 8, max: 15 })
    .withMessage("Phone must be 8-15 characters"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// NEW: validators for forgot/reset password
const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
];

const resetPasswordValidation = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Routes
router.post("/signup", ...signupValidation, signup);
router.get("/verify-email", verifyEmail);
router.post("/login", ...loginValidation, login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", requireAuth, me);

// NEW routes
router.post("/forgot-password", ...forgotPasswordValidation, forgotPassword);
router.post("/reset-password", ...resetPasswordValidation, resetPassword);

export default router;
