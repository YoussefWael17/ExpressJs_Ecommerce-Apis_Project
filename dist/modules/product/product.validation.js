"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    title: zod_1.z.string().min(2),
    // slug: z.string().min(2),
    description: zod_1.z.string().optional(),
    // thumbnail: z.string().url().optional(),
    categoryId: zod_1.z.string(),
    // variants: z.string(),
    // variants: z.array(
    //   z.object({
    //     sku: z.string().optional(),
    //     price: z.number().positive(),
    //     discountPrice: z.number().optional(),
    //     stock: z.number().int().nonnegative(),
    //     sizeId: z.string().optional(),
    //     colorId: z.string().optional(),
    //   })
    // ),
    // images: z.array(
    //   z.object({
    //     image: z.string().url(),
    //     isPrimary: z.boolean().optional(),
    //   })
    // ),
});
