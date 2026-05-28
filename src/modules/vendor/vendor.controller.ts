import { Response } from "express";

import { prisma } from "../../lib/prisma";

import { AuthRequest } from "../../types/auth-request";

import { asyncHandler } from "../../utils/asyncHandler";

import { AppError } from "../../utils/AppError";

import { productService } from "../product/product.service";

export const vendorController = {
  /*
  |--------------------------------------------------------------------------
  | Get My Products
  |--------------------------------------------------------------------------
  */
  getMyProducts: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const products =
        await prisma.product.findMany({
          where: {
            vendorId: req.user!.id,
          },

          include: {
            variants: true,
            images: true,
            category: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      res.json({
        success: true,
        data: products,
      });
    }
  ),

  /*
  |--------------------------------------------------------------------------
  | Get Single Product
  |--------------------------------------------------------------------------
  */
  getSingleProduct: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const product =
        await prisma.product.findFirst({
          where: {
            id: req.params.id as string,
            vendorId: req.user!.id,
          },

          include: {
            variants: {
              include: {
                size: true,
                color: true,
              },
            },

            images: true,
            category: true,
          },
        });

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

  /*
  |--------------------------------------------------------------------------
  | Create Product
  |--------------------------------------------------------------------------
  */
  createProduct: asyncHandler(
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
        message:
          "Product created successfully",
        data: product,
      });
    }
  ),

  /*
  |--------------------------------------------------------------------------
  | Update Product
  |--------------------------------------------------------------------------
  */
  updateProduct: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const product =
        await productService.update(
          req.params.id as string,
          req.body,
          req.user!.id,
          req.user!.role
        );

      res.json({
        success: true,
        message:
          "Product updated successfully",
        data: product,
      });
    }
  ),

  /*
  |--------------------------------------------------------------------------
  | Delete Product
  |--------------------------------------------------------------------------
  */
  deleteProduct: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      await productService.delete(
        req.params.id as string,
        req.user!.id,
        req.user!.role
      );

      res.json({
        success: true,
        message:
          "Product deleted successfully",
      });
    }
  ),

  /*
  |--------------------------------------------------------------------------
  | Vendor Orders
  |--------------------------------------------------------------------------
  */
  getVendorOrders: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const orders =
        await prisma.order.findMany({
          where: {
            items: {
              some: {
                product: {
                  vendorId:
                    req.user!.id,
                },
              },
            },
          },

          include: {
            items: {
              include: {
                product: true,
                variant: true,
              },
            },

            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      res.json({
        success: true,
        data: orders,
      });
    }
  ),

  /*
  |--------------------------------------------------------------------------
  | Single Vendor Order
  |--------------------------------------------------------------------------
  */
  getSingleVendorOrder: asyncHandler(
      async (
        req: AuthRequest,
        res: Response
      ) => {
        const order =
          await prisma.order.findFirst({
            where: {
              id: req.params.id as string,

              items: {
                some: {
                  product: {
                    vendorId:
                      req.user!.id,
                  },
                },
              },
            },

            include: {
              items: {
                include: {
                  product: true,
                  variant: true,
                },
              },

              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          });

        if (!order) {
          throw new AppError(
            "Order not found",
            404
          );
        }

        res.json({
          success: true,
          data: order,
        });
      }
    ),
};