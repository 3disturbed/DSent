export const mockUsers = [
  { id: 'u1', displayName: 'Alice' },
  { id: 'u2', displayName: 'Bob' },
  { id: 'u3', displayName: 'Cara' }
];

export const mockWorkspaces = [
  { id: 'w1', name: 'Core', channels: [ 'c1', 'c2', 'c3' ] },
  { id: 'w2', name: 'Research', channels: [ 'c4', 'c5' ] }
];

export const mockChannels = [
  { id: 'c1', workspaceId: 'w1', name: 'general' },
  { id: 'c2', workspaceId: 'w1', name: 'dev-chat' },
  { id: 'c3', workspaceId: 'w1', name: 'random' },
  { id: 'c4', workspaceId: 'w2', name: 'ideas' },
  { id: 'c5', workspaceId: 'w2', name: 'notes' }
];

export const mockMessages = [
  { id: 'm1', channelId: 'c1', authorId: 'u1', content: 'Welcome to #general!', createdAt: Date.now() - 860000 },
  { id: 'm2', channelId: 'c1', authorId: 'u2', content: 'Hey team, updates soon.', createdAt: Date.now() - 740000 },
  { id: 'm3', channelId: 'c2', authorId: 'u3', content: 'Refactoring the service loader.', createdAt: Date.now() - 720000 },
  { id: 'm4', channelId: 'c4', authorId: 'u1', content: 'Collecting research topics.', createdAt: Date.now() - 360000 }
];
