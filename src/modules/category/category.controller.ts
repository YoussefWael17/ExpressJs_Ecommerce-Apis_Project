import { Request, Response } from "express";

import { categoryService } from "./category.service";

import { asyncHandler } from "../../utils/asyncHandler";

import { AuthRequest } from "../../types/auth-request";

export const categoryController = {
  /*
  |--------------------------------------------------------------------------
  | Get All
  |--------------------------------------------------------------------------
  */

  getAll: asyncHandler(
    async (req: Request, res: Response) => {
      const categories =
        await categoryService.getAll();

      res.json({
        success: true,
        data: categories,
      });
    }
  ),

  /*
  |--------------------------------------------------------------------------
  | Get One
  |--------------------------------------------------------------------------
  */

  getOne: asyncHandler(
    async (req: Request, res: Response) => {
      const category =
        await categoryService.getOne(
          req.params.id as string
        );

      res.json({
        success: true,
        data: category,
      });
    }
  ),

};