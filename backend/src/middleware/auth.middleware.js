import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, env.jwtAccessSecret);

    const user = await User.findById(decoded.sub);
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, message: "Forbidden" });
    }
    next();
  };
};
