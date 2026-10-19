"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = void 0;
const stripe_1 = require("../../lib/stripe");
const prisma_1 = require("../../lib/prisma");
const order_service_1 = require("../order/order.service");
const stripeWebhook = async (req, res) => {
    console.log("=================================");
    console.log("WEBHOOK HIT");
    console.log("=================================");
    const signature = req.headers["stripe-signature"];
    try {
        const event = stripe_1.stripe.webhooks.constructEvent(req.body, signature, process.env
            .STRIPE_WEBHOOK_SECRET);
        console.log("EVENT TYPE:", event.type);
        if (event.type ===
            "checkout.session.completed") {
            const session = event.data.object;
            console.log("SESSION ID:");
            console.log(session.id);
            console.log("SESSION METADATA:");
            console.log(session.metadata);
            const userId = session.metadata?.userId;
            console.log("USER ID:");
            console.log(userId);
            if (!userId) {
                throw new Error("User ID missing");
            }
            console.log("LOOKING FOR PAYMENT...");
            const payment = await prisma_1.prisma.payment.findUnique({
                where: {
                    stripeSessionId: session.id,
                },
            });
            console.log("PAYMENT FOUND:");
            console.log(payment);
            if (!payment) {
                throw new Error(`Payment not found for session ${session.id}`);
            }
            if (payment.status === "PAID") {
                console.log("PAYMENT ALREADY PAID");
                return res.json({
                    received: true,
                });
            }
            console.log("CREATING ORDER...");
            // const order =
            //   await orderService.createOrder(
            //     userId
            //   );
            // console.log(
            //   "ORDER CREATED:"
            // );
            // console.log(order.id);
            // console.log(
            //   "UPDATING PAYMENT..."
            // );
            const order = await order_service_1.orderService.createOrder(userId);
            if (!order) {
                throw new Error("Failed to create order");
            }
            await prisma_1.prisma.order.update({
                where: {
                    id: order.id,
                },
                data: {
                    status: "PAID",
                },
            });
            await prisma_1.prisma.payment.update({
                where: {
                    stripeSessionId: session.id,
                },
                data: {
                    status: "PAID",
                    order: {
                        connect: {
                            id: order.id,
                        },
                    },
                },
            });
            console.log("PAYMENT UPDATED SUCCESSFULLY");
        }
        return res.json({
            received: true,
        });
    }
    catch (error) {
        console.error("=================================");
        console.error("WEBHOOK ERROR");
        console.error("=================================");
        console.error(error);
        return res
            .status(400)
            .send(`Webhook Error: ${error.message}`);
    }
};
exports.stripeWebhook = stripeWebhook;
