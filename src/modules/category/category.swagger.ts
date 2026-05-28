/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management APIs
 */

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories list
 */

/*
|--------------------------------------------------------------------------
| GET ONE
|--------------------------------------------------------------------------
*/

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get single category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category details
 */

