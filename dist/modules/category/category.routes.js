"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const category_validation_1 = require("./category.validation");
const router = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
router.get("/", category_controller_1.categoryController.getAll);
router.get("/:id", (0, validate_middleware_1.validate)(category_validation_1.categoryIdSchema), category_controller_1.categoryController.getOne);
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
exports.default = router;
