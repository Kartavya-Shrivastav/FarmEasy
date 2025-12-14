import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import { validationResult } from "express-validator";
import { User } from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/jwt.js";
import { sendEmail } from "../utils/mailer.js";
import { env } from "../config/env.js";

export const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, errors: errors.array() });
    }

    const { name, email, password, role, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Email already in use" });
    }

    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      emailVerificationToken,
      emailVerificationExpires
    });

    const verifyUrl = `${env.clientUrl}/verify-email?token=${emailVerificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your FarmEasy account",
      html: `
        <p>Hi ${user.name},</p>
        <p>Click the link below to verify your email:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>This link will expire in 1 hour.</p>
      `
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Signup successful, please verify email" });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, message: "Please verify your email first" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.json({ success: true, message: "Logged out" });
};
