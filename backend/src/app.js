import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";

import authRouter from "./routes/auth.routes.js";
import auctionRouter from "./routes/auction.routes.js";
import bidRouter from "./routes/bid.routes.js";
import adminRouter from "./routes/admin.routes.js";
import profileRouter from "./routes/profile.routes.js";
import reviewRouter from "./routes/review.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import paymentRouter from "./routes/payment.routes.js";


const app = express();

// Enable trust proxy for Socket.io
app.set("trust proxy", 1);


app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigin = env.clientUrl.endsWith('/') ? env.clientUrl.slice(0, -1) : env.clientUrl;
      if (origin === allowedOrigin) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.use("/api/auth", authRouter);

app.use("/api/auctions", auctionRouter);
app.use("/api", bidRouter);
app.use("/api/admin", adminRouter);

app.use("/api/profile", profileRouter);
app.use("/api", reviewRouter);

app.use("/api/upload", uploadRouter);
app.use("/api", paymentRouter);


app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export default app;
