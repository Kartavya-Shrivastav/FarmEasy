import amqplib from "amqplib";
import { env } from "../config/env.js";

let connection = null;
let channel = null;

export const connectRabbitMQ = async (retries = 5, delay = 3000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      connection = await amqplib.connect(env.rabbitmq.url);
      channel = await connection.createChannel();
      await channel.assertExchange("farmeasy_events", "topic", { durable: true });
      console.log("RabbitMQ connected");

      connection.on("error", (err) => {
        console.warn("RabbitMQ connection error (non-fatal):", err.message);
        channel = null;
      });
      connection.on("close", () => {
        console.warn("RabbitMQ connection closed");
        channel = null;
      });
      return; // Success, exit retry loop
    } catch (err) {
      console.warn(`RabbitMQ attempt ${i}/${retries} failed:`, err.message);
      if (i < retries) await new Promise(r => setTimeout(r, delay));
    }
  }
  console.warn("RabbitMQ unavailable after all retries (non-fatal)");
};

export const publishEvent = async (routingKey, message) => {
  try {
    if (!channel) return; // Skip silently if RabbitMQ is not connected
    channel.publish(
      "farmeasy_events",
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  } catch (err) {
    console.warn("Failed to publish event (non-fatal):", err.message);
  }
};