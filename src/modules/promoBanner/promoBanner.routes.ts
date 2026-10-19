import { Router } from "express";
import PromoBannerController from "./promoBanner.controller";



const router = Router();

// GET
router.get("/", PromoBannerController.getActivePromoBanners);

// GET one
router.get("/:id", PromoBannerController.getPromoBanner);


export default router;