
import { BannerRequestStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { getIO } from "../../lib/socket";
import { AppError } from "../../utils/AppError";

export const PromoBannerRequestService = {
  // =========================================================
  // CREATE PROMO BANNER REQUEST - VENDOR
  // =========================================================

  create: async function (
    vendorId: string,
    productId: string,
    offerPercentage: number,
    startDate: Date,
    endDate: Date,
    backgroundColor?: string,
    note?: string
  ) {
    // Check product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    // Check if vendor owns the product
    if (product.vendorId !== vendorId) {
      throw new AppError(
        "You are not allowed to create a promo banner request for this product.",
        403
      );
    }

    // Validate offer percentage
    if (offerPercentage < 0 || offerPercentage > 100) {
      throw new AppError(
        "Offer percentage must be between 0 and 100.",
        400
      );
    }

    // Validate dates
    if (startDate >= endDate) {
      throw new AppError(
        "End date must be after start date.",
        400
      );
    }

    // Check existing pending request for the same product
    const existingRequest =
      await prisma.promoBannerRequest.findFirst({
        where: {
          productId,
          status: BannerRequestStatus.PENDING,
        },
      });

    if (existingRequest) {
      throw new AppError(
        "A promo banner request for this product already exists.",
        400
      );
    }

    // Create request
    const request = await prisma.promoBannerRequest.create({
      data: {
        vendorId,
        productId,
        offerPercentage,
        startDate,
        endDate,
        backgroundColor,
        note,
      },

      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        product: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            salePercentage: true,
          },
        },
      },
    });

    // Notify admins
    getIO()
      .to("admins")
      .emit("new-promo-banner-request", request);

    return request;
  },

  // =========================================================
  // GET VENDOR REQUESTS
  // =========================================================

  getAllVendorRequests: async function (
    page = 1,
    limit = 10,
    vendorId: string,
    searchTerm?: string
  ) {
    const skip = (page - 1) * limit;

    const whereCondition: any = {
      vendorId,
    };

    if (searchTerm?.trim()) {
      const search = searchTerm.trim();
      const upperSearch = search.toUpperCase();

      whereCondition.OR = [
        {
          id: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          product: {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];

      if (
        Object.values(BannerRequestStatus).includes(
          upperSearch as BannerRequestStatus
        )
      ) {
        whereCondition.OR.push({
          status:
            upperSearch as BannerRequestStatus,
        });
      }
    }

    const [
      promoBannerRequests,
      total,
      statusCounts,
    ] = await Promise.all([
      prisma.promoBannerRequest.findMany({
        where: whereCondition,

        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          product: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              salePercentage: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        skip,
        take: limit,
      }),

      prisma.promoBannerRequest.count({
        where: whereCondition,
      }),

      prisma.promoBannerRequest.groupBy({
        by: ["status"],

        where: whereCondition,

        _count: {
          status: true,
        },
      }),
    ]);

    const stats = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    statusCounts.forEach((item) => {
      switch (item.status) {
        case BannerRequestStatus.PENDING:
          stats.pending = item._count.status;
          break;

        case BannerRequestStatus.APPROVED:
          stats.approved = item._count.status;
          break;

        case BannerRequestStatus.REJECTED:
          stats.rejected = item._count.status;
          break;
      }
    });

    const totalPages = Math.ceil(total / limit);

    return {
      promoBannerRequests,

      pagination: {
        total,
        ...stats,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  },

  // =========================================================
  // GET VENDOR REQUEST BY ID
  // =========================================================

  getVendorRequestById: async function (
    requestId: string,
    vendorId: string
  ) {
    const promoBannerRequest =
      await prisma.promoBannerRequest.findFirst({
        where: {
          id: requestId,
          vendorId,
        },

        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          product: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              salePercentage: true,
            },
          },
        },
      });

    if (!promoBannerRequest) {
      throw new AppError(
        "Promo banner request not found.",
        404
      );
    }

    return promoBannerRequest;
  },

  // =========================================================
  // GET ALL REQUESTS - ADMIN
  // =========================================================

  getAll: async function (
    page = 1,
    limit = 10,
    searchTerm?: string
  ) {
    const skip = (page - 1) * limit;

    const whereCondition: any = {};

    if (searchTerm?.trim()) {
      const search = searchTerm.trim();
      const upperSearch = search.toUpperCase();

      whereCondition.OR = [
        {
          id: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          vendor: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },

        {
          vendor: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },

        {
          product: {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];

      if (
        Object.values(BannerRequestStatus).includes(
          upperSearch as BannerRequestStatus
        )
      ) {
        whereCondition.OR.push({
          status:
            upperSearch as BannerRequestStatus,
        });
      }
    }

    const [
      promoBannerRequests,
      total,
      statusCounts,
    ] = await Promise.all([
      prisma.promoBannerRequest.findMany({
        where: whereCondition,

        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          product: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              salePercentage: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        skip,
        take: limit,
      }),

      prisma.promoBannerRequest.count({
        where: whereCondition,
      }),

      prisma.promoBannerRequest.groupBy({
        by: ["status"],

        where: whereCondition,

        _count: {
          status: true,
        },
      }),
    ]);

    const stats = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    statusCounts.forEach((item) => {
      switch (item.status) {
        case BannerRequestStatus.PENDING:
          stats.pending = item._count.status;
          break;

        case BannerRequestStatus.APPROVED:
          stats.approved = item._count.status;
          break;

        case BannerRequestStatus.REJECTED:
          stats.rejected = item._count.status;
          break;
      }
    });

    const totalPages = Math.ceil(total / limit);

    return {
      promoBannerRequests,

      pagination: {
        total,
        ...stats,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  },

  // =========================================================
  // APPROVE REQUEST - ADMIN
  // =========================================================

  approve: async function (requestId: string) {
    return prisma.$transaction(async (tx) => {
      // Get request
      const request =
        await tx.promoBannerRequest.findUnique({
          where: {
            id: requestId,
          },

          include: {
            product: true,
          },
        });

      if (!request) {
        throw new AppError(
          "Promo banner request not found.",
          404
        );
      }

      // Make sure it is still pending
      if (
        request.status !==
        BannerRequestStatus.PENDING
      ) {
        throw new AppError(
          "This request has already been processed.",
          400
        );
      }

      // Check if product already has a promo banner
      const existingBanner =
        await tx.promoBanner.findFirst({
          where: {
            productId: request.productId,

            // Only block currently existing promo banners
            isActive: true,
          },
        });

      if (existingBanner) {
        throw new AppError(
          "This product already has an active promo banner.",
          400
        );
      }

      // Create Promo Banner
      const promoBanner = await tx.promoBanner.create({
        data: {
          title: request.product.title,

          subtitle:
            request.product.description ?? null,

          image: request.product.thumbnail,

          buttonText: "Buy Now",

          buttonLink:
            `/products/${request.product.id}`,

          offerPercentage:
            request.offerPercentage,

          startDate:
            request.startDate,

          endDate:
            request.endDate,

          backgroundColor:
            request.backgroundColor,

          productId:
            request.productId,

          vendorId:
            request.vendorId,

          isActive: true,
        },

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
      });

      // Update request status
      await tx.promoBannerRequest.update({
        where: {
          id: requestId,
        },

        data: {
          status:
            BannerRequestStatus.APPROVED,
        },
      });

      // Notify the vendor after the transaction succeeds
      getIO()
        .to(`vendor:${promoBanner.vendorId}`)
        .emit("promo-banner-request-approved", {
          requestId,
          productId: promoBanner.productId,
          productTitle: promoBanner.product?.title,
          status: BannerRequestStatus.APPROVED,
          message: `Your promo banner request for "${promoBanner.product?.title}" has been approved.`,
          promoBanner: promoBanner,
        });

      return promoBanner;
    });
  },

  // =========================================================
  // REJECT REQUEST - ADMIN
  // =========================================================

  reject: async function (
    requestId: string,
  ) {
    const request =
      await prisma.promoBannerRequest.findUnique({
        where: {
          id: requestId,
        },
      });

    if (!request) {
      throw new AppError(
        "Promo banner request not found.",
        404
      );
    }

    if (
      request.status !==
      BannerRequestStatus.PENDING
    ) {
      throw new AppError(
        "This request has already been processed.",
        400
      );
    }

    const rejectedRequest =
      await prisma.promoBannerRequest.update({
        where: {
          id: requestId,
        },

        data: {
          status:
            BannerRequestStatus.REJECTED,
        },

        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          product: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              salePercentage: true,
            },
          },
        },
      });

      const room = `vendor:${rejectedRequest.vendorId}`;

      const roomSockets = getIO().sockets.adapter.rooms.get(room);

      console.log("Rejecting promo banner request:", {
        requestId,
        vendorId: rejectedRequest.vendorId,
        room,
        connectedSocketsInRoom: roomSockets?.size ?? 0,
      });

      const io = getIO();

      io.to(room).emit("promo-banner-request-rejected", {
        requestId,
        productId: rejectedRequest.productId,
        productTitle: rejectedRequest.product.title,
        status: BannerRequestStatus.REJECTED,
        message: `Your promo banner request for "${rejectedRequest.product.title}" has been rejected.`,
        request: rejectedRequest,
      });

      console.log("Rejection event emitted:", {
        event: "promo-banner-request-rejected",
        room,
      });

      // getIO()
      // .to(`vendor:${rejectedRequest.vendorId}`)
      // .emit("promo-banner-request-rejected", {
      //   requestId,
      //   productId: rejectedRequest.productId,
      //   productTitle: rejectedRequest.product.title,
      //   status: BannerRequestStatus.REJECTED,
      //   message: `Your promo banner request for "${rejectedRequest.product.title}" has been rejected.`,
      //   request: rejectedRequest,
      // });

    return rejectedRequest;
  },

  // =========================================================
  // DELETE REQUEST - VENDOR
  // =========================================================

  delete: async function (
    vendorId: string,
    requestId: string
  ) {
    const existingRequest =
      await prisma.promoBannerRequest.findFirst({
        where: {
          vendorId,
          id: requestId,
        },
      });

    if (!existingRequest) {
      throw new AppError(
        "Promo banner request does not exist.",
        404
      );
    }

    // Optional:
    // Prevent vendor from deleting approved/rejected requests
    if (
      existingRequest.status !==
      BannerRequestStatus.PENDING
    ) {
      throw new AppError(
        "Only pending promo banner requests can be deleted.",
        400
      );
    }

    const deletedRequest =
      await prisma.promoBannerRequest.delete({
        where: {
          id: requestId,
        },
      });

    getIO()
      .to("admins")
      .emit(
        "promo-banner-request-deleted",
        deletedRequest
      );

    return deletedRequest;
  },
};