import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(3),

  slug: z.string().min(3),

  description: z.string(),

  categoryId: z.string().uuid(),

  thumbnail: z.string(),

  variants: z.array(
    z.object({
      sku: z.string(),

      price: z.number().positive(),

      stock: z.number().min(0),

      sizeId: z.string().uuid().optional(),

      colorId: z.string().uuid().optional(),
    })
  ),

  images: z.array(
    z.object({
      image: z.string(),
    })
  ),
});