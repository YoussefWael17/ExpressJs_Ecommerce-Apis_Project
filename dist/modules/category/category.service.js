"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const prisma_1 = require("../../lib/prisma");
const slugify_1 = __importDefault(require("slugify"));
const AppError_1 = require("../../utils/AppError");
exports.categoryService = {
    /*
    |--------------------------------------------------------------------------
    | Create Category
    |--------------------------------------------------------------------------
    */
    create: async (data) => {
        const slug = (0, slugify_1.default)(data.name, {
            lower: true,
            strict: true,
            trim: true,
        });
        const exists = await prisma_1.prisma.category.findFirst({
            where: {
                OR: [
                    { name: data.name },
                    { slug },
                ],
            },
        });
        if (exists) {
            throw new AppError_1.AppError("Category already exists", 400);
        }
        return prisma_1.prisma.category.create({
            data: {
                name: data.name,
                icon: data.icon,
                slug,
            },
        });
    },
    /*
    |--------------------------------------------------------------------------
    | Get All Categories
    |--------------------------------------------------------------------------
    */
    getAll: async () => {
        return prisma_1.prisma.category.findMany({
            include: {
                products: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    /*
    |--------------------------------------------------------------------------
    | Get Single Category
    |--------------------------------------------------------------------------
    */
    getOne: async (id) => {
        const category = await prisma_1.prisma.category.findUnique({
            where: { id },
            include: {
                products: {
                    include: {
                        variants: true,
                        images: true,
                    },
                },
            },
        });
        if (!category) {
            throw new AppError_1.AppError("Category not found", 404);
        }
        return category;
    },
    /*
    |--------------------------------------------------------------------------
    | Update Category
    |--------------------------------------------------------------------------
    */
    update: async (id, data) => {
        const category = await prisma_1.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new AppError_1.AppError("Category not found", 404);
        }
        const slug = data.name
            ? (0, slugify_1.default)(data.name, {
                lower: true,
                strict: true,
                trim: true,
            })
            : category.slug;
        const exists = await prisma_1.prisma.category.findFirst({
            where: {
                AND: [
                    {
                        NOT: { id },
                    },
                    {
                        OR: [
                            { name: data.name },
                            { slug },
                        ],
                    },
                ],
            },
        });
        if (exists) {
            throw new AppError_1.AppError("Category already exists", 400);
        }
        return prisma_1.prisma.category.update({
            where: { id },
            data: {
                ...data,
                slug,
            },
        });
    },
    /*
    |--------------------------------------------------------------------------
    | Delete Category
    |--------------------------------------------------------------------------
    */
    delete: async (id) => {
        const category = await prisma_1.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new AppError_1.AppError("Category not found", 404);
        }
        // 🧹 delete image from uploads
        // if (category.image) {
        //   const imagePath = path.join(process.cwd(), category.image);
        //   if (fs.existsSync(imagePath)) {
        //     await fs.promises.unlink(imagePath);
        //   }
        // }
        // 🗑️ delete from database
        return prisma_1.prisma.category.delete({
            where: { id },
        });
    },
    // delete: async (id: string) => {
    //   const category =
    //     await prisma.category.findUnique({
    //       where: { id },
    //     });
    //   if (!category) {
    //     throw new AppError(
    //       "Category not found",
    //       404
    //     );
    //   }
    //   return prisma.category.delete({
    //     where: { id },
    //   });
    // },
};
