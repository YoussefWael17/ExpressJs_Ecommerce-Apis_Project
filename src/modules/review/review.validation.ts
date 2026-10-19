import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.string().uuid(),

  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),

  comment: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .nullable(),
});

export const updateReviewSchema =
  createReviewSchema
    .omit({ productId: true })
    .partial();

export const reviewIdSchema = z.object({
  id: z.string().uuid(),
});