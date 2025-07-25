import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Pack File Uploader API",
    version: "1.0.0",
    description: "API per il caricamento e gestione dei file",
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
  },
  servers: [
    {
      url: "http://PackServiceLoad-bdrmcefe-1921833194.eu-central-1.elb.amazonaws.com",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      apiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
        description: "Chiave API per l'autenticazione delle richieste.",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "error",
          },
          message: {
            type: "string",
            example: "Errore nella richiesta",
          },
        },
      },
      FileUploadResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          fileUrl: {
            type: "string",
            example: "https://bucket.s3.amazonaws.com/file.pdf",
          },
          fileId: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
        },
      },
    },
  },
  security: [
    {
      apiKeyAuth: [],
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: [
    "./src/routes/*.ts",
    "./src/index.ts",
    "./dist/routes/*.js",
    "./dist/index.js",
  ], // Path ai file con le annotazioni
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Pack File Uploader API Docs",
    })
  );

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

export { swaggerSpec };
