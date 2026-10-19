"use strict";
// import { Request, Response } from "express";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistController = void 0;
const wishlist_service_1 = require("./wishlist.service");
const asyncHandler_1 = require("../../utils/asyncHandler");
exports.wishlistController = {
    add: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const item = await wishlist_service_1.wishlistService.add(userId, req.body.variantId);
        res.status(201).json({
            success: true,
            message: "Added to wishlist",
            data: item,
        });
    }),
    getMine: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const items = await wishlist_service_1.wishlistService.getUserWishlist(req.user.id);
        res.json({
            success: true,
            data: items,
        });
    }),
    remove: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await wishlist_service_1.wishlistService.remove(req.user.id, req.params.id);
        res.json({
            success: true,
            message: "Item removed from wishlist",
        });
    }),
};
