"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const review_service_1 = require("./review.service");
exports.ReviewController = {
    addReview: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const { productId, rating, comment } = req.body;
        const review = await review_service_1.ReviewService.create(productId, req.user.id, rating, comment);
        res.status(201).json({
            success: true,
            message: "Review added successfully",
            data: review,
        });
    }),
};
