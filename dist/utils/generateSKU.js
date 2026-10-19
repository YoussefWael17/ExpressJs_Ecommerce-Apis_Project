"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSKU = void 0;
const node_crypto_1 = require("node:crypto");
const slugify_1 = __importDefault(require("slugify"));
const generateSKU = (title, sizeId, colorId) => {
    const cleanTitle = (0, slugify_1.default)(title, {
        lower: true,
        strict: true,
    });
    const shortId = (0, node_crypto_1.randomUUID)().split("-")[0];
    return [
        cleanTitle,
        sizeId || "na",
        colorId || "na",
        shortId,
    ]
        .join("-")
        .toUpperCase();
};
exports.generateSKU = generateSKU;
