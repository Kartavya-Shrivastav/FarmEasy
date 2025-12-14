import { Router } from "express";
import { body } from "express-validator";
import { signup, verifyEmail, login, logout, refresh, me  } from "../controllers/auth.controller.js";
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
    .withMessage("Phone must be 8-15 characters")
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required")
];

router.post("/signup", ...signupValidation, signup);

router.get("/verify-email", verifyEmail);

router.post("/login", ...loginValidation, login);

router.post("/logout", logout);

router.post("/refresh", refresh);
router.get("/me", requireAuth, me);


export default router;
