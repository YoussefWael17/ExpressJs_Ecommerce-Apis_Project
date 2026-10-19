import { Request, Response } from "express";
import { categoryService } from "./category.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../../types/auth-request";

export const categoryController = {
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
  getAll: asyncHandler(
    async (req: Request, res: Response) => {
      const categories = await categoryService.getAll();

      res.json({
        success: true,
        data: categories,
      });
    }
  ),

  /*
  |--------------------------------------------------------------------------
  | Get Single Category
  |--------------------------------------------------------------------------
  */
  getOne: asyncHandler(
    async (req: Request, res: Response) => {
      const category = await categoryService.getOne(
        req.params.id as string
      );

      res.json({
        success: true,
        data: category,
      });
    }
  ),

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