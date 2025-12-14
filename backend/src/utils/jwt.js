import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const accessExpires = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const refreshExpires = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.jwtAccessSecret,
    { expiresIn: accessExpires }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ sub: user._id.toString() }, env.jwtRefreshSecret, {
    expiresIn: refreshExpires
  });
};

export const verifyAccessToken = (token) => jwt.verify(token, env.jwtAccessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret);
