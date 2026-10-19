import { Router } from "express";

import { adminController } from "./admin.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { roleMiddleware } from "../../middlewares/role.middleware";

import { validate } from "../../middlewares/validate.middleware";

import {
  changeRoleSchema,
} from "./admin.validation";
import { updateOrderStatusSchema } from "../order/order.validation";
import { createCategorySchema, updateCategorySchema } from "../category/category.validation";
import { upload } from "../../middlewares/upload.middleware";


const router = Router();

/*
|--------------------------------------------------------------------------
| Protect ALL admin routes
|--------------------------------------------------------------------------
*/

router.use(authMiddleware, roleMiddleware("ADMIN"));

/*
|--------------------------------------------------------------------------
| USERS
|--------------------------------------------------------------------------
*/

router.get("/users", adminController.getUsers);

router.patch(
  "/users/:id/role",
  validate(changeRoleSchema),
  adminController.changeRole
);

router.delete("/users/:id", adminController.deleteUser);

/*
|--------------------------------------------------------------------------
| PRODUCTS
|--------------------------------------------------------------------------
*/

router.get("/products", adminController.getProducts);

router.delete("/products/:id", adminController.deleteProduct);

router.patch("/products/:id/toggle", adminController.toggleProductStatus);

/*
|--------------------------------------------------------------------------
| ORDERS
|--------------------------------------------------------------------------
*/

router.get("/orders", adminController.getOrders);

router.get("/orders/:id", adminController.getOrderById);

router.patch(
  "/orders/:id/status",
  validate(updateOrderStatusSchema),
  adminController.updateOrderStatus
);

/*
|--------------------------------------------------------------------------
| STATS
|--------------------------------------------------------------------------
*/

router.get("/stats", adminController.getStats);

// router.post(
//   "/categories",
//   validate(createCategorySchema),
//   adminController.createCategory
// );

router.post(
  "/categories",
  upload.single("image"),
  validate(createCategorySchema),
  adminController.createCategory
);

// router.patch(
//   "/categories/:id",
//   validate(updateCategorySchema),
//   adminController.updateCategory
// );

router.patch(
  "/categories/:id",
  upload.single("image"),
  validate(updateCategorySchema),
  adminController.updateCategory
);

router.delete(
  "/categories/:id",
  adminController.deleteCategory
);


router.post("/sizes", adminController.addSize);
router.patch("/sizes/:id", adminController.updateSize);
router.delete("/sizes/:id", adminController.deleteSize);

router.post("/colors", adminController.addColor);
router.patch("/colors/:id", adminController.updateColor);
router.delete("/colors/:id", adminController.deleteColor);

router.get("/banner-requests", adminController.getBannerRequests);

router.patch("/banner-requests/:id/approve", adminController.approveBannerRequest);
router.patch("/banner-requests/:id/reject", adminController.rejectBannerRequest);

router.get("/promo-banner-requests", adminController.getPromoBannersRequests);

router.patch("/promo-banner-requests/:id/approve", adminController.approvePromoBannerRequest);
router.patch("/promo-banner-requests/:id/reject", adminController.rejectPromoBannerRequest);



export default router;

