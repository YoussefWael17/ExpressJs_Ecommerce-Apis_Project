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

            CartItem: {
              type: "object",

              properties: {
                id: {
                  type: "string",
                },

                quantity: {
                  type: "integer",
                },

                createdAt: {
                  type: "string",
                  format: "date-time",
                },

                variant: {
                  type: "object",

                  properties: {
                    id: {
                      type: "string",
                    },

                    sku: {
                      type: "string",
                    },

                    price: {
                      type: "number",
                    },

                    stock: {
                      type: "integer",
                    },

                    product: {
                      $ref: "#/components/schemas/Product",
                    },
                  },
                },
              },
            },

            Cart: {
              type: "object",

              properties: {
                id: {
                  type: "string",
                },

                userId: {
                  type: "string",
                },

                items: {
                  type: "array",

                  items: {
                    $ref: "#/components/schemas/CartItem",
                  },
                },
              },
            },

            OrderItem: {
              type: "object",

              properties: {
                id: {
                  type: "string",
                },

                quantity: {
                  type: "integer",
                },

                price: {
                  type: "number",
                },

                product: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },

            Order: {
              type: "object",

              properties: {
                id: {
                  type: "string",
                },

                userId: {
                  type: "string",
                },

                status: {
                  type: "string",

                  enum: [
                    "PENDING",
                    "PAID",
                    "SHIPPED",
                    "DELIVERED",
                    "CANCELLED",
                  ],
                },

                totalPrice: {
                  type: "number",
                },

                createdAt: {
                  type: "string",
                  format: "date-time",
                },

                items: {
                  type: "array",

                  items: {
                    $ref: "#/components/schemas/OrderItem",
                  },
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