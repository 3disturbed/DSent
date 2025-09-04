import { getState, setWorkspace, setChannel, addMessage, toggleTheme, createChannel } from './state.js';
import { renderWorkspaces, renderChannels, renderMessages, renderChannelHeader } from './render.js';

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
  renderMessages(els.messageList, s.currentChannelId, s.messages);
  wireAddChannel();
}

function initComposer() {
  els.composer.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = els.composerInput.value.trim();
    if (!text) return;
    const s = getState();
    addMessage(s.currentChannelId, text);
    els.composerInput.value='';
    renderMessages(els.messageList, s.currentChannelId, s.messages);
  });
}

(function bootstrap() {
  initTheme();
  initComposer();
  renderAll();
})();

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
