import { nanoid } from 'nanoid';

const messages = [
  { id: nanoid(), channelId: 'c1', authorId: 'u1', content: 'Welcome to #general!', createdAt: Date.now() - 860000 },
  { id: nanoid(), channelId: 'c1', authorId: 'u2', content: 'Hey team, updates soon.', createdAt: Date.now() - 740000 },
  { id: nanoid(), channelId: 'c2', authorId: 'u3', content: 'Refactoring the service loader.', createdAt: Date.now() - 720000 },
  { id: nanoid(), channelId: 'c4', authorId: 'u1', content: 'Collecting research topics.', createdAt: Date.now() - 360000 }
];

export function listMessages(channelId) {
  return messages
    .filter(m => m.channelId === channelId)
    .sort((a,b)=> a.createdAt - b.createdAt);
}

export function createMessage({ channelId, authorId = 'u1', content }) {
  const msg = { id: nanoid(), channelId, authorId, content, createdAt: Date.now() };
  messages.push(msg);
  return msg;
}
