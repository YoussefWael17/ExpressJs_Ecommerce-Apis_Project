import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { productService } from "../product/product.service";

export const vendorService = {
  /*
  |--------------------------------------------------------------------------
  | PRODUCTS
  |--------------------------------------------------------------------------
  */

  getMyProducts: async (vendorId: string) => {
    return prisma.product.findMany({
      where: { vendorId },
      include: {
        variants: {
          include: {
            size: true,
            color: true,
          },
        },
        images: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  getSingleProduct: async (productId: string, vendorId: string) => {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        vendorId,
      },
      include: {
        variants: {
          include: {
            size: true,
            color: true,
          },
        },
        images: true,
        category: true,
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  },

  /*
  |--------------------------------------------------------------------------
  | CREATE PRODUCT (FIXED - CLEAN DELEGATION)
  |--------------------------------------------------------------------------
  */

  createProduct: async (data: any, vendorId: string, role: string) => {
    return productService.create(data, vendorId, role);
  },

  /*
  |--------------------------------------------------------------------------
  | UPDATE PRODUCT
  |--------------------------------------------------------------------------
  */

  updateProduct: async (
    productId: string,
    data: any,
    userId: string,
    role: string
  ) => {
    return productService.update(productId, data, userId, role);
  },

  /*
  |--------------------------------------------------------------------------
  | DELETE PRODUCT (SAFE + CLEAN TRANSACTION)
  |--------------------------------------------------------------------------
  */

  deleteProduct: async (
    productId: string,
    userId: string,
    role: string
  ) => {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.vendorId !== userId && role !== "ADMIN") {
      throw new AppError("Forbidden", 403);
    }

    await prisma.$transaction(async (tx) => {
      await tx.productVariant.deleteMany({
        where: { productId },
      });

      await tx.productImage.deleteMany({
        where: { productId },
      });

      await tx.wishlistItem.deleteMany({
        where: {
          variant: {
            productId,
          },
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          variant: {
            productId,
          },
        },
      });

      await tx.orderItem.deleteMany({
        where: { productId },
      });

      await tx.product.delete({
        where: { id: productId },
      });
    });

    return { success: true };
  },

  /*
  |--------------------------------------------------------------------------
  | ORDERS
  |--------------------------------------------------------------------------
  */

  getVendorOrders: async (vendorId: string) => {
    return prisma.order.findMany({
      where: {
        items: {
          some: {
            product: { vendorId },
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  getSingleVendorOrder: async (orderId: string, vendorId: string) => {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        items: {
          some: {
            product: { vendorId },
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    return order;
  },
};