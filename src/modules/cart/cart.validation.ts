import { z } from "zod";

export const addToCartSchema = z.object({
  variantId: z.string(),

  quantity: z.number().int().positive(),
});

export const updateCartSchema = z.object({
  quantity: z.number().int().positive(),
});