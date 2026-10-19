"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const payment_service_1 = require("./payment.service");
exports.paymentController = {
    checkout: async (req, res) => {
        try {
            const session = await payment_service_1.paymentService.createCheckoutSession(req.user.id);
            res.json({
                success: true,
                url: session.url,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },
};
