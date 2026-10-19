// import { z } from "zod";

// export const createCategorySchema = z.object({
//   name: z
//     .string()
//     .min(2)
//     .max(100),

//   // slug: z
//   //   .string()
//   //   .min(2)
//   //   .max(100),

//   icon: z
//     .string()
//     .optional(),
// });

import { z } from "zod";

// اختياري: لو عندك icons محددة
export const ICONS = [
  "faMobileScreen",
  "faLaptop",
  "faCamera",
  "faHeadphones",
  "faGamepad",
  "faTv",
  "faShirt",
] as const;

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),

  icon: z
    .enum(ICONS)
    .optional(), // أو nullable لو تحب
});

export const updateCategorySchema =
  createCategorySchema.partial();

export const categoryIdSchema = z.object({
  id: z.string().uuid(),
});