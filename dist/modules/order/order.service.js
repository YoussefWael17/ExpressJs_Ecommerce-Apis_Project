"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../utils/AppError");
exports.orderService = {
    // createOrder: async (userId: string) => {
    //   const cart =
    //     await prisma.cart.findUnique({
    //       where: { userId },
    //       include: {
    //         items: {
    //           include: {
    //             variant: {
    //               include: {
    //                 product: true,
    //               },
    //             },
    //           },
    //         },
    //       },
    //     });
    //   if (!cart || cart.items.length === 0) {
    //     throw new AppError(
    //       "Cart is empty",
    //       400
    //     );
    //   }
    //   let totalAmount = 0;
    //   // validate stock + calculate total
    //   for (const item of cart.items) {
    //     if (
    //       item.quantity >
    //       item.variant.stock
    //     ) {
    //       throw new AppError(
    //         `${item.variant.product.title} out of stock`,
    //         400
    //       );
    //     }
    //     const price =
    //       item.variant.discountPrice ??
    //       item.variant.price;
    //     totalAmount +=
    //       item.quantity * price;
    //   }
    //   // create order (transaction recommended)
    //   const order =
    //     await prisma.$transaction(
    //       async (tx) => {
    //         const createdOrder =
    //           await tx.order.create({
    //             data: {
    //               userId,
    //               totalAmount,
    //               items: {
    //                 create: cart.items.map(
    //                   (item) => ({
    //                     productId:
    //                       item.variant.productId,
    //                     variantId:
    //                       item.variantId,
    //                     quantity:
    //                       item.quantity,
    //                     price:
    //                       item.variant
    //                         .discountPrice ??
    //                       item.variant.price,
    //                   })
    //                 ),
    //               },
    //             },
    //             include: {
    //               items: true,
    //             },
    //           });
    //         // reduce stock safely inside transaction
    //         for (const item of cart.items) {
    //           await tx.productVariant.update({
    //             where: {
    //               id: item.variantId,
    //             },
    //             data: {
    //               stock: {
    //                 decrement: item.quantity,
    //               },
    //             },
    //           });
    //         }
    //         // clear cart
    //         await tx.cartItem.deleteMany({
    //           where: {
    //             cartId: cart.id,
    //           },
    //         });
    //         return createdOrder;
    //       }
    //     );
    //   return order;
    // },
    createOrder: async (userId) => {
        const cart = await prisma_1.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });
        if (!cart || cart.items.length === 0) {
            throw new AppError_1.AppError("Cart is empty", 400);
        }
        let totalAmount = 0;
        // Validate stock + calculate total
        for (const item of cart.items) {
            if (item.quantity > item.variant.stock) {
                throw new AppError_1.AppError(`${item.variant.product.title} is out of stock`, 400);
            }
            const price = item.variant.discountPrice ?? item.variant.price;
            totalAmount += item.quantity * price;
        }
        const order = await prisma_1.prisma.$transaction(async (tx) => {
            // Create Order
            const createdOrder = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    items: {
                        create: cart.items.map((item) => ({
                            productId: item.variant.productId,
                            variantId: item.variantId,
                            quantity: item.quantity,
                            price: item.variant.discountPrice ??
                                item.variant.price,
                        })),
                    },
                },
            });
            // Create Payment
            await tx.payment.create({
                data: {
                    userId,
                    orderId: createdOrder.id,
                    amount: totalAmount,
                    status: "PENDING"
                },
            });
            // Reduce stock
            for (const item of cart.items) {
                await tx.productVariant.update({
                    where: {
                        id: item.variantId,
                    },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }
            // Clear cart
            await tx.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                },
            });
            // Return order with relations
            return tx.order.findUnique({
                where: {
                    id: createdOrder.id,
                },
                include: {
                    payment: true,
                    items: {
                        include: {
                            product: true,
                            variant: {
                                include: {
                                    size: true,
                                    color: true,
                                },
                            },
                        },
                    },
                },
            });
        });
        return order;
    },
    getUserOrders: async (userId) => {
        return prisma_1.prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    getSingleOrder: async (orderId, userId) => {
        const order = await prisma_1.prisma.order.findFirst({
            where: {
                id: orderId,
                userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true,
                    },
                },
            },
        });
        if (!order) {
            throw new AppError_1.AppError("Order not found", 404);
        }
        return order;
    },
};
