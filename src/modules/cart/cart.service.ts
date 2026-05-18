import { prisma } from "../../lib/prisma";

export const cartService = {
  getCart: async (userId: string) => {
    let cart = await prisma.cart.findUnique({
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

    if (!cart) {
        cart = await prisma.cart.create({
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

    return cart;
  },

  addItem: async (
    userId: string,
    variantId: string,
    quantity: number
  ) => {
    const variant = await prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },

      include: {
        product: true,
      },
    });

    if (!variant) {
      throw new Error("Variant not found");
    }

    if (variant.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    let cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
      });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });

    if (existingItem) {
      const totalQuantity =
        existingItem.quantity + quantity;

      if (totalQuantity > variant.stock) {
        throw new Error("Stock exceeded");
      }

      return prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },

        data: {
          quantity: totalQuantity,
        },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity,
      },
    });
  },

  updateQuantity: async (
    itemId: string,
    quantity: number
  ) => {
    const item = await prisma.cartItem.findUnique({
      where: {
        id: itemId,
      },

      include: {
        variant: true,
      },
    });

    if (!item) {
      throw new Error("Cart item not found");
    }

    if (quantity > item.variant.stock) {
      throw new Error("Stock exceeded");
    }

    return prisma.cartItem.update({
      where: {
        id: itemId,
      },

      data: {
        quantity,
      },
    });
  },

  removeItem: async (itemId: string) => {
    return prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });
  },
};