"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorService = void 0;
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../utils/AppError");
exports.ColorService = {
    create: async function (name, hexCode) {
        const lowerCaseName = name.trim().toLowerCase();
        const existingColor = await prisma_1.prisma.color.findFirst({
            where: {
                name: lowerCaseName,
                hexCode: hexCode ?? null
            }
        });
        if (existingColor) {
            throw new AppError_1.AppError("Color already exists", 400);
        }
        return (await prisma_1.prisma.color.create({
            data: {
                name: lowerCaseName,
                hexCode: hexCode ?? null
            }
        }));
    },
    getAll: async function () {
        return prisma_1.prisma.color.findMany({
            orderBy: {
                name: "asc",
            },
        });
    },
    update: async function (id, name, hexCode) {
        const color = await prisma_1.prisma.color.findUnique({
            where: { id },
        });
        if (!color) {
            throw new AppError_1.AppError("Color not found", 404);
        }
        if (name) {
            const existingColor = await prisma_1.prisma.color.findFirst({
                where: {
                    name: name.trim().toLowerCase(),
                    NOT: {
                        id,
                    },
                },
            });
            if (existingColor) {
                throw new AppError_1.AppError("Color already exists", 400);
            }
        }
        return prisma_1.prisma.color.update({
            where: { id },
            data: {
                ...(name && {
                    name: name.trim().toLowerCase(),
                }),
                ...(hexCode !== undefined && {
                    hexCode: hexCode,
                }),
            },
        });
    },
    delete: async function (id) {
        const color = await prisma_1.prisma.color.findUnique({
            where: { id },
            include: {
                variants: true,
            },
        });
        if (!color) {
            throw new AppError_1.AppError("Color not found", 404);
        }
        if (color?.variants.length) {
            throw new AppError_1.AppError("Cannot delete color because it is used by products", 400);
        }
        return prisma_1.prisma.color.delete({
            where: { id },
        });
    },
};
