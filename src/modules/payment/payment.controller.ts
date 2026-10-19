import { Response } from "express";
import { AuthRequest } from "../../types/auth-request";
import { paymentService } from "./payment.service";

export const paymentController = {
  checkout: async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const session =
        await paymentService.createCheckoutSession(
          req.user!.id
        );

      res.json({
        success: true,
        url: session.url,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};