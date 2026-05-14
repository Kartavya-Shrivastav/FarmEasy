import Redis from "ioredis";
import { env } from "../config/env.js";

const redis = new Redis(env.redis.url, {
  lazyConnect: true,
  retryStrategy: (times) => {
    if (times > 3) return null; // Stop retrying after 3 attempts
    return Math.min(times * 200, 1000);
  }
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.warn("Redis error (non-fatal):", err.message));

export const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null; // If Redis is down, just skip cache
  }
};

export const setCache = async (key, data, ttlSeconds = 300) => {
  try {
    await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
  } catch {
    // Non-fatal, continue without caching
  }
};

export const invalidateCache = async (key) => {
  try {
    await redis.del(key);
  } catch {
    // Non-fatal
  }
};

export const invalidateCachePattern = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch {
    // Non-fatal
  }
};