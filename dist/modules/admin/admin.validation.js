"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeRoleSchema = void 0;
const zod_1 = require("zod");
exports.changeRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(["ADMIN", "CUSTOMER", "VENDOR"]),
});
