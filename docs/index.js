import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Workflow Management API",
      version: "1.0.0",
    },
  },
  apis: [
    "./docs/*.swagger.js",
    "./docs/common.swagger.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
