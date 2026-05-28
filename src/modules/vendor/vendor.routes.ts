import { Router } from "express";

import { vendorController } from "./vendor.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { allowRoles } from "../../middlewares/allowRoles";

const router = Router();

/*
|--------------------------------------------------------------------------
| Vendor Access Only
|--------------------------------------------------------------------------
*/

router.use(
  authMiddleware,
  allowRoles("VENDOR", "ADMIN")
);

/*
|--------------------------------------------------------------------------
| Vendor Products
|--------------------------------------------------------------------------
*/

// GET /vendor/products
router.get(
  "/products",
  vendorController.getMyProducts
);

// GET /vendor/products/:id
router.get(
  "/products/:id",
  vendorController.getSingleProduct
);

// POST /vendor/products
router.post(
  "/products",
  vendorController.createProduct
);

// PATCH /vendor/products/:id
router.patch(
  "/products/:id",
  vendorController.updateProduct
);

// DELETE /vendor/products/:id
router.delete(
  "/products/:id",
  vendorController.deleteProduct
);

/*
|--------------------------------------------------------------------------
| Vendor Orders
|--------------------------------------------------------------------------
*/

// GET /vendor/orders
router.get(
  "/orders",
  vendorController.getVendorOrders
);

// GET /vendor/orders/:id
router.get(
  "/orders/:id",
  vendorController.getSingleVendorOrder
);

export default router;