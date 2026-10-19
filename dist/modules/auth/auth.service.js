"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const prisma_1 = require("../../lib/prisma");
const email_service_1 = require("../../services/email.service");
const welcome_template_1 = require("../../templates/welcome.template");
const google_1 = require("../../utils/google");
const hash_1 = require("../../utils/hash");
const jwt_1 = require("../../utils/jwt");
exports.authService = {
    register: async (data) => {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error("Email already exists");
        }
        const hashed = await (0, hash_1.hashPassword)(data.password);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: data.email,
                password: hashed,
                name: data.name,
            },
        });
        await email_service_1.emailService.sendEmail(user.email, "Welcome To CARTIFY STORE", (0, welcome_template_1.welcomeTemplate)(user.name || "User"));
        const token = (0, jwt_1.generateToken)({ id: user.id, role: user.role });
        return {
            user,
            token,
        };
    },
    // login: async (data: any) => {
    //   const user = await prisma.user.findUnique({
    //     where: { email: data.email },
    //   });
    //   if (!user) {
    //     throw new Error("Invalid credentials");
    //   }
    //   const isValid = await comparePassword(data.password, user.password);
    //   if (!isValid) {
    //     throw new Error("Invalid credentials");
    //   }
    //   const token = generateToken({id:user.id, role:user.role});
    //   return {
    //     user,
    //     token,
    //   };
    // },
    login: async (data) => {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        // المستخدم مسجل بجوجل
        if (!user.password) {
            throw new Error("This account uses Google login");
        }
        const isValid = await (0, hash_1.comparePassword)(data.password, user.password);
        if (!isValid) {
            throw new Error("Invalid credentials");
        }
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            role: user.role,
        });
        return {
            user,
            token,
        };
    },
    googleLogin: async (googleToken) => {
        const payload = await (0, google_1.verifyGoogleToken)(googleToken);
        const email = payload.email;
        if (!email) {
            throw new Error("Google account has no email");
        }
        let user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        // لو المستخدم مش موجود اعمله register
        if (!user) {
            user = await prisma_1.prisma.user.create({
                data: {
                    email,
                    name: payload.name,
                    provider: "GOOGLE",
                    googleId: payload.sub,
                    avatar: payload.picture,
                },
            });
            await email_service_1.emailService.sendEmail(user.email, "Welcome To CARTIFY STORE", (0, welcome_template_1.welcomeTemplate)(user.name || "User"));
        }
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            role: user.role,
        });
        return {
            user,
            token,
        };
    },
};
