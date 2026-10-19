import { Response } from "express";
import { AuthRequest } from "../../types/auth-request";
import { asyncHandler } from "../../utils/asyncHandler";
import HeroBannerService from "./heroBanner.service";


const HeroBannerController = {
  getHeroBanners: asyncHandler(async (_req: AuthRequest, res: Response) => {
    const banners = await HeroBannerService.getAll();

    res.status(200).json({
      success: true,
      data: banners,
    });
  }),

  getHeroBanner: asyncHandler(async (req: AuthRequest, res: Response) => {
    const banner = await HeroBannerService.getById(req.params.id as string);

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

  updateHeroBanner: asyncHandler(async (req: AuthRequest, res: Response) => {
    const banner = await HeroBannerService.update(
      req.params.id as string,
      req.body
    );

    res.status(200).json({
      success: true,
      data: banner,
    });
  }),

  deleteHeroBanner: asyncHandler(async (req: AuthRequest, res: Response) => {
    await HeroBannerService.delete(req.params.id as string);

    res.status(200).json({
      success: true,
      message: "Hero Banner deleted successfully.",
    });
  }),

  toggleHeroBannerStatus: asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const banner = await HeroBannerService.toggleStatus(req.params.id as string);

      res.status(200).json({
        success: true,
        data: banner,
      });
    }
  ),
};

export default HeroBannerController;