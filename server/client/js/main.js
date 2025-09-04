import { getState, setWorkspace, setChannel, addMessage, toggleTheme, createChannel, mockUsers, addMessageFor, mockWorkspaces, mockChannels } from './state.js';
import { apiGet, apiPost } from './api.js';
import { renderWorkspaces, renderChannels, renderMessages, renderChannelHeader, renderMembers } from './render.js';

const els = {
  workspaceRail: document.getElementById('workspaceRail'),
  channelSidebar: document.getElementById('channelSidebar'),
  messageList: document.getElementById('messageList'),
  channelHeader: document.getElementById('channelHeader'),
  composer: document.getElementById('composer'),
  composerInput: document.getElementById('composerInput'),
  toastContainer: document.getElementById('toastContainer')
};

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  els.toastContainer.appendChild(t);
  setTimeout(()=> t.remove(), 3000);
}

function applyTheme(theme) {
  if (theme === 'light') document.body.classList.add('light-theme');
  else document.body.classList.remove('light-theme');
  localStorage.setItem('dsent-theme', theme);
}

function initTheme() {
  const stored = localStorage.getItem('dsent-theme');
  if (stored) {
    const st = getState();
    st.theme = stored;
    applyTheme(stored);
  } else {
    applyTheme(getState().theme);
  }
  const btn = document.createElement('button');
  btn.className = 'theme-toggle-btn';
  btn.textContent = 'Toggle Theme';
  btn.addEventListener('click', () => {
    const newTheme = toggleTheme();
    applyTheme(newTheme);
  });
  document.body.appendChild(btn);
}

function renderAll() {
  const s = getState();
  renderWorkspaces(els.workspaceRail, s.currentWorkspaceId, (id)=> { setWorkspace(id); renderAll(); toast('Switched workspace'); });
  renderChannels(els.channelSidebar, s.currentWorkspaceId, s.currentChannelId, (cid)=> { setChannel(cid); renderAll(); });
  renderChannelHeader(els.channelHeader, s.currentChannelId);
  fetchMessages(s.currentChannelId);
  wireAddChannel();
  renderMembers(document.getElementById('memberPanel'), s.currentWorkspaceId);
}

function initComposer() {
  els.composer.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = els.composerInput.value.trim();
    if (!text) return;
    const s = getState();
    // optimistic add
    addMessage(s.currentChannelId, text);
    renderMessages(els.messageList, s.currentChannelId, s.messages);
    els.composerInput.value='';
    fetch('/api/v1/messages', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ channelId: s.currentChannelId, content: text }) })
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(() => fetchMessages(s.currentChannelId, { silent:true }))
      .catch(()=> toast('Send failed (offline?)'));
  });
}

(function bootstrap() {
  initTheme();
  initComposer();
  bootstrapData();
  startPresenceSimulation();
  startMockIncomingMessages();
})();

function fetchMessages(channelId, { silent } = {}) {
  fetch('/api/v1/messages?channelId=' + encodeURIComponent(channelId))
    .then(r => r.ok ? r.json() : Promise.reject(r))
    .then(payload => {
      if (payload && payload.success) {
        const s = getState();
        s.messages = payload.data;
        renderMessages(els.messageList, channelId, s.messages);
      }
    })
    .catch(() => { if (!silent) toast('Load messages failed'); });
}

function wireAddChannel() {
  const btn = document.getElementById('addChannelBtn');
  if (!btn || btn._wired) return; // prevent duplicate wiring
  btn._wired = true;
  btn.addEventListener('click', openChannelModal);
}

function openChannelModal() {
  const root = document.getElementById('modalRoot');
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `\n    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="newChannelTitle">\n      <h3 id="newChannelTitle">Create Channel</h3>\n      <form id="newChannelForm">\n        <label>\n          <span style="font-size:12px;letter-spacing:0.5px;">NAME</span>\n          <input name="name" required minlength="2" maxlength="30" placeholder="e.g. planning" />\n        </label>\n        <div class="modal-actions">\n          <button type="button" class="btn" id="cancelChannelBtn">Cancel</button>\n          <button type="submit" class="btn primary">Create</button>\n        </div>\n      </form>\n    </div>`;
  root.appendChild(backdrop);
  const input = backdrop.querySelector('input[name="name"]');
  setTimeout(()=> input.focus(), 30);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  backdrop.querySelector('#cancelChannelBtn').addEventListener('click', close);
  backdrop.querySelector('#newChannelForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = input.value.trim().toLowerCase().replace(/\s+/g,'-');
    if (!name) return;
    const s = getState();
    if (name.length < 2) { toast('Name too short'); return; }
    if (name.length > 30) { toast('Name too long'); return; }
    createChannel(s.currentWorkspaceId, name);
    renderAll();
    toast('Channel #' + name + ' created');
    close();
  });
  function close() { backdrop.remove(); }
  document.addEventListener('keydown', function escHandler(ev){ if (ev.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); } });
}

function startPresenceSimulation() {
  // Randomly change a user's presence every 5 seconds for demo
  setInterval(() => {
  const pick = Math.floor(Math.random() * mockUsers.length);
  const user = mockUsers[pick];
    const statuses = ['online','idle','dnd'];
    user.presence = statuses[Math.floor(Math.random()*statuses.length)];
    const s = getState();
    renderMembers(document.getElementById('memberPanel'), s.currentWorkspaceId);
  }, 5000);
}

function startMockIncomingMessages() {
  setInterval(() => {
    const s = getState();
    // pick a channel not currently viewed (if available)
    const available = [...new Set(s.messages.map(m => m.channelId))].filter(id => id !== s.currentChannelId);
    if (available.length === 0) return;
    const target = available[Math.floor(Math.random()*available.length)];
    addMessageFor(target, 'Auto update ' + new Date().toLocaleTimeString());
    // re-render channels to update unread badges
    renderChannels(els.channelSidebar, s.currentWorkspaceId, s.currentChannelId, (cid)=> { setChannel(cid); renderAll(); });
  }, 7000);
}

async function bootstrapData() {
  try {
    const workspaces = await apiGet('/api/v1/workspaces');
    // Replace mockWorkspaces in place (keeping references) for simplicity
    mockWorkspaces.splice(0, mockWorkspaces.length, ...workspaces.map(w => ({ id:w.id, name:w.name, channels: [] })));
    // Load channels for first workspace
    if (workspaces.length) {
      const first = workspaces[0];
      const chs = await apiGet(`/api/v1/workspaces/${first.id}/channels`);
      mockChannels.splice(0, mockChannels.length, ...chs.map(c => ({ id:c.id, workspaceId:c.workspaceId, name:c.name })));
      // attach channel ids to workspace object
      const wsObj = mockWorkspaces.find(w => w.id === first.id);
      wsObj.channels = chs.map(c=>c.id);
    }
    renderAll();
  } catch (e) {
    console.error(e);
    renderAll();
  }
}
