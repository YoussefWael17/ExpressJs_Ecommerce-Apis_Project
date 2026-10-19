"use strict";
// import { z } from "zod";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryIdSchema = exports.updateCategorySchema = exports.createCategorySchema = exports.ICONS = void 0;
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
const zod_1 = require("zod");
// اختياري: لو عندك icons محددة
exports.ICONS = [
    "faMobileScreen",
    "faLaptop",
    "faCamera",
    "faHeadphones",
    "faGamepad",
    "faTv",
    "faShirt",
];
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be at most 100 characters"),
    icon: zod_1.z
        .enum(exports.ICONS)
        .optional(), // أو nullable لو تحب
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
exports.categoryIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
