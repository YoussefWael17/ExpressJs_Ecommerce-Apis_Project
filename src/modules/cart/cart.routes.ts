import { Router } from "express";

import { cartController } from "./cart.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { validate } from "../../middlewares/validate.middleware";

import {
  addToCartSchema,
  updateCartSchema,
} from "./cart.validation";

const router = Router();

router.use(authMiddleware);

/*
|--------------------------------------------------------------------------
| GET CART
|--------------------------------------------------------------------------
*/

router.get("/", cartController.getCart);

/*
|--------------------------------------------------------------------------
| ADD ITEM
|--------------------------------------------------------------------------
*/

router.post(
  "/items",
  validate(addToCartSchema),
  cartController.addItem
);

/*
|--------------------------------------------------------------------------
| UPDATE ITEM
|--------------------------------------------------------------------------
*/

router.patch(
  "/items/:id",
  validate(updateCartSchema),
  cartController.updateQuantity
);

/*
|--------------------------------------------------------------------------
| DELETE ITEM
|--------------------------------------------------------------------------
*/

router.delete(
  "/items/:id",
  cartController.removeItem
);

export default router;