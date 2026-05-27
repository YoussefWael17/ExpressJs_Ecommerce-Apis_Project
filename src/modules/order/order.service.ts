// import { prisma } from "../../lib/prisma";

// export const orderService = {
//   createOrder: async (userId: string) => {
//     const cart = await prisma.cart.findUnique({
//       where: {
//         userId,
//       },

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

//     if (!cart || cart.items.length === 0) {
//       throw new Error("Cart is empty");
//     }

//     let totalAmount = 0;

//     for (const item of cart.items) {
//       if (item.quantity > item.variant.stock) {
//         throw new Error(
//           `${item.variant.product.title} out of stock`
//         );
//       }

//       totalAmount +=
//         item.quantity * item.variant.price;
//     }

//     const order = await prisma.order.create({
//       data: {
//         userId,
//         totalAmount,

//         items: {
//           create: cart.items.map((item) => ({
//             productId: item.variant.productId,
//             variantId: item.variantId,
//             quantity: item.quantity,
//             price: item.variant.price,
//           })),
//         },
//       },

//       include: {
//         items: true,
//       },
//     });

//     // Reduce stock
//     for (const item of cart.items) {
//       await prisma.productVariant.update({
//         where: {
//           id: item.variantId,
//         },

//         data: {
//           stock: {
//             decrement: item.quantity,
//           },
//         },
//       });
//     }

//     // Clear cart
//     await prisma.cartItem.deleteMany({
//       where: {
//         cartId: cart.id,
//       },
//     });

//     return order;
//   },

//   getUserOrders: async (userId: string) => {
//     return prisma.order.findMany({
//       where: {
//         userId,
//       },

//       include: {
//         items: {
//           include: {
//             product: true,
//             variant: true,
//           },
//         },
//       },

//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//   },

//   getSingleOrder: async (
//     orderId: string,
//     userId: string
//   ) => {
//     return prisma.order.findFirst({
//       where: {
//         id: orderId,
//         userId,
//       },

//       include: {
//         items: {
//           include: {
//             product: true,
//             variant: true,
//           },
//         },
//       },
//     });
//   },
// };


import { prisma } from "../../lib/prisma";

import { AppError } from "../../utils/AppError";

export const orderService = {
  createOrder: async (userId: string) => {
    const cart =
      await prisma.cart.findUnique({
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
      throw new AppError(
        "Cart is empty",
        400
      );
    }

    let totalAmount = 0;

    // validate stock + calculate total
    for (const item of cart.items) {
      if (
        item.quantity >
        item.variant.stock
      ) {
        throw new AppError(
          `${item.variant.product.title} out of stock`,
          400
        );
      }

      const price =
        item.variant.discountPrice ??
        item.variant.price;

      totalAmount +=
        item.quantity * price;
    }

    // create order (transaction recommended)
    const order =
      await prisma.$transaction(
        async (tx) => {
          const createdOrder =
            await tx.order.create({
              data: {
                userId,
                totalAmount,

                items: {
                  create: cart.items.map(
                    (item) => ({
                      productId:
                        item.variant.productId,

                      variantId:
                        item.variantId,

                      quantity:
                        item.quantity,

                      price:
                        item.variant
                          .discountPrice ??
                        item.variant.price,
                    })
                  ),
                },
              },

              include: {
                items: true,
              },
            });

          // reduce stock safely inside transaction
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

          // clear cart
          await tx.cartItem.deleteMany({
            where: {
              cartId: cart.id,
            },
          });

          return createdOrder;
        }
      );

    return order;
  },

  getUserOrders: async (
    userId: string
  ) => {
    return prisma.order.findMany({
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

  getSingleOrder: async (
    orderId: string,
    userId: string
  ) => {
    const order =
      await prisma.order.findFirst({
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
      throw new AppError(
        "Order not found",
        404
      );
    }

    return order;
  },
};