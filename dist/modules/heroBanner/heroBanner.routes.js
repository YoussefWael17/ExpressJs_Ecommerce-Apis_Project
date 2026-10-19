"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const heroBanner_controller_1 = __importDefault(require("./heroBanner.controller"));
const router = (0, express_1.Router)();
// GET
router.get("/", heroBanner_controller_1.default.getHeroBanners);
// GET one
router.get("/:id", heroBanner_controller_1.default.getHeroBanner);
exports.default = router;
