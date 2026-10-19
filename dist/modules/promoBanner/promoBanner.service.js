"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../utils/AppError");
const PromoBannerService = {
    // Get All Promo Banners - Admin
    getAll: async function getAllPromoBanners() {
        return await prisma_1.prisma.promoBanner.findMany({
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
        return await prisma_1.prisma.promoBanner.findMany({
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
    getById: async function getOnePromoBanner(id) {
        const promoBanner = await prisma_1.prisma.promoBanner.findUnique({
            where: { id },
            include: {
                product: true,
                vendor: true,
            },
        });
        if (!promoBanner) {
            throw new AppError_1.AppError("Promo Banner not found", 404);
        }
        return promoBanner;
    },
    // Update One Promo Banner
    update: async function updatePromoBanner(id, data) {
        const promoBanner = await prisma_1.prisma.promoBanner.findUnique({
            where: { id },
        });
        if (!promoBanner) {
            throw new AppError_1.AppError("Promo Banner not found", 404);
        }
        return await prisma_1.prisma.promoBanner.update({
            where: { id },
            data,
            include: {
                product: true,
                vendor: true,
            },
        });
    },
    // Delete One Promo Banner
    delete: async function deletePromoBanner(id) {
        const promoBanner = await prisma_1.prisma.promoBanner.findUnique({
            where: { id },
        });
        if (!promoBanner) {
            throw new AppError_1.AppError("Promo Banner not found", 404);
        }
        await prisma_1.prisma.promoBanner.delete({
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
exports.default = PromoBannerService;
