import { Request, Response } from "express";

import { AuthRequest } from "../../types/auth-request";

import { adminService } from "./admin.service";

import { asyncHandler } from "../../utils/asyncHandler";

import { AppError } from "../../utils/AppError";
import { categoryService } from "../category/category.service";
import { SizeService } from "../size/size.service";
import { ColorService } from "../color/color.service";
import { BannerRequestService } from "../bannerRequest/bannerRequest.service";
import PromoBannerService from "../promoBanner/promoBanner.service";
import { PromoBannerRequestService } from "../promoBannerRequest/promoBannerRequest.service";

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
  
    // createCategory: asyncHandler(
    //   async (
    //     req: AuthRequest,
    //     res: Response
    //   ) => {
    //     const category =
    //       await categoryService.create(
    //         req.body
    //       );
  
    //     res.status(201).json({
    //       success: true,
    //       message:
    //         "Category created successfully",
    //       data: category,
    //     });
    //   }
    // ),

    createCategory: asyncHandler(
      async (req: AuthRequest, res: Response) => {

        // if (!req.file) {
        //   throw new AppError("Image is required", 400);
        //   console.log("FILE:", req.file);
        // }

        // console.log("FILE:", req.file);

        const category = await categoryService.create({
          name: req.body.name,
          icon: req.body.icon
          // image: req.file.path,
        });

        res.status(201).json({
          success: true,
          message: "Category created successfully",
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

      const data: any = {
        ...req.body,
      };

      if (req.file) {
        data.image = req.file.path;
      }

      const category = await categoryService.update(
        req.params.id as string,
        data
      );

      res.json({
        success: true,
        message: "Category updated successfully",
        data: category,
      });
    }
  ),

  // updateCategory: asyncHandler(
  //   async (
  //     req: AuthRequest,
  //     res: Response
  //   ) => {
  //     const category =
  //       await categoryService.update(
  //         req.params.id as string,
  //         req.body
  //       );

  //     res.json({
  //       success: true,
  //       message:
  //         "Category updated successfully",
  //       data: category,
  //     });
  //   }
  // ),

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


    addSize: asyncHandler( async function (req: AuthRequest, res: Response) {
      const size = await SizeService.create(req.body);
      
      res.status(201).json({
        success: true,
        message: "Size added successfully",
        data: size,
      });

    }),

    updateSize: asyncHandler( async function (req: AuthRequest, res: Response) {
      const size = await SizeService.update(req.params.id as string, req.body);

      res.json({
        success: true,
        message: "Size updated successfully",
        data: size,
      });
    
    }),

    deleteSize: asyncHandler( async function (req: AuthRequest, res: Response) {
      const size = await SizeService.delete(req.params.id as string);

      res.json({
        success: true,
        message: "Size Deleted successfully",
        data: size,
      });
    
    }),

    addColor: asyncHandler( async function (req: AuthRequest, res: Response) {
      
      if (!req.body.name?.trim()) {
        throw new AppError("Color name is required", 400);
      }

      const name = req.body.name.trim();
      const hexCode = req.body.hexCode ?? null;

      const color = await ColorService.create(name, hexCode);

      res.status(201).json({
        success: true,
        message: "Color added successfully",
        data: color,
      });

    }),

    updateColor: asyncHandler( async function (req: AuthRequest, res: Response) {
      
      const id = req.params.id as string;
      
      const name = req.body.name?.trim();
      let hexCode: string | null | undefined;

      if ("hexCode" in req.body) {
        hexCode = req.body.hexCode;
      }

      const color = await ColorService.update(id, name, hexCode);

      res.json({
        success: true,
        message: "Color updated successfully",
        data: color,
      });
    }),

    deleteColor: asyncHandler( async function (req: AuthRequest, res: Response) {

      const id = req.params.id as string;

      const color = await ColorService.delete(id);

      res.json({
        success: true,
        message: "Color Deleted successfully",
        data: color,
      });
    
    }),


    /*
    |--------------------------------------------------------------------------
    | Banner Requests
    |--------------------------------------------------------------------------
    */
    getBannerRequests: asyncHandler( async function ( req: AuthRequest, res: Response ) {
      
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const searchTerm =
        typeof req.query.search === "string"
          ? req.query.search.trim()
          : undefined;

      const requests = await BannerRequestService.getAll(page, limit, searchTerm);

      res.status(200).json({
        success: true,
        data: requests,
      });
  }),

  approveBannerRequest: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const banner = await BannerRequestService.approve(id as string);

    res.status(200).json({
        success: true,
        data: banner,
    });
  }),

  rejectBannerRequest: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const banner = await BannerRequestService.reject(id as string);

    res.status(200).json({
        success: true,
        data: banner,
    });
  }),


  // Get All Promo Banners Request - Admin
  getPromoBannersRequests: asyncHandler( async (req: AuthRequest, res: Response) => {

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const searchTerm =
        typeof req.query.search === "string"
          ? req.query.search.trim()
          : undefined;

      const promoBannersRequests = await PromoBannerRequestService.getAll(page, limit, searchTerm);

      res.status(200).json({
        success: true,
        data: promoBannersRequests,
      });
    }
  ),

    // =========================================================
    // APPROVE REQUEST - ADMIN
    // =========================================================
  
    approvePromoBannerRequest: asyncHandler(async (req: AuthRequest, res: Response) => {
      const promoBanner = await PromoBannerRequestService.approve(
        req.params.id as string
      );
  
      res.status(200).json({
        success: true,
        data: promoBanner,
        message: "Promo banner request approved successfully.",
      });
    }),
  
    // =========================================================
    // REJECT REQUEST - ADMIN
    // =========================================================
  
    rejectPromoBannerRequest: asyncHandler(async (req: AuthRequest, res: Response) => {
    
      const rejectedRequest = await PromoBannerRequestService.reject(
        req.params.id as string,
      );
  
      res.status(200).json({
        success: true,
        data: rejectedRequest,
        message: "Promo banner request rejected successfully.",
      });
    }),


};