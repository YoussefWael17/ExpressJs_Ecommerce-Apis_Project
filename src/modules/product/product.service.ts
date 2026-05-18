import { prisma } from "../../lib/prisma";

export const productService = {
  create: async (data: any, vendorId: string) => {
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
        variants: true,
        images: true,
        category: true,
      },
    });
  },

  getAll: async (query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    return prisma.product.findMany({
      skip,
      take: limit,

      where: {
        isActive: true,

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
        variants: true,
        images: true,
        category: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getOne: async (id: string) => {
    return prisma.product.findUnique({
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
        reviews: true,
      },
    });
  },
};