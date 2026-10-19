"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const AppError_1 = require("../utils/AppError");
const client_1 = require("../generated/prisma/client");
const node_console_1 = __importDefault(require("node:console"));
const errorMiddleware = (err, req, res, next) => {
    node_console_1.default.error(err);
    // App Error
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    // Zod Error
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.issues,
        });
    }
    // Prisma Unique Error
    if (err instanceof
        client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            return res.status(400).json({
                success: false,
                message: "Duplicate field value",
            });
        }
    }
    // // JWT Error
    // if (err.name === "JsonWebTokenError") {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Invalid token",
    //   });
    // }
    // JWT Expired
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Token expired",
        });
    }
    // JWT Invalid
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
exports.errorMiddleware = errorMiddleware;
