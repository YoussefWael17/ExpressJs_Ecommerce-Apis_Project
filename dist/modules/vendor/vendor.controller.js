"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const vendor_service_1 = require("./vendor.service");
const AppError_1 = require("../../utils/AppError");
const variant_service_1 = require("../variant/variant.service");
const color_service_1 = require("../color/color.service");
const size_service_1 = require("../size/size.service");
const bannerRequest_service_1 = require("../bannerRequest/bannerRequest.service");
const promoBannerRequest_service_1 = require("../promoBannerRequest/promoBannerRequest.service");
const vendorAnalytics_service_1 = __importDefault(require("../vendorAnalytics/vendorAnalytics.service"));
exports.vendorController = {
    /*
    |--------------------------------------------------------------------------
    | Products
    |--------------------------------------------------------------------------
    */
    getMyProducts: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
        const searchTerm = typeof req.query.search === "string"
            ? req.query.search.trim()
            : undefined;
        const products = await vendor_service_1.vendorService.getMyProducts(req.user.id, page, limit, searchTerm);
        res.status(200).json({
            success: true,
            data: products,
        });
    }),
    getSingleProduct: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const product = await vendor_service_1.vendorService.getSingleProduct(req.params.id, req.user.id);
        res.json({
            success: true,
            data: product,
        });
    }),
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
    createProduct: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const files = req.files;
        const thumbnail = files?.thumbnail?.[0]?.path;
        const images = files?.images?.map((file) => file.path) || [];
        if (!thumbnail) {
            throw new AppError_1.AppError("Thumbnail is required", 400);
        }
        // const variants = req.body.variants
        //   ? JSON.parse(req.body.variants)
        //   : [];
        const product = await vendor_service_1.vendorService.createProduct({
            ...req.body,
            thumbnail,
            images,
            // variants,
        }, req.user.id, req.user.role);
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    }),
    updateProduct: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const product = await vendor_service_1.vendorService.updateProduct(req.params.id, req.body, req.user.id, req.user.role);
        res.json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });
    }),
    deleteProduct: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await vendor_service_1.vendorService.deleteProduct(req.params.id, req.user.id, req.user.role);
        res.json({
            success: true,
            message: "Product deleted successfully",
        });
    }),
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
    getVendorOrders: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchTerm = typeof req.query.search === "string"
            ? req.query.search.trim()
            : undefined;
        const orders = await vendor_service_1.vendorService.getVendorOrders(req.user.id, page, limit, searchTerm);
        res.json({
            success: true,
            data: orders,
        });
    }),
    getSingleVendorOrder: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await vendor_service_1.vendorService.getSingleVendorOrder(req.params.id, req.user.id);
        res.json({
            success: true,
            data: order,
        });
    }),
    getColors: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const colors = await color_service_1.ColorService.getAll();
        res.status(201).json({
            success: true,
            data: colors,
        });
    }),
    getSizes: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const sizes = await size_service_1.SizeService.getAll();
        res.status(201).json({
            success: true,
            data: sizes,
        });
    }),
    addVariant: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const variant = await variant_service_1.VariantService.addVariant(req.params.productId, req.body, req.user.id);
        res.status(201).json({
            success: true,
            message: "Variant added successfully",
            data: variant,
        });
    }),
    getProductVariants: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const variants = await variant_service_1.VariantService.getProductVariants(req.params.productId, req.user.id);
        res.json({
            success: true,
            data: variants,
        });
    }),
    updateVariant: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const variant = await variant_service_1.VariantService.updateVariant(req.params.variantId, req.body, req.user.id);
        res.json({
            success: true,
            message: "Variant updated successfully",
            data: variant,
        });
    }),
    deleteVariant: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        await variant_service_1.VariantService.deleteVariant(req.params.variantId, req.user.id);
        res.json({
            success: true,
            message: "Variant deleted successfully",
        });
    }),
    // Create Banner Request
    createBannerRequest: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const { productId, note, icon, offerPercentage } = req.body ?? {};
        if (!productId) {
            throw new AppError_1.AppError("ProductId is required", 400);
        }
        const request = await bannerRequest_service_1.BannerRequestService.create(req.user.id, productId, note, icon, offerPercentage);
        res.status(201).json({
            success: true,
            message: "Banner request created successfully.",
            data: request,
        });
    }),
    // Get Vendor Requests History
    getVendorRequestsHistory: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchTerm = typeof req.query.search === "string"
            ? req.query.search.trim()
            : undefined;
        const history = await bannerRequest_service_1.BannerRequestService.getAllVendorRequests(page, limit, req.user.id, searchTerm);
        res.status(200).json({
            success: true,
            message: "Vendor banner requests history fetched successfully.",
            data: history,
        });
    }),
    getVendorRequestById: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const { id } = req.params;
        if (!id) {
            throw new AppError_1.AppError("Banner Request id is required", 400);
        }
        const bannerRequest = await bannerRequest_service_1.BannerRequestService.getVendorRequestById(id, req.user.id);
        res.status(200).json({
            success: true,
            message: "Banner request fetched successfully.",
            data: bannerRequest,
        });
    }),
    deleteVendorRequestById: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const { id } = req.params;
        if (!id) {
            throw new AppError_1.AppError("Banner Request id is required", 400);
        }
        await bannerRequest_service_1.BannerRequestService.delete(req.user.id, id);
        res.json({
            success: true,
            message: "Banner Request deleted successfully",
        });
    }),
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
    createPromoBannerRequest: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { productId, offerPercentage, startDate, endDate, backgroundColor, note, } = req.body;
        const vendorId = req.user.id;
        const promoBannerRequest = await promoBannerRequest_service_1.PromoBannerRequestService.create(vendorId, productId, Number(offerPercentage), new Date(startDate), new Date(endDate), backgroundColor, note);
        res.status(201).json({
            success: true,
            data: promoBannerRequest,
            message: "Promo banner request created successfully.",
        });
    }),
    getAnalytics: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const vendorId = req.user?.id;
        if (!vendorId) {
            throw new AppError_1.AppError("Unauthorized", 401);
        }
        const period = typeof req.query.period === "string"
            ? req.query.period
            : "6m";
        const analytics = await vendorAnalytics_service_1.default.getAnalytics(vendorId, period);
        return res.status(200).json({
            success: true,
            data: analytics,
        });
    }),
};
