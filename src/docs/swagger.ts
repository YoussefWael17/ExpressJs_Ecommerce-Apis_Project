import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Ecommerce API",

      version: "1.0.0",

      description: "Backend API Documentation",
    },

    components: {
        schemas: {
            Product: {
            type: "object",
            properties: {
                id: {
                type: "string",
                },

                title: {
                type: "string",
                },

                slug: {
                type: "string",
                },

                description: {
                type: "string",
                nullable: true,
                },

                thumbnail: {
                type: "string",
                nullable: true,
                },

                isActive: {
                type: "boolean",
                },

                isSale: {
                type: "boolean",
                },

                createdAt: {
                type: "string",
                format: "date-time",
                },

                updatedAt: {
                type: "string",
                format: "date-time",
                },
            },
            },
        },
        securitySchemes: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
        },
        },
    },

    security: [
        {
        bearerAuth: [],
        },
    ],

    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },

  apis: ["src/modules/**/*.ts"],
});