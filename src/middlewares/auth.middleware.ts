// import { Response, NextFunction } from "express";
// import { verifyToken } from "../utils/jwt";
// import { prisma } from "../lib/prisma";
// import { AuthRequest } from "../types/auth-request";

// export const authMiddleware = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         message: "Unauthorized",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     const payload = verifyToken(token) as { userId: string };

//     const user = await prisma.user.findUnique({
//       where: {
//         id: payload.userId,
//       },
//     });

//     if (!user) {
//       return res.status(401).json({
//         message: "User not found",
//       });
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       message: "Invalid token",
//     });
//   }
// };


import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma";

import { AppError } from "../utils/AppError";
import { AuthRequest } from "../types/auth-request";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    throw new AppError(
      "Unauthorized",
      401
    );
  }

  const token =
    authHeader.split(" ")[1];

  if (!token) {
    throw new AppError(
      "Unauthorized",
      401
    );
  }

  const decoded: any = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  );

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
  });

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  req.user = user;

  next();
};