import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../config/env.js";
import { randomUUID } from "crypto";

const s3 = new S3Client({ region: env.aws.region });

export const uploadToS3 = async (file) => {
  const fileExtension = file.mimetype.split("/")[1];
  const fileName = `produce/${randomUUID()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: env.aws.s3BucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype
  });

  await s3.send(command);

  // Return CloudFront URL if configured, otherwise direct S3 URL
  const url = env.aws.cloudfrontUrl
    ? `https://${env.aws.cloudfrontUrl}/${fileName}`
    : `https://${env.aws.s3BucketName}.s3.${env.aws.region}.amazonaws.com/${fileName}`;

  return { url, publicId: fileName };
};

export const deleteFromS3 = async (publicId) => {
  const command = new DeleteObjectCommand({
    Bucket: env.aws.s3BucketName,
    Key: publicId
  });
  await s3.send(command);
};