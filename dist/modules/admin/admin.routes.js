"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const admin_validation_1 = require("./admin.validation");
const order_validation_1 = require("../order/order.validation");
const category_validation_1 = require("../category/category.validation");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const router = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| Protect ALL admin routes
|--------------------------------------------------------------------------
*/
router.use(auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("ADMIN"));
/*
|--------------------------------------------------------------------------
| USERS
|--------------------------------------------------------------------------
*/
router.get("/users", admin_controller_1.adminController.getUsers);
router.patch("/users/:id/role", (0, validate_middleware_1.validate)(admin_validation_1.changeRoleSchema), admin_controller_1.adminController.changeRole);
router.delete("/users/:id", admin_controller_1.adminController.deleteUser);
/*
|--------------------------------------------------------------------------
| PRODUCTS
|--------------------------------------------------------------------------
*/
router.get("/products", admin_controller_1.adminController.getProducts);
router.delete("/products/:id", admin_controller_1.adminController.deleteProduct);
router.patch("/products/:id/toggle", admin_controller_1.adminController.toggleProductStatus);
/*
|--------------------------------------------------------------------------
| ORDERS
|--------------------------------------------------------------------------
*/
router.get("/orders", admin_controller_1.adminController.getOrders);
router.get("/orders/:id", admin_controller_1.adminController.getOrderById);
router.patch("/orders/:id/status", (0, validate_middleware_1.validate)(order_validation_1.updateOrderStatusSchema), admin_controller_1.adminController.updateOrderStatus);
/*
|--------------------------------------------------------------------------
| STATS
|--------------------------------------------------------------------------
*/
router.get("/stats", admin_controller_1.adminController.getStats);
// router.post(
//   "/categories",
//   validate(createCategorySchema),
//   adminController.createCategory
// );
router.post("/categories", upload_middleware_1.upload.single("image"), (0, validate_middleware_1.validate)(category_validation_1.createCategorySchema), admin_controller_1.adminController.createCategory);
// router.patch(
//   "/categories/:id",
//   validate(updateCategorySchema),
//   adminController.updateCategory
// );
router.patch("/categories/:id", upload_middleware_1.upload.single("image"), (0, validate_middleware_1.validate)(category_validation_1.updateCategorySchema), admin_controller_1.adminController.updateCategory);
router.delete("/categories/:id", admin_controller_1.adminController.deleteCategory);
router.post("/sizes", admin_controller_1.adminController.addSize);
router.patch("/sizes/:id", admin_controller_1.adminController.updateSize);
router.delete("/sizes/:id", admin_controller_1.adminController.deleteSize);
router.post("/colors", admin_controller_1.adminController.addColor);
router.patch("/colors/:id", admin_controller_1.adminController.updateColor);
router.delete("/colors/:id", admin_controller_1.adminController.deleteColor);
router.get("/banner-requests", admin_controller_1.adminController.getBannerRequests);
router.patch("/banner-requests/:id/approve", admin_controller_1.adminController.approveBannerRequest);
router.patch("/banner-requests/:id/reject", admin_controller_1.adminController.rejectBannerRequest);
router.get("/promo-banner-requests", admin_controller_1.adminController.getPromoBannersRequests);
router.patch("/promo-banner-requests/:id/approve", admin_controller_1.adminController.approvePromoBannerRequest);
router.patch("/promo-banner-requests/:id/reject", admin_controller_1.adminController.rejectPromoBannerRequest);
exports.default = router;
