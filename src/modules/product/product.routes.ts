import { Router } from "express";

import { productController } from "./product.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

router.get("/", productController.getAll);

router.get("/:id", productController.getOne);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("VENDOR", "ADMIN"),
  productController.create
);

export default router;