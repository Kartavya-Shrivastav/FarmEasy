import { StatusCodes } from "http-status-codes";
import { uploadToS3 } from "../utils/s3.js";

export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "No files uploaded"
      });
    }

    const uploadPromises = req.files.map((file) => uploadToS3(file));
    const uploadedImages = await Promise.all(uploadPromises);

    return res.json({
      success: true,
      images: uploadedImages
    });
  } catch (err) {
    next(err);
  }
};