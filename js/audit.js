// ===== Audit Page =====
const AuditPage = {
  activeTab: 'logs',

  render(container) {
    container.innerHTML = `
      <h1 class="text-xl font-bold text-gray-800 mb-4">資安稽核</h1>

      <div class="tab-bar mb-4">
        <div class="tab-item ${this.activeTab === 'logs' ? 'active' : ''}" onclick="AuditPage.switchTab('logs')">操作日誌</div>
        <div class="tab-item ${this.activeTab === 'access' ? 'active' : ''}" onclick="AuditPage.switchTab('access')">資料存取紀錄</div>
        <div class="tab-item ${this.activeTab === 'pii' ? 'active' : ''}" onclick="AuditPage.switchTab('pii')">個資管理</div>
        <div class="tab-item ${this.activeTab === 'retention' ? 'active' : ''}" onclick="AuditPage.switchTab('retention')">資料保留與銷毀</div>
      </div>

      <div id="audit-tab-content" class="animate-in">
        ${this.renderTab()}
      </div>
    `;
  },

  switchTab(tab) {
    this.activeTab = tab;
    const content = document.getElementById('audit-tab-content');
    if (content) {
      content.innerHTML = this.renderTab();
      content.classList.add('animate-in');
      setTimeout(() => content.classList.remove('animate-in'), 200);
    }
    document.querySelectorAll('.tab-item').forEach(t => {
      const map = { '操作日誌': 'logs', '資料存取紀錄': 'access', '個資管理': 'pii', '資料保留與銷毀': 'retention' };
      t.classList.toggle('active', map[t.textContent.trim()] === tab);
    });
  },

  renderTab() {
    switch (this.activeTab) {
      case 'logs': return this.renderLogs();
      case 'access': return this.renderAccess();
      case 'pii': return this.renderPII();
      case 'retention': return this.renderRetention();
      default: return '';
    }
  },

  // ---- Operation Logs ----
  renderLogs() {
    return `
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-700">操作日誌</h2>
          <div class="flex gap-2">
            <input type="date" class="form-input" style="width:160px" value="2026-03-20">
            <select class="form-select" style="width:140px" id="log-user-filter">
              <option value="">全部使用者</option>
              ${[...new Set(MockData.auditLogs.map(l => l.user))].map(u =>
                `<option value="${u}">${u}</option>`
              ).join('')}
            </select>
            <select class="form-select" style="width:140px" id="log-action-filter">
              <option value="">全部操作</option>
              ${[...new Set(MockData.auditLogs.map(l => l.action))].map(a =>
                `<option value="${a}">${a}</option>`
              ).join('')}
            </select>
          </div>
        </div>
        <div id="log-table-wrap">
          ${this.renderLogTable(MockData.auditLogs)}
        </div>
      </div>
    `;
  },

  renderLogTable(logs) {
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>時間</th>
            <th>使用者</th>
            <th>操作</th>
            <th>對象</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          ${logs.map(l => `
            <tr>
              <td class="font-mono text-xs">${l.time}</td>
              <td>${l.user}</td>
              <td>
                <span class="badge ${this.actionBadgeClass(l.action)}">${l.action}</span>
              </td>
              <td class="text-sm">${l.target}</td>
              <td class="font-mono text-xs text-gray-400">${l.ip}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="text-xs text-gray-400 mt-3 text-center">共 ${logs.length} 筆紀錄（不可竄改）</div>
    `;
  },

  actionBadgeClass(action) {
    if (action.includes('登入')) return 'badge-blue';
    if (action.includes('上傳') || action.includes('新增')) return 'badge-green';
    if (action.includes('修改') || action.includes('更新')) return 'badge-yellow';
    if (action.includes('刪除')) return 'badge-red';
    return 'badge-gray';
  },

  // ---- Data Access Records ----
  renderAccess() {
    const accessLogs = [
      { time: '2026-03-20 09:20:15', user: '李小華', dataType: '知識庫文件', target: '非疫區國家犬貓入境簡化流程公告', action: '上傳', ip: '10.0.1.55' },
      { time: '2026-03-20 10:07:44', user: '陳小芳', dataType: '對話紀錄', target: 'C-20260320-001 ~ C-20260320-005', action: '查詢', ip: '10.0.1.60' },
      { time: '2026-03-20 10:12:33', user: '林小傑', dataType: '對話紀錄', target: 'C-20260320-002（含使用者個資）', action: '檢視', ip: '10.0.1.61' },
      { time: '2026-03-20 10:35:18', user: '王小明', dataType: '稽核日誌', target: '2026-03 操作日誌（完整匯出）', action: '匯出', ip: '10.0.1.52' },
      { time: '2026-03-20 11:00:05', user: '李小華', dataType: '知識庫文件', target: '犬貓輸入檢疫作業辦法', action: '修改', ip: '10.0.1.55' },
    ];

    return `
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-700">資料存取紀錄</h2>
          <div class="text-xs text-gray-400">記錄知識庫、對話紀錄等敏感資料的存取軌跡</div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>時間</th>
              <th>使用者</th>
              <th>資料類型</th>
              <th>存取對象</th>
              <th>操作</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            ${accessLogs.map(l => `
              <tr>
                <td class="font-mono text-xs">${l.time}</td>
                <td>${l.user}</td>
                <td><span class="badge badge-blue">${l.dataType}</span></td>
                <td class="text-sm">${l.target}</td>
                <td><span class="badge ${l.action === '匯出' ? 'badge-yellow' : 'badge-gray'}">${l.action}</span></td>
                <td class="font-mono text-xs text-gray-400">${l.ip}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ---- PII Management ----
  renderPII() {
    return `
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h2 class="font-semibold text-gray-700 mb-4">個資查詢與管理</h2>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div class="text-sm text-yellow-800">
            ⚠️ 依《個人資料保護法》規定，當事人得請求查閱、複製、補充、更正、停止蒐集、處理、利用或刪除其個人資料。
          </div>
        </div>

        <div class="flex gap-2 mb-6">
          <input type="text" class="form-input" placeholder="輸入使用者 ID 或對話編號..." id="pii-search" style="max-width:400px">
          <button class="btn btn-primary" onclick="AuditPage.searchPII()">查詢</button>
        </div>

        <div id="pii-result" class="hidden">
          <div class="border border-gray-200 rounded-lg p-4 mb-4">
            <h3 class="font-semibold text-gray-700 mb-3">查詢結果</h3>
            <table class="data-table">
              <thead>
                <tr><th>資料類型</th><th>內容摘要</th><th>建立時間</th><th>操作</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>對話紀錄</td>
                  <td>C-20260320-002（5 則訊息）</td>
                  <td>2026-03-20 10:05</td>
                  <td>
                    <button class="btn btn-sm btn-secondary" onclick="AuditPage.deidentify()">去識別化</button>
                    <button class="btn btn-sm btn-danger" onclick="AuditPage.deletePII()">刪除</button>
                  </td>
                </tr>
                <tr>
                  <td>語音紀錄</td>
                  <td>voice_20260320_002.wav（2.3 MB）</td>
                  <td>2026-03-20 10:05</td>
                  <td>
                    <button class="btn btn-sm btn-danger" onclick="AuditPage.deletePII()">刪除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  searchPII() {
    const input = document.getElementById('pii-search');
    if (input && input.value.trim()) {
      document.getElementById('pii-result')?.classList.remove('hidden');
      showToast('已查詢到 2 筆相關個資紀錄');
    }
  },

  deidentify() {
    showModal(`
      <div class="modal-header">
        <h3 class="font-semibold text-gray-800">確認去識別化</h3>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <div class="modal-body">
        <p class="text-sm text-gray-600 mb-4">此操作將對話紀錄中的個人資料替換為匿名標記（如：使用者 → [REDACTED]）。此操作不可逆。</p>
        <div class="bg-gray-50 rounded-lg p-3 text-sm font-mono">
          <div class="diff-remove">原文：My name is John Smith, flight BR123 arriving March 25</div>
          <div class="diff-add">替換：My name is [REDACTED], flight [REDACTED] arriving [REDACTED]</div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal()" class="btn btn-secondary">取消</button>
        <button onclick="closeModal(); showToast('✓ 已完成去識別化處理')" class="btn btn-danger">確認去識別化</button>
      </div>
    `);
  },

  deletePII() {
    showModal(`
      <div class="modal-header">
        <h3 class="font-semibold text-gray-800">確認刪除個資</h3>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <div class="modal-body">
        <p class="text-sm text-red-600 font-medium mb-2">⚠️ 此操作不可逆</p>
        <p class="text-sm text-gray-600">將永久刪除此筆個人資料。刪除紀錄將保留於稽核日誌中。</p>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal()" class="btn btn-secondary">取消</button>
        <button onclick="closeModal(); showToast('✓ 個資已刪除，紀錄已寫入稽核日誌')" class="btn btn-danger">確認刪除</button>
      </div>
    `);
  },

  // ---- Data Retention ----
  renderRetention() {
    const r = MockData.dataRetention;
    return `
      <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-6">
        <div>
          <h2 class="font-semibold text-gray-700 mb-4">資料保留期限設定</h2>
          <div class="text-sm text-gray-500 mb-4">到期資料將自動銷毀，銷毀紀錄保留於稽核日誌</div>

          <div class="space-y-4" style="max-width: 500px;">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-sm">對話紀錄</div>
                <div class="text-xs text-gray-400">包含文字對話內容</div>
              </div>
              <div class="flex items-center gap-2">
                <input type="number" class="form-input" style="width:80px" value="${r.conversationDays}">
                <span class="text-sm text-gray-500">天</span>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-sm">語音檔案</div>
                <div class="text-xs text-gray-400">STT 原始錄音</div>
              </div>
              <div class="flex items-center gap-2">
                <input type="number" class="form-input" style="width:80px" value="${r.voiceFileDays}">
                <span class="text-sm text-gray-500">天</span>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-sm">稽核日誌</div>
                <div class="text-xs text-gray-400">操作紀錄與存取日誌</div>
              </div>
              <div class="flex items-center gap-2">
                <input type="number" class="form-input" style="width:80px" value="${r.auditLogDays}">
                <span class="text-sm text-gray-500">天</span>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-4">
          <h3 class="font-semibold text-gray-700 mb-3">自動銷毀排程狀態</h3>
          <div class="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
            <div class="flex justify-between">
              <span>上次執行時間</span>
              <span class="font-mono">2026-03-20 02:00:00</span>
            </div>
            <div class="flex justify-between">
              <span>本次銷毀筆數</span>
              <span>對話紀錄 0 筆 · 語音檔案 3 筆</span>
            </div>
            <div class="flex justify-between">
              <span>下次排程時間</span>
              <span class="font-mono">2026-03-21 02:00:00</span>
            </div>
            <div class="flex justify-between">
              <span>排程狀態</span>
              <span class="badge badge-green">正常運作</span>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            📧 <strong>Email 通知：</strong>每次自動銷毀完成後，系統將發送 Email 通知資安人員，內容包含銷毀筆數與時間戳記。
          </div>
        </div>

        <div class="flex justify-end">
          <button class="btn btn-primary" onclick="showToast('✓ 保留期限設定已儲存')">儲存設定</button>
        </div>
      </div>
    `;
  },
};
