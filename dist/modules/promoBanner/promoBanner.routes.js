"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promoBanner_controller_1 = __importDefault(require("./promoBanner.controller"));
const router = (0, express_1.Router)();
// GET
router.get("/", promoBanner_controller_1.default.getActivePromoBanners);
// GET one
router.get("/:id", promoBanner_controller_1.default.getPromoBanner);
exports.default = router;
