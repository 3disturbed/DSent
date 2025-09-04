import express from 'express';
import { getWorkspaces, postWorkspace, getWorkspaceDetail, getWorkspaceChannels, postWorkspaceChannel } from '../controllers/workspacesController.js';

const router = express.Router();

router.get('/workspaces', getWorkspaces);
router.post('/workspaces', postWorkspace);
router.get('/workspaces/:id', getWorkspaceDetail);
router.get('/workspaces/:id/channels', getWorkspaceChannels);
router.post('/workspaces/:id/channels', postWorkspaceChannel);

export default router;
