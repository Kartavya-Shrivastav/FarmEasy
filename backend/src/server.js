import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

const start = async () => {
  await connectDB();

  const server = http.createServer(app);

  // Socket.io setup
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Make io available globally for controllers
  app.set("io", io);

  // Socket.io connection handler
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join auction room
    socket.on("join-auction", (auctionId) => {
      socket.join(`auction:${auctionId}`);
      console.log(`Socket ${socket.id} joined auction:${auctionId}`);
    });

    // Leave auction room
    socket.on("leave-auction", (auctionId) => {
      socket.leave(`auction:${auctionId}`);
      console.log(`Socket ${socket.id} left auction:${auctionId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

start();