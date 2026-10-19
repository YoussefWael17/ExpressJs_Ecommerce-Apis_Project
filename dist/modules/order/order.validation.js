"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderSchema = exports.updateOrderStatusSchema = void 0;
const zod_1 = require("zod");
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([
        "PENDING",
        "PAID",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
    ]),
});
exports.getOrderSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
});
