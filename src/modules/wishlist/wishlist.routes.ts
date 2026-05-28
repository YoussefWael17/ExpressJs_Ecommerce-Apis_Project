import { Router } from "express";

import { wishlistController } from "./wishlist.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { validate } from "../../middlewares/validate.middleware";

import {
  addWishlistSchema,
  removeWishlistSchema,
} from "./wishlist.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| GET WISHLIST
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  wishlistController.getMine
);

/*
|--------------------------------------------------------------------------
| ADD ITEM
|--------------------------------------------------------------------------
*/

router.post(
  "/items",
  authMiddleware,
  validate(addWishlistSchema),
  wishlistController.add
);

/*
|--------------------------------------------------------------------------
| REMOVE ITEM
|--------------------------------------------------------------------------
*/

router.delete(
  "/items/:id",
  authMiddleware,
  validate(removeWishlistSchema),
  wishlistController.remove
);

export default router;