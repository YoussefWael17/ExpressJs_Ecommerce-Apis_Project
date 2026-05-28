import { Router } from "express";

import { orderController } from "./order.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { validate } from "../../middlewares/validate.middleware";
import { getOrderSchema } from "./order.validation";


const router = Router();

router.use(authMiddleware);

/*
|--------------------------------------------------------------------------
| CREATE ORDER
|--------------------------------------------------------------------------
*/

router.post("/", orderController.create);

/*
|--------------------------------------------------------------------------
| GET MY ORDERS
|--------------------------------------------------------------------------
*/

router.get("/", orderController.getMyOrders);

/*
|--------------------------------------------------------------------------
| GET SINGLE ORDER
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  validate(getOrderSchema),
  orderController.getOne
);

export default router;