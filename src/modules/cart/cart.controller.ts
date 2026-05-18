import { Response } from "express";
import { cartService } from "./cart.service";
import { AuthRequest } from "../../types/auth-request";

export const cartController = {
  getCart: async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const cart = await cartService.getCart(
        req.user!.id
      );

      res.json(cart);

    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  addItem: async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const item = await cartService.addItem(
        req.user!.id,
        req.body.variantId,
        req.body.quantity
      );

      res.status(201).json(item);

    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  },

  updateQuantity: async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const item = await cartService.updateQuantity(
        req.params.id as string,
        req.body.quantity
      );

      res.json(item);

    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  },

  removeItem: async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      await cartService.removeItem(req.params.id as string);

      res.json({
        message: "Item removed",
      });

    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
};