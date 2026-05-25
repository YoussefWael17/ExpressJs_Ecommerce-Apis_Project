import { Response } from "express";

import { paymentService } from "./payment.service";

import { AuthRequest } from "../../types/auth-request";

export const paymentController = {
  checkout: async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const session =
        await paymentService.createCheckoutSession(
          req.params.orderId as string,
          req.user!.id
        );

      res.json({
        url: session.url,
      });

    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
};