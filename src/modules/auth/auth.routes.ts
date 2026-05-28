import { Router } from "express";

import { authController } from "./auth.controller";

import { validate } from "../../middlewares/validate.middleware";

import {
  registerSchema,
  loginSchema,
} from "./auth.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  validate(registerSchema),
  authController.register
);

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

router.post(
  "/login",
  validate(loginSchema),
  authController.login
);

router.post("/google", authController.googleAuth);

export default router;