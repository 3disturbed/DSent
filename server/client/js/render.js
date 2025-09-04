import { getState, mockUsers, mockWorkspaces, mockChannels, getUnread } from './state.js';

function el(tag, className, children) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (children) {
    if (Array.isArray(children)) children.forEach(c => e.append(c.nodeType ? c : document.createTextNode(c)));
    else e.append(children);
  }
  return e;
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function renderWorkspaces(container, currentWorkspaceId, onSelect) {
  container.innerHTML = '';
  mockWorkspaces.forEach(w => {
    const btn = el('div', 'workspace-btn' + (w.id === currentWorkspaceId ? ' active' : ''), w.name[0]);
    btn.title = w.name;
    btn.tabIndex = 0;
    btn.addEventListener('click', () => onSelect(w.id));
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter') onSelect(w.id); });
    container.appendChild(btn);
  });
}

export function renderChannels(container, workspaceId, currentChannelId, onSelect) {
  container.innerHTML = '';
  const ws = mockWorkspaces.find(w => w.id === workspaceId);
  if (!ws) return;
  const group = el('div', 'channel-group');
  group.appendChild(el('h4', null, 'TEXT CHANNELS'));
  ws.channels.forEach(cid => {
    const ch = mockChannels.find(c => c.id === cid);
    if (!ch) return;
    const item = el('div', 'channel-item' + (cid === currentChannelId ? ' active' : ''), null);
    const label = el('span', 'channel-label', '#' + ch.name);
    const unread = getUnread(cid);
    if (unread > 0) {
      const badge = el('span', 'unread-badge', unread > 99 ? '99+' : String(unread));
      item.append(label, badge);
    } else {
      item.append(label);
    }
    item.tabIndex = 0;
    item.addEventListener('click', () => onSelect(cid));
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter') onSelect(cid); });
    group.appendChild(item);
  });
  container.appendChild(group);
  // Add channel button mount point (handled by main.js for logic) if not exists
  let addBtn = container.querySelector('.add-channel-btn');
  if (!addBtn) {
    addBtn = el('button', 'add-channel-btn', '+ Add Channel');
    addBtn.type = 'button';
    addBtn.id = 'addChannelBtn';
    container.appendChild(addBtn);
  }
}

export function renderMessages(container, channelId, messages) {
  container.innerHTML = '';
  messages.filter(m => m.channelId === channelId).sort((a,b)=>a.createdAt-b.createdAt).forEach(msg => {
    const user = mockUsers.find(u => u.id === msg.authorId) || { displayName: 'Unknown' };
    const row = el('div', 'message');
    const avatar = el('div', 'avatar', user.displayName[0]);
    const body = el('div', 'body');
    const head = el('div', 'head');
    const author = el('span', 'author', user.displayName);
    const meta = el('span', 'meta', formatTime(msg.createdAt));
    head.append(author, meta);
    const content = el('div', 'content', msg.content);
    body.append(head, content);
    row.append(avatar, body);
    row.setAttribute('role','listitem');
    container.appendChild(row);
  });
  container.scrollTop = container.scrollHeight;
}

export function renderChannelHeader(container, channelId) {
  const ch = mockChannels.find(c => c.id === channelId);
  container.textContent = ch ? '#' + ch.name : 'Unknown';
}

export function renderMembers(container, workspaceId) {
  container.innerHTML = '';
  const title = el('h4', null, 'MEMBERS');
  container.appendChild(title);
  mockUsers.forEach(u => {
    const row = el('div', 'member-row');
    const badge = el('span', 'presence presence-' + u.presence);
    const name = el('span', 'member-name', u.displayName);
    row.append(badge, name);
    container.appendChild(row);
  });
}
