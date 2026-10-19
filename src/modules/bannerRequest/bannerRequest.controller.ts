import { Request, Response, NextFunction } from "express";
import { BannerRequestService } from "./bannerRequest.service";
import { AuthRequest } from "../../types/auth-request";
import { asyncHandler } from "../../utils/asyncHandler";

export const BannerRequestController = {



//   getAll: asyncHandler( async function ( req: AuthRequest, res: Response ) {

//     const requests = await BannerRequestService.getAll();

//     res.status(200).json({
//       success: true,
//       data: requests,
//     });
//   }),

//   approve: async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const { id } = req.params;

//       const heroBanner = await BannerRequestService.approve(id);

//       res.status(200).json({
//         success: true,
//         message: "Banner request approved successfully.",
//         data: heroBanner,
//       });
//     } catch (error) {
//       next(error);
//     }
//   },

//   reject: async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const { id } = req.params;
//       const { note } = req.body;

//       const request = await BannerRequestService.reject(id, note);

//       res.status(200).json({
//         success: true,
//         message: "Banner request rejected successfully.",
//         data: request,
//       });
//     } catch (error) {
//       next(error);
//     }
//   },

};