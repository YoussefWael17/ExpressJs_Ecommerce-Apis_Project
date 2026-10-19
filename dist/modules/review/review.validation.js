"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewIdSchema = exports.updateReviewSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid(),
    rating: zod_1.z.coerce
        .number()
        .int()
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5"),
    comment: zod_1.z
        .string()
        .trim()
        .max(1000)
        .optional()
        .nullable(),
});
exports.updateReviewSchema = exports.createReviewSchema
    .omit({ productId: true })
    .partial();
exports.reviewIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
