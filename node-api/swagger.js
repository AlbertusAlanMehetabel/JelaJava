const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JelaJava API Documentation',
      version: '1.0.0',
      description: "C23-PS222 -  JelaJava's API Documentations",
    },
    servers: [
      {
        url: 'https://node-api-froi2bfpmq-et.a.run.app/',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./routes/default.js', './routes/auth.js', './routes/user.js', './routes/notes.js', './routes/maps.js', './routes/weather.js'],
};

const specs = swaggerJsdoc(options);

module.exports = app => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
