// import { Request, Response } from "express";

// import { wishlistService } from "./wishlist.service";
// import { AuthRequest } from "../../types/auth-request";

// export const wishlistController = {
//   add: async (req: AuthRequest, res: Response) => {
//     try {
//       const userId = req.user!.id;

//       const item =
//         await wishlistService.add(
//           userId,
//           req.body.variantId
//         );

//       res.status(201).json(item);

//     } catch (error: any) {
//       res.status(400).json({
//         message: error.message,
//       });
//     }
//   },

//   getMine: async (
//     req: AuthRequest,
//     res: Response
//   ) => {
//     try {
//       const items =
//         await wishlistService.getUserWishlist(
//           req.user!.id
//         );

//       res.json(items);

//     } catch (error: any) {
//       res.status(500).json({
//         message: error.message,
//       });
//     }
//   },

//   remove: async (
//     req: AuthRequest,
//     res: Response
//   ) => {
//     try {
//       await wishlistService.remove(
//         req.user!.id,
//         req.params.id as string
//       );

//       res.json({
//         message:
//           "Item removed from wishlist",
//       });

//     } catch (error: any) {
//       res.status(400).json({
//         message: error.message,
//       });
//     }
//   },
// };

import { Response } from "express";

import { wishlistService } from "./wishlist.service";

import { AuthRequest } from "../../types/auth-request";

import { asyncHandler } from "../../utils/asyncHandler";

import { AppError } from "../../utils/AppError";

export const wishlistController = {
  add: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const userId = req.user!.id;

      const item =
        await wishlistService.add(
          userId,
          req.body.variantId
        );

      res.status(201).json({
        success: true,
        message:
          "Added to wishlist",
        data: item,
      });
    }
  ),

  getMine: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const items =
        await wishlistService.getUserWishlist(
          req.user!.id
        );

      res.json({
        success: true,
        data: items,
      });
    }
  ),

  remove: asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      await wishlistService.remove(
        req.user!.id,
        req.params.id as string
      );

      res.json({
        success: true,
        message:
          "Item removed from wishlist",
      });
    }
  ),
};