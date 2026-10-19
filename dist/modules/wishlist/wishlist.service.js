"use strict";
// import { prisma } from "../../lib/prisma";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistService = void 0;
// export const wishlistService = {
//   add: async (
//     userId: string,
//     variantId: string
//   ) => {
//     return prisma.wishlistItem.create({
//       data: {
//         userId,
//         variantId,
//       },
//       include: {
//         variant: {
//           include: {
//             product: true,
//             size: true,
//             color: true,
//           },
//         },
//       },
//     });
//   },
//   getUserWishlist: async (userId: string) => {
//     return prisma.wishlistItem.findMany({
//       where: {
//         userId,
//       },
//       include: {
//         variant: {
//           include: {
//             product: true,
//             size: true,
//             color: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//   },
//   remove: async (
//     userId: string,
//     wishlistItemId: string
//   ) => {
//     const item =
//       await prisma.wishlistItem.findFirst({
//         where: {
//           id: wishlistItemId,
//           userId,
//         },
//       });
//     if (!item) {
//       throw new Error(
//         "Wishlist item not found"
//       );
//     }
//     return prisma.wishlistItem.delete({
//       where: {
//         id: wishlistItemId,
//       },
//     });
//   },
// };
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../utils/AppError");
exports.wishlistService = {
    add: async (userId, variantId) => {
        // check variant exists
        const variant = await prisma_1.prisma.productVariant.findUnique({
            where: { id: variantId },
        });
        if (!variant) {
            throw new AppError_1.AppError("Variant not found", 404);
        }
        // prevent duplicates (important)
        const existing = await prisma_1.prisma.wishlistItem.findUnique({
            where: {
                userId_variantId: {
                    userId,
                    variantId,
                },
            },
        });
        if (existing) {
            throw new AppError_1.AppError("Already in wishlist", 400);
        }
        return prisma_1.prisma.wishlistItem.create({
            data: {
                userId,
                variantId,
            },
            include: {
                variant: {
                    include: {
                        product: true,
                        size: true,
                        color: true,
                    },
                },
            },
        });
    },
    // getUserWishlist: async (
    //   userId: string
    // ) => {
    //   return prisma.wishlistItem.findMany({
    //     where: {
    //       userId,
    //     },
    //     include: {
    //       variant: {
    //         include: {
    //           product: { 
    //             include: {
    //               category: true,
    //             },
    //           },
    //           size: true,
    //           color: true,
    //         },
    //       },
    //     },
    //     orderBy: {
    //       createdAt: "desc",
    //     },
    //   });
    // },
    getUserWishlist: async (userId) => {
        const wishlist = await prisma_1.prisma.wishlistItem.findMany({
            where: {
                userId,
            },
            include: {
                variant: {
                    include: {
                        product: {
                            include: {
                                category: true,
                            },
                        },
                        size: true,
                        color: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return wishlist.map((item) => ({
            ...item.variant.product,
            // variant: {
            //   id: item.variant.id,
            //   sku: item.variant.sku,
            //   price: item.variant.price,
            //   discountPrice: item.variant.discountPrice,
            //   stock: item.variant.stock,
            //   size: item.variant.size,
            //   color: item.variant.color,
            // },
            variants: [
                {
                    id: item.variant.id,
                    sku: item.variant.sku,
                    price: item.variant.price,
                    discountPrice: item.variant.discountPrice,
                    stock: item.variant.stock,
                    size: item.variant.size,
                    color: item.variant.color,
                },
            ],
            wishlistId: item.id,
            addedAt: item.createdAt,
        }));
    },
    // remove: async (
    //   userId: string,
    //   wishlistItemId: string
    // ) => {
    //   const item =
    //     await prisma.wishlistItem.findFirst(
    //       {
    //         where: {
    //           id: wishlistItemId,
    //           userId,
    //         },
    //       }
    //     );
    //   if (!item) {
    //     throw new AppError(
    //       "Wishlist item not found",
    //       404
    //     );
    //   }
    //   await prisma.wishlistItem.delete({
    //     where: {
    //       id: wishlistItemId,
    //     },
    //   });
    //   return {
    //     success: true,
    //   };
    // },
    remove: async (userId, variantId) => {
        const item = await prisma_1.prisma.wishlistItem.findFirst({
            where: {
                userId,
                variantId,
            },
        });
        if (!item) {
            throw new AppError_1.AppError("Wishlist item not found", 404);
        }
        await prisma_1.prisma.wishlistItem.delete({
            where: {
                id: item.id,
            },
        });
        return {
            success: true,
        };
    },
};
