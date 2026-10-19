import { Router } from "express";

import { vendorController } from "./vendor.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { allowRoles } from "../../middlewares/allowRoles";
import { upload } from "../../middlewares/upload.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createProductSchema } from "../product/product.validation";

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
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  validate(createProductSchema),
  vendorController.createProduct
);

// router.post(
//   "/products",
//   vendorController.createProduct
// );

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


router.post(
  "/products/:productId/variants",
  vendorController.addVariant
);

router.patch(
  "/variants/:variantId",
  vendorController.updateVariant
);

router.delete(
  "/variants/:variantId",
  vendorController.deleteVariant
);

router.get(
  "/products/:productId/variants",
  vendorController.getProductVariants
);


router.get(
  "/colors",
  vendorController.getColors
);

router.get(
  "/sizes",
  vendorController.getSizes
);

router.post(
  "/banner-requests",
  vendorController.createBannerRequest
);

router.get(
  "/banner-requests/history",
  vendorController.getVendorRequestsHistory
);

router.get(
  "/banner-requests/history/:id",
  vendorController.getVendorRequestById
);

router.delete(
  "/banner-requests/history/:id",
  vendorController.deleteVendorRequestById
);

router.post(
  "/banner-requests",
  vendorController.createBannerRequest
);

router.post("/promo-banner-requests", vendorController.createPromoBannerRequest);
router.get("/analytices", vendorController.getAnalytics);

export default router;