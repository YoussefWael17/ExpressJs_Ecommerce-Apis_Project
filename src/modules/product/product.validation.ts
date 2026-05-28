import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(2),

  slug: z.string().min(2),

  description: z.string().optional(),

  thumbnail: z.string().url().optional(),

  categoryId: z.string(),

  variants: z.array(
    z.object({
      sku: z.string().optional(),

      price: z.number().positive(),

      discountPrice: z.number().optional(),

      stock: z.number().int().nonnegative(),

      sizeId: z.string().optional(),

      colorId: z.string().optional(),
    })
  ),

  images: z.array(
    z.object({
      image: z.string().url(),

      isPrimary: z.boolean().optional(),
    })
  ),
});