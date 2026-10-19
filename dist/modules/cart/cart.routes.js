"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("./cart.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const cart_validation_1 = require("./cart.validation");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
/*
|--------------------------------------------------------------------------
| GET CART
|--------------------------------------------------------------------------
*/
router.get("/", cart_controller_1.cartController.getCart);
/*
|--------------------------------------------------------------------------
| ADD ITEM
|--------------------------------------------------------------------------
*/
router.post("/items", (0, validate_middleware_1.validate)(cart_validation_1.addToCartSchema), cart_controller_1.cartController.addItem);
/*
|--------------------------------------------------------------------------
| UPDATE ITEM
|--------------------------------------------------------------------------
*/
router.patch("/items/:id", (0, validate_middleware_1.validate)(cart_validation_1.updateCartSchema), cart_controller_1.cartController.updateQuantity);
/*
|--------------------------------------------------------------------------
| DELETE ITEM
|--------------------------------------------------------------------------
*/
router.delete("/items/:id", cart_controller_1.cartController.removeItem);
exports.default = router;
