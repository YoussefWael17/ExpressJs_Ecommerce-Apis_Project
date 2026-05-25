import { Router } from "express";

import { productController } from "./product.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { roleMiddleware } from "../../middlewares/role.middleware";
import { createProductSchema } from "./product.validation";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router.get("/", productController.getAll);

router.get("/:id", productController.getOne);

router.post(
  "/",

  authMiddleware,

  roleMiddleware("VENDOR", "ADMIN"),

  validate(createProductSchema),

  productController.create
);

export default router;