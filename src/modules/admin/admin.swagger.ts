import { Express } from "express";

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin dashboard APIs
 */

/*
|--------------------------------------------------------------------------
| USERS
|--------------------------------------------------------------------------
*/

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 */

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Change user role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER, VENDOR]
 *     responses:
 *       200:
 *         description: Role updated successfully
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Admin]
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
 *         description: User deleted successfully
 */

/*
|--------------------------------------------------------------------------
| PRODUCTS
|--------------------------------------------------------------------------
*/

/**
 * @swagger
 * /admin/products:
 *   get:
 *     summary: Get all products (admin view)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 */

/**
 * @swagger
 * /admin/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Admin]
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
 *         description: Product deleted successfully
 */

/**
 * @swagger
 * /admin/products/{id}/toggle:
 *   patch:
 *     summary: Toggle product active status
 *     tags: [Admin]
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
 *         description: Product status updated
 */

/*
|--------------------------------------------------------------------------
| ORDERS
|--------------------------------------------------------------------------
*/

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */

/**
 * @swagger
 * /admin/orders/{id}:
 *   get:
 *     summary: Get single order
 *     tags: [Admin]
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
 */

/**
 * @swagger
 * /admin/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - PAID
 *                   - SHIPPED
 *                   - DELIVERED
 *                   - CANCELLED
 *     responses:
 *       200:
 *         description: Order status updated
 */

/*
|--------------------------------------------------------------------------
| STATS
|--------------------------------------------------------------------------
*/

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: number
 *                 vendors:
 *                   type: number
 *                 products:
 *                   type: number
 *                 orders:
 *                   type: number
 *                 revenue:
 *                   type: number
 */