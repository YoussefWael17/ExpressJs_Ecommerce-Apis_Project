import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

const PromoBannerService = {

    // Get All Promo Banners - Admin
    getAll: async function getAllPromoBanners() {
        return await prisma.promoBanner.findMany({
            include: {
                product: true,
                vendor: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    // Get Active Promo Banners - Customer
    getActive: async function getActivePromoBanners() {
        const now = new Date();

        return await prisma.promoBanner.findMany({
            where: {
                isActive: true,
                startDate: {
                    lte: now,
                },
                endDate: {
                    gte: now,
                },
            },
            include: {
                product: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    },

    // Get One Promo Banner
    getById: async function getOnePromoBanner(id: string) {

        const promoBanner = await prisma.promoBanner.findUnique({
            where: { id },
            include: {
                product: true,
                vendor: true,
            },
        });

        if (!promoBanner) {
            throw new AppError("Promo Banner not found", 404);
        }

        return promoBanner;
    },

    // Update One Promo Banner
    update: async function updatePromoBanner(
        id: string,
        data: Partial<{
            title: string;
            subtitle: string;
            image: string;
            buttonText: string;
            buttonLink: string;
            offerPercentage: number;
            startDate: Date;
            endDate: Date;
            backgroundColor: string;
            isActive: boolean;
        }>
    ) {

        const promoBanner = await prisma.promoBanner.findUnique({
            where: { id },
        });

        if (!promoBanner) {
            throw new AppError("Promo Banner not found", 404);
        }

        return await prisma.promoBanner.update({
            where: { id },
            data,
            include: {
                product: true,
                vendor: true,
            },
        });
    },

    // Delete One Promo Banner
    delete: async function deletePromoBanner(id: string) {

        const promoBanner = await prisma.promoBanner.findUnique({
            where: { id },
        });

        if (!promoBanner) {
            throw new AppError("Promo Banner not found", 404);
        }

        await prisma.promoBanner.delete({
            where: { id },
        });

        return {
            message: "Promo Banner deleted successfully",
        };
    },

    // Toggle Active Status
    // toggleStatus: async function togglePromoBannerStatus(id: string) {

    //     const promoBanner = await prisma.promoBanner.findUnique({
    //         where: { id },
    //     });

    //     if (!promoBanner) {
    //         throw new AppError("Promo Banner not found", 404);
    //     }

    //     return await prisma.promoBanner.update({
    //         where: { id },
    //         data: {
    //             isActive: !promoBanner.isActive,
    //         },
    //     });
    // },
};

export default PromoBannerService;