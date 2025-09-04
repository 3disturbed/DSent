import express from 'express';
import health from './health.js';
import messages from './messages.js';
import workspaces from './workspaces.js';

const router = express.Router();

router.use(health);
router.use(messages);
router.use(workspaces);

export default router;
