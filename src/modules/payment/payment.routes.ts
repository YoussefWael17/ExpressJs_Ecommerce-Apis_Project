import { Router } from "express";

import { paymentController } from "./payment.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/checkout/:orderId",
  authMiddleware,
  paymentController.checkout
);

export default router;