import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/product/product.routes";
import cartRoutes from "./modules/cart/cart.routes";
import orderRoutes from "./modules/order/order.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import { stripeWebhook } from "./modules/payment/payment.webhook";

import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./docs/swagger";
import wishlistRoutes from "./modules/wishlist/wishlist.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.post(
  "/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/wishlist", wishlistRoutes);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.json({ message: "API is working 🚀" });
});

export default app;