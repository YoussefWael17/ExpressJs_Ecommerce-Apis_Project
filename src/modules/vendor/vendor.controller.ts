import { Response } from "express";

import { AuthRequest } from "../../types/auth-request";

import { asyncHandler } from "../../utils/asyncHandler";

import { vendorService } from "./vendor.service";
import { AppError } from "../../utils/AppError";
import { VariantService } from "../variant/variant.service";
import { ColorService } from "../color/color.service";
import { SizeService } from "../size/size.service";
import { BannerRequestService } from "../bannerRequest/bannerRequest.service";
import { PromoBannerRequestService } from "../promoBannerRequest/promoBannerRequest.service";
import VendorAnalyticsService from "../vendorAnalytics/vendorAnalytics.service";


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
      // const products =
      //   await vendorService.getMyProducts(
      //     req.user!.id
      //   );

      // res.json({
      //   success: true,
      //   data: products,
      // });

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const searchTerm =
        typeof req.query.search === "string"
          ? req.query.search.trim()
          : undefined;


      const products = await vendorService.getMyProducts(
        req.user!.id,
        page,
        limit,
        searchTerm
      );

      res.status(200).json({
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

  // createProduct: asyncHandler(
  //   async (
  //     req: AuthRequest,
  //     res: Response
  //   ) => {

  //     if (!req.file) {
  //       throw new AppError(
  //         "Thumbnail is required",
  //         400
  //       );
  //     }

  //     const product =
  //       await vendorService.createProduct(
  //         {
  //           ...req.body,
  //           thumbnail: req.file.path,
  //         },
  //         req.user!.id,
  //         req.user!.role
  //       );

  //     res.status(201).json({
  //       success: true,
  //       message:
  //         "Product created successfully",
  //       data: product,
  //     });
  //   }
  // ),

  // createProduct: asyncHandler(
  //   async (
  //     req: AuthRequest,
  //     res: Response
  //   ) => {
  //     const product =
  //       await vendorService.createProduct(
  //         req.body,
  //         req.user!.id,
  //         req.user!.role
  //       );

  //     res.status(201).json({
  //       success: true,
  //       message:
  //         "Product created successfully",
  //       data: product,
  //     });
  //   }
  // ),

  createProduct: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const files = req.files as {
        thumbnail?: Express.Multer.File[];
        images?: Express.Multer.File[];
      };

      const thumbnail =
        files?.thumbnail?.[0]?.path;

      const images =
        files?.images?.map((file) => file.path) || [];

      if (!thumbnail) {
        throw new AppError(
          "Thumbnail is required",
          400
        );
      }

      // const variants = req.body.variants
      //   ? JSON.parse(req.body.variants)
      //   : [];

      const product =
        await vendorService.createProduct(
          {
            ...req.body,
            thumbnail,
            images,
            // variants,
          },
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

  // getVendorOrders: asyncHandler(
  //   async (
  //     req: AuthRequest,
  //     res: Response
  //   ) => {
  //     const orders =
  //       await vendorService.getVendorOrders(
  //         req.user!.id
  //       );

  //     res.json({
  //       success: true,
  //       data: orders,
  //     });
  //   }
  // ),

  getVendorOrders: asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const searchTerm =
        typeof req.query.search === "string"
          ? req.query.search.trim()
          : undefined;

      const orders = await vendorService.getVendorOrders(
        req.user!.id,
        page,
        limit,
        searchTerm
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

  getColors: asyncHandler( async function (req: AuthRequest, res: Response){
    const colors = await ColorService.getAll();

    res.status(201).json({
      success: true,
      data: colors,
    })
  }),

  getSizes: asyncHandler( async function (req: AuthRequest, res: Response){
    const sizes = await SizeService.getAll();

    res.status(201).json({
      success: true,
      data: sizes,
    })
  }),

  addVariant: asyncHandler( async function (req: AuthRequest, res: Response) {
    const variant = await VariantService.addVariant(
        req.params.productId as string,
        req.body,
        req.user!.id
      );

    res.status(201).json({
      success: true,
      message: "Variant added successfully",
      data: variant,
    });
  }),

  getProductVariants: asyncHandler( async function (req: AuthRequest, res: Response) {
    const variants = await VariantService.getProductVariants(
        req.params.productId as string,
        req.user!.id
      );

    res.json({
      success: true,
      data: variants,
    });
  }),

  updateVariant: asyncHandler( async function (req: AuthRequest, res: Response) {
    const variant = await VariantService.updateVariant(
        req.params.variantId as string,
        req.body,
        req.user!.id
    );

    res.json({
      success: true,
      message: "Variant updated successfully",
      data: variant,
    });
  }),


  deleteVariant: asyncHandler( async function (req: AuthRequest, res: Response) {
    await VariantService.deleteVariant(
      req.params.variantId as string,
      req.user!.id
    );

    res.json({
      success: true,
      message: "Variant deleted successfully",
    });

  }),

  // Create Banner Request
  createBannerRequest: asyncHandler( async function ( req: AuthRequest, res: Response) {
    
    const { productId, note, icon, offerPercentage } = req.body ?? {};

    if (!productId) {
      throw new AppError("ProductId is required", 400);
    }

    const request = await BannerRequestService.create( req.user!.id, productId, note, icon, offerPercentage);

    res.status(201).json({
      success: true,
      message: "Banner request created successfully.",
      data: request,
    });
  }),


  // Get Vendor Requests History
  getVendorRequestsHistory: asyncHandler(
    async function (req: AuthRequest, res: Response) {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const searchTerm =
        typeof req.query.search === "string"
          ? req.query.search.trim()
          : undefined;

      const history =
        await BannerRequestService.getAllVendorRequests(
          page,
          limit,
          req.user!.id,
          searchTerm
        );

      res.status(200).json({
        success: true,
        message: "Vendor banner requests history fetched successfully.",
        data: history,
      });
    }
  ),

getVendorRequestById: asyncHandler(
  async function (req: AuthRequest, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new AppError(
        "Banner Request id is required",
        400
      );
    }

    const bannerRequest =
      await BannerRequestService.getVendorRequestById(
        id as string,
        req.user!.id
      );

    res.status(200).json({
      success: true,
      message: "Banner request fetched successfully.",
      data: bannerRequest,
    });
  }
),
    deleteVendorRequestById: asyncHandler(
      async function (req: AuthRequest, res: Response) {

        const { id } = req.params;

        if (!id) {
          throw new AppError(
            "Banner Request id is required",
            400
          );
        }

        
        await BannerRequestService.delete(
          req.user!.id,
          id as string,
        );

        res.json({
          success: true,
          message: "Banner Request deleted successfully",
        });
      }
    ),


    // getVendorPromoRequestById: asyncHandler( async function (req: AuthRequest, res: Response) {
    //     const { id } = req.params;

    //     if (!id) {
    //       throw new AppError(
    //         "Promo Banner Request id is required",
    //         400
    //       );
    //     }

    //     const promoBanner =
    //       await PromoBannerService.getById(
    //         id as string,
    //         req.user!.id
    //       );

    //     res.status(200).json({
    //       success: true,
    //       message: "Banner request fetched successfully.",
    //       data: bannerRequest,
    //     });
    //   }
    // ),

      // =========================================================
  // CREATE PROMO BANNER REQUEST - VENDOR
  // =========================================================

  createPromoBannerRequest: asyncHandler(async (req: AuthRequest, res: Response) => {
    const {
      productId,
      offerPercentage,
      startDate,
      endDate,
      backgroundColor,
      note,
    } = req.body;

    const vendorId = req.user!.id;

    const promoBannerRequest = await PromoBannerRequestService.create(
      vendorId,
      productId,
      Number(offerPercentage),
      new Date(startDate),
      new Date(endDate),
      backgroundColor,
      note
    );

    res.status(201).json({
      success: true,
      data: promoBannerRequest,
      message: "Promo banner request created successfully.",
    });
  }),

  getAnalytics: asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const vendorId = req.user?.id;

      if (!vendorId) {
          throw new AppError(
            "Unauthorized",
            401
          );
        }

      const period =
        typeof req.query.period === "string"
          ? req.query.period
          : "6m";

      const analytics =
        await VendorAnalyticsService.getAnalytics(
          vendorId,
          period
        );

      return res.status(200).json({
        success: true,
        data: analytics,
      });
    }
  ),

};