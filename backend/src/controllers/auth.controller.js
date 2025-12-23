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
import { verifyRefreshToken } from "../utils/jwt.js";

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

    console.log('=== EMAIL VERIFICATION DEBUG ===');
    console.log('Token from URL:', token);
    console.log('Token length:', token?.length);
    console.log('Current time:', Date.now());

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    console.log('User found:', user ? 'YES' : 'NO');

    if (user) {
      console.log('User email:', user.email);
      console.log('Token in DB:', user.emailVerificationToken);
      console.log('Token expires:', user.emailVerificationExpires);
      console.log('Time left (ms):', user.emailVerificationExpires - Date.now());
    } else {
      // Check if user exists with this token but expired
      const expiredUser = await User.findOne({ emailVerificationToken: token });
      if (expiredUser) {
        console.log('Token found but EXPIRED');
        console.log('Expired at:', expiredUser.emailVerificationExpires);
        console.log('Current time:', Date.now());
      } else {
        console.log('No user found with this token at all');
      }
    }

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    console.log('✅ Email verified successfully');

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.error('Verification error:', err);
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
      sameSite: env.nodeEnv === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: env.nodeEnv === "production" ? "none" : "lax",
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

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "No refresh token" });
    }

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const accessToken = generateAccessToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: env.nodeEnv === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000
    });

    return res.json({ success: true, accessToken });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};

export const me = async (req, res) => {
  // requireAuth middleware will attach req.user
  return res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isEmailVerified: req.user.isEmailVerified
    }
  });
};

export const forgotPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    // For security, respond the same even if user not found
    if (!user) {
      return res.json({
        success: true,
        message: "If an account exists, a reset link has been sent to this email",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    const resetUrl = `${env.clientUrl}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your FarmEasy password",
      html: `
        <p>Hi ${user.name},</p>
        <p>You requested to reset your password for your FarmEasy account.</p>
        <p>Click the link below to choose a new password:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 1 hour. If you did not request this, you can safely ignore this email.</p>
      `,
    });

    return res.json({
      success: true,
      message: "If an account exists, a reset link has been sent to this email",
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, errors: errors.array() });
    }

    const { token } = req.query;
    const { password } = req.body;

    if (!token) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Token is required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.password = password; // will be hashed by your pre('save') hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (err) {
    next(err);
  }
};
