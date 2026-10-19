"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = require("../../utils/asyncHandler");
const vendorAnalytics_service_1 = __importDefault(require("./vendorAnalytics.service"));
const VendorAnalyticsController = {
    getAnalytics: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const vendorId = req.user?.id;
        if (!vendorId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const period = typeof req.query.period === "string"
            ? req.query.period
            : "6m";
        const analytics = await vendorAnalytics_service_1.default.getAnalytics(vendorId, period);
        return res.status(200).json({
            success: true,
            data: analytics,
        });
    }),
};
exports.default = VendorAnalyticsController;
