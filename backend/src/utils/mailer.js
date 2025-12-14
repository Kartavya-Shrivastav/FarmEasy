import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"FarmEasy" <${env.smtp.user}>`,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};
