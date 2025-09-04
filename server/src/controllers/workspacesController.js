import { listWorkspaces, createWorkspace, getWorkspace, listChannels, createChannel } from '../services/workspacesService.js';

export function getWorkspaces(req, res, next) {
  try {
    return res.json({ success:true, data: listWorkspaces() });
  } catch (e) { next(e); }
}

export function postWorkspace(req, res, next) {
  try {
    const { name } = req.body || {};
    if (!name || typeof name !== 'string') return res.status(400).json({ success:false, error:{ code:'VALIDATION_ERROR', message:'name required'} });
    const ws = createWorkspace(name.trim());
    res.status(201).json({ success:true, data: ws });
  } catch (e) { next(e); }
}

export function getWorkspaceDetail(req, res, next) {
  try {
    const ws = getWorkspace(req.params.id);
    if (!ws) return res.status(404).json({ success:false, error:{ code:'NOT_FOUND', message:'workspace not found'} });
    res.json({ success:true, data: ws });
  } catch (e) { next(e); }
}

export function getWorkspaceChannels(req, res, next) {
  try {
    const { id } = req.params;
    if (!getWorkspace(id)) return res.status(404).json({ success:false, error:{ code:'NOT_FOUND', message:'workspace not found'} });
    res.json({ success:true, data: listChannels(id) });
  } catch (e) { next(e); }
}

export function postWorkspaceChannel(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body || {};
    if (!name) return res.status(400).json({ success:false, error:{ code:'VALIDATION_ERROR', message:'name required'} });
    const ch = createChannel(id, name.trim());
    res.status(201).json({ success:true, data: ch });
  } catch (e) { next(e); }
}
