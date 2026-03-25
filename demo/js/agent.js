// ===== Agent Workspace Page =====
const AgentPage = {
  activeQueue: null,
  agentStatus: 'online',
  chatMessages: [],

  render(container) {
    container.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold text-gray-800">真人客服工作台</h1>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500">客服狀態：</span>
          <button id="agent-status-btn" class="btn btn-sm ${this.agentStatus === 'online' ? 'btn-primary' : 'btn-secondary'}" onclick="AgentPage.toggleStatus()">
            ${this.agentStatus === 'online' ? '🟢 上線中' : '⚫ 離線'}
          </button>
        </div>
      </div>

      <div class="flex gap-4" style="height: calc(100vh - 180px);">
        <!-- Queue Panel -->
        <div class="w-72 shrink-0 bg-white rounded-xl border border-gray-200 flex flex-col">
          <div class="p-3 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-600">
              待接聽佇列
              <span class="badge badge-red ml-2">${MockData.agentQueue.length}</span>
            </h3>
          </div>
          <div class="flex-1 overflow-y-auto" id="queue-list">
            ${MockData.agentQueue.map(q => `
              <div class="queue-item ${this.activeQueue === q.id ? 'active' : ''}" onclick="AgentPage.selectQueue('${q.id}')">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-medium text-sm">${q.user}</span>
                  <span class="text-xs text-red-500">等待 ${q.waitTime}</span>
                </div>
                <div class="text-xs text-gray-500 truncate">${q.summary}</div>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-gray-400">${q.language}</span>
                  ${confidenceBadge(q.confidence)}
                </div>
              </div>
            `).join('')}
            ${MockData.agentQueue.length === 0 ? '<div class="p-4 text-center text-sm text-gray-400">目前無等待對話</div>' : ''}
          </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col">
          ${this.activeQueue ? this.renderChatArea() : this.renderEmptyChat()}
        </div>
      </div>
    `;
  },

  renderEmptyChat() {
    return `
      <div class="flex-1 flex items-center justify-center text-gray-400">
        <div class="text-center">
          <div class="text-4xl mb-3">🎧</div>
          <div>請從左側佇列選擇對話接聽</div>
        </div>
      </div>
    `;
  },

  renderChatArea() {
    const q = MockData.agentQueue.find(q => q.id === this.activeQueue);
    if (!q) return this.renderEmptyChat();

    return `
      <!-- Chat Header -->
      <div class="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <span class="font-semibold">${q.user}</span>
          <span class="text-sm text-gray-400 ml-2">${q.language} · 信心度 ${(q.confidence * 100).toFixed(0)}%</span>
        </div>
        <button class="btn btn-sm btn-danger" onclick="AgentPage.closeCase()">結案</button>
      </div>

      <!-- AI Context -->
      <div class="bg-yellow-50 border-b border-yellow-100 p-3">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs font-semibold text-yellow-700">📋 AI 對話脈絡（轉接前）</span>
          <button class="text-xs text-yellow-600 underline" onclick="AgentPage.toggleContext()">展開/收合</button>
        </div>
        <div id="ai-context" class="space-y-2">
          ${q.previousMessages.map(m => `
            <div class="text-xs ${m.role === 'user' ? 'text-blue-700' : 'text-gray-600'}">
              <span class="font-medium">${m.role === 'user' ? '使用者：' : 'AI：'}</span>${m.text}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3" id="chat-messages">
        <div class="text-center text-xs text-gray-400 mb-4">—— 真人客服已接手 ——</div>
        ${this.chatMessages.map(m => `
          <div class="flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}">
            <div>
              <div class="text-xs text-gray-400 mb-1 ${m.role === 'user' ? 'text-right' : ''}">${m.role === 'user' ? '使用者' : '🎧 客服人員'}</div>
              <div class="chat-bubble ${m.role === 'user' ? 'user' : 'agent'}">${m.text}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Input Area -->
      <div class="p-4 border-t border-gray-100">
        <div class="flex gap-2">
          <input type="text" class="form-input flex-1" placeholder="輸入回覆訊息..." id="agent-input"
            onkeydown="if(event.key==='Enter')AgentPage.sendMessage()">
          <button class="btn btn-primary" onclick="AgentPage.sendMessage()">發送</button>
        </div>
      </div>
    `;
  },

  selectQueue(id) {
    this.activeQueue = id;
    this.chatMessages = [];
    this.render(document.getElementById('main-content'));

    // Simulate user message after a delay
    setTimeout(() => {
      this.receiveUserMessage();
    }, 2000);
  },

  sendMessage() {
    const input = document.getElementById('agent-input');
    if (!input || !input.value.trim()) return;

    this.chatMessages.push({ role: 'agent', text: input.value.trim() });
    input.value = '';

    const chatArea = document.getElementById('chat-messages');
    if (chatArea) {
      const m = this.chatMessages[this.chatMessages.length - 1];
      const div = document.createElement('div');
      div.className = 'flex justify-start';
      div.innerHTML = `
        <div>
          <div class="text-xs text-gray-400 mb-1">🎧 客服人員</div>
          <div class="chat-bubble agent">${m.text}</div>
        </div>
      `;
      chatArea.appendChild(div);
      chatArea.scrollTop = chatArea.scrollHeight;
    }

    // Simulate user reply
    setTimeout(() => this.receiveUserMessage(), 3000);
  },

  receiveUserMessage() {
    const replies = [
      'Thank you for the information.',
      'So there\'s really no way to bring my dog without the test?',
      'How long would the quarantine isolation be?',
      'Can you help me understand the process step by step?',
      'I see, thank you for explaining.',
    ];
    const reply = replies[this.chatMessages.length % replies.length];

    this.chatMessages.push({ role: 'user', text: reply });

    const chatArea = document.getElementById('chat-messages');
    if (chatArea) {
      const div = document.createElement('div');
      div.className = 'flex justify-end';
      div.innerHTML = `
        <div>
          <div class="text-xs text-gray-400 mb-1 text-right">使用者</div>
          <div class="chat-bubble user">${reply}</div>
        </div>
      `;
      chatArea.appendChild(div);
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  },

  toggleContext() {
    const ctx = document.getElementById('ai-context');
    if (ctx) ctx.classList.toggle('hidden');
  },

  toggleStatus() {
    this.agentStatus = this.agentStatus === 'online' ? 'offline' : 'online';
    const btn = document.getElementById('agent-status-btn');
    if (btn) {
      btn.className = `btn btn-sm ${this.agentStatus === 'online' ? 'btn-primary' : 'btn-secondary'}`;
      btn.innerHTML = this.agentStatus === 'online' ? '🟢 上線中' : '⚫ 離線';
    }
    showToast(this.agentStatus === 'online' ? '已上線，可接聽對話' : '已離線');
  },

  closeCase() {
    showModal(`
      <div class="modal-header">
        <h3 class="font-semibold text-gray-800">結案</h3>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <div class="modal-body space-y-4">
        <div>
          <label class="form-label">結案分類</label>
          <select class="form-select">
            <option>已解決 — 提供正確資訊</option>
            <option>已解決 — 引導至其他管道</option>
            <option>未解決 — 需後續跟進</option>
            <option>未解決 — 使用者自行離開</option>
          </select>
        </div>
        <div>
          <label class="form-label">摘要</label>
          <textarea class="form-input" rows="3" placeholder="簡述對話內容與處理結果...">使用者詢問抗體力價不足是否有例外，已說明法規無例外條款，建議可先入境後送隔離檢疫場。</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal()" class="btn btn-secondary">取消</button>
        <button onclick="AgentPage.doCloseCase()" class="btn btn-primary">確認結案</button>
      </div>
    `);
  },

  doCloseCase() {
    // Remove from queue
    const idx = MockData.agentQueue.findIndex(q => q.id === this.activeQueue);
    if (idx > -1) MockData.agentQueue.splice(idx, 1);
    this.activeQueue = null;
    this.chatMessages = [];

    closeModal();
    showToast('✓ 對話已結案');
    this.render(document.getElementById('main-content'));
  },
};
