import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../utils/AppError";
import { normalize } from "../../../utils/normalize";

export const resolveSize = async (
  sizeName: string,
  userRole: string
) => {
  const name = normalize(sizeName);

  let size = await prisma.size.findFirst({
    where: { name },
  });

  if (!size) {
    if (userRole === "ADMIN") {
      size = await prisma.size.create({
        data: { name },
      });
    } else {
      throw new AppError(`Size "${name}" not found`, 400);
    }
  }

  return size;
};