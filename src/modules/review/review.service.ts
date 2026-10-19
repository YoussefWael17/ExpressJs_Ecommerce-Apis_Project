import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

export const ReviewService = {
    create: async function (productId: string, userId: string, rating: number, comment?: string | null) {
            
            const existingProduct = await prisma.product.findUnique({
                where:{
                    id: productId
                }
            })

            if(!existingProduct){
                throw new AppError(
                    "Product Not Found",
                    404
                );
            }

            if (rating < 1 || rating > 5) {
                throw new AppError(
                    "Rating must be between 1 and 5",
                    400
                );
            }

            const existingReview = await prisma.review.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId
                    }
                }
            });

            if (existingReview) {
                throw new AppError(
                    "You already reviewed this product",
                    409
                );
            }
    
            return(
                await prisma.review.create({
                    data: {
                        productId: productId,
                        userId: userId,
                        rating: rating,
                        comment: comment
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                })
            )
        },
}