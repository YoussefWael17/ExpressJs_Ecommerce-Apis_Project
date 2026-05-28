import { Request, Response } from "express";

import { AuthRequest } from "../../types/auth-request";

import { adminService } from "./admin.service";

import { asyncHandler } from "../../utils/asyncHandler";

import { AppError } from "../../utils/AppError";
import { categoryService } from "../category/category.service";

export const adminController = {
  /*
  |--------------------------------------------------------------------------
  | Users
  |--------------------------------------------------------------------------
  */

  getUsers: asyncHandler(async (_: AuthRequest, res: Response) => {
    const users = await adminService.getUsers();

    res.json(users);
  }),

  changeRole: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const user = await adminService.changeRole(id as string, req.body.role);

    res.json(user);
  }),

  deleteUser: asyncHandler(async (req: AuthRequest, res: Response) => {
    await adminService.deleteUser(req.params.id as string);

    res.json({
      message: "User deleted successfully",
    });
  }),

  /*
  |--------------------------------------------------------------------------
  | Products
  |--------------------------------------------------------------------------
  */

  getProducts: asyncHandler(async (_: AuthRequest, res: Response) => {
    const products = await adminService.getProducts();

    res.json(products);
  }),

  deleteProduct: asyncHandler(async (req: AuthRequest, res: Response) => {
    await adminService.deleteProduct(req.params.id as string);

    res.json({
      message: "Product deleted successfully",
    });
  }),

  toggleProductStatus: asyncHandler(async (req: AuthRequest, res: Response) => {
    const product = await adminService.toggleProductStatus(req.params.id as string);

    res.json(product);
  }),

  /*
  |--------------------------------------------------------------------------
  | Orders
  |--------------------------------------------------------------------------
  */

  getOrders: asyncHandler(async (_: AuthRequest, res: Response) => {
    const orders = await adminService.getOrders();

    res.json(orders);
  }),

  getOrderById: asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await adminService.getOrderById(req.params.id as string);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    res.json(order);
  }),

  updateOrderStatus: asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await adminService.updateOrderStatus(
      req.params.id as string,
      req.body.status
    );

    res.json(order);
  }),

  /*
  |--------------------------------------------------------------------------
  | Stats
  |--------------------------------------------------------------------------
  */

  getStats: asyncHandler(async (_: AuthRequest, res: Response) => {
    const stats = await adminService.getStats();

    res.json(stats);
  }),

  /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */
  
    createCategory: asyncHandler(
      async (
        req: AuthRequest,
        res: Response
      ) => {
        const category =
          await categoryService.create(
            req.body
          );
  
        res.status(201).json({
          success: true,
          message:
            "Category created successfully",
          data: category,
        });
      }
    ),

    /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  updateCategory: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const category =
        await categoryService.update(
          req.params.id as string,
          req.body
        );

      res.json({
        success: true,
        message:
          "Category updated successfully",
        data: category,
      });
    }
  ),

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  deleteCategory: asyncHandler(
    async (req: Request, res: Response) => {
      await categoryService.delete(
        req.params.id as string
      );

      res.json({
        success: true,
        message:
          "Category deleted successfully",
      });
    }
  ),


};