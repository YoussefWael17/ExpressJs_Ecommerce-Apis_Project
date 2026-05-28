import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100),

  slug: z
    .string()
    .min(2)
    .max(100),

  image: z
    .string()
    .url()
    .optional(),
});

export const updateCategorySchema =
  createCategorySchema.partial();

export const categoryIdSchema = z.object({
  id: z.string().uuid(),
});