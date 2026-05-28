import { OrderStatus, Role } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export const adminService = {
  /*
  |--------------------------------------------------------------------------
  | Users
  |--------------------------------------------------------------------------
  */

  getUsers: async () => {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  changeRole: async (userId: string, role: string) => {
    return prisma.user.update({
      where: { id: userId },
      data: { role: role as Role },
    });
  },

  deleteUser: async (userId: string) => {
    return prisma.user.delete({
      where: { id: userId },
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Products
  |--------------------------------------------------------------------------
  */

  getProducts: async () => {
    return prisma.product.findMany({
      include: {
        category: true,
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        variants: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  deleteProduct: async (productId: string) => {
    return prisma.product.delete({
      where: { id: productId },
    });
  },

  toggleProductStatus: async (productId: string) => {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    return prisma.product.update({
      where: { id: productId },
      data: {
        isActive: !product.isActive,
      },
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Orders
  |--------------------------------------------------------------------------
  */

  getOrders: async () => {
    return prisma.order.findMany({
      include: {
        user: true,
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

  getOrderById: async (orderId: string) => {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    return prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus  },
    });
  },

  /*
  |--------------------------------------------------------------------------
  | Stats
  |--------------------------------------------------------------------------
  */

  getStats: async () => {
    const users = await prisma.user.count();
    const vendors = await prisma.user.count({
      where: { role: "VENDOR" },
    });

    const products = await prisma.product.count();
    const orders = await prisma.order.count();

    const revenue = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

    return {
      users,
      vendors,
      products,
      orders,
      revenue: revenue._sum.totalAmount || 0,
    };
  },
};