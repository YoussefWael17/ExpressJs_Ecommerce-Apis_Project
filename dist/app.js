"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const product_routes_1 = __importDefault(require("./modules/product/product.routes"));
const heroBanner_routes_1 = __importDefault(require("./modules/heroBanner/heroBanner.routes"));
const promoBanner_routes_1 = __importDefault(require("./modules/promoBanner/promoBanner.routes"));
const cart_routes_1 = __importDefault(require("./modules/cart/cart.routes"));
const order_routes_1 = __importDefault(require("./modules/order/order.routes"));
const payment_routes_1 = __importDefault(require("./modules/payment/payment.routes"));
const payment_webhook_1 = require("./modules/payment/payment.webhook");
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./docs/swagger");
const wishlist_routes_1 = __importDefault(require("./modules/wishlist/wishlist.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const vendor_routes_1 = __importDefault(require("./modules/vendor/vendor.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const category_routes_1 = __importDefault(require("./modules/category/category.routes"));
const review_routes_1 = __importDefault(require("./modules/review/review.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.post("/api/payments/webhook", express_1.default.raw({
    type: "application/json",
}), payment_webhook_1.stripeWebhook);
app.use(express_1.default.json());
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use("/auth", auth_routes_1.default);
app.use("/products", product_routes_1.default);
app.use("/cart", cart_routes_1.default);
app.use("/orders", order_routes_1.default);
app.use("/payments", payment_routes_1.default);
app.use("/wishlist", wishlist_routes_1.default);
app.use("/vendor", vendor_routes_1.default);
app.use("/admin", admin_routes_1.default);
app.use("/categories", category_routes_1.default);
app.use("/reviews", review_routes_1.default);
app.use("/hero-banners", heroBanner_routes_1.default);
app.use("/promo-banners", promoBanner_routes_1.default);
app.use("/uploads", express_1.default.static("uploads"));
app.use(error_middleware_1.errorMiddleware);
app.get("/", (req, res) => {
    res.json({ message: "API is working 🚀" });
});
exports.default = app;
