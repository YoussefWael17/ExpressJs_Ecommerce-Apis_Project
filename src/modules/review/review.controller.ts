import { Response } from "express";
import { AuthRequest } from "../../types/auth-request";
import { asyncHandler } from "../../utils/asyncHandler";
import { ReviewService } from "./review.service";

export const ReviewController = {
    addReview: asyncHandler( async function (req: AuthRequest, res: Response) {
        const { productId, rating, comment } = req.body
        const review = await ReviewService.create(
            productId as string,
            req.user!.id,
            rating,
            comment
          );
    
        res.status(201).json({
          success: true,
          message: "Review added successfully",
          data: review,
        });
      }),
}