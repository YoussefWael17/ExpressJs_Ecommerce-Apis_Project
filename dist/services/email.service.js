"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const mail_1 = require("../lib/mail");
exports.emailService = {
    sendEmail: async (to, subject, html) => {
        return mail_1.transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });
    },
};
