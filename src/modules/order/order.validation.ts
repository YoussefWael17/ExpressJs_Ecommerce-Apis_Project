import { z } from "zod";

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PAID",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export const getOrderSchema = z.object({
  id: z.string().min(1),
});