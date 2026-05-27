// import { prisma } from "../../lib/prisma";

// export const productService = {
//   create: async (data: any, vendorId: string) => {
//     return prisma.product.create({
//       data: {
//         title: data.title,
//         slug: data.slug,
//         description: data.description,
//         thumbnail: data.thumbnail,
//         categoryId: data.categoryId,
//         vendorId,

//         variants: {
//           create: data.variants,
//         },

//         images: {
//           create: data.images,
//         },
//       },

//       include: {
//         variants: true,
//         images: true,
//         category: true,
//       },
//     });
//   },

//   getAll: async (query: any) => {
//     const page = Number(query.page) || 1;
//     const limit = Number(query.limit) || 10;

//     const skip = (page - 1) * limit;

//     return prisma.product.findMany({
//       skip,
//       take: limit,

//       where: {
//         isActive: true,

//         ...(query.search && {
//           title: {
//             contains: query.search,
//             mode: "insensitive",
//           },
//         }),

//         ...(query.categoryId && {
//           categoryId: query.categoryId,
//         }),
//       },

//       include: {
//         variants: true,
//         images: true,
//         category: true,
//       },

//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//   },

//   getOne: async (id: string) => {
//     return prisma.product.findUnique({
//       where: { id },

//       include: {
//         variants: {
//           include: {
//             size: true,
//             color: true,
//           },
//         },

//         images: true,
//         category: true,
//         reviews: true,
//       },
//     });
//   },

//   getNewArrivals: async (limit = 10) => {
//     return prisma.product.findMany({
//       where: {
//         isActive: true,
//         createdAt: {
//           gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//         },
//       },

//       include: {
//         variants: true,
//         images: true,
//         category: true,
//       },

//       orderBy: {
//         createdAt: "desc",
//       },

//       take: limit,
//     });
//   },

//   getBestSellers: async (limit = 10) => {
//     const bestSellers = await prisma.orderItem.groupBy({
//       by: ["productId"],

//       _sum: {
//         quantity: true,
//       },

//       orderBy: {
//         _sum: {
//           quantity: "desc",
//         },
//       },

//       take: limit,
//     });

//     const productIds = bestSellers.map(
//       (item) => item.productId
//     );

//     return prisma.product.findMany({
//       where: {
//         id: {
//           in: productIds,
//         },
//       },

//       include: {
//         variants: true,
//         images: true,
//         category: true,
//       },
//     });
//   },
// };

import { prisma } from "../../lib/prisma";

import { AppError } from "../../utils/AppError";

export const productService = {
  create: async (
    data: any,
    vendorId: string
  ) => {
    return prisma.product.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        thumbnail: data.thumbnail,
        categoryId: data.categoryId,
        vendorId,

        variants: {
          create: data.variants,
        },

        images: {
          create: data.images,
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

  getAll: async (query: any) => {
    const page =
      Number(query.page) || 1;

    const limit =
      Number(query.limit) || 10;

    const skip =
      (page - 1) * limit;

    const products =
      await prisma.product.findMany({
        skip,
        take: limit,

        where: {
          isActive: true,

          ...(query.search && {
            title: {
              contains:
                query.search,
              mode: "insensitive",
            },
          }),

          ...(query.categoryId && {
            categoryId:
              query.categoryId,
          }),
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
      });

    const total =
      await prisma.product.count({
        where: {
          isActive: true,
        },
      });

    return {
      data: products,

      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      },
    };
  },

  getOne: async (id: string) => {
    const product =
      await prisma.product.findUnique({
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
      throw new AppError(
        "Product not found",
        404
      );
    }

    return product;
  },

  getNewArrivals: async (
    limit = 10
  ) => {
    return prisma.product.findMany({
      where: {
        isActive: true,

        createdAt: {
          gte: new Date(
            Date.now() -
              7 *
                24 *
                60 *
                60 *
                1000
          ),
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

  getBestSellers: async (
    limit = 10
  ) => {
    const bestSellers =
      await prisma.orderItem.groupBy({
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

    const productIds =
      bestSellers.map(
        (item) => item.productId
      );

    return prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },

        isActive: true,
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
};