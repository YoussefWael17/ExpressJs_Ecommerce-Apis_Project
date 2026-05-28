import { z } from "zod";

export const addWishlistSchema = z.object({
  variantId: z.string().uuid(),
});

export const removeWishlistSchema = z.object({
  id: z.string().uuid(),
});