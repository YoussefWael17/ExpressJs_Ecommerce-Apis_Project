import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";


const HeroBannerService = {
  // Get All Hero Banners
  getAll: async () => {
    return prisma.heroBanner.findMany({
      include: {
        product: true,
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });
  },

  // Get One Hero Banner
  getById: async (id: string) => {
    const banner = await prisma.heroBanner.findUnique({
      where: { id },
      include: {
        product: true,
        vendor: true,
      },
    });

    if (!banner) {
      throw new AppError("Hero Banner not found", 404);
    }

    return banner;
  },

  // Create Hero Banner
  // create: async (data: {
  //   title: string;
  //   subtitle?: string;
  //   image: string;
  //   buttonText?: string;
  //   buttonLink: string;
  //   order?: number;
  //   isActive?: boolean;
  //   productId?: string;
  //   vendorId?: string;
  // }) => {
  //   return prisma.heroBanner.create({
  //     data,
  //   });
  // },

  // Update Hero Banner
  update: async (
    id: string,
    data: Partial<{
      title: string;
      subtitle: string;
      image: string;
      buttonText: string;
      buttonLink: string;
      order: number;
      isActive: boolean;
    }>
  ) => {
    const banner = await prisma.heroBanner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new AppError("Hero Banner not found", 404);
    }

    return prisma.heroBanner.update({
      where: { id },
      data,
    });
  },

  // Delete Hero Banner
  delete: async (id: string) => {
    const banner = await prisma.heroBanner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new AppError("Hero Banner not found", 404);
    }

    await prisma.heroBanner.delete({
      where: { id },
    });
  },

  // Toggle Active
  toggleStatus: async (id: string) => {
    const banner = await prisma.heroBanner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new AppError("Hero Banner not found", 404);
    }

    return prisma.heroBanner.update({
      where: { id },
      data: {
        isActive: !banner.isActive,
      },
    });
  },
};

export default HeroBannerService;