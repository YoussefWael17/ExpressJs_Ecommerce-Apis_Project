"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const order_validation_1 = require("./order.validation");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
/*
|--------------------------------------------------------------------------
| CREATE ORDER
|--------------------------------------------------------------------------
*/
router.post("/", order_controller_1.orderController.create);
/*
|--------------------------------------------------------------------------
| GET MY ORDERS
|--------------------------------------------------------------------------
*/
router.get("/", order_controller_1.orderController.getMyOrders);
/*
|--------------------------------------------------------------------------
| GET SINGLE ORDER
|--------------------------------------------------------------------------
*/
router.get("/:id", (0, validate_middleware_1.validate)(order_validation_1.getOrderSchema), order_controller_1.orderController.getOne);
exports.default = router;
