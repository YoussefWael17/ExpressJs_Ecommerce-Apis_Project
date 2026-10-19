"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeWishlistSchema = exports.addWishlistSchema = void 0;
const zod_1 = require("zod");
exports.addWishlistSchema = zod_1.z.object({
    variantId: zod_1.z.string().uuid(),
});
exports.removeWishlistSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
