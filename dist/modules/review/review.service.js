"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../utils/AppError");
exports.ReviewService = {
    create: async function (productId, userId, rating, comment) {
        const existingProduct = await prisma_1.prisma.product.findUnique({
            where: {
                id: productId
            }
        });
        if (!existingProduct) {
            throw new AppError_1.AppError("Product Not Found", 404);
        }
        if (rating < 1 || rating > 5) {
            throw new AppError_1.AppError("Rating must be between 1 and 5", 400);
        }
        const existingReview = await prisma_1.prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });
        if (existingReview) {
            throw new AppError_1.AppError("You already reviewed this product", 409);
        }
        return (await prisma_1.prisma.review.create({
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
        }));
    },
};
