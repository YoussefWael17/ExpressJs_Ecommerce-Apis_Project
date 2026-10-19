"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const category_service_1 = require("./category.service");
const asyncHandler_1 = require("../../utils/asyncHandler");
exports.categoryController = {
    /*
    |--------------------------------------------------------------------------
    | Create Category
    |--------------------------------------------------------------------------
    */
    // create: asyncHandler(
    //   async (req: AuthRequest, res: Response) => {
    //     const category = await categoryService.create(req.body);
    //     res.status(201).json({
    //       success: true,
    //       message: "Category created successfully",
    //       data: category,
    //     });
    //   }
    // ),
    /*
    |--------------------------------------------------------------------------
    | Get All Categories
    |--------------------------------------------------------------------------
    */
    getAll: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const categories = await category_service_1.categoryService.getAll();
        res.json({
            success: true,
            data: categories,
        });
    }),
    /*
    |--------------------------------------------------------------------------
    | Get Single Category
    |--------------------------------------------------------------------------
    */
    getOne: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const category = await category_service_1.categoryService.getOne(req.params.id);
        res.json({
            success: true,
            data: category,
        });
    }),
    /*
    |--------------------------------------------------------------------------
    | Update Category
    |--------------------------------------------------------------------------
    */
    // update: asyncHandler(
    //   async (req: AuthRequest, res: Response) => {
    //     const category = await categoryService.update(
    //       req.params.id as string,
    //       req.body
    //     );
    //     res.json({
    //       success: true,
    //       message: "Category updated successfully",
    //       data: category,
    //     });
    //   }
    // ),
    /*
    |--------------------------------------------------------------------------
    | Delete Category
    |--------------------------------------------------------------------------
    */
    // delete: asyncHandler(
    //   async (req: Request, res: Response) => {
    //     await categoryService.delete(
    //       req.params.id as string
    //     );
    //     res.json({
    //       success: true,
    //       message: "Category deleted successfully",
    //     });
    //   }
    // ),
};
