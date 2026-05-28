import { Router } from "express";

import { productController } from "./product.controller";

import { validate } from "../../middlewares/validate.middleware";


const router = Router();

/*
|--------------------------------------------------------------------------
| STATIC ROUTES (must come first)
|--------------------------------------------------------------------------
*/

router.get("/new-arrivals", productController.getNewArrivals);

router.get("/best-sellers", productController.getBestSellers);

/*
|--------------------------------------------------------------------------
| LIST PRODUCTS
|--------------------------------------------------------------------------
*/

router.get("/", productController.getAll);

/*
|--------------------------------------------------------------------------
| SINGLE PRODUCT
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  productController.getOne
);

export default router;