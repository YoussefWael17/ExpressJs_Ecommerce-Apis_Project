"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSize = void 0;
const prisma_1 = require("../../../lib/prisma");
const AppError_1 = require("../../../utils/AppError");
const normalize_1 = require("../../../utils/normalize");
const resolveSize = async (sizeName, userRole) => {
    const name = (0, normalize_1.normalize)(sizeName);
    let size = await prisma_1.prisma.size.findFirst({
        where: { name },
    });
    if (!size) {
        if (userRole === "ADMIN") {
            size = await prisma_1.prisma.size.create({
                data: { name },
            });
        }
        else {
            throw new AppError_1.AppError(`Size "${name}" not found`, 400);
        }
    }
    return size;
};
exports.resolveSize = resolveSize;
