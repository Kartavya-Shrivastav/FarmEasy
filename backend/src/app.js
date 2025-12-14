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


const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
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


app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export default app;
