/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Wishlist management APIs
 */

/*
|--------------------------------------------------------------------------
| GET WISHLIST
|--------------------------------------------------------------------------
*/

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
 *         description: Wishlist items
 */

/*
|--------------------------------------------------------------------------
| ADD ITEM
|--------------------------------------------------------------------------
*/

/**
 * @swagger
 * /wishlist/items:
 *   post:
 *     summary: Add item to wishlist
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
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Item added successfully
 */

/*
|--------------------------------------------------------------------------
| REMOVE ITEM
|--------------------------------------------------------------------------
*/

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
 *           format: uuid
 *     responses:
 *       200:
 *         description: Item removed successfully
 */