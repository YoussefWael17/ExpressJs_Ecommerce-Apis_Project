import { Router } from "express";

import { cartController } from "./cart.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", cartController.getCart);

router.post("/items", cartController.addItem);

router.patch(
  "/items/:id",
  cartController.updateQuantity
);

router.delete(
  "/items/:id",
  cartController.removeItem
);

export default router;