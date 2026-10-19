import { prisma } from "../../lib/prisma";

import slugify from "slugify";

import { AppError } from "../../utils/AppError";

import fs from "fs";
import path from "path";

export const categoryService = {
  /*
  |--------------------------------------------------------------------------
  | Create Category
  |--------------------------------------------------------------------------
  */

  create: async (data: any) => {

    const slug = slugify(data.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const exists = await prisma.category.findFirst({
      where: {
        OR: [
          { name: data.name },
          { slug },
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
      data: {
        name: data.name,
        icon: data.icon,
        slug,
      },
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

  update: async (id: string, data: any) => {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const slug = data.name
      ? slugify(data.name, {
          lower: true,
          strict: true,
          trim: true,
        })
      : category.slug;

    const exists = await prisma.category.findFirst({
      where: {
        AND: [
          {
            NOT: { id },
          },
          {
            OR: [
              { name: data.name },
              { slug },
            ],
          },
        ],
      },
    });

    if (exists) {
      throw new AppError("Category already exists", 400);
    }

    return prisma.category.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Delete Category
  |--------------------------------------------------------------------------
  */

  delete: async (id: string) => {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // 🧹 delete image from uploads
    // if (category.image) {
    //   const imagePath = path.join(process.cwd(), category.image);

    //   if (fs.existsSync(imagePath)) {
    //     await fs.promises.unlink(imagePath);
    //   }
    // }

    // 🗑️ delete from database
    return prisma.category.delete({
      where: { id },
    });
  },

  // delete: async (id: string) => {
  //   const category =
  //     await prisma.category.findUnique({
  //       where: { id },
  //     });

  //   if (!category) {
  //     throw new AppError(
  //       "Category not found",
  //       404
  //     );
  //   }

  //   return prisma.category.delete({
  //     where: { id },
  //   });
  // },
};