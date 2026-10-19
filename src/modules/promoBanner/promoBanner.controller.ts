import { Response } from "express";
import { AuthRequest } from "../../types/auth-request";
import { asyncHandler } from "../../utils/asyncHandler";
import PromoBannerService from "./promoBanner.service";

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
  getActivePromoBanners: asyncHandler( async (_req: AuthRequest, res: Response) => {
      const promoBanners = await PromoBannerService.getActive();

      res.status(200).json({
        success: true,
        data: promoBanners,
      });
    }
  ),

  // Get One Promo Banner
  getPromoBanner: asyncHandler( async (req: AuthRequest, res: Response) => {
      const promoBanner = await PromoBannerService.getById(
        req.params.id as string
      );

      res.status(200).json({
        success: true,
        data: promoBanner,
      });
    }
  ),

  // Update Promo Banner
  updatePromoBanner: asyncHandler( async (req: AuthRequest, res: Response) => {
      const promoBanner = await PromoBannerService.update(
        req.params.id as string,
        req.body
      );

      res.status(200).json({
        success: true,
        data: promoBanner,
      });
    }
  ),

  // Delete Promo Banner
  deletePromoBanner: asyncHandler( async (req: AuthRequest, res: Response) => {
      await PromoBannerService.delete(req.params.id as string);

      res.status(200).json({
        success: true,
        message: "Promo Banner deleted successfully.",
      });
    }
  ),

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

export default PromoBannerController;