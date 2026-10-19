"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = require("../../utils/asyncHandler");
const promoBanner_service_1 = __importDefault(require("./promoBanner.service"));
const PromoBannerController = {
    // // Get All Promo Banners - Admin
    // getPromoBanners: asyncHandler( async (_req: AuthRequest, res: Response) => {
    //     const promoBanners = await PromoBannerService.getAll();
    //     res.status(200).json({
    //       success: true,
    //       data: promoBanners,
    //     });
    //   }
    // ),
    // Get Active Promo Banners - Customer
    getActivePromoBanners: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const promoBanners = await promoBanner_service_1.default.getActive();
        res.status(200).json({
            success: true,
            data: promoBanners,
        });
    }),
    // Get One Promo Banner
    getPromoBanner: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const promoBanner = await promoBanner_service_1.default.getById(req.params.id);
        res.status(200).json({
            success: true,
            data: promoBanner,
        });
    }),
    // Update Promo Banner
    updatePromoBanner: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const promoBanner = await promoBanner_service_1.default.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: promoBanner,
        });
    }),
    // Delete Promo Banner
    deletePromoBanner: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await promoBanner_service_1.default.delete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Promo Banner deleted successfully.",
        });
    }),
    // Toggle Promo Banner Status
    //   togglePromoBannerStatus: asyncHandler(
    //     async (req: AuthRequest, res: Response) => {
    //       const banner = await PromoBannerService.toggleStatus(
    //         req.params.id as string
    //       );
    //       res.status(200).json({
    //         success: true,
    //         data: banner,
    //       });
    //     }
    //   ),
};
exports.default = PromoBannerController;
