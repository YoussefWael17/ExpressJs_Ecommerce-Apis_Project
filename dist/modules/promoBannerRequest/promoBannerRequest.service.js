"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoBannerRequestService = void 0;
const enums_1 = require("../../generated/prisma/enums");
const prisma_1 = require("../../lib/prisma");
const socket_1 = require("../../lib/socket");
const AppError_1 = require("../../utils/AppError");
exports.PromoBannerRequestService = {
    // =========================================================
    // CREATE PROMO BANNER REQUEST - VENDOR
    // =========================================================
    create: async function (vendorId, productId, offerPercentage, startDate, endDate, backgroundColor, note) {
        // Check product exists
        const product = await prisma_1.prisma.product.findUnique({
            where: {
                id: productId,
            },
        });
        if (!product) {
            throw new AppError_1.AppError("Product not found.", 404);
        }
        // Check if vendor owns the product
        if (product.vendorId !== vendorId) {
            throw new AppError_1.AppError("You are not allowed to create a promo banner request for this product.", 403);
        }
        // Validate offer percentage
        if (offerPercentage < 0 || offerPercentage > 100) {
            throw new AppError_1.AppError("Offer percentage must be between 0 and 100.", 400);
        }
        // Validate dates
        if (startDate >= endDate) {
            throw new AppError_1.AppError("End date must be after start date.", 400);
        }
        // Check existing pending request for the same product
        const existingRequest = await prisma_1.prisma.promoBannerRequest.findFirst({
            where: {
                productId,
                status: enums_1.BannerRequestStatus.PENDING,
            },
        });
        if (existingRequest) {
            throw new AppError_1.AppError("A promo banner request for this product already exists.", 400);
        }
        // Create request
        const request = await prisma_1.prisma.promoBannerRequest.create({
            data: {
                vendorId,
                productId,
                offerPercentage,
                startDate,
                endDate,
                backgroundColor,
                note,
            },
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                product: {
                    select: {
                        id: true,
                        title: true,
                        thumbnail: true,
                        salePercentage: true,
                    },
                },
            },
        });
        // Notify admins
        (0, socket_1.getIO)()
            .to("admins")
            .emit("new-promo-banner-request", request);
        return request;
    },
    // =========================================================
    // GET VENDOR REQUESTS
    // =========================================================
    getAllVendorRequests: async function (page = 1, limit = 10, vendorId, searchTerm) {
        const skip = (page - 1) * limit;
        const whereCondition = {
            vendorId,
        };
        if (searchTerm?.trim()) {
            const search = searchTerm.trim();
            const upperSearch = search.toUpperCase();
            whereCondition.OR = [
                {
                    id: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    product: {
                        title: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
            ];
            if (Object.values(enums_1.BannerRequestStatus).includes(upperSearch)) {
                whereCondition.OR.push({
                    status: upperSearch,
                });
            }
        }
        const [promoBannerRequests, total, statusCounts,] = await Promise.all([
            prisma_1.prisma.promoBannerRequest.findMany({
                where: whereCondition,
                include: {
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            title: true,
                            thumbnail: true,
                            salePercentage: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),
            prisma_1.prisma.promoBannerRequest.count({
                where: whereCondition,
            }),
            prisma_1.prisma.promoBannerRequest.groupBy({
                by: ["status"],
                where: whereCondition,
                _count: {
                    status: true,
                },
            }),
        ]);
        const stats = {
            pending: 0,
            approved: 0,
            rejected: 0,
        };
        statusCounts.forEach((item) => {
            switch (item.status) {
                case enums_1.BannerRequestStatus.PENDING:
                    stats.pending = item._count.status;
                    break;
                case enums_1.BannerRequestStatus.APPROVED:
                    stats.approved = item._count.status;
                    break;
                case enums_1.BannerRequestStatus.REJECTED:
                    stats.rejected = item._count.status;
                    break;
            }
        });
        const totalPages = Math.ceil(total / limit);
        return {
            promoBannerRequests,
            pagination: {
                total,
                ...stats,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
    },
    // =========================================================
    // GET VENDOR REQUEST BY ID
    // =========================================================
    getVendorRequestById: async function (requestId, vendorId) {
        const promoBannerRequest = await prisma_1.prisma.promoBannerRequest.findFirst({
            where: {
                id: requestId,
                vendorId,
            },
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                product: {
                    select: {
                        id: true,
                        title: true,
                        thumbnail: true,
                        salePercentage: true,
                    },
                },
            },
        });
        if (!promoBannerRequest) {
            throw new AppError_1.AppError("Promo banner request not found.", 404);
        }
        return promoBannerRequest;
    },
    // =========================================================
    // GET ALL REQUESTS - ADMIN
    // =========================================================
    getAll: async function (page = 1, limit = 10, searchTerm) {
        const skip = (page - 1) * limit;
        const whereCondition = {};
        if (searchTerm?.trim()) {
            const search = searchTerm.trim();
            const upperSearch = search.toUpperCase();
            whereCondition.OR = [
                {
                    id: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    vendor: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    vendor: {
                        email: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    product: {
                        title: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
            ];
            if (Object.values(enums_1.BannerRequestStatus).includes(upperSearch)) {
                whereCondition.OR.push({
                    status: upperSearch,
                });
            }
        }
        const [promoBannerRequests, total, statusCounts,] = await Promise.all([
            prisma_1.prisma.promoBannerRequest.findMany({
                where: whereCondition,
                include: {
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            title: true,
                            thumbnail: true,
                            salePercentage: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),
            prisma_1.prisma.promoBannerRequest.count({
                where: whereCondition,
            }),
            prisma_1.prisma.promoBannerRequest.groupBy({
                by: ["status"],
                where: whereCondition,
                _count: {
                    status: true,
                },
            }),
        ]);
        const stats = {
            pending: 0,
            approved: 0,
            rejected: 0,
        };
        statusCounts.forEach((item) => {
            switch (item.status) {
                case enums_1.BannerRequestStatus.PENDING:
                    stats.pending = item._count.status;
                    break;
                case enums_1.BannerRequestStatus.APPROVED:
                    stats.approved = item._count.status;
                    break;
                case enums_1.BannerRequestStatus.REJECTED:
                    stats.rejected = item._count.status;
                    break;
            }
        });
        const totalPages = Math.ceil(total / limit);
        return {
            promoBannerRequests,
            pagination: {
                total,
                ...stats,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
    },
    // =========================================================
    // APPROVE REQUEST - ADMIN
    // =========================================================
    approve: async function (requestId) {
        return prisma_1.prisma.$transaction(async (tx) => {
            // Get request
            const request = await tx.promoBannerRequest.findUnique({
                where: {
                    id: requestId,
                },
                include: {
                    product: true,
                },
            });
            if (!request) {
                throw new AppError_1.AppError("Promo banner request not found.", 404);
            }
            // Make sure it is still pending
            if (request.status !==
                enums_1.BannerRequestStatus.PENDING) {
                throw new AppError_1.AppError("This request has already been processed.", 400);
            }
            // Check if product already has a promo banner
            const existingBanner = await tx.promoBanner.findFirst({
                where: {
                    productId: request.productId,
                    // Only block currently existing promo banners
                    isActive: true,
                },
            });
            if (existingBanner) {
                throw new AppError_1.AppError("This product already has an active promo banner.", 400);
            }
            // Create Promo Banner
            const promoBanner = await tx.promoBanner.create({
                data: {
                    title: request.product.title,
                    subtitle: request.product.description ?? null,
                    image: request.product.thumbnail,
                    buttonText: "Buy Now",
                    buttonLink: `/products/${request.product.id}`,
                    offerPercentage: request.offerPercentage,
                    startDate: request.startDate,
                    endDate: request.endDate,
                    backgroundColor: request.backgroundColor,
                    productId: request.productId,
                    vendorId: request.vendorId,
                    isActive: true,
                },
                include: {
                    product: true,
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            // Update request status
            await tx.promoBannerRequest.update({
                where: {
                    id: requestId,
                },
                data: {
                    status: enums_1.BannerRequestStatus.APPROVED,
                },
            });
            // Notify the vendor after the transaction succeeds
            (0, socket_1.getIO)()
                .to(`vendor:${promoBanner.vendorId}`)
                .emit("promo-banner-request-approved", {
                requestId,
                productId: promoBanner.productId,
                productTitle: promoBanner.product?.title,
                status: enums_1.BannerRequestStatus.APPROVED,
                message: `Your promo banner request for "${promoBanner.product?.title}" has been approved.`,
                promoBanner: promoBanner,
            });
            return promoBanner;
        });
    },
    // =========================================================
    // REJECT REQUEST - ADMIN
    // =========================================================
    reject: async function (requestId) {
        const request = await prisma_1.prisma.promoBannerRequest.findUnique({
            where: {
                id: requestId,
            },
        });
        if (!request) {
            throw new AppError_1.AppError("Promo banner request not found.", 404);
        }
        if (request.status !==
            enums_1.BannerRequestStatus.PENDING) {
            throw new AppError_1.AppError("This request has already been processed.", 400);
        }
        const rejectedRequest = await prisma_1.prisma.promoBannerRequest.update({
            where: {
                id: requestId,
            },
            data: {
                status: enums_1.BannerRequestStatus.REJECTED,
            },
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                product: {
                    select: {
                        id: true,
                        title: true,
                        thumbnail: true,
                        salePercentage: true,
                    },
                },
            },
        });
        const room = `vendor:${rejectedRequest.vendorId}`;
        const roomSockets = (0, socket_1.getIO)().sockets.adapter.rooms.get(room);
        console.log("Rejecting promo banner request:", {
            requestId,
            vendorId: rejectedRequest.vendorId,
            room,
            connectedSocketsInRoom: roomSockets?.size ?? 0,
        });
        const io = (0, socket_1.getIO)();
        io.to(room).emit("promo-banner-request-rejected", {
            requestId,
            productId: rejectedRequest.productId,
            productTitle: rejectedRequest.product.title,
            status: enums_1.BannerRequestStatus.REJECTED,
            message: `Your promo banner request for "${rejectedRequest.product.title}" has been rejected.`,
            request: rejectedRequest,
        });
        console.log("Rejection event emitted:", {
            event: "promo-banner-request-rejected",
            room,
        });
        // getIO()
        // .to(`vendor:${rejectedRequest.vendorId}`)
        // .emit("promo-banner-request-rejected", {
        //   requestId,
        //   productId: rejectedRequest.productId,
        //   productTitle: rejectedRequest.product.title,
        //   status: BannerRequestStatus.REJECTED,
        //   message: `Your promo banner request for "${rejectedRequest.product.title}" has been rejected.`,
        //   request: rejectedRequest,
        // });
        return rejectedRequest;
    },
    // =========================================================
    // DELETE REQUEST - VENDOR
    // =========================================================
    delete: async function (vendorId, requestId) {
        const existingRequest = await prisma_1.prisma.promoBannerRequest.findFirst({
            where: {
                vendorId,
                id: requestId,
            },
        });
        if (!existingRequest) {
            throw new AppError_1.AppError("Promo banner request does not exist.", 404);
        }
        // Optional:
        // Prevent vendor from deleting approved/rejected requests
        if (existingRequest.status !==
            enums_1.BannerRequestStatus.PENDING) {
            throw new AppError_1.AppError("Only pending promo banner requests can be deleted.", 400);
        }
        const deletedRequest = await prisma_1.prisma.promoBannerRequest.delete({
            where: {
                id: requestId,
            },
        });
        (0, socket_1.getIO)()
            .to("admins")
            .emit("promo-banner-request-deleted", deletedRequest);
        return deletedRequest;
    },
};
