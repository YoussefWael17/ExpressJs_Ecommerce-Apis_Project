// import { prisma } from "../../lib/prisma";

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

import { prisma } from "../../lib/prisma";

import { AppError } from "../../utils/AppError";

export const wishlistService = {
  add: async (
    userId: string,
    variantId: string
  ) => {
    // check variant exists
    const variant =
      await prisma.productVariant.findUnique(
        {
          where: { id: variantId },
        }
      );

    if (!variant) {
      throw new AppError(
        "Variant not found",
        404
      );
    }

    // prevent duplicates (important)
    const existing =
      await prisma.wishlistItem.findUnique(
        {
          where: {
            userId_variantId: {
              userId,
              variantId,
            },
          },
        }
      );

    if (existing) {
      throw new AppError(
        "Already in wishlist",
        400
      );
    }

    return prisma.wishlistItem.create({
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

  getUserWishlist: async (
    userId: string
  ) => {
    return prisma.wishlistItem.findMany({
      where: {
        userId,
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

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  remove: async (
    userId: string,
    wishlistItemId: string
  ) => {
    const item =
      await prisma.wishlistItem.findFirst(
        {
          where: {
            id: wishlistItemId,
            userId,
          },
        }
      );

    if (!item) {
      throw new AppError(
        "Wishlist item not found",
        404
      );
    }

    await prisma.wishlistItem.delete({
      where: {
        id: wishlistItemId,
      },
    });

    return {
      success: true,
    };
  },
};