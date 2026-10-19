"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const product_service_1 = require("./product.service");
const asyncHandler_1 = require("../../utils/asyncHandler");
const AppError_1 = require("../../utils/AppError");
exports.productController = {
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const product = await product_service_1.productService.create(req.body, req.user.id, req.user.role);
        res.status(201).json({
            success: true,
            data: product,
        });
    }),
    getAll: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const products = await product_service_1.productService.getAll(req.query);
        res.json({
            success: true,
            data: products,
        });
    }),
    getOne: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const product = await product_service_1.productService.getOne(req.params.id);
        if (!product) {
            throw new AppError_1.AppError("Product not found", 404);
        }
        res.json({
            success: true,
            data: product,
        });
    }),
    getNewArrivals: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const limit = Number(req.query.limit) || 10;
        const products = await product_service_1.productService.getNewArrivals(limit);
        res.json({
            success: true,
            data: products,
        });
    }),
    // getFlashSales: asyncHandler(
    //   async (
    //     req: Request,
    //     res: Response
    //   ) => {
    //     const limit =
    //       Number(req.query.limit) || 10;
    //     const products =
    //       await productService.getFlashSales(
    //         limit
    //       );
    //     res.json({
    //       success: true,
    //       data: products,
    //     });
    //   }
    // ),
    getFlashSales: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const limit = Number(req.query.limit) || 10;
        const userId = req.user?.id;
        const products = await product_service_1.productService.getFlashSales(limit, userId);
        res.json({
            success: true,
            data: products,
        });
    }),
    getBestSellers: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const limit = Number(req.query.limit) || 10;
        const products = await product_service_1.productService.getBestSellers(limit);
        res.json({
            success: true,
            data: products,
        });
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const product = await product_service_1.productService.update(req.params.id, req.body, req.user.id, req.user.role);
        res.json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });
    }),
};
