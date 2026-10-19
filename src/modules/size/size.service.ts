import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError";

export const SizeService = {
    create: async function(data: any) {

        const upperCaseName = data.name.trim().toUpperCase();

        const exists = await prisma.size.findUnique({
            where: {
                name: upperCaseName 
            },
        })

        if (exists) {
            throw new AppError(
                "Size already exists",
                400
            );
        }

        return prisma.size.create({
            data:{
                name: upperCaseName
            }
        })
    },

    getAll: async function () {
        return prisma.size.findMany({
            orderBy: {
                name: "asc",
            },
        });    
    },

    update: async function (id: string, data: any) {

        const size = await prisma.size.findUnique({
            where: { id },
        });

        if (!size) {
            throw new AppError("Size not found", 404);
        }

        return prisma.size.update({
            where: { id },
            data: {
                name: data.name.trim().toUpperCase(),
            },
        });
    },



    delete: async function (id: string) {
        const size = await prisma.size.findUnique({
            where: { id },
            include: {
                variants: true,
            },
        });

        if (!size) {
            throw new AppError(
                "Size not found",
                404
            );
        }

        if (size?.variants.length) {
            throw new AppError(
                "Cannot delete size because it is used by products",
                400
            );
        }

        return prisma.size.delete({
            where: { id },
        });
    },
}