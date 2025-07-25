import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/customErrors";
import z from "zod";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Generic Error:", err.stack);

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof z.ZodError) {
    statusCode = 400;
    message =
      "Validation input data error " +
      err.issues.map((e) => e.message).join(", ");
  }

  res.status(statusCode).json({
    status: "error",
    message: message,
    stack: err.stack,
  });
};
