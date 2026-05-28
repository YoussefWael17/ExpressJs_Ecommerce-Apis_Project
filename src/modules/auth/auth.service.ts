import { prisma } from "../../lib/prisma";
import { emailService } from "../../services/email.service";
import { welcomeTemplate } from "../../templates/welcome.template";
import { verifyGoogleToken } from "../../utils/google";
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

    await emailService.sendEmail(
      user.email,

      "Welcome To CARTIFY STORE",

      welcomeTemplate(user.name || "User")
    );

    const token = generateToken({id:user.id, role:user.role});
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

  login: async (data: any) => {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // المستخدم مسجل بجوجل
    if (!user.password) {
      throw new Error("This account uses Google login");
    }

    const isValid = await comparePassword(
      data.password,
      user.password
    );

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    return {
      user,
      token,
    };
  },

  googleLogin: async (googleToken: string) => {
    const payload = await verifyGoogleToken(googleToken);

    const email = payload.email;

    if (!email) {
      throw new Error("Google account has no email");
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    // لو المستخدم مش موجود اعمله register
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: payload.name,
          provider: "GOOGLE",
          googleId: payload.sub,
          avatar: payload.picture,
        },
      });

      await emailService.sendEmail(
        user.email,
        "Welcome To CARTIFY STORE",
        welcomeTemplate(user.name || "User")
      );
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    return {
      user,
      token,
    };
  },
};