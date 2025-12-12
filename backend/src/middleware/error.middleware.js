import { StatusCodes } from "http-status-codes";

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Something went wrong";
  res.status(status).json({ success: false, message });
};
