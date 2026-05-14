import Razorpay from "razorpay";
import { env } from "./env.js";

let razorpayInstance = null;

export const getRazorpay = () => {
  if (!razorpayInstance) {
    if (!env.razorpay.keyId || !env.razorpay.keySecret) {
      throw new Error("Razorpay keys not configured");
    }
    razorpayInstance = new Razorpay({
      key_id: env.razorpay.keyId,
      key_secret: env.razorpay.keySecret
    });
  }
  return razorpayInstance;
};