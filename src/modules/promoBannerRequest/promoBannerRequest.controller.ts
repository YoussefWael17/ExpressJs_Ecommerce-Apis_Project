import { Response } from "express";
import { AuthRequest } from "../../types/auth-request";
import { asyncHandler } from "../../utils/asyncHandler";
import { PromoBannerRequestService } from "./promoBannerRequest.service";

const PromoBannerRequestController = {
//   // =========================================================
//   // CREATE PROMO BANNER REQUEST - VENDOR
//   // =========================================================

//   create: asyncHandler(async (req: AuthRequest, res: Response) => {
//     const {
//       productId,
//       offerPercentage,
//       startDate,
//       endDate,
//       backgroundColor,
//       note,
//     } = req.body;

//     const vendorId = req.user!.id;

//     const promoBannerRequest = await PromoBannerRequestService.create(
//       vendorId,
//       productId,
//       Number(offerPercentage),
//       new Date(startDate),
//       new Date(endDate),
//       backgroundColor,
//       note
//     );

//     res.status(201).json({
//       success: true,
//       data: promoBannerRequest,
//       message: "Promo banner request created successfully.",
//     });
//   }),

  // =========================================================
  // GET VENDOR PROMO BANNER REQUESTS - VENDOR
  // =========================================================

  getAllVendorRequests: asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const searchTerm = req.query.search as string | undefined;

      const vendorId = req.user!.id;

      const result =
        await PromoBannerRequestService.getAllVendorRequests(
          page,
          limit,
          vendorId,
          searchTerm
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  ),

  // =========================================================
  // GET ONE VENDOR REQUEST - VENDOR
  // =========================================================

  getVendorRequestById: asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const vendorId = req.user!.id;

      const promoBannerRequest =
        await PromoBannerRequestService.getVendorRequestById(
          req.params.id as string,
          vendorId
        );

      res.status(200).json({
        success: true,
        data: promoBannerRequest,
      });
    }
  ),

  // =========================================================
  // GET ALL PROMO BANNER REQUESTS - ADMIN
  // =========================================================

  getAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const searchTerm = req.query.search as string | undefined;

    const result = await PromoBannerRequestService.getAll(
      page,
      limit,
      searchTerm
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

//   // =========================================================
//   // APPROVE REQUEST - ADMIN
//   // =========================================================

//   approve: asyncHandler(async (req: AuthRequest, res: Response) => {
//     const promoBanner = await PromoBannerRequestService.approve(
//       req.params.id as string
//     );

//     res.status(200).json({
//       success: true,
//       data: promoBanner,
//       message: "Promo banner request approved successfully.",
//     });
//   }),

//   // =========================================================
//   // REJECT REQUEST - ADMIN
//   // =========================================================

//   reject: asyncHandler(async (req: AuthRequest, res: Response) => {
//     const { note } = req.body;

//     const rejectedRequest = await PromoBannerRequestService.reject(
//       req.params.id as string,
//       note
//     );

//     res.status(200).json({
//       success: true,
//       data: rejectedRequest,
//       message: "Promo banner request rejected successfully.",
//     });
//   }),

  // =========================================================
  // DELETE REQUEST - VENDOR
  // =========================================================

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const vendorId = req.user!.id;

    await PromoBannerRequestService.delete(
      vendorId,
      req.params.id as string
    );

    res.status(200).json({
      success: true,
      message: "Promo banner request deleted successfully.",
    });
  }),
};

export default PromoBannerRequestController;