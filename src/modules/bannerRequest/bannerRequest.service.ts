import { BannerRequestStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { getIO } from "../../lib/socket";
import { AppError } from "../../utils/AppError";



export const BannerRequestService = {
    
    create: async function ( vendorId: string, productId: string, note?: string, icon?: string, offerPercentage?: number ) {

        const existingRequest = await prisma.bannerRequest.findFirst({
            where: {
                productId,
                status: "PENDING"
            }
        });

        if (existingRequest) {
            throw new AppError("A banner request for this product already exists.", 400);
        }

        const request = await prisma.bannerRequest.create({
            data: {
                vendorId,
                productId,
                note,
                icon, 
                offerPercentage
            }
        });

        getIO().to("admins").emit("new-banner-request", request);

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

    getAllVendorRequests: async function (
    page = 1,
    limit = 10,
    vendorId: string,
    searchTerm?: string
    ) {
    const skip = (page - 1) * limit;

    const whereCondition: any = {
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

        if (
        Object.values(BannerRequestStatus).includes(
            upperSearch as BannerRequestStatus
        )
        ) {
        whereCondition.OR.push({
            status: upperSearch as BannerRequestStatus,
        });
        }
    }

    const [bannerRequests, total, statusCounts] = await Promise.all([
        prisma.bannerRequest.findMany({
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

        prisma.bannerRequest.count({
        where: whereCondition,
        }),

        prisma.bannerRequest.groupBy({
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
        case BannerRequestStatus.PENDING:
            stats.pending = item._count.status;
            break;

        case BannerRequestStatus.APPROVED:
            stats.approved = item._count.status;
            break;

        case BannerRequestStatus.REJECTED:
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

    getVendorRequestById: async function ( requestId: string, vendorId: string) {
        const bannerRequest = await prisma.bannerRequest.findFirst({
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
            throw new AppError(
            "Banner request not found.",
            404
            );
        }

        return bannerRequest;
        },



    getAll: async function ( page = 1, limit = 10, searchTerm?: string) {

        const skip = (page - 1) * limit;

        const whereCondition: any = {};

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

            if (
            Object.values(BannerRequestStatus).includes(
                upperSearch as BannerRequestStatus
            )
            ) {
            whereCondition.OR.push({
                status: upperSearch as BannerRequestStatus,
            });
            }
        }

        const [bannerRequests, total, statusCounts] = await Promise.all([

            prisma.bannerRequest.findMany({

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

            prisma.bannerRequest.count({
            where: whereCondition,
            }),

            prisma.bannerRequest.groupBy({
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

            case BannerRequestStatus.PENDING:
                stats.pending = item._count.status;
                break;

            case BannerRequestStatus.APPROVED:
                stats.approved = item._count.status;
                break;

            case BannerRequestStatus.REJECTED:
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

    approve: async function ( requestId: string ) {

        return prisma.$transaction(async (tx) => {

            const request = await tx.bannerRequest.findUnique({
                where: { id: requestId },
                include: { product: true },
            });

            if (!request) {
                throw new AppError("Request not found", 404);
            }

            if (request.status !== BannerRequestStatus.PENDING) {
                throw new AppError("This request has already been processed.", 400);
            }

            const existingBanner = await tx.heroBanner.findFirst({
                where: {
                    productId: request.productId,
                },
            });

            if (existingBanner) {
                throw new AppError("This product already has a hero banner.", 400);
            }

            const heroBanner = await tx.heroBanner.create({
                data: {
                    title: request.product.title,
                    image: request.product.thumbnail!,
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
                    status: BannerRequestStatus.APPROVED,
                },
            });

            return heroBanner;
        });

    },

    reject: async function ( requestId: string, note?: string ) {

        return prisma.bannerRequest.update({
            where: {
                id: requestId
            },
            data: {
                status: "REJECTED",
                note
            }
        });

    },

    delete: async function (vendorId: string, requestId: string) {
        const existingRequest = await prisma.bannerRequest.findFirst({
            where: {
                vendorId,
                id: requestId,
            },
        });

        if (!existingRequest) {
            throw new AppError("Banner request does not exist.", 400);
        }

        const deletedRequest = await prisma.bannerRequest.delete({
            where: {
                id: requestId,
            },
        });

        getIO().to("admins").emit("banner-request-deleted", deletedRequest);

        return deletedRequest;
    },

}