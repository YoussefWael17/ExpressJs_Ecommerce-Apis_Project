import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { AppError } from "../../utils/AppError";

export const paymentService = {
  createCheckoutSession: async (userId: string) => {
    const cart = await prisma.cart.findUnique({
      where: { userId },

      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    const totalAmount = cart.items.reduce(
      (sum, item) =>
        sum +
        item.quantity *
          (item.variant.discountPrice ??
            item.variant.price),
      0
    );

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        payment_method_types: ["card"],

        metadata: {
          userId,
        },

        line_items: cart.items.map((item) => ({
          quantity: item.quantity,

          price_data: {
            currency: "usd",

            product_data: {
              name:
                item.variant.product.title,
            },

            unit_amount: Math.round(
              (item.variant.discountPrice ??
                item.variant.price) * 100
            ),
          },
        })),

        success_url:
          `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${process.env.CLIENT_URL}/cart`,
      });

    await prisma.payment.create({
      data: {
        userId,

        stripeSessionId: session.id,

        amount: totalAmount,

        status: "PENDING",
      },
    });

    return session;
  },
};