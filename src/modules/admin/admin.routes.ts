import { Router } from "express";

import { adminController } from "./admin.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { roleMiddleware } from "../../middlewares/role.middleware";

import { validate } from "../../middlewares/validate.middleware";

import {
  changeRoleSchema,
} from "./admin.validation";
import { updateOrderStatusSchema } from "../order/order.validation";


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

export default router;