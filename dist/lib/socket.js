"use strict";
// import { Server } from "socket.io";
// import jwt from "jsonwebtoken";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
// let io: Server;
// export const initSocket = (server: any) => {
//   io = new Server(server, {
//     cors: {
//       origin: "*",
//     },
//   });
//   io.use((socket, next) => {
//     try {
//       const token = socket.handshake.auth.token;
//       if (!token) {
//         return next(new Error("Unauthorized"));
//       }
//       const decoded = jwt.verify(
//         token,
//         process.env.JWT_SECRET!
//       ) as any;
//       socket.data.user = decoded;
//       next();
//     } catch (err) {
//       next(new Error("Unauthorized"));
//     }
//   });
//   io.on("connection", (socket) => {
//     console.log("Client connected:", socket.id);
//     const user = socket.data.user;
//     if (user.role === "VENDOR") {
//       socket.join(`vendor:${user.id}`);
//       console.log("Vendor Join")
//     }
//     if (user.role === "ADMIN") {
//       socket.join("admins");
//       console.log("Admin joined admins room");
//     }
//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//     });
//   });
//   return io;
// };
// export const getIO = () => io;
// import { Server } from "socket.io";
// import jwt from "jsonwebtoken";
// import type { Server as HttpServer } from "http";
// let io: Server;
// export const initSocket = (server: HttpServer) => {
//   io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//   });
//   io.use((socket, next) => {
//     try {
//       const token = socket.handshake.auth?.token;
//       if (!token) {
//         return next(new Error("Unauthorized: Missing token"));
//       }
//       const decoded = jwt.verify(
//         token,
//         process.env.JWT_SECRET!
//       ) as {
//         id: string;
//         role: string;
//       };
//       socket.data.user = decoded;
//       next();
//     } catch {
//       next(new Error("Unauthorized: Invalid token"));
//     }
//   });
//   io.on("connection", (socket) => {
//     const user = socket.data.user;
//     console.log("Client connected:", {
//       socketId: socket.id,
//       userId: user.id,
//       role: user.role,
//     });
//     if (user.role === "VENDOR") {
//       const room = `vendor:${user.id}`;
//       socket.join(room);
//       console.log("Vendor joined room:", {
//         socketId: socket.id,
//         userId: user.id,
//         room,
//         joined: socket.rooms.has(room),
//       });
//     }
//     if (user.role === "ADMIN") {
//       socket.join("admins");
//       console.log("Admin joined admins room");
//     }
//     socket.on("disconnect", (reason) => {
//       console.log("Client disconnected:", {
//         socketId: socket.id,
//         reason,
//       });
//     });
//   });
//   return io;
// };
// export const getIO = () => {
//   if (!io) {
//     throw new Error("Socket.IO has not been initialized");
//   }
//   return io;
// };
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*", // في production، حدد دومين الـ frontend بدل *
            methods: ["GET", "POST"],
        },
    });
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (typeof token !== "string" || !token) {
                return next(new Error("Unauthorized: Missing token"));
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (typeof decoded === "string") {
                return next(new Error("Unauthorized: Invalid token payload"));
            }
            const payload = decoded;
            // يدعم أسماء الحقول المختلفة مؤقتًا
            const userId = payload.id ?? payload.userId ?? payload.vendorId;
            const role = payload.role;
            if (!userId || !role) {
                console.error("Socket JWT missing required claims:", {
                    hasId: Boolean(payload.id),
                    hasUserId: Boolean(payload.userId),
                    hasVendorId: Boolean(payload.vendorId),
                    hasRole: Boolean(role),
                });
                return next(new Error("Unauthorized: Missing user ID or role"));
            }
            socket.data.user = {
                id: userId,
                role,
            };
            next();
        }
        catch {
            next(new Error("Unauthorized: Invalid token"));
        }
    });
    io.on("connection", (socket) => {
        const user = socket.data.user;
        console.log("Client connected:", {
            socketId: socket.id,
            userId: user.id,
            role: user.role,
        });
        if (user.role === "VENDOR") {
            const room = `vendor:${user.id}`;
            socket.join(room);
            console.log("Vendor joined room:", {
                socketId: socket.id,
                userId: user.id,
                room,
                joined: socket.rooms.has(room),
            });
        }
        if (user.role === "ADMIN") {
            socket.join("admins");
            console.log("Admin joined admins room");
        }
        socket.on("disconnect", (reason) => {
            console.log("Client disconnected:", {
                socketId: socket.id,
                userId: user.id,
                reason,
            });
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized");
    }
    return io;
};
exports.getIO = getIO;
