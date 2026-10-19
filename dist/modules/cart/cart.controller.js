"use strict";
// import { Response } from "express";
// import { cartService } from "./cart.service";
// import { AuthRequest } from "../../types/auth-request";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartController = void 0;
const cart_service_1 = require("./cart.service");
const asyncHandler_1 = require("../../utils/asyncHandler");
exports.cartController = {
    getCart: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const cart = await cart_service_1.cartService.getCart(req.user.id);
        res.json({
            success: true,
            data: cart,
        });
    }),
    addItem: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const item = await cart_service_1.cartService.addItem(req.user.id, req.body.variantId, req.body.quantity);
        res.status(201).json({
            success: true,
            message: "Item added to cart",
            data: item,
        });
    }),
    updateQuantity: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const item = await cart_service_1.cartService.updateQuantity(req.params.id, req.body.quantity);
        res.json({
            success: true,
            message: "Cart updated successfully",
            data: item,
        });
    }),
    removeItem: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await cart_service_1.cartService.removeItem(req.params.id);
        res.json({
            success: true,
            message: "Item removed from cart",
        });
    }),
};
