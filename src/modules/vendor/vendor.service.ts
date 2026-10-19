import slugify from "slugify";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { productService } from "../product/product.service";
import { generateSKU } from "../../utils/generateSKU";
import { OrderStatus } from "../../generated/prisma/client";

export const vendorService = {
  /*
  |--------------------------------------------------------------------------
  | PRODUCTS
  |--------------------------------------------------------------------------
  */

  getMyProducts: async (
    vendorId: string,
    page: number = 1,
    limit: number = 10,
    searchTerm?: string
  ) => {
    const skip = (page - 1) * limit;

    const whereCondition: any = {
      vendorId,
    };

    if (searchTerm?.trim()) {
      const search = searchTerm.trim();

      whereCondition.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          variants: {
            some: {
              sku: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      ];
    }

    // const [products, total] = await Promise.all([
    //   prisma.product.findMany({
    //     where: whereCondition,
    //     include: {
    //       variants: {
    //         include: {
    //           size: true,
    //           color: true,
    //         },
    //       },
    //       images: true,
    //       category: true,
    //     },
    //     orderBy: {
    //       createdAt: "desc",
    //     },
    //     skip,
    //     take: limit,
    //   }),

    //   prisma.product.count({
    //     where: whereCondition,
    //   }),
    // ]);

    const [
        products,
        total,
        availableProducts,
        outOfStockProducts,
        inventory,
      ] = await Promise.all([
        prisma.product.findMany({
          where: whereCondition,
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
          skip,
          take: limit,
        }),

        prisma.product.count({
          where: {vendorId},
        }),

        // Products that have at least one variant in stock
        prisma.product.count({
          where: {
            vendorId,
            variants: {
              some: {
                stock: {
                  gt: 0,
                },
              },
            },
          },
        }),

        // Products with no variants in stock
        prisma.product.count({
          where: {
            vendorId,
            variants: {
              every: {
                stock: 0,
              },
            },
          },
        }),

        // Total inventory units
        prisma.productVariant.aggregate({
          where: {
            product: {
              vendorId,
            },
          },
          _sum: {
            stock: true,
          },
        }),
      ]);

    return {
      products,
      pagination: {
        total,
        availableProducts,
        outOfStockProducts,
        totalInventory: inventory._sum.stock ?? 0,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  },

  // getMyProducts: async (vendorId: string) => {
  //   return prisma.product.findMany({
  //     where: { vendorId },
  //     include: {
  //       variants: {
  //         include: {
  //           size: true,
  //           color: true,
  //         },
  //       },
  //       images: true,
  //       category: true,
  //     },
  //     orderBy: { createdAt: "desc" },
  //   });
  // },

  getSingleProduct: async (productId: string, vendorId: string) => {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        vendorId,
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

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  },

  /*
  |--------------------------------------------------------------------------
  | CREATE PRODUCT (FIXED - CLEAN DELEGATION)
  |--------------------------------------------------------------------------
  */

  createProduct: async (
  data: any,
  vendorId: string,
  role: string
) => {
  if (role !== "VENDOR") {
    throw new AppError(
      "Only vendors can create products",
      403
    );
  }

  const slug = slugify(data.title, {
    lower: true,
    strict: true,
    trim: true,
  });

  const exists = await prisma.product.findFirst({
    where: {
      OR: [
        { title: data.title },
        { slug },
      ],
    },
  });

  if (exists) {
    throw new AppError(
      "Product already exists",
      400
    );
  }

  const category =
    await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

  if (!category) {
    throw new AppError(
      "Category not found",
      404
    );
  }

  const isActive =
    data.isActive === "true";

  const salePercentage =
    data.salePercentage
      ? Number(data.salePercentage)
      : null;

  const saleStartDate =
    data.saleStartDate
      ? new Date(data.saleStartDate)
      : null;
  
  const saleEndDate =
    data.saleEndDate
      ? new Date(data.saleEndDate)
      : null;

  const hasSaleData =
    salePercentage ||
    saleStartDate ||
    saleEndDate;

  const allSaleData =
    salePercentage &&
    saleStartDate &&
    saleEndDate;

  if (hasSaleData && !allSaleData) {
    throw new AppError(
      "salePercentage, saleStartDate and saleEndDate are required together",
      400
    );
  }

  if (
    salePercentage &&
    (salePercentage <= 0 ||
      salePercentage > 100)
  ) {
    throw new AppError(
      "Sale percentage must be between 1 and 100",
      400
    );
  }

  if (
    saleEndDate &&
    saleEndDate <= new Date()
  ) {
    throw new AppError(
      "Sale end date must be in the future",
      400
    );
  }

  if (
    saleStartDate &&
    saleEndDate &&
    saleStartDate >= saleEndDate
  ) {
    throw new AppError(
      "Sale start date must be before sale end date",
      400
    );
  }

  return prisma.product.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      thumbnail: data.thumbnail,

      isActive,

      salePercentage,
      saleEndDate,
      saleStartDate,

      categoryId: data.categoryId,
      vendorId,

      isPublished: false,

      images: {
        create: data.images.map(
          (
            image: string,
            index: number
          ) => ({
            image,
            isPrimary: index === 0,
          })
        ),
      },
    },

    include: {
      category: true,
      vendor: true,
      images: true,
    },
  });
},

  // createProduct: async (
  //   data: any,
  //   vendorId: string,
  //   role: string
  // ) => {
  //   if (role !== "VENDOR") {
  //     throw new AppError(
  //       "Only vendors can create products",
  //       403
  //     );
  //   }

  //   const slug = slugify(data.title, {
  //     lower: true,
  //     strict: true,
  //     trim: true,
  //   });

  //   const exists = await prisma.product.findFirst({
  //     where: {
  //       OR: [
  //         { title: data.title },
  //         { slug },
  //       ],
  //     },
  //   });

  //   if (exists) {
  //     throw new AppError(
  //       "Product already exists",
  //       400
  //     );
  //   }

  //   const category = await prisma.category.findUnique({
  //     where: {
  //       id: data.categoryId,
  //     },
  //   });

  //   if (!category) {
  //     throw new AppError(
  //       "Category not found",
  //       404
  //     );
  //   }

  //   return prisma.product.create({
  //     data: {
  //       title: data.title,
  //       slug,
  //       description: data.description,
  //       thumbnail: data.thumbnail,
  //       categoryId: data.categoryId,
  //       vendorId,

  //       images: {
  //         create:
  //           data.images?.map(
  //             (image: string, index: number) => ({
  //               image,
  //               isPrimary: index === 0,
  //             })
  //           ) || [],
  //       },
  //     },
  //     include: {
  //       category: true,
  //       vendor: true,
  //       images: true,
  //     },
  //   });
  // },

  // createProduct: async (
  //   data: any,
  //   vendorId: string,
  //   role: string
  // ) => {
  //   if (role !== "VENDOR") {
  //     throw new AppError(
  //       "Only vendors can create products",
  //       403
  //     );
  //   }

  //   const slug = slugify(data.title, {
  //     lower: true,
  //     strict: true,
  //     trim: true,
  //   });

  //   const exists = await prisma.product.findFirst({
  //     where: {
  //       OR: [
  //         { title: data.title },
  //         { slug },
  //       ],
  //     },
  //   });

  //   if (exists) {
  //     throw new AppError(
  //       "Product already exists",
  //       400
  //     );
  //   }

  //   const category =
  //     await prisma.category.findUnique({
  //       where: {
  //         id: data.categoryId,
  //       },
  //     });

  //   if (!category) {
  //     throw new AppError(
  //       "Category not found",
  //       404
  //     );
  //   }

  //   return prisma.product.create({
  //     data: {
  //       title: data.title,
  //       slug,
  //       description: data.description,
  //       thumbnail: data.thumbnail,
  //       categoryId: data.categoryId,
  //       vendorId,

  //       images: {
  //         create: data.images.map(
  //           (image: string, index: number) => ({
  //             image,
  //             isPrimary: index === 0,
  //           })
  //         ),
  //       },

  //       // variants: {
  //       //   create: data.variants.map(
  //       //     (variant: any) => ({
  //       //       sku: variant.sku,
  //       //       price: Number(variant.price),
  //       //       discountPrice:
  //       //         variant.discountPrice
  //       //           ? Number(
  //       //               variant.discountPrice
  //       //             )
  //       //           : null,
  //       //       stock: Number(variant.stock),
  //       //       sizeId:
  //       //         variant.sizeId || null,
  //       //       colorId:
  //       //         variant.colorId || null,
  //       //     })
  //       //   ),
  //       // },

  //       variants: {
  //         create: data.variants?.map((variant: any) => ({
  //           sku: generateSKU(
  //             data.title,
  //             variant.sizeId,
  //             variant.colorId
  //           ),
  //           price: Number(variant.price),
  //           discountPrice: variant.discountPrice
  //             ? Number(variant.discountPrice)
  //             : null,
  //           stock: Number(variant.stock),
  //           sizeId: variant.sizeId || null,
  //           colorId: variant.colorId || null,
  //         })) || [],
  //       },
  //     },

  //     include: {
  //       category: true,
  //       vendor: true,
  //       images: true,
  //       variants: {
  //         include: {
  //           size: true,
  //           color: true,
  //         },
  //       },
  //     },
  //   });
  // },

  // createProduct: async (data: any, vendorId: string, role: string) => {
  //   return productService.create(data, vendorId, role);
  // },


  // createProduct: async (
  //   data: any,
  //   vendorId: string,
  //   role: string
  // ) => {
  //   if (role !== "VENDOR") {
  //     throw new AppError(
  //       "Only vendors can create products",
  //       403
  //     );
  //   }

  //   const slug = slugify(data.title, {
  //     lower: true,
  //     strict: true,
  //     trim: true,
  //   });

  //   const exists = await prisma.product.findFirst({
  //     where: {
  //       OR: [
  //         { title: data.title },
  //         { slug },
  //       ],
  //     },
  //   });

  //   if (exists) {
  //     throw new AppError(
  //       "Product already exists",
  //       400
  //     );
  //   }

  //   const category =
  //     await prisma.category.findUnique({
  //       where: {
  //         id: data.categoryId,
  //       },
  //     });

  //   if (!category) {
  //     throw new AppError(
  //       "Category not found",
  //       404
  //     );
  //   }

  //   const isSale = data.isSale === "true";
  //   const isActive = data.isActive === "true";

  //   return prisma.product.create({
  //     data: {
  //       title: data.title,
  //       slug,
  //       description: data.description,
  //       thumbnail: data.thumbnail,

  //       isSale: isSale,
  //       isActive: isActive,

  //       categoryId: data.categoryId,
  //       vendorId,

  //       images: {
  //         create: data.images.map(
  //           (image: string, index: number) => ({
  //             image,
  //             isPrimary: index === 0,
  //           })
  //         ),
  //       },
  //     },

  //     include: {
  //       category: true,
  //       vendor: true,
  //       images: true,
  //     },
  //   });
  // },

  //   return prisma.product.create({
  //     data: {
  //       title: data.title,
  //       slug,
  //       description: data.description,
  //       thumbnail: data.thumbnail,
  //       categoryId: data.categoryId,
  //       vendorId,

  //       images: {
  //         create: data.images.map(
  //           (image: string, index: number) => ({
  //             image,
  //             isPrimary: index === 0,
  //           })
  //         ),
  //       },
  //     },

  //     include: {
  //       category: true,
  //       vendor: true,
  //       images: true,
  //     },
  //   });
  // },

  /*
  |--------------------------------------------------------------------------
  | UPDATE PRODUCT
  |--------------------------------------------------------------------------
  */

  updateProduct: async (
    productId: string,
    data: any,
    userId: string,
    role: string
  ) => {
    return productService.update(productId, data, userId, role);
  },

  /*
  |--------------------------------------------------------------------------
  | DELETE PRODUCT (SAFE + CLEAN TRANSACTION)
  |--------------------------------------------------------------------------
  */

  deleteProduct: async (
    productId: string,
    userId: string,
    role: string
  ) => {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.vendorId !== userId && role !== "ADMIN") {
      throw new AppError("Forbidden", 403);
    }

    await prisma.$transaction(async (tx) => {
      await tx.productVariant.deleteMany({
        where: { productId },
      });

      await tx.productImage.deleteMany({
        where: { productId },
      });

      await tx.wishlistItem.deleteMany({
        where: {
          variant: {
            productId,
          },
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          variant: {
            productId,
          },
        },
      });

      await tx.orderItem.deleteMany({
        where: { productId },
      });

      await tx.product.delete({
        where: { id: productId },
      });
    });

    return { success: true };
  },

  /*
  |--------------------------------------------------------------------------
  | ORDERS
  |--------------------------------------------------------------------------
  */

  // getVendorOrders: async (vendorId: string) => {
  //   return prisma.order.findMany({
  //     where: {
  //       items: {
  //         some: {
  //           product: { vendorId },
  //         },
  //       },
  //     },
  //     include: {
  //       items: {
  //         include: {
  //           product: true,
  //           variant: true,
  //         },
  //       },
  //       user: {
  //         select: {
  //           id: true,
  //           name: true,
  //           email: true,
  //         },
  //       },
  //     },
  //     orderBy: { createdAt: "desc" },
  //   });
  // },

    getVendorOrders: async (
  vendorId: string,
  page = 1,
  limit = 10,
  searchTerm?: string
) => {

  // console.log("searchTerm:", searchTerm);

  const skip = (page - 1) * limit;

  const whereCondition: any = {
    items: {
      some: {
        product: {
          vendorId,
        },
      },
    },
  };

  if (searchTerm) {
    const search = searchTerm.trim();
    const upperSearch = search.toUpperCase();

    whereCondition.OR = [
      {
        id: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        user: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        user: {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        items: {
          some: {
            product: {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      },
    ];

    if (Object.values(OrderStatus).includes(upperSearch as OrderStatus)) {
      whereCondition.OR.push({
        status: upperSearch as OrderStatus,
      });
    }
  }

  // console.log(JSON.stringify(whereCondition, null, 2));

  const [orders, total, statusCounts] = await Promise.all([
    prisma.order.findMany({
      where: whereCondition,

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        payment: true,

        items: {
          include: {
            product: true,
            variant: {
              include: {
                size: true,
                color: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      skip,
      take: limit,
    }),

    prisma.order.count({
      where: whereCondition,
    }),

    prisma.order.groupBy({
      by: ["status"],
      where: whereCondition,
      _count: {
        status: true,
      },
    }),
  ]);

  const filteredOrders = orders.map((order) => ({
    ...order,
    items: order.items.filter(
      (item) => item.product.vendorId === vendorId
    ),
  }));

    const stats = {
    pending: 0,
    paid: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  statusCounts.forEach((item) => {
    switch (item.status) {
      case OrderStatus.PENDING:
        stats.pending = item._count.status;
        break;

      case OrderStatus.PAID:
        stats.paid = item._count.status;
        break;

      case OrderStatus.SHIPPED:
        stats.shipped = item._count.status;
        break;

      case OrderStatus.DELIVERED:
        stats.delivered = item._count.status;
        break;

      case OrderStatus.CANCELLED:
        stats.cancelled = item._count.status;
        break;
    }
  });
  

  return {
    orders: filteredOrders,

    pagination: {
      total,
      ...stats,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
},

//   getVendorOrders: async (
//   vendorId: string,
//   page = 1,
//   limit = 10,
//   searchTerm?: string
// ) => {

//   // console.log("searchTerm:", searchTerm);

//   const skip = (page - 1) * limit;

//   const whereCondition: any = {
//     items: {
//       some: {
//         product: {
//           vendorId,
//         },
//       },
//     },
//   };

//   if (searchTerm) {
//     const search = searchTerm.trim();
//     const upperSearch = search.toUpperCase();

//     whereCondition.OR = [
//       {
//         id: {
//           contains: search,
//           mode: "insensitive",
//         },
//       },
//       {
//         user: {
//           name: {
//             contains: search,
//             mode: "insensitive",
//           },
//         },
//       },
//       {
//         user: {
//           email: {
//             contains: search,
//             mode: "insensitive",
//           },
//         },
//       },
//       {
//         items: {
//           some: {
//             product: {
//               title: {
//                 contains: search,
//                 mode: "insensitive",
//               },
//             },
//           },
//         },
//       },
//     ];

//     if (Object.values(OrderStatus).includes(upperSearch as OrderStatus)) {
//       whereCondition.OR.push({
//         status: upperSearch as OrderStatus,
//       });
//     }
//   }

//   // console.log(JSON.stringify(whereCondition, null, 2));

//   const [orders, total] = await Promise.all([
//     prisma.order.findMany({
//       where: whereCondition,

//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },

//         payment: true,

//         items: {
//           include: {
//             product: true,
//             variant: {
//               include: {
//                 size: true,
//                 color: true,
//               },
//             },
//           },
//         },
//       },

//       orderBy: {
//         createdAt: "desc",
//       },

//       skip,
//       take: limit,
//     }),

//     prisma.order.count({
//       where: whereCondition,
//     }),
//   ]);

//   const filteredOrders = orders.map((order) => ({
//     ...order,
//     items: order.items.filter(
//       (item) => item.product.vendorId === vendorId
//     ),
//   }));


//   return {
//     orders: filteredOrders,

//     pagination: {
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//       hasNextPage: page < Math.ceil(total / limit),
//       hasPreviousPage: page > 1,
//     },
//   };
// },
  

  getSingleVendorOrder: async (orderId: string, vendorId: string) => {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        items: {
          some: {
            product: { vendorId },
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        payment: true,
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    return order;
  },
};