import swaggerJsdoc from 'swagger-jsdoc';

// TODO: Update title, description, and contact info to match your app
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'vSaaS API',
      version: '1.0.0',
      description: 'Generic vertical SaaS boilerplate API',
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? process.env.API_URL || ''
            : 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        // TODO: Update cookie name to match your app
        cookieAuth: { type: 'apiKey', in: 'cookie', name: 'vsaas_access_token' },
      },
    },
  },
  apis: ['./src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
