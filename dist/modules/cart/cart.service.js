"use strict";
// import { prisma } from "../../lib/prisma";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = void 0;
// export const cartService = {
//   getCart: async (userId: string) => {
//     let cart = await prisma.cart.findUnique({
//       where: {
//         userId,
//       },
//       include: {
//         items: {
//           include: {
//             variant: {
//               include: {
//                 product: true,
//                 size: true,
//                 color: true,
//               },
//             },
//           },
//         },
//       },
//     });
//     if (!cart) {
//         cart = await prisma.cart.create({
//             data: {
//             userId,
//             },
//             include: {
//             items: {
//                 include: {
//                 variant: {
//                     include: {
//                     product: true,
//                     size: true,
//                     color: true,
//                     },
//                 },
//                 },
//             },
//             },
//         });
//         }
//     return cart;
//   },
//   addItem: async (
//     userId: string,
//     variantId: string,
//     quantity: number
//   ) => {
//     const variant = await prisma.productVariant.findUnique({
//       where: {
//         id: variantId,
//       },
//       include: {
//         product: true,
//       },
//     });
//     if (!variant) {
//       throw new Error("Variant not found");
//     }
//     if (variant.stock < quantity) {
//       throw new Error("Insufficient stock");
//     }
//     let cart = await prisma.cart.findUnique({
//       where: {
//         userId,
//       },
//     });
//     if (!cart) {
//       cart = await prisma.cart.create({
//         data: {
//           userId,
//         },
//       });
//     }
//     const existingItem = await prisma.cartItem.findUnique({
//       where: {
//         cartId_variantId: {
//           cartId: cart.id,
//           variantId,
//         },
//       },
//     });
//     if (existingItem) {
//       const totalQuantity =
//         existingItem.quantity + quantity;
//       if (totalQuantity > variant.stock) {
//         throw new Error("Stock exceeded");
//       }
//       return prisma.cartItem.update({
//         where: {
//           id: existingItem.id,
//         },
//         data: {
//           quantity: totalQuantity,
//         },
//       });
//     }
//     return prisma.cartItem.create({
//       data: {
//         cartId: cart.id,
//         variantId,
//         quantity,
//       },
//     });
//   },
//   updateQuantity: async (
//     itemId: string,
//     quantity: number
//   ) => {
//     const item = await prisma.cartItem.findUnique({
//       where: {
//         id: itemId,
//       },
//       include: {
//         variant: true,
//       },
//     });
//     if (!item) {
//       throw new Error("Cart item not found");
//     }
//     if (quantity > item.variant.stock) {
//       throw new Error("Stock exceeded");
//     }
//     return prisma.cartItem.update({
//       where: {
//         id: itemId,
//       },
//       data: {
//         quantity,
//       },
//     });
//   },
//   removeItem: async (itemId: string) => {
//     return prisma.cartItem.delete({
//       where: {
//         id: itemId,
//       },
//     });
//   },
// };
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../utils/AppError");
exports.cartService = {
    getCart: async (userId) => {
        let cart = await prisma_1.prisma.cart.findUnique({
            where: {
                userId,
            },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                                size: true,
                                color: true,
                            },
                        },
                    },
                },
            },
        });
        // create cart automatically
        if (!cart) {
            cart = await prisma_1.prisma.cart.create({
                data: {
                    userId,
                },
                include: {
                    items: {
                        include: {
                            variant: {
                                include: {
                                    product: true,
                                    size: true,
                                    color: true,
                                },
                            },
                        },
                    },
                },
            });
        }
        // calculate totals
        const subtotal = cart.items.reduce((acc, item) => {
            return (acc +
                item.quantity *
                    (item.variant.discountPrice ??
                        item.variant.price));
        }, 0);
        return {
            ...cart,
            summary: {
                itemsCount: cart.items.length,
                subtotal,
            },
        };
    },
    addItem: async (userId, variantId, quantity) => {
        if (quantity <= 0) {
            throw new AppError_1.AppError("Quantity must be greater than 0", 400);
        }
        const variant = await prisma_1.prisma.productVariant.findUnique({
            where: {
                id: variantId,
            },
            include: {
                product: true,
                size: true,
                color: true,
            },
        });
        if (!variant) {
            throw new AppError_1.AppError("Variant not found", 404);
        }
        if (!variant.product.isActive) {
            throw new AppError_1.AppError("Product is unavailable", 400);
        }
        if (variant.stock < quantity) {
            throw new AppError_1.AppError("Insufficient stock", 400);
        }
        let cart = await prisma_1.prisma.cart.findUnique({
            where: {
                userId,
            },
        });
        // auto create cart
        if (!cart) {
            cart = await prisma_1.prisma.cart.create({
                data: {
                    userId,
                },
            });
        }
        const existingItem = await prisma_1.prisma.cartItem.findUnique({
            where: {
                cartId_variantId: {
                    cartId: cart.id,
                    variantId,
                },
            },
        });
        // update existing item
        if (existingItem) {
            const totalQuantity = existingItem.quantity +
                quantity;
            if (totalQuantity >
                variant.stock) {
                throw new AppError_1.AppError("Stock exceeded", 400);
            }
            return prisma_1.prisma.cartItem.update({
                where: {
                    id: existingItem.id,
                },
                data: {
                    quantity: totalQuantity,
                },
                include: {
                    variant: {
                        include: {
                            product: true,
                            size: true,
                            color: true,
                        },
                    },
                },
            });
        }
        // create new item
        return prisma_1.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                variantId,
                quantity,
            },
            include: {
                variant: {
                    include: {
                        product: true,
                        size: true,
                        color: true,
                    },
                },
            },
        });
    },
    updateQuantity: async (itemId, quantity) => {
        if (quantity <= 0) {
            throw new AppError_1.AppError("Quantity must be greater than 0", 400);
        }
        const item = await prisma_1.prisma.cartItem.findUnique({
            where: {
                id: itemId,
            },
            include: {
                variant: {
                    include: {
                        product: true,
                        size: true,
                        color: true,
                    },
                },
            },
        });
        if (!item) {
            throw new AppError_1.AppError("Cart item not found", 404);
        }
        if (quantity >
            item.variant.stock) {
            throw new AppError_1.AppError("Stock exceeded", 400);
        }
        return prisma_1.prisma.cartItem.update({
            where: {
                id: itemId,
            },
            data: {
                quantity,
            },
            include: {
                variant: {
                    include: {
                        product: true,
                        size: true,
                        color: true,
                    },
                },
            },
        });
    },
    removeItem: async (itemId) => {
        const item = await prisma_1.prisma.cartItem.findUnique({
            where: {
                id: itemId,
            },
        });
        if (!item) {
            throw new AppError_1.AppError("Cart item not found", 404);
        }
        await prisma_1.prisma.cartItem.delete({
            where: {
                id: itemId,
            },
        });
        return {
            success: true,
        };
    },
};
