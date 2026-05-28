import { prisma } from "../../lib/prisma";

import { AppError } from "../../utils/AppError";

export const categoryService = {
  /*
  |--------------------------------------------------------------------------
  | Create Category
  |--------------------------------------------------------------------------
  */

  create: async (data: any) => {
    const exists =
      await prisma.category.findFirst({
        where: {
          OR: [
            { name: data.name },
            { slug: data.slug },
          ],
        },
      });

    if (exists) {
      throw new AppError(
        "Category already exists",
        400
      );
    }

    return prisma.category.create({
      data,
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Get All Categories
  |--------------------------------------------------------------------------
  */

  getAll: async () => {
    return prisma.category.findMany({
      include: {
        products: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Get Single Category
  |--------------------------------------------------------------------------
  */

  getOne: async (id: string) => {
    const category =
      await prisma.category.findUnique({
        where: { id },

        include: {
          products: {
            include: {
              variants: true,
              images: true,
            },
          },
        },
      });

    if (!category) {
      throw new AppError(
        "Category not found",
        404
      );
    }

    return category;
  },

  /*
  |--------------------------------------------------------------------------
  | Update Category
  |--------------------------------------------------------------------------
  */

  update: async (
    id: string,
    data: any
  ) => {
    const category =
      await prisma.category.findUnique({
        where: { id },
      });

    if (!category) {
      throw new AppError(
        "Category not found",
        404
      );
    }

    return prisma.category.update({
      where: { id },

      data,
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Delete Category
  |--------------------------------------------------------------------------
  */

  delete: async (id: string) => {
    const category =
      await prisma.category.findUnique({
        where: { id },
      });

    if (!category) {
      throw new AppError(
        "Category not found",
        404
      );
    }

    return prisma.category.delete({
      where: { id },
    });
  },
};