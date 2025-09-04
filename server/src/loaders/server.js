import express from 'express';
import routes from '../routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { requestId } from '../middleware/requestId.js';
import { errorHandler } from '../middleware/errorHandler.js';

export function createServer({ config }) {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));
  app.use(requestId);

  app.use('/api/v1', routes);

  // Static client
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const clientDir = path.join(__dirname, '../../client');
  app.use(express.static(clientDir));

  // SPA fallback: serve index.html for non-API, non-file requests
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientDir, 'index.html'), (err) => {
      if (err) next(err);
    });
  });

  app.use(errorHandler);

  return app;
}
