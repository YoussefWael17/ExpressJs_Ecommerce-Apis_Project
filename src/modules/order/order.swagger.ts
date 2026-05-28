/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */

/*
|--------------------------------------------------------------------------
| CREATE ORDER
|--------------------------------------------------------------------------
*/

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create new order from cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */

/*
|--------------------------------------------------------------------------
| GET MY ORDERS
|--------------------------------------------------------------------------
*/

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get current user orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User orders list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */

/*
|--------------------------------------------------------------------------
| GET SINGLE ORDER
|--------------------------------------------------------------------------
*/

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get single order details
 *     tags: [Orders]
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
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */