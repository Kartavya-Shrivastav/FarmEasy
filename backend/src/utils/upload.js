import multer from "multer";
import { StatusCodes } from "http-status-codes";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: err.message
    });
  }
  if (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: err.message
    });
  }
  next();
};
