"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vendor_controller_1 = require("./vendor.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const allowRoles_1 = require("../../middlewares/allowRoles");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const product_validation_1 = require("../product/product.validation");
const router = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| Vendor Access Only
|--------------------------------------------------------------------------
*/
router.use(auth_middleware_1.authMiddleware, (0, allowRoles_1.allowRoles)("VENDOR", "ADMIN"));
/*
|--------------------------------------------------------------------------
| Vendor Products
|--------------------------------------------------------------------------
*/
// GET /vendor/products
router.get("/products", vendor_controller_1.vendorController.getMyProducts);
// GET /vendor/products/:id
router.get("/products/:id", vendor_controller_1.vendorController.getSingleProduct);
// POST /vendor/products
router.post("/products", upload_middleware_1.upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
]), (0, validate_middleware_1.validate)(product_validation_1.createProductSchema), vendor_controller_1.vendorController.createProduct);
// router.post(
//   "/products",
//   vendorController.createProduct
// );
// PATCH /vendor/products/:id
router.patch("/products/:id", vendor_controller_1.vendorController.updateProduct);
// DELETE /vendor/products/:id
router.delete("/products/:id", vendor_controller_1.vendorController.deleteProduct);
/*
|--------------------------------------------------------------------------
| Vendor Orders
|--------------------------------------------------------------------------
*/
// GET /vendor/orders
router.get("/orders", vendor_controller_1.vendorController.getVendorOrders);
// GET /vendor/orders/:id
router.get("/orders/:id", vendor_controller_1.vendorController.getSingleVendorOrder);
router.post("/products/:productId/variants", vendor_controller_1.vendorController.addVariant);
router.patch("/variants/:variantId", vendor_controller_1.vendorController.updateVariant);
router.delete("/variants/:variantId", vendor_controller_1.vendorController.deleteVariant);
router.get("/products/:productId/variants", vendor_controller_1.vendorController.getProductVariants);
router.get("/colors", vendor_controller_1.vendorController.getColors);
router.get("/sizes", vendor_controller_1.vendorController.getSizes);
router.post("/banner-requests", vendor_controller_1.vendorController.createBannerRequest);
router.get("/banner-requests/history", vendor_controller_1.vendorController.getVendorRequestsHistory);
router.get("/banner-requests/history/:id", vendor_controller_1.vendorController.getVendorRequestById);
router.delete("/banner-requests/history/:id", vendor_controller_1.vendorController.deleteVendorRequestById);
router.post("/banner-requests", vendor_controller_1.vendorController.createBannerRequest);
router.post("/promo-banner-requests", vendor_controller_1.vendorController.createPromoBannerRequest);
router.get("/analytices", vendor_controller_1.vendorController.getAnalytics);
exports.default = router;
