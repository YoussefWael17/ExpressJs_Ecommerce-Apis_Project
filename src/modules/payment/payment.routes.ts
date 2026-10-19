import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/checkout",
  authMiddleware,
  paymentController.checkout
);

export default router;