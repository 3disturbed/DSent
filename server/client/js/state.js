import { mockUsers, mockWorkspaces, mockChannels, mockMessages } from './mockData.js';

const state = {
  currentWorkspaceId: 'w1',
  currentChannelId: 'c1',
  messages: [...mockMessages], // will be replaced by API fetch
  theme: 'dark',
  unread: {}
};

export function getState() { return state; }

export function setWorkspace(id) {
  state.currentWorkspaceId = id;
  // choose first channel in workspace
  const ws = mockWorkspaces.find(w => w.id === id);
  if (ws) state.currentChannelId = ws.channels[0];
  // mark first channel read
  state.unread[state.currentChannelId] = 0;
}

export function setChannel(id) {
  state.currentChannelId = id;
  state.unread[id] = 0; // reading clears unread
}

export function addMessage(channelId, content) {
  const id = 'm' + (state.messages.length + 1);
  state.messages.push({ id, channelId, authorId: 'u1', content, createdAt: Date.now() });
}

export function addMessageFor(channelId, content, authorId = 'u2') {
  const id = 'm' + (state.messages.length + 1);
  state.messages.push({ id, channelId, authorId, content, createdAt: Date.now() });
  if (channelId !== state.currentChannelId) {
    state.unread[channelId] = (state.unread[channelId] || 0) + 1;
  }
}

export function getUnread(channelId) { return state.unread[channelId] || 0; }

export function resetUnread(channelId) { state.unread[channelId] = 0; }

export function createChannel(workspaceId, name) {
  const id = 'c' + (mockChannels.length + 1);
  mockChannels.push({ id, workspaceId, name });
  const ws = mockWorkspaces.find(w => w.id === workspaceId);
  if (ws) ws.channels.push(id);
  state.currentChannelId = id;
  state.unread[id] = 0;
  return id;
}

export function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  return state.theme;
}

export { mockUsers, mockWorkspaces, mockChannels };
