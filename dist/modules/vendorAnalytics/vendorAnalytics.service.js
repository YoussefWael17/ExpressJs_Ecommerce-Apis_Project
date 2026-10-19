"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../generated/prisma/enums");
const prisma_1 = require("../../lib/prisma");
const VendorAnalyticsService = {
    getAnalytics: async (vendorId, period = "6m") => {
        const months = period === "12m" ? 12 : 6;
        const now = new Date();
        // Start of the first month
        const fromDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
        // End of current month
        const toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        // --------------------------------------------------
        // Stats
        // --------------------------------------------------
        const [totalProducts, totalOrders, customers, revenueItems, ordersForStatus,] = await Promise.all([
            // Total Products
            prisma_1.prisma.product.count({
                where: {
                    vendorId,
                },
            }),
            // Total Orders containing at least one vendor product
            prisma_1.prisma.order.count({
                where: {
                    items: {
                        some: {
                            product: {
                                vendorId,
                            },
                        },
                    },
                },
            }),
            // Unique Customers
            prisma_1.prisma.order.findMany({
                where: {
                    items: {
                        some: {
                            product: {
                                vendorId,
                            },
                        },
                    },
                },
                select: {
                    userId: true,
                },
                distinct: ["userId"],
            }),
            // Revenue items
            prisma_1.prisma.orderItem.findMany({
                where: {
                    product: {
                        vendorId,
                    },
                    order: {
                        status: {
                            in: [
                                enums_1.OrderStatus.PAID,
                                enums_1.OrderStatus.SHIPPED,
                                enums_1.OrderStatus.DELIVERED,
                            ],
                        },
                    },
                },
                select: {
                    price: true,
                    quantity: true,
                },
            }),
            // Orders status
            prisma_1.prisma.order.findMany({
                where: {
                    items: {
                        some: {
                            product: {
                                vendorId,
                            },
                        },
                    },
                },
                select: {
                    id: true,
                    status: true,
                },
            }),
        ]);
        const totalCustomers = customers.length;
        const totalRevenue = revenueItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
        // --------------------------------------------------
        // Orders Status
        // --------------------------------------------------
        const statusCounts = {
            [enums_1.OrderStatus.PENDING]: 0,
            [enums_1.OrderStatus.PAID]: 0,
            [enums_1.OrderStatus.SHIPPED]: 0,
            [enums_1.OrderStatus.DELIVERED]: 0,
            [enums_1.OrderStatus.CANCELLED]: 0,
        };
        for (const order of ordersForStatus) {
            statusCounts[order.status]++;
        }
        const ordersStatus = [
            {
                name: "Pending",
                value: statusCounts[enums_1.OrderStatus.PENDING],
            },
            {
                name: "Paid",
                value: statusCounts[enums_1.OrderStatus.PAID],
            },
            {
                name: "Shipped",
                value: statusCounts[enums_1.OrderStatus.SHIPPED],
            },
            {
                name: "Delivered",
                value: statusCounts[enums_1.OrderStatus.DELIVERED],
            },
            {
                name: "Cancelled",
                value: statusCounts[enums_1.OrderStatus.CANCELLED],
            },
        ];
        // --------------------------------------------------
        // Sales Overview
        // --------------------------------------------------
        const salesItems = await prisma_1.prisma.orderItem.findMany({
            where: {
                product: {
                    vendorId,
                },
                order: {
                    createdAt: {
                        gte: fromDate,
                        lte: toDate,
                    },
                    status: {
                        in: [
                            enums_1.OrderStatus.PAID,
                            enums_1.OrderStatus.SHIPPED,
                            enums_1.OrderStatus.DELIVERED,
                        ],
                    },
                },
            },
            select: {
                price: true,
                quantity: true,
                order: {
                    select: {
                        createdAt: true,
                    },
                },
            },
        });
        const salesMap = new Map();
        for (let i = 0; i < months; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            salesMap.set(key, 0);
        }
        for (const item of salesItems) {
            const date = item.order.createdAt;
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            const current = salesMap.get(key) ?? 0;
            salesMap.set(key, current + item.price * item.quantity);
        }
        const salesOverview = Array.from(salesMap.entries()).map(([key, sales]) => {
            const [year, month] = key.split("-").map(Number);
            const date = new Date(year, month, 1);
            return {
                name: date.toLocaleString("en-US", {
                    month: "short",
                }),
                year,
                month: month + 1,
                sales: Number(sales.toFixed(2)),
            };
        });
        // --------------------------------------------------
        // Customers Growth
        // --------------------------------------------------
        const customerOrders = await prisma_1.prisma.order.findMany({
            where: {
                createdAt: {
                    gte: fromDate,
                    lte: toDate,
                },
                items: {
                    some: {
                        product: {
                            vendorId,
                        },
                    },
                },
            },
            select: {
                userId: true,
                createdAt: true,
            },
        });
        const customerMap = new Map();
        for (let i = 0; i < months; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            customerMap.set(key, new Set());
        }
        for (const order of customerOrders) {
            const date = order.createdAt;
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            if (!customerMap.has(key)) {
                customerMap.set(key, new Set());
            }
            customerMap
                .get(key)
                .add(order.userId);
        }
        const customersGrowth = Array.from(customerMap.entries()).map(([key, users]) => {
            const [year, month] = key.split("-").map(Number);
            const date = new Date(year, month, 1);
            return {
                month: date.toLocaleString("en-US", {
                    month: "short",
                }),
                year,
                customers: users.size,
            };
        });
        // --------------------------------------------------
        // Recent Activity
        // --------------------------------------------------
        const [recentOrders, recentProducts, recentBannerRequests, recentPromoRequests,] = await Promise.all([
            prisma_1.prisma.order.findMany({
                where: {
                    items: {
                        some: {
                            product: {
                                vendorId,
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
                select: {
                    id: true,
                    createdAt: true,
                    status: true,
                },
            }),
            prisma_1.prisma.product.findMany({
                where: {
                    vendorId,
                },
                orderBy: {
                    updatedAt: "desc",
                },
                take: 5,
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma_1.prisma.bannerRequest.findMany({
                where: {
                    vendorId,
                },
                orderBy: {
                    updatedAt: "desc",
                },
                take: 5,
                select: {
                    id: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    product: {
                        select: {
                            title: true,
                        },
                    },
                },
            }),
            prisma_1.prisma.promoBannerRequest.findMany({
                where: {
                    vendorId,
                },
                orderBy: {
                    updatedAt: "desc",
                },
                take: 5,
                select: {
                    id: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    product: {
                        select: {
                            title: true,
                        },
                    },
                },
            }),
        ]);
        const recentActivity = [
            ...recentOrders.map((order) => ({
                id: `order-${order.id}`,
                type: "ORDER",
                title: "New Order Received",
                createdAt: order.createdAt,
                metadata: {
                    orderId: order.id,
                    status: order.status,
                },
            })),
            ...recentProducts.map((product) => ({
                id: `product-${product.id}`,
                type: "PRODUCT",
                title: "Product Updated",
                createdAt: product.updatedAt,
                metadata: {
                    productId: product.id,
                    productTitle: product.title,
                },
            })),
            ...recentBannerRequests.map((request) => ({
                id: `banner-${request.id}`,
                type: "BANNER_REQUEST",
                title: `Banner Request ${request.status.toLowerCase()}`,
                createdAt: request.updatedAt,
                metadata: {
                    requestId: request.id,
                    productTitle: request.product.title,
                    status: request.status,
                },
            })),
            ...recentPromoRequests.map((request) => ({
                id: `promo-${request.id}`,
                type: "PROMO_REQUEST",
                title: `Promo Request ${request.status.toLowerCase()}`,
                createdAt: request.updatedAt,
                metadata: {
                    requestId: request.id,
                    productTitle: request.product.title,
                    status: request.status,
                },
            })),
        ]
            .sort((a, b) => b.createdAt.getTime() -
            a.createdAt.getTime())
            .slice(0, 5);
        // --------------------------------------------------
        // Final Response
        // --------------------------------------------------
        return {
            stats: {
                totalRevenue: Number(totalRevenue.toFixed(2)),
                totalOrders,
                totalCustomers,
                totalProducts,
            },
            salesOverview,
            ordersStatus,
            customersGrowth,
            recentActivity,
        };
    },
};
exports.default = VendorAnalyticsService;
