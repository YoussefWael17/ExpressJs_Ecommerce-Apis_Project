import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/product/product.routes";
import cartRoutes from "./modules/cart/cart.routes";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is working 🚀" });
});

export default app;