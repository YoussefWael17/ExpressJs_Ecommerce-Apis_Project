"use strict";
// import { Response } from "express";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const order_service_1 = require("./order.service");
const asyncHandler_1 = require("../../utils/asyncHandler");
const AppError_1 = require("../../utils/AppError");
exports.orderController = {
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await order_service_1.orderService.createOrder(req.user.id);
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });
    }),
    getMyOrders: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const orders = await order_service_1.orderService.getUserOrders(req.user.id);
        res.json({
            success: true,
            data: orders,
        });
    }),
    getOne: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await order_service_1.orderService.getSingleOrder(req.params.id, req.user.id);
        if (!order) {
            throw new AppError_1.AppError("Order not found", 404);
        }
        res.json({
            success: true,
            data: order,
        });
    }),
};
