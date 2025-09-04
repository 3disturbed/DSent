import { createServer } from './loaders/server.js';
import { logger } from './loaders/logger.js';
import { loadConfig } from './config/index.js';

(async () => {
  try {
    const config = loadConfig();
    const app = createServer({ config });
    const server = app.listen(config.PORT, () => {
      logger.info({ port: config.PORT, env: config.NODE_ENV }, 'Server started');
    });

    const shutdown = (signal) => {
      logger.info({ signal }, 'Shutdown initiated');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
      setTimeout(() => {
        logger.error('Forced shutdown');
        process.exit(1);
      }, 8000).unref();
    };

    ['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, () => shutdown(sig)));
  } catch (err) {
    logger.error({ err }, 'Fatal startup error');
    process.exit(1);
  }
})();
