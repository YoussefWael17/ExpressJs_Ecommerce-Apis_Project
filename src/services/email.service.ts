import { transporter } from "../lib/mail";

export const emailService = {
  sendEmail: async (
    to: string,
    subject: string,
    html: string
  ) => {
    return transporter.sendMail({
      from: process.env.EMAIL_FROM,

      to,

      subject,

      html,
    });
  },
};