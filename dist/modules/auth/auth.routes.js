"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/
router.post("/register", (0, validate_middleware_1.validate)(auth_validation_1.registerSchema), auth_controller_1.authController.register);
/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
router.post("/login", (0, validate_middleware_1.validate)(auth_validation_1.loginSchema), auth_controller_1.authController.login);
router.post("/google", auth_controller_1.authController.googleAuth);
exports.default = router;
