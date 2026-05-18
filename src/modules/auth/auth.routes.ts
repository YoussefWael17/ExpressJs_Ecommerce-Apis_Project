import { Router } from "express";
import { authController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get(
  "/profile",
  authMiddleware,
  authController.profile
);

export default router;