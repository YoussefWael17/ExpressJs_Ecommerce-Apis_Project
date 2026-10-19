"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../utils/AppError");
const color_resolver_1 = require("./resolvers/color.resolver");
const size_resolver_1 = require("./resolvers/size.resolver");
exports.productService = {
    create: async (data, vendorId, vendorRole) => {
        const variants = await Promise.all(data.variants.map(async (v) => {
            const color = await (0, color_resolver_1.resolveColor)(v.color, vendorRole);
            const size = await (0, size_resolver_1.resolveSize)(v.size, vendorRole);
            return {
                sku: v.sku,
                price: v.price,
                discountPrice: v.discountPrice ?? null,
                stock: v.stock ?? 0,
                colorId: color.id,
                sizeId: size.id,
            };
        }));
        return prisma_1.prisma.product.create({
            data: {
                title: data.title,
                slug: data.slug,
                description: data.description,
                thumbnail: data.thumbnail,
                categoryId: data.categoryId,
                vendorId,
                // ✅ FIXED VARIANTS
                variants: {
                    create: variants,
                },
                // images safe
                images: {
                    create: (data.images || []).map((img) => ({
                        image: img.image,
                        isPrimary: img.isPrimary ?? false,
                    })),
                },
            },
            include: {
                variants: {
                    include: {
                        size: true,
                        color: true,
                    },
                },
                images: true,
                category: true,
            },
        });
    },
    getAll: async (query) => {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const products = await prisma_1.prisma.product.findMany({
            skip,
            take: limit,
            where: {
                isActive: true,
                isPublished: true,
                ...(query.search && {
                    title: {
                        contains: query.search,
                        mode: "insensitive",
                    },
                }),
                ...(query.categoryId && {
                    categoryId: query.categoryId,
                }),
            },
            include: {
                variants: {
                    include: {
                        size: true,
                        color: true,
                    },
                },
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true
                    }
                },
                images: true,
                category: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const productsWithStats = products.map(product => {
            const totalReviews = product.reviews.length;
            const avgRating = totalReviews > 0
                ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
                : 0;
            return {
                ...product,
                totalReviews,
                avgRating: Number(avgRating.toFixed(1)),
            };
        });
        const total = await prisma_1.prisma.product.count({
            where: {
                isActive: true,
            },
        });
        return {
            products: productsWithStats,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },
    getOne: async (id) => {
        const product = await prisma_1.prisma.product.findUnique({
            where: { id },
            include: {
                variants: {
                    include: {
                        size: true,
                        color: true,
                    },
                },
                images: true,
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!product) {
            throw new AppError_1.AppError("Product not found", 404);
        }
        return product;
    },
    getNewArrivals: async (limit = 10) => {
        return prisma_1.prisma.product.findMany({
            where: {
                isActive: true,
                isPublished: true,
                createdAt: {
                    gte: new Date(Date.now() -
                        7 *
                            24 *
                            60 *
                            60 *
                            1000),
                },
            },
            include: {
                variants: {
                    include: {
                        size: true,
                        color: true,
                    },
                },
                images: true,
                category: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
        });
    },
    getBestSellers: async (limit = 10) => {
        const bestSellers = await prisma_1.prisma.orderItem.groupBy({
            by: ["productId"],
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: "desc",
                },
            },
            take: limit,
        });
        const productIds = bestSellers.map((item) => item.productId);
        return prisma_1.prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
                isActive: true,
                isPublished: true,
            },
            include: {
                variants: {
                    include: {
                        size: true,
                        color: true,
                    },
                },
                images: true,
                category: true,
            },
        });
    },
    //   getFlashSales: async (limit = 10) => {
    //   const now = new Date();
    //   const products = await prisma.product.findMany({
    //     where: {
    //       isActive: true,
    //       isPublished: true,
    //       salePercentage: {
    //         not: null,
    //       },
    //       saleStartDate: {
    //         lte: now,
    //       },
    //       saleEndDate: {
    //         gte: now,
    //       },
    //     },
    //     include: {
    //       variants: {
    //         include: {
    //           size: true,
    //           color: true,
    //         },
    //       },
    //       images: true,
    //       category: true,
    //       reviews: true,
    //     },
    //     orderBy: {
    //       salePercentage: "desc",
    //     },
    //     take: limit,
    //   });
    //   const productsWithStats = products.map((product) => {
    //     const totalReviews = product.reviews.length;
    //     const avgRating =
    //       totalReviews > 0
    //         ? product.reviews.reduce(
    //             (sum, review) => sum + review.rating,
    //             0
    //           ) / totalReviews
    //         : 0;
    //     return {
    //       ...product,
    //       totalReviews,
    //       avgRating: Number(avgRating.toFixed(1)),
    //     };
    //   });
    //   return productsWithStats;
    // },
    getFlashSales: async (limit = 10, userId) => {
        const now = new Date();
        const products = await prisma_1.prisma.product.findMany({
            where: {
                isActive: true,
                isPublished: true,
                salePercentage: {
                    not: null,
                },
                saleStartDate: {
                    lte: now,
                },
                saleEndDate: {
                    gte: now,
                },
            },
            include: {
                variants: {
                    include: {
                        size: true,
                        color: true,
                        cartItems: userId
                            ? {
                                where: {
                                    cart: {
                                        userId,
                                    },
                                },
                            }
                            : false,
                        wishlistItems: userId
                            ? {
                                where: {
                                    userId,
                                },
                            }
                            : false,
                    },
                },
                images: true,
                category: true,
                reviews: true,
            },
            orderBy: {
                salePercentage: "desc",
            },
            take: limit,
        });
        const productsWithStats = products.map((product) => {
            const totalReviews = product.reviews.length;
            const avgRating = totalReviews > 0
                ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
                : 0;
            return {
                ...product,
                totalReviews,
                avgRating: Number(avgRating.toFixed(1)),
                isInCart: userId
                    ? product.variants.some(variant => variant.cartItems.length > 0)
                    : false,
                isInWishlist: userId
                    ? product.variants.some(variant => variant.wishlistItems.length > 0)
                    : false,
            };
        });
        return productsWithStats;
    },
    update: async (productId, data, userId, userRole) => {
        const product = await prisma_1.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new AppError_1.AppError("Product not found", 404);
        }
        if (product.vendorId !== userId && userRole !== "ADMIN") {
            throw new AppError_1.AppError("Forbidden", 403);
        }
        return prisma_1.prisma.$transaction(async (tx) => {
            // 1. Update product basic info
            await tx.product.update({
                where: { id: productId },
                data: {
                    title: data.title ?? product.title,
                    slug: data.slug ?? product.slug,
                    description: data.description ?? product.description,
                    thumbnail: data.thumbnail ?? product.thumbnail,
                    categoryId: data.categoryId ?? product.categoryId,
                    isActive: data.isActive ?? product.isActive,
                },
            });
            // 2. REPLACE VARIANTS
            if (Array.isArray(data.variants)) {
                await tx.productVariant.deleteMany({
                    where: { productId },
                });
                if (data.variants.length > 0) {
                    await tx.productVariant.createMany({
                        data: data.variants.map((v) => ({
                            sku: v.sku,
                            price: v.price,
                            discountPrice: v.discountPrice ?? null,
                            stock: v.stock ?? 0,
                            productId,
                            sizeId: v.sizeId,
                            colorId: v.colorId,
                        })),
                    });
                }
            }
            // 3. REPLACE IMAGES
            if (Array.isArray(data.images)) {
                await tx.productImage.deleteMany({
                    where: { productId },
                });
                if (data.images.length > 0) {
                    await tx.productImage.createMany({
                        data: data.images.map((img) => ({
                            image: img.image,
                            isPrimary: img.isPrimary ?? false,
                            productId,
                        })),
                    });
                }
            }
            // 4. return fresh product
            return tx.product.findUnique({
                where: { id: productId },
                include: {
                    variants: {
                        include: {
                            size: true,
                            color: true,
                        },
                    },
                    images: true,
                    category: true,
                },
            });
        });
    },
    delete: async (productId, userId, userRole) => {
        const product = await prisma_1.prisma.product.findUnique({
            where: {
                id: productId,
            },
        });
        if (!product) {
            throw new AppError_1.AppError("Product not found", 404);
        }
        if (product.vendorId !== userId &&
            userRole !== "ADMIN") {
            throw new AppError_1.AppError("Forbidden", 403);
        }
        await prisma_1.prisma.product.delete({
            where: {
                id: productId,
            },
        });
        return {
            success: true,
        };
    },
};
