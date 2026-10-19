"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const optionalAuth_middleware_1 = require("../../middlewares/optionalAuth.middleware");
const router = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| STATIC ROUTES (must come first)
|--------------------------------------------------------------------------
*/
router.get("/new-arrivals", product_controller_1.productController.getNewArrivals);
router.get("/best-sellers", product_controller_1.productController.getBestSellers);
router.get("/flash-sales", optionalAuth_middleware_1.optionalAuthMiddleware, product_controller_1.productController.getFlashSales);
// router.get("/flash-sales", productController.getFlashSales);
/*
|--------------------------------------------------------------------------
| LIST PRODUCTS
|--------------------------------------------------------------------------
*/
router.get("/", product_controller_1.productController.getAll);
/*
|--------------------------------------------------------------------------
| SINGLE PRODUCT
|--------------------------------------------------------------------------
*/
router.get("/:id", product_controller_1.productController.getOne);
exports.default = router;
