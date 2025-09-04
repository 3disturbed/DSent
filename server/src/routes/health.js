import express from 'express';
import { loadConfig } from '../config/index.js';

const router = express.Router();
const config = loadConfig();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: config.VERSION,
      requestId: req.id
    }
  });
});

export default router;
