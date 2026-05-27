// import { Request, Response } from "express";
// import { productService } from "./product.service";
// import { AuthRequest } from "../../types/auth-request";

// export const productController = {
//   create: async (req: AuthRequest, res: Response) => {
//     try {
//       const product = await productService.create(
//         req.body,
//         req.user!.id
//       );

//       res.status(201).json(product);
//     } catch (error: any) {
//       res.status(400).json({
//         message: error.message,
//       });
//     }
//   },

//   getAll: async (req: Request, res: Response) => {
//     try {
//       const products = await productService.getAll(req.query);

//       res.json(products);
//     } catch (error: any) {
//       res.status(500).json({
//         message: error.message,
//       });
//     }
//   },

//   getOne: async (req: Request, res: Response) => {
//     try {
//       const product = await productService.getOne(
//         req.params.id as string
//       );

//       if (!product) {
//         return res.status(404).json({
//           message: "Product not found",
//         });
//       }

//       res.json(product);
//     } catch (error: any) {
//       res.status(500).json({
//         message: error.message,
//       });
//     }
//   },

//   getNewArrivals: async (req: Request, res: Response) => {
//     try {
//       const limit = Number(req.query.limit) || 10;

//       const products = await productService.getNewArrivals(limit);

//       res.json(products);

//     } catch (error: any) {
//       res.status(500).json({
//         message: error.message,
//       });
//     }
//   },

//   getBestSellers: async (req: Request, res: Response) => {
//     try {
//       const limit = Number(req.query.limit) || 10;

//       const products =
//         await productService.getBestSellers(limit);

//       res.json(products);

//     } catch (error: any) {
//       res.status(500).json({
//         message: error.message,
//       });
//     }
//   },

// };


import { Request, Response } from "express";

import { productService } from "./product.service";

import { AuthRequest } from "../../types/auth-request";

import { asyncHandler } from "../../utils/asyncHandler";

import { AppError } from "../../utils/AppError";

export const productController = {
  create: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const product =
        await productService.create(
          req.body,
          req.user!.id
        );

      res.status(201).json({
        success: true,
        data: product,
      });
    }
  ),

  getAll: asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const products =
        await productService.getAll(
          req.query
        );

      res.json({
        success: true,
        data: products,
      });
    }
  ),

  getOne: asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const product =
        await productService.getOne(
          req.params.id as string
        );

      if (!product) {
        throw new AppError(
          "Product not found",
          404
        );
      }

      res.json({
        success: true,
        data: product,
      });
    }
  ),

  getNewArrivals: asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const limit =
        Number(req.query.limit) || 10;

      const products =
        await productService.getNewArrivals(
          limit
        );

      res.json({
        success: true,
        data: products,
      });
    }
  ),

  getBestSellers: asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const limit =
        Number(req.query.limit) || 10;

      const products =
        await productService.getBestSellers(
          limit
        );

      res.json({
        success: true,
        data: products,
      });
    }
  ),
};