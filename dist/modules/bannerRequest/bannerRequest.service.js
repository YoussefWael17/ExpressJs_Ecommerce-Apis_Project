"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerRequestService = void 0;
const enums_1 = require("../../generated/prisma/enums");
const prisma_1 = require("../../lib/prisma");
const socket_1 = require("../../lib/socket");
const AppError_1 = require("../../utils/AppError");
exports.BannerRequestService = {
    create: async function (vendorId, productId, note, icon, offerPercentage) {
        const existingRequest = await prisma_1.prisma.bannerRequest.findFirst({
            where: {
                productId,
                status: "PENDING"
            }
        });
        if (existingRequest) {
            throw new AppError_1.AppError("A banner request for this product already exists.", 400);
        }
        const request = await prisma_1.prisma.bannerRequest.create({
            data: {
                vendorId,
                productId,
                note,
                icon,
                offerPercentage
            }
        });
        (0, socket_1.getIO)().to("admins").emit("new-banner-request", request);
        return request;
    },
    // getAll: async function () {
    //     return prisma.bannerRequest.findMany({
    //         include: {
    //             vendor: {
    //                 select: {
    //                     id: true,
    //                     name: true,
    //                     email: true
    //                 }
    //             },
    //             product: {
    //                 select: {
    //                     id: true,
    //                     title: true,
    //                     thumbnail: true,
    //                     salePercentage: true
    //                 }
    //             }
    //         },
    //         orderBy: {
    //             createdAt: "desc"
    //         }
    //     });
    // },
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
        const [bannerRequests, total, statusCounts] = await Promise.all([
            prisma_1.prisma.bannerRequest.findMany({
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
            prisma_1.prisma.bannerRequest.count({
                where: whereCondition,
            }),
            prisma_1.prisma.bannerRequest.groupBy({
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
        return {
            bannerRequests,
            pagination: {
                total,
                ...stats,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPreviousPage: page > 1,
            },
        };
    },
    getVendorRequestById: async function (requestId, vendorId) {
        const bannerRequest = await prisma_1.prisma.bannerRequest.findFirst({
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
        if (!bannerRequest) {
            throw new AppError_1.AppError("Banner request not found.", 404);
        }
        return bannerRequest;
    },
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
        const [bannerRequests, total, statusCounts] = await Promise.all([
            prisma_1.prisma.bannerRequest.findMany({
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
            prisma_1.prisma.bannerRequest.count({
                where: whereCondition,
            }),
            prisma_1.prisma.bannerRequest.groupBy({
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
        return {
            bannerRequests,
            pagination: {
                total,
                ...stats,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPreviousPage: page > 1,
            },
        };
    },
    approve: async function (requestId) {
        return prisma_1.prisma.$transaction(async (tx) => {
            const request = await tx.bannerRequest.findUnique({
                where: { id: requestId },
                include: { product: true },
            });
            if (!request) {
                throw new AppError_1.AppError("Request not found", 404);
            }
            if (request.status !== enums_1.BannerRequestStatus.PENDING) {
                throw new AppError_1.AppError("This request has already been processed.", 400);
            }
            const existingBanner = await tx.heroBanner.findFirst({
                where: {
                    productId: request.productId,
                },
            });
            if (existingBanner) {
                throw new AppError_1.AppError("This product already has a hero banner.", 400);
            }
            const heroBanner = await tx.heroBanner.create({
                data: {
                    title: request.product.title,
                    image: request.product.thumbnail,
                    productId: request.productId,
                    vendorId: request.vendorId,
                    icon: request.icon,
                    offerPercentage: request.offerPercentage,
                    buttonLink: `/products/${request.product.id}`,
                },
            });
            await tx.bannerRequest.update({
                where: { id: requestId },
                data: {
                    status: enums_1.BannerRequestStatus.APPROVED,
                },
            });
            return heroBanner;
        });
    },
    reject: async function (requestId, note) {
        return prisma_1.prisma.bannerRequest.update({
            where: {
                id: requestId
            },
            data: {
                status: "REJECTED",
                note
            }
        });
    },
    delete: async function (vendorId, requestId) {
        const existingRequest = await prisma_1.prisma.bannerRequest.findFirst({
            where: {
                vendorId,
                id: requestId,
            },
        });
        if (!existingRequest) {
            throw new AppError_1.AppError("Banner request does not exist.", 400);
        }
        const deletedRequest = await prisma_1.prisma.bannerRequest.delete({
            where: {
                id: requestId,
            },
        });
        (0, socket_1.getIO)().to("admins").emit("banner-request-deleted", deletedRequest);
        return deletedRequest;
    },
};
