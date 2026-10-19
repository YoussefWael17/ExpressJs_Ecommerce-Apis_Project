"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
exports.authController = {
    register: async (req, res) => {
        try {
            const result = await auth_service_1.authService.register(req.body);
            res.status(201).json(result);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    login: async (req, res) => {
        try {
            const result = await auth_service_1.authService.login(req.body);
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    googleAuth: async (req, res) => {
        try {
            const { token } = req.body;
            const result = await auth_service_1.authService.googleLogin(token);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    },
    profile: async (req, res) => {
        res.json({
            user: req.user,
        });
    },
};
