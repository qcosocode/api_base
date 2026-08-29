import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app.error";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  const message = error instanceof Error ? error.message : "Internal error";
  res.status(500).json({ message });
};
