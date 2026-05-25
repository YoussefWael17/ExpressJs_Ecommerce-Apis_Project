import { Request, Response } from "express";

import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";

export const stripeWebhook = async (
  req: Request,
  res: Response
) => {
  const sig = req.headers["stripe-signature"] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const orderId = session.metadata?.orderId;

      if (orderId) {
        await prisma.order.update({
          where: {
            id: orderId,
          },

          data: {
            status: "PAID",
          },
        });
      }
    }

    res.json({
      received: true,
    });

  } catch (err: any) {
    res.status(400).send(
      `Webhook Error: ${err.message}`
    );
  }
};