// ===== System Management Page =====
const SystemPage = {
  activeTab: 'accounts',

  render(container) {
    container.innerHTML = `
      <h1 class="text-xl font-bold text-gray-800 mb-4">系統管理</h1>

      <div class="tab-bar mb-4">
        <div class="tab-item ${this.activeTab === 'accounts' ? 'active' : ''}" onclick="SystemPage.switchTab('accounts')">帳號與權限</div>
        <div class="tab-item ${this.activeTab === 'ai' ? 'active' : ''}" onclick="SystemPage.switchTab('ai')">AI 參數設定</div>
        <div class="tab-item ${this.activeTab === 'languages' ? 'active' : ''}" onclick="SystemPage.switchTab('languages')">多語系管理</div>
        <div class="tab-item ${this.activeTab === 'announcements' ? 'active' : ''}" onclick="SystemPage.switchTab('announcements')">公告管理</div>
        <div class="tab-item ${this.activeTab === 'service' ? 'active' : ''}" onclick="SystemPage.switchTab('service')">服務時間</div>
      </div>

      <div id="tab-content" class="animate-in">
        ${this.renderTab()}
      </div>
    `;
  },

  switchTab(tab) {
    this.activeTab = tab;
    const content = document.getElementById('tab-content');
    if (content) {
      content.innerHTML = this.renderTab();
      content.classList.add('animate-in');
      setTimeout(() => content.classList.remove('animate-in'), 200);
    }
    document.querySelectorAll('.tab-item').forEach(t => {
      t.classList.toggle('active', t.textContent.trim() === {
        accounts: '帳號與權限', ai: 'AI 參數設定', languages: '多語系管理',
        announcements: '公告管理', service: '服務時間',
      }[tab]);
    });
  },

  renderTab() {
    switch (this.activeTab) {
      case 'accounts': return this.renderAccounts();
      case 'ai': return this.renderAI();
      case 'languages': return this.renderLanguages();
      case 'announcements': return this.renderAnnouncements();
      case 'service': return this.renderService();
      default: return '';
    }
  },

  // ---- Accounts Tab ----
  renderAccounts() {
    return `
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-700">帳號管理</h2>
          <button class="btn btn-primary" onclick="SystemPage.showAddAccount()">＋ 新增帳號</button>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>Email</th>
              <th>角色</th>
              <th>狀態</th>
              <th>最後登入</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${MockData.accounts.map(a => `
              <tr>
                <td class="font-medium">${a.name}</td>
                <td class="text-sm text-gray-500">${a.email}</td>
                <td><span class="badge badge-blue">${a.role}</span></td>
                <td>${statusBadge(a.status)}</td>
                <td class="text-sm text-gray-500">${a.lastLogin}</td>
                <td>
                  <div class="flex gap-1">
                    <button class="btn btn-sm btn-secondary" onclick="SystemPage.editAccount('${a.id}')">編輯</button>
                    <button class="btn btn-sm btn-secondary" onclick="SystemPage.toggleAccount('${a.id}')">
                      ${a.status === 'active' ? '停用' : '啟用'}
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h3 class="font-semibold text-gray-700 mt-8 mb-3">角色權限對照</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>角色</th>
              <th>儀表板</th>
              <th>知識庫管理</th>
              <th>客服工作台</th>
              <th>系統管理</th>
              <th>資安稽核</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="font-medium">系統管理員</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
            <tr><td class="font-medium">知識管理員</td><td>👁</td><td>✓</td><td>—</td><td>—</td><td>—</td></tr>
            <tr><td class="font-medium">客服督導</td><td>✓</td><td>👁</td><td>✓</td><td>—</td><td>—</td></tr>
            <tr><td class="font-medium">客服人員</td><td>—</td><td>—</td><td>✓</td><td>—</td><td>—</td></tr>
          </tbody>
        </table>
        <div class="text-xs text-gray-400 mt-2">✓ 完整權限 · 👁 唯讀 · — 無權限</div>
      </div>
    `;
  },

  showAddAccount() {
    showModal(`
      <div class="modal-header">
        <h3 class="font-semibold text-gray-800">新增帳號</h3>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <div class="modal-body space-y-4">
        <div>
          <label class="form-label">姓名</label>
          <input type="text" class="form-input" placeholder="輸入姓名" id="new-name">
        </div>
        <div>
          <label class="form-label">Email</label>
          <input type="email" class="form-input" placeholder="name@baphiq.gov.tw" id="new-email">
        </div>
        <div>
          <label class="form-label">角色</label>
          <select class="form-select" id="new-role">
            <option>系統管理員</option>
            <option>知識管理員</option>
            <option>客服督導</option>
            <option selected>客服人員</option>
          </select>
        </div>
        <div>
          <label class="form-label">初始密碼</label>
          <input type="text" class="form-input" value="Baphiq@2026" readonly>
          <div class="text-xs text-gray-400 mt-1">首次登入需強制變更密碼</div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal()" class="btn btn-secondary">取消</button>
        <button onclick="SystemPage.doAddAccount()" class="btn btn-primary">建立帳號</button>
      </div>
    `);
  },

  doAddAccount() {
    const name = document.getElementById('new-name')?.value || '新使用者';
    const email = document.getElementById('new-email')?.value || 'new@baphiq.gov.tw';
    const role = document.getElementById('new-role')?.value || '客服人員';

    MockData.accounts.push({
      id: 'U' + String(MockData.accounts.length + 1).padStart(3, '0'),
      name, email, role, status: 'active', lastLogin: '—',
    });

    closeModal();
    showToast(`✓ 已建立帳號「${name}」`);
    this.switchTab('accounts');
  },

  editAccount(id) {
    const a = MockData.accounts.find(a => a.id === id);
    if (!a) return;

    showModal(`
      <div class="modal-header">
        <h3 class="font-semibold text-gray-800">編輯帳號 — ${a.name}</h3>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <div class="modal-body space-y-4">
        <div>
          <label class="form-label">姓名</label>
          <input type="text" class="form-input" value="${a.name}" id="edit-name">
        </div>
        <div>
          <label class="form-label">Email</label>
          <input type="email" class="form-input" value="${a.email}" id="edit-email">
        </div>
        <div>
          <label class="form-label">角色</label>
          <select class="form-select" id="edit-role">
            ${['系統管理員', '知識管理員', '客服督導', '客服人員'].map(r =>
              `<option ${r === a.role ? 'selected' : ''}>${r}</option>`
            ).join('')}
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal()" class="btn btn-secondary">取消</button>
        <button onclick="SystemPage.doEditAccount('${id}')" class="btn btn-primary">儲存</button>
      </div>
    `);
  },

  doEditAccount(id) {
    const a = MockData.accounts.find(a => a.id === id);
    if (a) {
      a.name = document.getElementById('edit-name')?.value || a.name;
      a.email = document.getElementById('edit-email')?.value || a.email;
      a.role = document.getElementById('edit-role')?.value || a.role;
    }
    closeModal();
    showToast('✓ 帳號已更新');
    this.switchTab('accounts');
  },

  toggleAccount(id) {
    const a = MockData.accounts.find(a => a.id === id);
    if (a) {
      a.status = a.status === 'active' ? 'inactive' : 'active';
      showToast(`✓「${a.name}」已${a.status === 'active' ? '啟用' : '停用'}`);
      this.switchTab('accounts');
    }
  },

  // ---- AI Settings Tab ----
  renderAI() {
    const s = MockData.aiSettings;
    return `
      <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-6">
        <div>
          <h2 class="font-semibold text-gray-700 mb-4">信心度閾值</h2>
          <div class="flex items-center gap-4">
            <input type="range" min="0.3" max="0.9" step="0.05" value="${s.confidenceThreshold}"
              class="flex-1" id="confidence-slider"
              oninput="document.getElementById('confidence-val').textContent = this.value">
            <span id="confidence-val" class="text-lg font-bold text-green-700 w-12 text-center">${s.confidenceThreshold}</span>
          </div>
          <div class="text-xs text-gray-400 mt-1">低於此閾值的回覆將觸發人機轉接</div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Temperature</label>
            <input type="number" class="form-input" value="${s.temperature}" min="0" max="1" step="0.1">
            <div class="text-xs text-gray-400 mt-1">較低值使回覆更精確，較高值更有創意</div>
          </div>
          <div>
            <label class="form-label">Max Tokens</label>
            <input type="number" class="form-input" value="${s.maxTokens}" min="256" max="4096" step="256">
          </div>
        </div>

        <div>
          <label class="form-label">System Prompt</label>
          <textarea class="form-input" rows="4">${s.systemPrompt}</textarea>
        </div>

        <div>
          <label class="form-label">歡迎語</label>
          <textarea class="form-input" rows="2">${s.welcomeMessage}</textarea>
        </div>

        <div class="flex justify-end">
          <button class="btn btn-primary" onclick="showToast('✓ AI 參數已儲存')">儲存設定</button>
        </div>
      </div>
    `;
  },

  // ---- Languages Tab ----
  renderLanguages() {
    const langs = MockData.aiSettings.languages;
    return `
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h2 class="font-semibold text-gray-700 mb-4">支援語系</h2>
        <div class="space-y-2">
          ${langs.map((lang, i) => `
            <div class="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
              <div class="flex items-center gap-3">
                <input type="checkbox" checked class="w-4 h-4 accent-green-700">
                <span>${lang}</span>
                ${i < 2 ? '<span class="badge badge-green">AI 語意辨識</span>' : '<span class="badge badge-gray">基本翻譯</span>'}
              </div>
              ${i >= 2 ? '<button class="text-xs text-red-400 hover:text-red-600">移除</button>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ---- Announcements Tab ----
  renderAnnouncements() {
    const anns = MockData.aiSettings.announcements;
    return `
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-700">前台公告管理</h2>
          <button class="btn btn-primary" onclick="SystemPage.addAnnouncement()">＋ 新增公告</button>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>公告內容</th><th>建立日期</th><th>狀態</th><th>操作</th></tr>
          </thead>
          <tbody>
            ${anns.map(a => `
              <tr>
                <td>${a.title}</td>
                <td class="text-sm text-gray-500">${a.date}</td>
                <td>${a.active ? '<span class="badge badge-green">顯示中</span>' : '<span class="badge badge-gray">已關閉</span>'}</td>
                <td>
                  <button class="btn btn-sm btn-secondary" onclick="SystemPage.toggleAnnouncement('${a.id}')">
                    ${a.active ? '關閉' : '開啟'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  addAnnouncement() {
    showModal(`
      <div class="modal-header">
        <h3 class="font-semibold text-gray-800">新增公告</h3>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <div class="modal-body">
        <label class="form-label">公告內容</label>
        <input type="text" class="form-input" placeholder="輸入公告內容..." id="new-announcement">
      </div>
      <div class="modal-footer">
        <button onclick="closeModal()" class="btn btn-secondary">取消</button>
        <button onclick="SystemPage.doAddAnnouncement()" class="btn btn-primary">發佈</button>
      </div>
    `);
  },

  doAddAnnouncement() {
    const text = document.getElementById('new-announcement')?.value || '新公告';
    MockData.aiSettings.announcements.push({
      id: 'A' + String(MockData.aiSettings.announcements.length + 1).padStart(3, '0'),
      title: text, active: true, date: '2026-03-20',
    });
    closeModal();
    showToast('✓ 公告已發佈');
    this.switchTab('announcements');
  },

  toggleAnnouncement(id) {
    const a = MockData.aiSettings.announcements.find(a => a.id === id);
    if (a) {
      a.active = !a.active;
      showToast(a.active ? '✓ 公告已開啟' : '✓ 公告已關閉');
      this.switchTab('announcements');
    }
  },

  // ---- Service Hours Tab ----
  renderService() {
    const s = MockData.aiSettings.serviceHours;
    return `
      <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-6">
        <div>
          <h2 class="font-semibold text-gray-700 mb-4">真人客服服務時段</h2>
          <div class="grid grid-cols-2 gap-4" style="max-width:400px">
            <div>
              <label class="form-label">開始時間</label>
              <input type="time" class="form-input" value="${s.start}">
            </div>
            <div>
              <label class="form-label">結束時間</label>
              <input type="time" class="form-input" value="${s.end}">
            </div>
          </div>
          <div class="text-xs text-gray-400 mt-2">非服務時段將自動切換為純 AI 客服模式（24×7 運作）</div>
        </div>

        <div>
          <h3 class="font-semibold text-gray-700 mb-3">服務日設定</h3>
          <div class="flex gap-2">
            ${['一', '二', '三', '四', '五', '六', '日'].map((d, i) => `
              <label class="flex flex-col items-center gap-1">
                <input type="checkbox" ${i < 5 ? 'checked' : ''} class="w-4 h-4 accent-green-700">
                <span class="text-sm">週${d}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <div class="flex justify-end">
          <button class="btn btn-primary" onclick="showToast('✓ 服務時間已儲存')">儲存設定</button>
        </div>
      </div>
    `;
  },
};
