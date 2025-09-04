import express from 'express';
import health from './health.js';

const router = express.Router();

router.use(health);

export default router;
