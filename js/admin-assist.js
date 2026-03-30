// ===== Admin Assist (內部行政輔助) Page =====
const AdminAssistPage = {
  activeTab: 'search',
  searchResults: null,
  summaryResult: null,
  draftResult: null,

  render(container) {
    container.innerHTML = `
      <h1 class="text-xl font-bold text-gray-800 mb-4">內部行政輔助</h1>
      <p class="text-sm text-gray-500 mb-4">提供內部人員專用介面，協助快速檢索規範、自動摘要諮詢重點及草擬公務回覆草案。</p>

      <div class="tab-bar mb-4">
        <div class="tab-item ${this.activeTab === 'search' ? 'active' : ''}" onclick="AdminAssistPage.switchTab('search')">規範快速檢索</div>
        <div class="tab-item ${this.activeTab === 'summary' ? 'active' : ''}" onclick="AdminAssistPage.switchTab('summary')">諮詢重點摘要</div>
        <div class="tab-item ${this.activeTab === 'draft' ? 'active' : ''}" onclick="AdminAssistPage.switchTab('draft')">公務回覆草擬</div>
      </div>

      <div id="admin-tab-content" class="animate-in">
        ${this.renderTab()}
      </div>
    `;
  },

  switchTab(tab) {
    this.activeTab = tab;
    const content = document.getElementById('admin-tab-content');
    if (content) {
      content.innerHTML = this.renderTab();
      content.classList.add('animate-in');
      setTimeout(() => content.classList.remove('animate-in'), 200);
    }
    document.querySelectorAll('.tab-item').forEach(t => {
      t.classList.toggle('active', t.textContent.trim() === {
        search: '規範快速檢索', summary: '諮詢重點摘要', draft: '公務回覆草擬',
      }[tab]);
    });
  },

  renderTab() {
    switch (this.activeTab) {
      case 'search': return this.renderSearch();
      case 'summary': return this.renderSummary();
      case 'draft': return this.renderDraft();
      default: return '';
    }
  },

  // ---- 規範快速檢索 ----
  renderSearch() {
    return `
      <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div>
          <label class="form-label">輸入查詢關鍵字或問題描述</label>
          <div class="flex gap-2">
            <input type="text" class="form-input flex-1" placeholder="例如：從狂犬病疫區入境犬隻需要哪些文件？" id="admin-search-input"
              onkeydown="if(event.key==='Enter')AdminAssistPage.doSearch()">
            <button class="btn btn-primary" onclick="AdminAssistPage.doSearch()">AI 檢索</button>
          </div>
        </div>

        <div class="flex gap-2 flex-wrap">
          <span class="text-xs text-gray-400">常用查詢：</span>
          <button class="text-xs text-green-700 bg-green-50 px-2 py-1 rounded hover:bg-green-100" onclick="document.getElementById('admin-search-input').value='狂犬病抗體力價不足如何處理';AdminAssistPage.doSearch()">抗體力價不足</button>
          <button class="text-xs text-green-700 bg-green-50 px-2 py-1 rounded hover:bg-green-100" onclick="document.getElementById('admin-search-input').value='非疫區國家犬貓入境簡化流程';AdminAssistPage.doSearch()">非疫區入境</button>
          <button class="text-xs text-green-700 bg-green-50 px-2 py-1 rounded hover:bg-green-100" onclick="document.getElementById('admin-search-input').value='隔離檢疫場所及費用規定';AdminAssistPage.doSearch()">隔離規定</button>
          <button class="text-xs text-green-700 bg-green-50 px-2 py-1 rounded hover:bg-green-100" onclick="document.getElementById('admin-search-input').value='晶片規格 ISO 標準';AdminAssistPage.doSearch()">晶片規格</button>
        </div>

        ${this.searchResults ? `
          <div class="border-t border-gray-100 pt-4 space-y-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm font-semibold text-gray-700">AI 檢索結果</span>
              <span class="badge badge-green">找到 ${this.searchResults.length} 筆相關規範</span>
            </div>
            ${this.searchResults.map((r, i) => `
              <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-sm text-gray-800">${i + 1}. ${r.title}</span>
                  <span class="badge badge-blue">${r.source}</span>
                </div>
                <div class="text-sm text-gray-600 leading-relaxed">${r.content}</div>
                <div class="flex gap-2">
                  ${r.laws.map(l => `<span class="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">📎 ${l}</span>`).join('')}
                </div>
                <div class="text-xs text-gray-400">相關度：${r.relevance}%</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  },

  doSearch() {
    const input = document.getElementById('admin-search-input');
    if (!input || !input.value.trim()) return;

    // Simulate AI search results
    this.searchResults = [
      {
        title: '狂犬病中和抗體力價檢測規定',
        source: '狂犬病防治作業辦法',
        content: '犬貓輸入時，應檢附由OIE認可實驗室出具之狂犬病中和抗體力價檢測報告，其力價須達 0.5 IU/ml 以上。採血日須距入境日至少 180 天以上。力價不足者，需重新施打疫苗後 30 天再次採血檢測。',
        laws: ['狂犬病防治作業辦法 第5條', '犬貓輸入檢疫作業辦法 第3條'],
        relevance: 95,
      },
      {
        title: '犬貓輸入檢疫所需文件',
        source: '犬貓輸入檢疫作業辦法',
        content: '輸入犬貓應檢附：(1) 輸出國政府機關核發之動物健康證明書 (2) 狂犬病預防注射證明 (3) 寵物晶片植入證明（ISO 11784/11785） (4) 狂犬病中和抗體力價檢測報告。',
        laws: ['犬貓輸入檢疫作業辦法 第3條', '犬貓輸入檢疫作業辦法 第4條'],
        relevance: 88,
      },
      {
        title: '疫區與非疫區國家分類',
        source: '2026年度疫區國家清單',
        content: '日本、澳洲、紐西蘭、英國、瑞典、冰島、挪威、夏威夷等為非狂犬病疫區。非疫區國家犬貓入境可適用簡化流程，但仍需檢附有效之狂犬病預防注射證明。',
        laws: ['犬貓輸入檢疫作業辦法 第6條'],
        relevance: 72,
      },
    ];

    showToast('AI 檢索完成');
    this.switchTab('search');
  },

  // ---- 諮詢重點摘要 ----
  renderSummary() {
    return `
      <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div>
          <label class="form-label">選擇要摘要的來源</label>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label class="form-label text-xs text-gray-400">從留言板選擇</label>
              <select class="form-select" id="summary-message-select">
                <option value="">請選擇留言...</option>
                ${MockData.messages.map(m => `<option value="${m.id}">${m.id} — ${m.name}：${m.description.substring(0, 30)}...</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="form-label text-xs text-gray-400">或從對話紀錄選擇</label>
              <select class="form-select" id="summary-conv-select">
                <option value="">請選擇對話...</option>
                ${MockData.conversations.map(c => `<option value="${c.id}">${c.id} — ${c.intent}（${c.language}）</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
        <div>
          <label class="form-label">或直接貼上諮詢內容</label>
          <textarea class="form-input" rows="4" id="summary-input" placeholder="貼上諮詢對話內容或描述..."></textarea>
        </div>
        <div class="flex justify-end">
          <button class="btn btn-primary" onclick="AdminAssistPage.doSummary()">AI 摘要</button>
        </div>

        ${this.summaryResult ? `
          <div class="border-t border-gray-100 pt-4 space-y-3">
            <h3 class="text-sm font-semibold text-gray-700">AI 摘要結果</h3>
            <div class="bg-yellow-50 rounded-lg p-4 space-y-3">
              <div>
                <div class="text-xs font-semibold text-yellow-700 mb-1">諮詢主旨</div>
                <div class="text-sm">${this.summaryResult.topic}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-yellow-700 mb-1">重點摘要</div>
                <ul class="text-sm space-y-1 list-disc list-inside">
                  ${this.summaryResult.points.map(p => `<li>${p}</li>`).join('')}
                </ul>
              </div>
              <div>
                <div class="text-xs font-semibold text-yellow-700 mb-1">涉及法規</div>
                <div class="flex gap-2 flex-wrap">
                  ${this.summaryResult.laws.map(l => `<span class="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">📎 ${l}</span>`).join('')}
                </div>
              </div>
              <div>
                <div class="text-xs font-semibold text-yellow-700 mb-1">建議處理方式</div>
                <div class="text-sm">${this.summaryResult.suggestion}</div>
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(document.querySelector('.bg-yellow-50').innerText); showToast('已複製摘要內容')">複製摘要</button>
              <button class="btn btn-primary btn-sm" onclick="AdminAssistPage.activeTab='draft'; AdminAssistPage.render(document.getElementById('main-content'));">前往草擬回覆</button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  doSummary() {
    const msgSelect = document.getElementById('summary-message-select')?.value;
    const convSelect = document.getElementById('summary-conv-select')?.value;
    const textInput = document.getElementById('summary-input')?.value;

    if (!msgSelect && !convSelect && !textInput?.trim()) {
      showToast('請選擇來源或輸入內容');
      return;
    }

    // Simulate AI summary
    this.summaryResult = {
      topic: '民眾詢問狂犬病抗體力價不足能否入境',
      points: [
        '民眾犬隻狂犬病中和抗體力價為 0.3 IU/ml，低於法定標準 0.5 IU/ml',
        '民眾已訂下週班機，時間緊迫，詢問是否有例外規定',
        'AI 客服已告知法規要求但對例外情形信心不足',
      ],
      laws: ['狂犬病防治作業辦法 第5條', '犬貓輸入檢疫作業辦法 第3條', '犬貓輸入檢疫作業辦法 第8條'],
      suggestion: '建議告知民眾目前法規無例外條款，但可先入境並將犬隻送至指定隔離檢疫場所，隔離期間完成補打疫苗與抗體檢測。費用由飼主負擔。',
    };

    showToast('AI 摘要完成');
    this.switchTab('summary');
  },

  // ---- 公務回覆草擬 ----
  renderDraft() {
    return `
      <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label class="form-label">回覆對象</label>
            <select class="form-select" id="draft-target">
              <option value="">直接輸入...</option>
              ${MockData.messages.filter(m => m.status !== 'replied').map(m => `<option value="${m.id}">${m.name}（${m.id} — ${m.category}）</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="form-label">回覆類型</label>
            <select class="form-select" id="draft-type">
              <option>一般民眾諮詢回覆</option>
              <option>跨機關公文草稿</option>
              <option>內部簽呈草稿</option>
              <option>新聞稿 / 對外說明</option>
            </select>
          </div>
        </div>
        <div>
          <label class="form-label">問題 / 需求描述</label>
          <textarea class="form-input" rows="3" id="draft-question" placeholder="描述需要回覆的問題或需求..."></textarea>
        </div>
        <div>
          <label class="form-label">補充指示（選填）</label>
          <input type="text" class="form-input" id="draft-instruction" placeholder="例如：語氣正式、需引用法規條文、附上聯絡窗口資訊...">
        </div>
        <div class="flex justify-end">
          <button class="btn btn-primary" onclick="AdminAssistPage.doDraft()">AI 草擬</button>
        </div>

        ${this.draftResult ? `
          <div class="border-t border-gray-100 pt-4 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-700">AI 草擬回覆</h3>
              <span class="text-xs text-gray-400">此為 AI 草案，請人工審核後使用</span>
            </div>
            <div class="relative">
              <textarea class="form-input" rows="10" id="draft-output">${this.draftResult}</textarea>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-400">
              <span>📎 引用來源：</span>
              <span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">狂犬病防治作業辦法 第5條</span>
              <span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">犬貓輸入檢疫作業辦法 第3條</span>
              <span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">犬貓輸入檢疫作業辦法 第8條</span>
            </div>
            <div class="flex justify-end gap-2">
              <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(document.getElementById('draft-output').value); showToast('已複製草案內容')">複製草案</button>
              <button class="btn btn-primary btn-sm" onclick="AdminAssistPage.sendToReply()">套用至留言回覆</button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  doDraft() {
    const question = document.getElementById('draft-question')?.value;
    if (!question?.trim()) {
      showToast('請輸入問題描述');
      return;
    }

    // Simulate AI draft
    this.draftResult = `您好：

感謝您的來信諮詢。關於您所詢問之事項，敬覆如下：

一、依據《狂犬病防治作業辦法》第5條規定，犬貓輸入時應檢附由世界動物衛生組織（WOAH/OIE）認可實驗室出具之狂犬病中和抗體力價檢測報告，其力價須達 0.5 IU/ml 以上。

二、若抗體力價未達標準，依現行法規並無例外條款。建議處理方式如下：
    (1) 重新施打狂犬病疫苗，待 30 天後再行採血檢測。
    (2) 若時間急迫需先行入境，犬隻將依《犬貓輸入檢疫作業辦法》第8條規定送至指定隔離檢疫場所，隔離期間需完成補打疫苗與抗體檢測，相關費用由飼主自行負擔。

三、隔離檢疫天數為 7 天（自入境日起算），費用約 NT$3,000-5,000/日，依各隔離場所公告收費標準為準。

如有其他疑問，歡迎來電或再次留言洽詢。

順頌　時祺

農業部動植物防疫檢疫署
犬貓出入境檢疫服務窗口
服務電話：(02) xxxx-xxxx
服務時間：週一至週五 08:30-17:30`;

    showToast('AI 草擬完成');
    this.switchTab('draft');
  },

  sendToReply() {
    const targetId = document.getElementById('draft-target')?.value;
    const draftContent = document.getElementById('draft-output')?.value;

    if (targetId && draftContent) {
      const m = MockData.messages.find(m => m.id === targetId);
      if (m) {
        m.reply = draftContent;
        closeModal();
        MessagesPage.replyMessage(targetId);
        return;
      }
    }
    showToast('已複製草案，請至留言板管理頁面進行回覆');
  },
};
