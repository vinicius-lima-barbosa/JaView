import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JaView API',
      version: '1.0.0',
      description: 'Documentação da API do JaView'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
