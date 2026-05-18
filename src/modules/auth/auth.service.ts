import { prisma } from "../../lib/prisma";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";

export const authService = {
  register: async (data: any) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashed = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
      },
    });

    const token = generateToken({id:user.id, role:user.role});
    return {
      user,
      token,
    };
  },

  login: async (data: any) => {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await comparePassword(data.password, user.password);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken({id:user.id, role:user.role});

    return {
      user,
      token,
    };
  },
};