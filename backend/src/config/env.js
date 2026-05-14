import dotenv from "dotenv";
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  aws: {
    region: process.env.AWS_REGION || "ap-south-1",
    s3BucketName: process.env.S3_BUCKET_NAME,
    cloudfrontUrl: process.env.CLOUDFRONT_URL
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379"
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || "amqp://admin:password@localhost:5672"
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173"
};