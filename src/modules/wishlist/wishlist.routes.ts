import { Router } from "express";

import { wishlistController } from "./wishlist.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { validate } from "../../middlewares/validate.middleware";

import { addWishlistSchema } from "./wishlist.validation";

const router = Router();

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get current user wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User wishlist items
 */
router.get(
  "/",
  authMiddleware,
  wishlistController.getMine
);

/**
 * @swagger
 * /wishlist/items:
 *   post:
 *     summary: Add product variant to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - variantId
 *             properties:
 *               variantId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item added successfully
 */
router.post(
  "/items",

  authMiddleware,

  validate(addWishlistSchema),

  wishlistController.add
);

/**
 * @swagger
 * /wishlist/items/{id}:
 *   delete:
 *     summary: Remove item from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed successfully
 */
router.delete(
  "/items/:id",

  authMiddleware,

  wishlistController.remove
);

export default router;