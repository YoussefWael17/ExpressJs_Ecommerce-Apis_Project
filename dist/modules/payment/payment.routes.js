"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
router.post("/checkout", auth_middleware_1.authMiddleware, payment_controller_1.paymentController.checkout);
exports.default = router;
