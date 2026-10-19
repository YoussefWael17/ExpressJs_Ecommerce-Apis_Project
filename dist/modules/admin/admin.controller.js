"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const admin_service_1 = require("./admin.service");
const asyncHandler_1 = require("../../utils/asyncHandler");
const AppError_1 = require("../../utils/AppError");
const category_service_1 = require("../category/category.service");
const size_service_1 = require("../size/size.service");
const color_service_1 = require("../color/color.service");
const bannerRequest_service_1 = require("../bannerRequest/bannerRequest.service");
const promoBannerRequest_service_1 = require("../promoBannerRequest/promoBannerRequest.service");
exports.adminController = {
    /*
    |--------------------------------------------------------------------------
    | Users
    |--------------------------------------------------------------------------
    */
    getUsers: (0, asyncHandler_1.asyncHandler)(async (_, res) => {
        const users = await admin_service_1.adminService.getUsers();
        res.json(users);
    }),
    changeRole: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const user = await admin_service_1.adminService.changeRole(id, req.body.role);
        res.json(user);
    }),
    deleteUser: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await admin_service_1.adminService.deleteUser(req.params.id);
        res.json({
            message: "User deleted successfully",
        });
    }),
    /*
    |--------------------------------------------------------------------------
    | Products
    |--------------------------------------------------------------------------
    */
    getProducts: (0, asyncHandler_1.asyncHandler)(async (_, res) => {
        const products = await admin_service_1.adminService.getProducts();
        res.json(products);
    }),
    deleteProduct: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await admin_service_1.adminService.deleteProduct(req.params.id);
        res.json({
            message: "Product deleted successfully",
        });
    }),
    toggleProductStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const product = await admin_service_1.adminService.toggleProductStatus(req.params.id);
        res.json(product);
    }),
    /*
    |--------------------------------------------------------------------------
    | Orders
    |--------------------------------------------------------------------------
    */
    getOrders: (0, asyncHandler_1.asyncHandler)(async (_, res) => {
        const orders = await admin_service_1.adminService.getOrders();
        res.json(orders);
    }),
    getOrderById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await admin_service_1.adminService.getOrderById(req.params.id);
        if (!order) {
            throw new AppError_1.AppError("Order not found", 404);
        }
        res.json(order);
    }),
    updateOrderStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await admin_service_1.adminService.updateOrderStatus(req.params.id, req.body.status);
        res.json(order);
    }),
    /*
    |--------------------------------------------------------------------------
    | Stats
    |--------------------------------------------------------------------------
    */
    getStats: (0, asyncHandler_1.asyncHandler)(async (_, res) => {
        const stats = await admin_service_1.adminService.getStats();
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
    createCategory: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        // if (!req.file) {
        //   throw new AppError("Image is required", 400);
        //   console.log("FILE:", req.file);
        // }
        // console.log("FILE:", req.file);
        const category = await category_service_1.categoryService.create({
            name: req.body.name,
            icon: req.body.icon
            // image: req.file.path,
        });
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    }),
    /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */
    updateCategory: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const data = {
            ...req.body,
        };
        if (req.file) {
            data.image = req.file.path;
        }
        const category = await category_service_1.categoryService.update(req.params.id, data);
        res.json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    }),
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
    deleteCategory: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await category_service_1.categoryService.delete(req.params.id);
        res.json({
            success: true,
            message: "Category deleted successfully",
        });
    }),
    addSize: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const size = await size_service_1.SizeService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Size added successfully",
            data: size,
        });
    }),
    updateSize: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const size = await size_service_1.SizeService.update(req.params.id, req.body);
        res.json({
            success: true,
            message: "Size updated successfully",
            data: size,
        });
    }),
    deleteSize: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const size = await size_service_1.SizeService.delete(req.params.id);
        res.json({
            success: true,
            message: "Size Deleted successfully",
            data: size,
        });
    }),
    addColor: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        if (!req.body.name?.trim()) {
            throw new AppError_1.AppError("Color name is required", 400);
        }
        const name = req.body.name.trim();
        const hexCode = req.body.hexCode ?? null;
        const color = await color_service_1.ColorService.create(name, hexCode);
        res.status(201).json({
            success: true,
            message: "Color added successfully",
            data: color,
        });
    }),
    updateColor: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const id = req.params.id;
        const name = req.body.name?.trim();
        let hexCode;
        if ("hexCode" in req.body) {
            hexCode = req.body.hexCode;
        }
        const color = await color_service_1.ColorService.update(id, name, hexCode);
        res.json({
            success: true,
            message: "Color updated successfully",
            data: color,
        });
    }),
    deleteColor: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const id = req.params.id;
        const color = await color_service_1.ColorService.delete(id);
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
    getBannerRequests: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchTerm = typeof req.query.search === "string"
            ? req.query.search.trim()
            : undefined;
        const requests = await bannerRequest_service_1.BannerRequestService.getAll(page, limit, searchTerm);
        res.status(200).json({
            success: true,
            data: requests,
        });
    }),
    approveBannerRequest: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const banner = await bannerRequest_service_1.BannerRequestService.approve(id);
        res.status(200).json({
            success: true,
            data: banner,
        });
    }),
    rejectBannerRequest: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const banner = await bannerRequest_service_1.BannerRequestService.reject(id);
        res.status(200).json({
            success: true,
            data: banner,
        });
    }),
    // Get All Promo Banners Request - Admin
    getPromoBannersRequests: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchTerm = typeof req.query.search === "string"
            ? req.query.search.trim()
            : undefined;
        const promoBannersRequests = await promoBannerRequest_service_1.PromoBannerRequestService.getAll(page, limit, searchTerm);
        res.status(200).json({
            success: true,
            data: promoBannersRequests,
        });
    }),
    // =========================================================
    // APPROVE REQUEST - ADMIN
    // =========================================================
    approvePromoBannerRequest: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const promoBanner = await promoBannerRequest_service_1.PromoBannerRequestService.approve(req.params.id);
        res.status(200).json({
            success: true,
            data: promoBanner,
            message: "Promo banner request approved successfully.",
        });
    }),
    // =========================================================
    // REJECT REQUEST - ADMIN
    // =========================================================
    rejectPromoBannerRequest: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const rejectedRequest = await promoBannerRequest_service_1.PromoBannerRequestService.reject(req.params.id);
        res.status(200).json({
            success: true,
            data: rejectedRequest,
            message: "Promo banner request rejected successfully.",
        });
    }),
};
