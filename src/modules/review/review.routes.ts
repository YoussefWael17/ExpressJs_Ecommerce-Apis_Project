import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { ReviewController } from "./review.controller";

import { validate } from "../../middlewares/validate.middleware";
import { createReviewSchema } from "./review.validation";

const router = Router();


router.post("/", authMiddleware, validate(createReviewSchema), ReviewController.addReview);

export default router;