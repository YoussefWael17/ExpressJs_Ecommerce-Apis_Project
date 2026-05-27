// import { Response } from "express";

// import { orderService } from "./order.service";

// import { AuthRequest } from "../../types/auth-request";

// export const orderController = {
//   create: async (
//     req: AuthRequest,
//     res: Response
//   ) => {
//     try {
//       const order = await orderService.createOrder(
//         req.user!.id
//       );

//       res.status(201).json(order);

//     } catch (error: any) {
//       res.status(400).json({
//         message: error.message,
//       });
//     }
//   },

//   getMyOrders: async (
//     req: AuthRequest,
//     res: Response
//   ) => {
//     try {
//       const orders =
//         await orderService.getUserOrders(
//           req.user!.id
//         );

//       res.json(orders);

//     } catch (error: any) {
//       res.status(500).json({
//         message: error.message,
//       });
//     }
//   },

//   getOne: async (
//     req: AuthRequest,
//     res: Response
//   ) => {
//     try {
//       const order =
//         await orderService.getSingleOrder(
//           req.params.id as string,
//           req.user!.id
//         );

//       if (!order) {
//         return res.status(404).json({
//           message: "Order not found",
//         });
//       }

//       res.json(order);

//     } catch (error: any) {
//       res.status(500).json({
//         message: error.message,
//       });
//     }
//   },
// };

import { Response } from "express";

import { orderService } from "./order.service";

import { AuthRequest } from "../../types/auth-request";

import { asyncHandler } from "../../utils/asyncHandler";

import { AppError } from "../../utils/AppError";

export const orderController = {
  create: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const order =
        await orderService.createOrder(
          req.user!.id
        );

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    }
  ),

  getMyOrders: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const orders =
        await orderService.getUserOrders(
          req.user!.id
        );

      res.json({
        success: true,
        data: orders,
      });
    }
  ),

  getOne: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const order =
        await orderService.getSingleOrder(
          req.params.id as string,
          req.user!.id
        );

      if (!order) {
        throw new AppError(
          "Order not found",
          404
        );
      }

      res.json({
        success: true,
        data: order,
      });
    }
  ),
};