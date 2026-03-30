// ===== Knowledge Base Page =====
const KnowledgePage = {
  selectedCategory: null,

  render(container) {
    const kb = MockData.knowledgeBase;

    container.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold text-gray-800">知識庫管理</h1>
        <button class="btn btn-primary" onclick="KnowledgePage.showUploadDialog()">⬆ 上傳文件</button>
      </div>

      <div class="flex gap-4">
        <!-- Category Tree -->
        <div class="w-64 shrink-0 bg-white rounded-xl border border-gray-200 p-4">
          <h3 class="text-sm font-semibold text-gray-600 mb-3">知識分類</h3>
          <div id="category-tree">
            <div class="tree-item selected" onclick="KnowledgePage.filterCategory(null, this)">
              📁 全部 <span class="text-xs text-gray-400 ml-auto">${kb.items.length}</span>
            </div>
            ${kb.categories.map(cat => `
              <div>
                <div class="tree-item font-medium" onclick="KnowledgePage.filterCategory('${cat.name}', this)">
                  ${cat.icon} ${cat.name}
                </div>
                ${cat.children.map(child => `
                  <div class="tree-item" style="padding-left: 2.5rem; font-size: 0.8125rem;" onclick="KnowledgePage.filterCategory('${cat.name}', this)">
                    └ ${child.name} <span class="text-xs text-gray-400 ml-auto">${child.count}</span>
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- File List -->
        <div class="flex-1 bg-white rounded-xl border border-gray-200 p-4">
          <div class="flex items-center gap-2 mb-4">
            <input type="text" placeholder="搜尋知識文件..." class="form-input" style="max-width:300px" id="kb-search">
            <select class="form-select" style="width:120px" id="kb-status-filter">
              <option value="">全部狀態</option>
              <option value="published">已發佈</option>
              <option value="review">審核中</option>
              <option value="draft">草稿</option>
            </select>
          </div>
          <div id="kb-table-wrap">
            ${this.renderTable(kb.items)}
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  renderTable(items) {
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>文件名稱</th>
            <th>分類</th>
            <th>版本</th>
            <th>狀態</th>
            <th>Embedding</th>
            <th>更新時間</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>
                <div class="font-medium">${item.title}</div>
                ${item.law ? `<div class="text-xs text-gray-400">${item.law}</div>` : ''}
              </td>
              <td class="text-sm">${item.category}</td>
              <td class="font-mono text-sm">${item.version}</td>
              <td>${statusBadge(item.status)}</td>
              <td>${statusBadge(item.embeddingStatus)}</td>
              <td class="text-sm text-gray-500">${item.updatedAt}<br><span class="text-xs">${item.updatedBy}</span></td>
              <td>
                <div class="flex gap-1">
                  <button class="btn btn-sm btn-secondary" onclick="KnowledgePage.showVersionHistory('${item.id}')">版本</button>
                  ${item.status === 'draft' ? `<button class="btn btn-sm btn-primary" onclick="KnowledgePage.submitReview('${item.id}')">送審</button>` : ''}
                  ${item.status === 'review' ? `<button class="btn btn-sm btn-primary" onclick="KnowledgePage.approve('${item.id}')">核准發佈</button>` : ''}
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  },

  filterCategory(category, el) {
    this.selectedCategory = category;
    document.querySelectorAll('#category-tree .tree-item').forEach(i => i.classList.remove('selected'));
    if (el) el.classList.add('selected');
    this.applyFilter();
  },

  applyFilter() {
    const keyword = document.getElementById('kb-search')?.value.toLowerCase() || '';
    const status = document.getElementById('kb-status-filter')?.value || '';
    const items = MockData.knowledgeBase.items.filter(item => {
      const matchCat = !this.selectedCategory || item.category === this.selectedCategory;
      const matchKeyword = !keyword || item.title.toLowerCase().includes(keyword);
      const matchStatus = !status || item.status === status;
      return matchCat && matchKeyword && matchStatus;
    });
    document.getElementById('kb-table-wrap').innerHTML = this.renderTable(items);
  },

  bindEvents() {
    const search = document.getElementById('kb-search');
    const filter = document.getElementById('kb-status-filter');
    if (search) search.addEventListener('input', () => this.applyFilter());
    if (filter) filter.addEventListener('change', () => this.applyFilter());
  },

  showUploadDialog() {
    showModal(`
      <div class="modal-header">
        <h3 class="font-semibold text-gray-800">上傳知識文件</h3>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <div class="modal-body space-y-4">
        <div>
          <label class="form-label">文件標題</label>
          <input type="text" class="form-input" placeholder="輸入文件標題" id="upload-title">
        </div>
        <div>
          <label class="form-label">分類</label>
          <select class="form-select" id="upload-category">
            ${MockData.knowledgeBase.categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="form-label">法規條文編號（選填）</label>
          <input type="text" class="form-input" placeholder="例：動物傳染病防治條例 第34條" id="upload-law">
        </div>
        <div>
          <label class="form-label">選擇檔案</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
            <div class="text-3xl mb-2">📄</div>
            <div>拖曳檔案至此或 <span class="text-green-700 font-medium cursor-pointer">點擊瀏覽</span></div>
            <div class="text-xs mt-1">支援 PDF、Word、HTML、Excel（最大 50MB）</div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="closeModal()" class="btn btn-secondary">取消</button>
        <button onclick="KnowledgePage.doUpload()" class="btn btn-primary">上傳並建立草稿</button>
      </div>
    `);
  },

  doUpload() {
    const title = document.getElementById('upload-title')?.value || '新知識文件';
    closeModal();

    // Add mock item
    MockData.knowledgeBase.items.unshift({
      id: 'K' + String(MockData.knowledgeBase.items.length + 1).padStart(3, '0'),
      title: title,
      category: document.getElementById('upload-category')?.value || '常見問答 (FAQ)',
      status: 'draft',
      updatedAt: '2026-03-20',
      updatedBy: '管理員',
      version: 'v0.1',
      embeddingStatus: 'none',
      law: document.getElementById('upload-law')?.value || '',
    });

    showToast(`✓ 已上傳「${title}」，狀態：草稿`);
    KnowledgePage.render(document.getElementById('main-content'));
  },

  submitReview(id) {
    const item = MockData.knowledgeBase.items.find(i => i.id === id);
    if (item) {
      item.status = 'review';
      showToast(`✓ 已將「${item.title}」送審`);
      this.applyFilter();
    }
  },

  approve(id) {
    const item = MockData.knowledgeBase.items.find(i => i.id === id);
    if (item) {
      item.status = 'published';
      item.embeddingStatus = 'pending';
      showToast(`✓ 已核准發佈「${item.title}」，Embedding 處理中...`);

      // Simulate embedding completion
      setTimeout(() => {
        item.embeddingStatus = 'done';
        if (App.currentPage === 'knowledge') {
          this.applyFilter();
          showToast(`✓「${item.title}」Embedding 已完成`);
        }
      }, 3000);

      this.applyFilter();
    }
  },

  showVersionHistory(id) {
    const item = MockData.knowledgeBase.items.find(i => i.id === id);
    const versions = MockData.knowledgeBase.versions;

    showModal(`
      <div class="modal-header">
        <div>
          <h3 class="font-semibold text-gray-800">版本歷程 — ${item?.title || id}</h3>
        </div>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <div class="modal-body">
        <table class="data-table">
          <thead>
            <tr><th>版本</th><th>日期</th><th>修改者</th><th>說明</th><th>操作</th></tr>
          </thead>
          <tbody>
            ${versions.map((v, i) => `
              <tr>
                <td class="font-mono">${v.version}</td>
                <td>${v.date}</td>
                <td>${v.author}</td>
                <td>${v.note}</td>
                <td>
                  ${v.changes ? `<button class="btn btn-sm btn-secondary" onclick="KnowledgePage.showDiff('${v.version}')">比對</button>` : ''}
                  ${i > 0 ? `<button class="btn btn-sm btn-secondary" onclick="KnowledgePage.rollback('${v.version}')">回溯</button>` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `);
  },

  showDiff(version) {
    const v = MockData.knowledgeBase.versions.find(v => v.version === version);
    if (!v || !v.changes) return;

    showModal(`
      <div class="modal-header">
        <h3 class="font-semibold text-gray-800">版本比對 — ${version}</h3>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <div class="modal-body">
        <p class="text-sm text-gray-500 mb-3">${v.note}</p>
        <div class="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-1">
          ${v.changes.split('\n').map(line => {
            if (line.startsWith('+')) return `<div class="diff-add px-2 py-0.5 rounded">${line}</div>`;
            if (line.startsWith('-')) return `<div class="diff-remove px-2 py-0.5 rounded">${line}</div>`;
            return `<div class="px-2 py-0.5">${line}</div>`;
          }).join('')}
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="KnowledgePage.showVersionHistory('K001')" class="btn btn-secondary">返回</button>
      </div>
    `);
  },

  rollback(version) {
    closeModal();
    showToast(`✓ 已回溯至版本 ${version}`);
  },
};
