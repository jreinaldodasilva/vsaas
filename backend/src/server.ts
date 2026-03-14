import { initializeMonitoring } from './config/monitoring';
import { validateEnv } from './config/env';
import { connectToDatabase, closeDatabaseConnection } from './config/database/database';
import logger from './config/logger';

initializeMonitoring();
validateEnv();

import app from './app';

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectToDatabase();

  const server = app.listen(PORT, () => {
    logger.info('🚀 ===================================');
    logger.info(`🚀 vSaaS API running on port ${PORT}`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    logger.info('🚀 ===================================');
  });

  const gracefulShutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      logger.info('HTTP server closed');
      try {
        await closeDatabaseConnection();
      } catch (err) {
        logger.error({ err }, 'Error closing database connection');
      }
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

start().catch((err) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});
