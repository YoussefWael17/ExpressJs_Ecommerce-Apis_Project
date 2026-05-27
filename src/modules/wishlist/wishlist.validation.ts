import { z } from "zod";

export const addWishlistSchema = z.object({
  variantId: z.string().uuid(),
});