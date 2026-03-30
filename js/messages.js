// ===== Messages (留言板管理) Page =====
const MessagesPage = {
  filterStatus: '',
  filterCategory: '',

  render(container) {
    const msgs = this.getFilteredMessages();
    const pending = MockData.messages.filter(m => m.status === 'pending').length;
    const processing = MockData.messages.filter(m => m.status === 'processing').length;
    const replied = MockData.messages.filter(m => m.status === 'replied').length;

    container.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold text-gray-800">留言板管理</h1>
        <div class="flex items-center gap-2">
          <span class="badge badge-red">待回覆 ${pending}</span>
          <span class="badge badge-yellow">處理中 ${processing}</span>
          <span class="badge badge-green">已回覆 ${replied}</span>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex gap-3 mb-4">
        <select class="form-select" style="width:150px" id="msg-filter-status" onchange="MessagesPage.applyFilter()">
          <option value="">全部狀態</option>
          <option value="pending" ${this.filterStatus === 'pending' ? 'selected' : ''}>待回覆</option>
          <option value="processing" ${this.filterStatus === 'processing' ? 'selected' : ''}>處理中</option>
          <option value="replied" ${this.filterStatus === 'replied' ? 'selected' : ''}>已回覆</option>
        </select>
        <select class="form-select" style="width:180px" id="msg-filter-category" onchange="MessagesPage.applyFilter()">
          <option value="">全部分類</option>
          ${MockData.messageCategories.map(c => `<option value="${c}" ${this.filterCategory === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
        <input type="text" class="form-input" style="width:200px" placeholder="搜尋留言者或內容..." id="msg-search" oninput="MessagesPage.applyFilter()">
      </div>

      <!-- Messages Table -->
      <div class="bg-white rounded-xl border border-gray-200">
        <table class="data-table">
          <thead>
            <tr>
              <th>編號</th>
              <th>留言者</th>
              <th>問題分類</th>
              <th>問題摘要</th>
              <th>留言時間</th>
              <th>回覆狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${msgs.map(m => `
              <tr>
                <td class="font-mono text-xs">${m.id}</td>
                <td>
                  <div class="font-medium">${m.name}</div>
                  <div class="text-xs text-gray-400">${m.email}</div>
                </td>
                <td><span class="badge badge-blue">${m.category}</span></td>
                <td class="max-w-xs">
                  <div class="truncate text-sm" style="max-width:220px" title="${m.description.replace(/"/g, '&quot;')}">${m.description}</div>
                </td>
                <td class="text-sm text-gray-500">${m.createdAt}</td>
                <td>${this.statusBadge(m.status)}</td>
                <td>
                  <div class="flex gap-1">
                    <button class="btn btn-sm btn-secondary" onclick="MessagesPage.viewMessage('${m.id}')">查看</button>
                    ${m.status !== 'replied' ? `<button class="btn btn-sm btn-primary" onclick="MessagesPage.replyMessage('${m.id}')">回覆</button>` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
            ${msgs.length === 0 ? '<tr><td colspan="7" class="text-center text-gray-400 py-8">無符合條件的留言</td></tr>' : ''}
          </tbody>
        </table>
      </div>
    `;
  },

  statusBadge(status) {
    const map = {
      pending: '<span class="badge badge-red">待回覆</span>',
      processing: '<span class="badge badge-yellow">處理中</span>',
      replied: '<span class="badge badge-green">已回覆</span>',
    };
    return map[status] || status;
  },

  getFilteredMessages() {
    const search = document.getElementById('msg-search')?.value?.toLowerCase() || '';
    return MockData.messages.filter(m => {
      if (this.filterStatus && m.status !== this.filterStatus) return false;
      if (this.filterCategory && m.category !== this.filterCategory) return false;
      if (search && !m.name.toLowerCase().includes(search) && !m.description.toLowerCase().includes(search) && !m.email.toLowerCase().includes(search)) return false;
      return true;
    });
  },

  applyFilter() {
    this.filterStatus = document.getElementById('msg-filter-status')?.value || '';
    this.filterCategory = document.getElementById('msg-filter-category')?.value || '';
    this.render(document.getElementById('main-content'));
  },

  viewMessage(id) {
    const m = MockData.messages.find(m => m.id === id);
    if (!m) return;

    showModal(`
      <div class="modal-header">
        <div>
          <h3 class="font-semibold text-gray-800">留言詳情 — ${m.id}</h3>
          <div class="text-sm text-gray-500 mt-1">${m.createdAt} · ${this.statusBadge(m.status)}</div>
        </div>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <div class="modal-body space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-xs text-gray-400 mb-1">留言者姓名</div>
            <div class="font-medium">${m.name}</div>
          </div>
          <div>
            <div class="text-xs text-gray-400 mb-1">Email</div>
            <div class="font-medium">${m.email}</div>
          </div>
        </div>
        <div>
          <div class="text-xs text-gray-400 mb-1">問題分類</div>
          <span class="badge badge-blue">${m.category}</span>
        </div>
        <div>
          <div class="text-xs text-gray-400 mb-1">問題描述</div>
          <div class="bg-gray-50 rounded-lg p-3 text-sm leading-relaxed">${m.description}</div>
        </div>
        ${m.status === 'replied' ? `
          <div class="border-t border-gray-100 pt-4">
            <div class="text-xs text-gray-400 mb-1">回覆內容（${m.repliedBy} · ${m.repliedAt}）</div>
            <div class="bg-green-50 rounded-lg p-3 text-sm leading-relaxed">${m.reply}</div>
          </div>
        ` : ''}
      </div>
      <div class="modal-footer">
        ${m.status !== 'replied' ? `<button class="btn btn-primary" onclick="closeModal(); MessagesPage.replyMessage('${m.id}');">回覆</button>` : ''}
        <button onclick="closeModal()" class="btn btn-secondary">關閉</button>
      </div>
    `);
  },

  replyMessage(id) {
    const m = MockData.messages.find(m => m.id === id);
    if (!m) return;

    // Mark as processing
    if (m.status === 'pending') {
      m.status = 'processing';
    }

    showModal(`
      <div class="modal-header">
        <div>
          <h3 class="font-semibold text-gray-800">回覆留言 — ${m.id}</h3>
          <div class="text-sm text-gray-500 mt-1">${m.name} · ${m.email}</div>
        </div>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <div class="modal-body space-y-4">
        <div>
          <div class="text-xs text-gray-400 mb-1">問題分類</div>
          <span class="badge badge-blue">${m.category}</span>
        </div>
        <div>
          <div class="text-xs text-gray-400 mb-1">問題描述</div>
          <div class="bg-gray-50 rounded-lg p-3 text-sm leading-relaxed">${m.description}</div>
        </div>
        <div>
          <label class="form-label">回覆內容</label>
          <textarea class="form-input" rows="5" id="reply-content" placeholder="輸入回覆內容...">${m.reply}</textarea>
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" id="send-email" checked class="w-4 h-4 accent-green-700">
          <label for="send-email" class="text-sm text-gray-600">同時發送 Email 通知留言者（${m.email}）</label>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal(); MessagesPage.render(document.getElementById('main-content'));" class="btn btn-secondary">取消</button>
        <button onclick="MessagesPage.doReply('${m.id}')" class="btn btn-primary">送出回覆</button>
      </div>
    `);
  },

  doReply(id) {
    const m = MockData.messages.find(m => m.id === id);
    const content = document.getElementById('reply-content')?.value;
    const sendEmail = document.getElementById('send-email')?.checked;

    if (!content || !content.trim()) {
      showToast('請輸入回覆內容');
      return;
    }

    if (m) {
      m.status = 'replied';
      m.reply = content.trim();
      m.repliedAt = '2026-03-30 ' + new Date().toTimeString().slice(0, 5);
      m.repliedBy = '管理員';
    }

    closeModal();
    showToast(sendEmail ? '回覆已送出，Email 已發送至留言者' : '回覆已送出');
    this.render(document.getElementById('main-content'));
  },
};
