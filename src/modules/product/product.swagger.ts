/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Products APIs
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get single product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products/new-arrivals:
 *   get:
 *     summary: Get new arrival products
 *     tags: [Products]
 *     description: Returns latest products sorted by creation date (newest first)
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of products to return
 *     responses:
 *       200:
 *         description: List of new arrival products
 */

/**
 * @swagger
 * /products/best-sellers:
 *   get:
 *     summary: Get best selling products
 *     tags: [Products]
 *     description: Returns products sorted by total quantity sold
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of best selling products
 */
