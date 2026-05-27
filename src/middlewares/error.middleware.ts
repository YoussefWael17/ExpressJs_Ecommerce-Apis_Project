import {
  Request,
  Response,
  NextFunction,
} from "express";

import { ZodError } from "zod";


import { AppError } from "../utils/AppError";
import { Prisma } from "../generated/prisma/client";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  // App Error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Zod Error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",

      errors: err.issues,
    });
  }

  // Prisma Unique Error
  if (
    err instanceof
    Prisma.PrismaClientKnownRequestError
  ) {
    if (err.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Duplicate field value",
      });
    }
  }

  // JWT Error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  // Default Error
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};