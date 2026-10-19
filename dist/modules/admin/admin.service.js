"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const prisma_1 = require("../../lib/prisma");
exports.adminService = {
    /*
    |--------------------------------------------------------------------------
    | Users
    |--------------------------------------------------------------------------
    */
    getUsers: async () => {
        return prisma_1.prisma.user.findMany({
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
    changeRole: async (userId, role) => {
        return prisma_1.prisma.user.update({
            where: { id: userId },
            data: { role: role },
        });
    },
    deleteUser: async (userId) => {
        return prisma_1.prisma.user.delete({
            where: { id: userId },
        });
    },
    /*
    |--------------------------------------------------------------------------
    | Products
    |--------------------------------------------------------------------------
    */
    getProducts: async () => {
        return prisma_1.prisma.product.findMany({
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
    deleteProduct: async (productId) => {
        return prisma_1.prisma.product.delete({
            where: { id: productId },
        });
    },
    toggleProductStatus: async (productId) => {
        const product = await prisma_1.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            throw new Error("Product not found");
        return prisma_1.prisma.product.update({
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
        return prisma_1.prisma.order.findMany({
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
    getOrderById: async (orderId) => {
        return prisma_1.prisma.order.findUnique({
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
    updateOrderStatus: async (orderId, status) => {
        return prisma_1.prisma.order.update({
            where: { id: orderId },
            data: { status: status },
        });
    },
    /*
    |--------------------------------------------------------------------------
    | Stats
    |--------------------------------------------------------------------------
    */
    getStats: async () => {
        const users = await prisma_1.prisma.user.count();
        const vendors = await prisma_1.prisma.user.count({
            where: { role: "VENDOR" },
        });
        const products = await prisma_1.prisma.product.count();
        const orders = await prisma_1.prisma.order.count();
        const revenue = await prisma_1.prisma.order.aggregate({
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
