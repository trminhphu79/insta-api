import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

export function setupSwagger(app: Express) {
  const options: swaggerJSDoc.Options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "Insta API",
        version: "1.0.0",
        description: "Instagram-like API (Express + Sequelize + PostgreSQL)",
      },
      servers: [{ url: "/api", description: "Base API" }],
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
        schemas: {
          // reusable models
          User: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              username: { type: "string" },
              email: { type: "string", format: "email" },
              createdAt: { type: "string", format: "date-time" },
            },
          },
          CreateUserDto: {
            type: "object",
            required: ["username", "email", "password"],
            properties: {
              username: { type: "string", example: "alice" },
              email: { type: "string", format: "email", example: "a@b.com" },
              password: { type: "string", example: "Str0ng!Passw0rd" },
            },
          },
          UpdateUserDto: {
            type: "object",
            properties: {
              username: { type: "string" },
              email: { type: "string", format: "email" },
            },
          },
        },
      },
      // apply auth globally (optional): security: [{ bearerAuth: [] }],
    },
    apis: ["src/api/routes/**/*.ts", "src/api/controllers/**/*.ts"],
  };

  const spec = swaggerJSDoc(options);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
}
