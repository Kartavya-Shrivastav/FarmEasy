import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id, role: user.role },
    env.jwtAccessSecret,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { sub: user._id },
    env.jwtRefreshSecret,
    { expiresIn: "7d" }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwtAccessSecret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.jwtRefreshSecret);
};
