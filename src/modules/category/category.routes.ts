import { Router } from "express";
import { categoryController } from "./category.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "./category.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  categoryController.getAll
);

router.get(
  "/:id",
  validate(categoryIdSchema),
  categoryController.getOne
);

// /*
// |--------------------------------------------------------------------------
// | ADMIN ROUTES
// |--------------------------------------------------------------------------
// */

// router.post(
//   "/",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   validate(createCategorySchema),
//   categoryController.create
// );

// router.patch(
//   "/:id",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   validate(categoryIdSchema),
//   validate(updateCategorySchema),
//   categoryController.update
// );

// router.delete(
//   "/:id",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   validate(categoryIdSchema),
//   categoryController.delete
// );

export default router;