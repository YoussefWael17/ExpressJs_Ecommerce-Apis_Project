"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantService = void 0;
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../utils/AppError");
const generateSKU_1 = require("../../utils/generateSKU");
exports.VariantService = {
    addVariant: async function (productId, data, vendorId) {
        const product = await prisma_1.prisma.product.findFirst({
            where: {
                id: productId,
                vendorId,
            },
        });
        if (!product) {
            throw new AppError_1.AppError("Product not found", 404);
        }
        const variant = await prisma_1.prisma.productVariant.create({
            data: {
                sku: (0, generateSKU_1.generateSKU)(product.title, data.sizeId, data.colorId),
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
        await prisma_1.prisma.product.update({
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
    getProductVariants: async function (productId, vendorId) {
        const product = await prisma_1.prisma.product.findFirst({
            where: {
                id: productId,
                vendorId,
            },
        });
        if (!product) {
            throw new AppError_1.AppError("Product not found", 404);
        }
        return prisma_1.prisma.productVariant.findMany({
            where: {
                productId,
            },
            include: {
                size: true,
                color: true,
            },
        });
    },
    updateVariant: async function (variantId, data, vendorId) {
        const variant = await prisma_1.prisma.productVariant.findUnique({
            where: {
                id: variantId,
            },
            include: {
                product: true,
            },
        });
        if (!variant) {
            throw new AppError_1.AppError("Variant not found", 404);
        }
        if (variant.product.vendorId !== vendorId) {
            throw new AppError_1.AppError("Unauthorized", 403);
        }
        return prisma_1.prisma.productVariant.update({
            where: {
                id: variantId,
            },
            data: {
                price: data.price !== undefined
                    ? Number(data.price)
                    : undefined,
                discountPrice: data.discountPrice !== undefined
                    ? Number(data.discountPrice)
                    : undefined,
                stock: data.stock !== undefined
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
    deleteVariant: async function (variantId, vendorId) {
        const variant = await prisma_1.prisma.productVariant.findUnique({
            where: {
                id: variantId,
            },
            include: {
                product: true,
            },
        });
        if (!variant) {
            throw new AppError_1.AppError("Variant not found", 404);
        }
        if (variant.product.vendorId !== vendorId) {
            throw new AppError_1.AppError("Unauthorized", 403);
        }
        return prisma_1.prisma.productVariant.delete({
            where: {
                id: variantId,
            },
        });
    },
};
