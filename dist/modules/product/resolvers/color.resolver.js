"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveColor = void 0;
const prisma_1 = require("../../../lib/prisma");
const AppError_1 = require("../../../utils/AppError");
const normalize_1 = require("../../../utils/normalize");
const resolveColor = async (colorName, userRole) => {
    const name = (0, normalize_1.normalize)(colorName);
    let color = await prisma_1.prisma.color.findFirst({
        where: { name },
    });
    if (!color) {
        if (userRole === "ADMIN") {
            color = await prisma_1.prisma.color.create({
                data: { name },
            });
        }
        else {
            throw new AppError_1.AppError(`Color "${name}" not found`, 400);
        }
    }
    return color;
};
exports.resolveColor = resolveColor;
