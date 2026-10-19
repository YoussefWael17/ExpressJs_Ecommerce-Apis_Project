"use strict";
// import { Response, NextFunction } from "express";
// import { verifyToken } from "../utils/jwt";
// import { prisma } from "../lib/prisma";
// import { AuthRequest } from "../types/auth-request";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const AppError_1 = require("../utils/AppError");
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.AppError("Unauthorized", 401);
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new AppError_1.AppError("Unauthorized", 401);
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            id: decoded.userId,
        },
    });
    if (!user) {
        throw new AppError_1.AppError("User not found", 404);
    }
    req.user = user;
    next();
};
exports.authMiddleware = authMiddleware;
