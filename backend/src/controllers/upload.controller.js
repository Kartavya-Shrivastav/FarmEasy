import { StatusCodes } from "http-status-codes";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "No files uploaded"
      });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "farmeasy/products",
            resource_type: "image"
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id
              });
            }
          }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);

    return res.json({
      success: true,
      images: uploadedImages
    });
  } catch (err) {
    next(err);
  }
};
