import { prisma } from "../../lib/prisma";

import { AppError } from "../../utils/AppError";
import { resolveColor } from "./resolvers/color.resolver";
import { resolveSize } from "./resolvers/size.resolver";

export const productService = {
  create: async (
    data: any,
    vendorId: string,
    vendorRole: string
  ) => {
    const variants = await Promise.all(
      data.variants.map(async (v: any) => {
        const color = await resolveColor(v.color, vendorRole);
        const size = await resolveSize(v.size, vendorRole);

        return {
          sku: v.sku,
          price: v.price,
          discountPrice: v.discountPrice ?? null,
          stock: v.stock ?? 0,
          colorId: color.id,
          sizeId: size.id,
        };
      })
    );

    return prisma.product.create({
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
          create: (data.images || []).map((img: any) => ({
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

  update: async (
    productId: string,
    data: any,
    userId: string,
    userRole: string
  ) => {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.vendorId !== userId && userRole !== "ADMIN") {
      throw new AppError("Forbidden", 403);
    }

    return prisma.$transaction(async (tx) => {
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
          isSale: data.isSale ?? product.isSale,
        },
      });

      // 2. REPLACE VARIANTS
      if (Array.isArray(data.variants)) {
        await tx.productVariant.deleteMany({
          where: { productId },
        });

        if (data.variants.length > 0) {
          await tx.productVariant.createMany({
            data: data.variants.map((v: any) => ({
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
            data: data.images.map((img: any) => ({
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

  delete: async (
    productId: string,
    userId: string,
    userRole: string
  ) => {
    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!product) {
      throw new AppError(
        "Product not found",
        404
      );
    }

    if (
      product.vendorId !== userId &&
      userRole !== "ADMIN"
    ) {
      throw new AppError(
        "Forbidden",
        403
      );
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return {
      success: true,
    };
  },
};