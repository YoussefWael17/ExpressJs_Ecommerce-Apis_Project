import { Router } from "express";
import HeroBannerController from "./heroBanner.controller";

const router = Router();

// GET
router.get("/", HeroBannerController.getHeroBanners);

// GET one
router.get("/:id", HeroBannerController.getHeroBanner);


export default router;