import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { generateSKU } from "../../utils/generateSKU";

export const VariantService = {
    addVariant: async function (productId: string, data: any, vendorId: string) {
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
                vendorId,
            },
        });

        if (!product) {
            throw new AppError(
                "Product not found",
                404
            );
        }

        const variant = await prisma.productVariant.create({
            data: {
                sku: generateSKU(
                product.title,
                data.sizeId,
                data.colorId
                ),

                price: Number(data.price),

                discountPrice: data.discountPrice
                ? Number(data.discountPrice)
                : null,

                stock: Number(data.stock),

                sizeId: data.sizeId || null,

                colorId: data.colorId || null,

                productId,
            },

            include: {
                size: true,
                color: true,
                },
        });

        await prisma.product.update({
            where: {
                id: productId,
            },
            data: {
                isPublished: true,
            },
        });

        return variant;

        // return prisma.productVariant.create({
        //     data: {
        //         sku: generateSKU(
        //         product.title,
        //         data.sizeId,
        //         data.colorId
        //         ),
        //         price: Number(data.price),
        //         discountPrice: data.discountPrice
        //         ? Number(data.discountPrice)
        //         : null,
        //         stock: Number(data.stock),
        //         sizeId: data.sizeId || null,
        //         colorId: data.colorId || null,
        //         productId,
        //     },

        //     include: {
        //         size: true,
        //         color: true,
        //     },
        // });
    },

    getProductVariants: async function (productId: string, vendorId: string) {
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
                vendorId,
            },
        });

        if (!product) {
            throw new AppError(
                "Product not found",
                404
            );
        }

        return prisma.productVariant.findMany({
            where: {
                productId,
            },

            include: {
                size: true,
                color: true,
            },
        });
    },

    updateVariant: async function (variantId: string, data: any, vendorId: string) {
        const variant = await prisma.productVariant.findUnique({
            where: {
                id: variantId,
            },

            include: {
                product: true,
            },
        });

        if (!variant) {
            throw new AppError(
                "Variant not found",
                404
            );
        }

        if (variant.product.vendorId !== vendorId) {
            throw new AppError(
                "Unauthorized",
                403
            );
        }

        return prisma.productVariant.update({
            where: {
                id: variantId,
            },

            data: {
                price:
                data.price !== undefined
                    ? Number(data.price)
                    : undefined,

                discountPrice:
                data.discountPrice !== undefined
                    ? Number(data.discountPrice)
                    : undefined,

                stock:
                data.stock !== undefined
                    ? Number(data.stock)
                    : undefined,

                sizeId: data.sizeId,
                colorId: data.colorId,
            },

            include: {
                size: true,
                color: true,
            },
            });
    },

    deleteVariant: async function (variantId: string, vendorId: string) {
        const variant = await prisma.productVariant.findUnique({
            where: {
                id: variantId,
            },

            include: {
                product: true,
            },
        });

        if (!variant) {
            throw new AppError(
                "Variant not found",
                404
            );
        }

        if (variant.product.vendorId !== vendorId) {
            throw new AppError(
                "Unauthorized",
                403
            );
        }

        return prisma.productVariant.delete({
            where: {
                id: variantId,
            },
        });
    },

}

  