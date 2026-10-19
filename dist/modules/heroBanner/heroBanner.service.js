"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../utils/AppError");
const HeroBannerService = {
    // Get All Hero Banners
    getAll: async () => {
        return prisma_1.prisma.heroBanner.findMany({
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
            orderBy: {
                order: "asc",
            },
        });
    },
    // Get One Hero Banner
    getById: async (id) => {
        const banner = await prisma_1.prisma.heroBanner.findUnique({
            where: { id },
            include: {
                product: true,
                vendor: true,
            },
        });
        if (!banner) {
            throw new AppError_1.AppError("Hero Banner not found", 404);
        }
        return banner;
    },
    // Create Hero Banner
    // create: async (data: {
    //   title: string;
    //   subtitle?: string;
    //   image: string;
    //   buttonText?: string;
    //   buttonLink: string;
    //   order?: number;
    //   isActive?: boolean;
    //   productId?: string;
    //   vendorId?: string;
    // }) => {
    //   return prisma.heroBanner.create({
    //     data,
    //   });
    // },
    // Update Hero Banner
    update: async (id, data) => {
        const banner = await prisma_1.prisma.heroBanner.findUnique({
            where: { id },
        });
        if (!banner) {
            throw new AppError_1.AppError("Hero Banner not found", 404);
        }
        return prisma_1.prisma.heroBanner.update({
            where: { id },
            data,
        });
    },
    // Delete Hero Banner
    delete: async (id) => {
        const banner = await prisma_1.prisma.heroBanner.findUnique({
            where: { id },
        });
        if (!banner) {
            throw new AppError_1.AppError("Hero Banner not found", 404);
        }
        await prisma_1.prisma.heroBanner.delete({
            where: { id },
        });
    },
    // Toggle Active
    toggleStatus: async (id) => {
        const banner = await prisma_1.prisma.heroBanner.findUnique({
            where: { id },
        });
        if (!banner) {
            throw new AppError_1.AppError("Hero Banner not found", 404);
        }
        return prisma_1.prisma.heroBanner.update({
            where: { id },
            data: {
                isActive: !banner.isActive,
            },
        });
    },
};
exports.default = HeroBannerService;
