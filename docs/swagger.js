const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Usuários",
      version: "2.0.0",
      description:
        "API REST completa com autenticação JWT, validação com Zod e paginação.",
      contact: {
        name: "Equipe de Desenvolvimento",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Insira o token JWT retornado no login. Ex: Bearer <token>",
        },
      },
      schemas: {
        Usuario: {
          type: "object",
          properties: {
            _id:       { type: "string",  example: "664abc123def456" },
            nome:      { type: "string",  example: "João Silva" },
            email:     { type: "string",  example: "joao@email.com" },
            idade:     { type: "integer", example: 28 },
            ativo:     { type: "boolean", example: true },
            createdAt: { type: "string",  format: "date-time" },
            updatedAt: { type: "string",  format: "date-time" },
          },
        },
        ErroValidacao: {
          type: "object",
          properties: {
            sucesso:  { type: "boolean", example: false },
            mensagem: { type: "string",  example: "Dados inválidos" },
            erros: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  campo:    { type: "string", example: "email" },
                  mensagem: { type: "string", example: "Formato de e-mail inválido" },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: "Auth",     description: "Registro, login e perfil" },
      { name: "Usuarios", description: "CRUD de usuários (requer autenticação)" },
    ],
  },
  apis: ["./routes/*.js"], // Lê os comentários JSDoc das rotas
};

const specs = swaggerJsdoc(options);

const configurarSwagger = (app) => {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      customSiteTitle: "API Docs",
      swaggerOptions: { persistAuthorization: true },
    })
  );
  console.log("Swagger disponível na rota /docs");
};

module.exports = configurarSwagger;
