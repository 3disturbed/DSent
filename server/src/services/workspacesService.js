import { nanoid } from 'nanoid';

const workspaces = [
  { id: 'w1', name: 'Core', createdAt: Date.now() - 500000 },
  { id: 'w2', name: 'Research', createdAt: Date.now() - 400000 }
];

const channels = [
  { id: 'c1', workspaceId: 'w1', name: 'general', createdAt: Date.now() - 450000 },
  { id: 'c2', workspaceId: 'w1', name: 'dev-chat', createdAt: Date.now() - 440000 },
  { id: 'c3', workspaceId: 'w1', name: 'random', createdAt: Date.now() - 430000 },
  { id: 'c4', workspaceId: 'w2', name: 'ideas', createdAt: Date.now() - 420000 },
  { id: 'c5', workspaceId: 'w2', name: 'notes', createdAt: Date.now() - 410000 }
];

export function listWorkspaces() { return [...workspaces]; }
export function getWorkspace(id) { return workspaces.find(w => w.id === id) || null; }
export function createWorkspace(name) {
  const ws = { id: nanoid(), name, createdAt: Date.now() };
  workspaces.push(ws);
  return ws;
}

export function listChannels(workspaceId) {
  return channels.filter(c => c.workspaceId === workspaceId).sort((a,b)=>a.createdAt-b.createdAt);
}
export function getChannel(id) { return channels.find(c => c.id === id) || null; }
export function createChannel(workspaceId, name) {
  if (!getWorkspace(workspaceId)) throw new Error('Workspace not found');
  const ch = { id: nanoid(), workspaceId, name, createdAt: Date.now() };
  channels.push(ch);
  return ch;
}

// Export backing arrays for other services (messages) cautiously (read-only clones recommended)
export function _allChannels() { return [...channels]; }