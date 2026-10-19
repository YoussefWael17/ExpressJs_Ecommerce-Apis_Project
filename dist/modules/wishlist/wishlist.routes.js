"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wishlist_controller_1 = require("./wishlist.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const wishlist_validation_1 = require("./wishlist.validation");
const router = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| GET WISHLIST
|--------------------------------------------------------------------------
*/
router.get("/", auth_middleware_1.authMiddleware, wishlist_controller_1.wishlistController.getMine);
/*
|--------------------------------------------------------------------------
| ADD ITEM
|--------------------------------------------------------------------------
*/
router.post("/items", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(wishlist_validation_1.addWishlistSchema), wishlist_controller_1.wishlistController.add);
/*
|--------------------------------------------------------------------------
| REMOVE ITEM
|--------------------------------------------------------------------------
*/
router.delete("/items/:id", auth_middleware_1.authMiddleware, wishlist_controller_1.wishlistController.remove);
exports.default = router;
