import { Request, Response } from "express";
import { productService } from "./product.service";
import { AuthRequest } from "../../types/auth-request";

export const productController = {
  create: async (req: AuthRequest, res: Response) => {
    try {
      const product = await productService.create(
        req.body,
        req.user!.id
      );

      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const products = await productService.getAll(req.query);

      res.json(products);
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  getOne: async (req: Request, res: Response) => {
    try {
      const product = await productService.getOne(
        req.params.id as string
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json(product);
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
};