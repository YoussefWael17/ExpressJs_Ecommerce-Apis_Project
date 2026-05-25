// import { Router } from "express";
// import { authController } from "./auth.controller";
// import { authMiddleware } from "../../middlewares/auth.middleware";

// const router = Router();

// router.post("/register", authController.register);
// router.post("/login", authController.login);

// router.get(
//   "/profile",
//   authMiddleware,
//   authController.profile
// );

// export default router;


import { Router } from "express";

import { authController } from "./auth.controller";

import { validate } from "../../middlewares/validate.middleware";

import {
  registerSchema,
  loginSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  authController.register
);

router.post(
  "/login",
  validate(loginSchema),
  authController.login
);

export default router;