import amqplib from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://admin:password@localhost:5672";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"FarmEasy" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Failed to send email:", err.message);
  }
};

const handleEvent = async (routingKey, event) => {
  if (routingKey === "bid.placed") {
    await sendEmail({
      to: event.bidderEmail,
      subject: `Your bid on "${event.auctionTitle}" was placed`,
      html: `<p>Hi ${event.bidderName},</p>
             <p>Your bid of <strong>₹${event.amount}</strong> on 
             <strong>${event.auctionTitle}</strong> was successfully placed.</p>
             <p>Good luck!</p>`
    });
  }

  if (routingKey === "auction.closed") {
    console.log(`Auction ${event.auctionId} closed. Final amount: ₹${event.finalAmount}`);
    // Add more email logic here when you have buyer/farmer emails in the event
  }
};

const startWorker = async () => {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange("farmeasy_events", "topic", { durable: true });
    const q = await channel.assertQueue("notification_queue", { durable: true });

    // Listen to all bid and auction events
    await channel.bindQueue(q.queue, "farmeasy_events", "bid.#");
    await channel.bindQueue(q.queue, "farmeasy_events", "auction.#");

    channel.prefetch(1); // Process one message at a time
    console.log("Notification worker started, waiting for events...");

    channel.consume(q.queue, async (msg) => {
      if (!msg) return;
      const routingKey = msg.fields.routingKey;
      const event = JSON.parse(msg.content.toString());
      console.log(`Received event: ${routingKey}`, event);
      await handleEvent(routingKey, event);
      channel.ack(msg);
    });

    connection.on("close", () => {
      console.error("RabbitMQ connection closed, restarting in 5s...");
      setTimeout(startWorker, 5000);
    });

  } catch (err) {
    console.error("Worker failed to start, retrying in 5s:", err.message);
    setTimeout(startWorker, 5000);
  }
};

startWorker();