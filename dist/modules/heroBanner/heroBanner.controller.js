"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = require("../../utils/asyncHandler");
const heroBanner_service_1 = __importDefault(require("./heroBanner.service"));
const HeroBannerController = {
    getHeroBanners: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const banners = await heroBanner_service_1.default.getAll();
        res.status(200).json({
            success: true,
            data: banners,
        });
    }),
    getHeroBanner: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const banner = await heroBanner_service_1.default.getById(req.params.id);
        res.status(200).json({
            success: true,
            data: banner,
        });
    }),
    // createHeroBanner: asyncHandler(async (req: AuthRequest, res: Response) => {
    //   const banner = await HeroBannerService.create(req.body);
    //   res.status(201).json({
    //     success: true,
    //     data: banner,
    //   });
    // }),
    updateHeroBanner: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const banner = await heroBanner_service_1.default.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: banner,
        });
    }),
    deleteHeroBanner: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await heroBanner_service_1.default.delete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Hero Banner deleted successfully.",
        });
    }),
    toggleHeroBannerStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const banner = await heroBanner_service_1.default.toggleStatus(req.params.id);
        res.status(200).json({
            success: true,
            data: banner,
        });
    }),
};
exports.default = HeroBannerController;
