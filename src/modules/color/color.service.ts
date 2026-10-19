import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

export const ColorService = {
    create: async function (name: string, hexCode: string | null) {
        
        const lowerCaseName = name.trim().toLowerCase();

        const existingColor = await prisma.color.findFirst({
            where:{
                name: lowerCaseName,
                hexCode: hexCode ?? null
            }
        })

        if(existingColor){
            throw new AppError(
                "Color already exists",
                400
            );
        }

        return(
            await prisma.color.create({
                data: {
                    name: lowerCaseName,
                    hexCode: hexCode ?? null
                }
            })
        )
    },

    getAll: async function () {
        return prisma.color.findMany({
            orderBy: {
                name: "asc",
            },
        });    
    },

    update: async function (id: string, name?: string, hexCode?: string | null) {
        
        const color = await prisma.color.findUnique({
            where: { id },
        });

        if (!color) {
            throw new AppError("Color not found", 404);
        }

        if (name) {
            const existingColor = await prisma.color.findFirst({
                where: {
                    name: name.trim().toLowerCase(),
                    NOT: {
                        id,
                    },
                },
        });

            if (existingColor) {
                throw new AppError("Color already exists", 400);
            }
        }

        return prisma.color.update({
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


    delete: async function (id: string) {
        const color = await prisma.color.findUnique({
            where: { id },
            include: {
                variants: true,
            },
        });

        if (!color) {
            throw new AppError("Color not found", 404);
        }

        if (color?.variants.length) {
            throw new AppError(
                "Cannot delete color because it is used by products",
                400
            );
        }

        return prisma.color.delete({
            where: { id },
        });
    },


}