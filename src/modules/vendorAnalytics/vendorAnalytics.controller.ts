import { Response } from "express";

import { AuthRequest } from "../../types/auth-request";
import { asyncHandler } from "../../utils/asyncHandler";

import VendorAnalyticsService from "./vendorAnalytics.service";

const VendorAnalyticsController = {
  getAnalytics: asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const vendorId = req.user?.id;

      if (!vendorId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
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

export default VendorAnalyticsController;