import { prisma } from "../../lib/prisma";

export const orderService = {
  createOrder: async (userId: string) => {
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },

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
      throw new Error("Cart is empty");
    }

    let totalAmount = 0;

    for (const item of cart.items) {
      if (item.quantity > item.variant.stock) {
        throw new Error(
          `${item.variant.product.title} out of stock`
        );
      }

      totalAmount +=
        item.quantity * item.variant.price;
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,

        items: {
          create: cart.items.map((item) => ({
            productId: item.variant.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.variant.price,
          })),
        },
      },

      include: {
        items: true,
      },
    });

    // Reduce stock
    for (const item of cart.items) {
      await prisma.productVariant.update({
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
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return order;
  },

  getUserOrders: async (userId: string) => {
    return prisma.order.findMany({
      where: {
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

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getSingleOrder: async (
    orderId: string,
    userId: string
  ) => {
    return prisma.order.findFirst({
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
  },
};