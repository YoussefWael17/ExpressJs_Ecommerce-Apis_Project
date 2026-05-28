import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../utils/AppError";
import { normalize } from "../../../utils/normalize";

export const resolveColor = async (
  colorName: string,
  userRole: string
) => {
  const name = normalize(colorName);

  let color = await prisma.color.findFirst({
    where: { name },
  });

  if (!color) {
    if (userRole === "ADMIN") {
      color = await prisma.color.create({
        data: { name },
      });
    } else {
      throw new AppError(`Color "${name}" not found`, 400);
    }
  }

  return color;
};