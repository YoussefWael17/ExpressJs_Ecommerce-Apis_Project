import { Response } from "express";

import { AuthRequest } from "../../types/auth-request";

import { asyncHandler } from "../../utils/asyncHandler";

import { vendorService } from "./vendor.service";

export const vendorController = {
  /*
  |--------------------------------------------------------------------------
  | Products
  |--------------------------------------------------------------------------
  */

  getMyProducts: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const products =
        await vendorService.getMyProducts(
          req.user!.id
        );

      res.json({
        success: true,
        data: products,
      });
    }
  ),

  getSingleProduct: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const product =
        await vendorService.getSingleProduct(
          req.params.id as string,
          req.user!.id
        );

      res.json({
        success: true,
        data: product,
      });
    }
  ),

  createProduct: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const product =
        await vendorService.createProduct(
          req.body,
          req.user!.id,
          req.user!.role
        );

      res.status(201).json({
        success: true,
        message:
          "Product created successfully",
        data: product,
      });
    }
  ),

  updateProduct: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const product =
        await vendorService.updateProduct(
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

  deleteProduct: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      await vendorService.deleteProduct(
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
  | Orders
  |--------------------------------------------------------------------------
  */

  getVendorOrders: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const orders =
        await vendorService.getVendorOrders(
          req.user!.id
        );

      res.json({
        success: true,
        data: orders,
      });
    }
  ),

  getSingleVendorOrder: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const order =
        await vendorService.getSingleVendorOrder(
          req.params.id as string,
          req.user!.id
        );

      res.json({
        success: true,
        data: order,
      });
    }
  ),
};