import { Router } from "express";

import { orderController } from "./order.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", orderController.create);

router.get("/", orderController.getMyOrders);

router.get("/:id", orderController.getOne);

export default router;