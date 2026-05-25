import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

export const paymentService = {
  createCheckoutSession: async (
    orderId: string,
    userId: string
  ) => {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === "PAID") {
      throw new Error("Order already paid");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      line_items: order.items.map((item) => ({
        price_data: {
          currency: "usd",

          product_data: {
            name: item.product.title,
          },

          unit_amount: Math.round(item.price * 100),
        },

        quantity: item.quantity,
      })),

      success_url: `${process.env.CLIENT_URL}/success`,

      cancel_url: `${process.env.CLIENT_URL}/cancel`,

      metadata: {
        orderId: order.id,
      },
    });

    return session;
  },
};