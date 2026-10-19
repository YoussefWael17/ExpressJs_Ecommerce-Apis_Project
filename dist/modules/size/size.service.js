"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeService = void 0;
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../utils/AppError");
exports.SizeService = {
    create: async function (data) {
        const upperCaseName = data.name.trim().toUpperCase();
        const exists = await prisma_1.prisma.size.findUnique({
            where: {
                name: upperCaseName
            },
        });
        if (exists) {
            throw new AppError_1.AppError("Size already exists", 400);
        }
        return prisma_1.prisma.size.create({
            data: {
                name: upperCaseName
            }
        });
    },
    getAll: async function () {
        return prisma_1.prisma.size.findMany({
            orderBy: {
                name: "asc",
            },
        });
    },
    update: async function (id, data) {
        const size = await prisma_1.prisma.size.findUnique({
            where: { id },
        });
        if (!size) {
            throw new AppError_1.AppError("Size not found", 404);
        }
        return prisma_1.prisma.size.update({
            where: { id },
            data: {
                name: data.name.trim().toUpperCase(),
            },
        });
    },
    delete: async function (id) {
        const size = await prisma_1.prisma.size.findUnique({
            where: { id },
            include: {
                variants: true,
            },
        });
        if (!size) {
            throw new AppError_1.AppError("Size not found", 404);
        }
        if (size?.variants.length) {
            throw new AppError_1.AppError("Cannot delete size because it is used by products", 400);
        }
        return prisma_1.prisma.size.delete({
            where: { id },
        });
    },
};
