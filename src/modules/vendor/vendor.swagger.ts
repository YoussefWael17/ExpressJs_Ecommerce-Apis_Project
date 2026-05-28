/**
 * @swagger
 * tags:
 *   name: Vendor
 *   description: Vendor APIs
 */

/**
 * @swagger
 * /vendor/products:
 *   get:
 *     summary: Get vendor products
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor products fetched successfully
 */

/**
 * @swagger
 * /vendor/products/{id}:
 *   get:
 *     summary: Get single vendor product
 *     tags: [Vendor]
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
 *         description: Product fetched successfully
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /vendor/products:
 *   post:
 *     summary: Create product
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 */

/**
 * @swagger
 * /vendor/products/{id}:
 *   patch:
 *     summary: Update product
 *     tags: [Vendor]
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
 *             $ref: '#/components/schemas/CreateProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /vendor/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Vendor]
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
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /vendor/orders:
 *   get:
 *     summary: Get vendor orders
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor orders fetched successfully
 */

/**
 * @swagger
 * /vendor/orders/{id}:
 *   get:
 *     summary: Get single vendor order
 *     tags: [Vendor]
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
 *         description: Order fetched successfully
 *       404:
 *         description: Order not found
 */