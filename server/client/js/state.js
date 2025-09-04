import { mockUsers, mockWorkspaces, mockChannels, mockMessages } from './mockData.js';

const state = {
  currentWorkspaceId: 'w1',
  currentChannelId: 'c1',
  messages: [...mockMessages],
  theme: 'dark'
};

export function getState() { return state; }

export function setWorkspace(id) {
  state.currentWorkspaceId = id;
  // choose first channel in workspace
  const ws = mockWorkspaces.find(w => w.id === id);
  if (ws) state.currentChannelId = ws.channels[0];
}

export function setChannel(id) { state.currentChannelId = id; }

export function addMessage(channelId, content) {
  const id = 'm' + (state.messages.length + 1);
  state.messages.push({ id, channelId, authorId: 'u1', content, createdAt: Date.now() });
}

export function createChannel(workspaceId, name) {
  const id = 'c' + (mockChannels.length + 1);
  mockChannels.push({ id, workspaceId, name });
  const ws = mockWorkspaces.find(w => w.id === workspaceId);
  if (ws) ws.channels.push(id);
  state.currentChannelId = id;
  return id;
}

export function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  return state.theme;
}

export { mockUsers, mockWorkspaces, mockChannels };
