"use strict";
/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Category management APIs
 */
/* -------------------------------------------------------------------------- */
/* CREATE CATEGORY                                                            */
/* -------------------------------------------------------------------------- */
// /**
//  * @swagger
//  * /categories:
//  *   post:
//  *     summary: Create category
//  *     tags: [Categories]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - name
//  *               - slug
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: Electronics
//  *               slug:
//  *                 type: string
//  *                 example: electronics
//  *               description:
//  *                 type: string
//  *                 example: Electronics products and accessories
//  *     responses:
//  *       201:
//  *         description: Category created successfully
//  *       400:
//  *         description: Validation error
//  *       401:
//  *         description: Unauthorized
//  *       403:
//  *         description: Forbidden
//  */
/* -------------------------------------------------------------------------- */
/* GET ALL CATEGORIES                                                         */
/* -------------------------------------------------------------------------- */
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
/* -------------------------------------------------------------------------- */
/* GET SINGLE CATEGORY                                                        */
/* -------------------------------------------------------------------------- */
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
 *       404:
 *         description: Category not found
 */
/* -------------------------------------------------------------------------- */
/* UPDATE CATEGORY                                                            */
/* -------------------------------------------------------------------------- */
// /**
//  * @swagger
//  * /categories/{id}:
//  *   patch:
//  *     summary: Update category
//  *     tags: [Categories]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: Electronics
//  *               slug:
//  *                 type: string
//  *                 example: electronics
//  *               description:
//  *                 type: string
//  *                 example: Updated category description
//  *     responses:
//  *       200:
//  *         description: Category updated successfully
//  *       404:
//  *         description: Category not found
//  *       401:
//  *         description: Unauthorized
//  *       403:
//  *         description: Forbidden
//  */
// /* -------------------------------------------------------------------------- */
// /* DELETE CATEGORY                                                            */
// /* -------------------------------------------------------------------------- */
// /**
//  * @swagger
//  * /categories/{id}:
//  *   delete:
//  *     summary: Delete category
//  *     tags: [Categories]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     responses:
//  *       200:
//  *         description: Category deleted successfully
//  *       404:
//  *         description: Category not found
//  *       401:
//  *         description: Unauthorized
//  *       403:
//  *         description: Forbidden
//  */
