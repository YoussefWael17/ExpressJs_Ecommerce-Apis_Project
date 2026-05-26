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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   slug:
 *                     type: string
 *                   description:
 *                     type: string
 *                     nullable: true
 *                   thumbnail:
 *                     type: string
 *                     nullable: true
 *                   isActive:
 *                     type: boolean
 *                   isSale:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   category:
 *                     type: object
 *                   variants:
 *                     type: array
 *                   images:
 *                     type: array
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

import { Router } from "express";

import { productController } from "./product.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { roleMiddleware } from "../../middlewares/role.middleware";
import { createProductSchema } from "./product.validation";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router.get("/", productController.getAll);

router.get("/:id", productController.getOne);

router.get("/new-arrivals", productController.getNewArrivals);

router.get("/best-sellers", productController.getBestSellers);

router.post(
  "/",

  authMiddleware,

  roleMiddleware("VENDOR", "ADMIN"),

  validate(createProductSchema),

  productController.create
);

export default router;