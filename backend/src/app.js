import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
// import mongoSanitize from "express-mongo-sanitize";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";

// routes will be added later
// import authRouter from "./routes/auth.routes.js";

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
// app.use(mongoSanitize());
if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// app.use("/api/auth", authRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export default app;
