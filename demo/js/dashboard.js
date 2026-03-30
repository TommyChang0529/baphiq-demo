// ===== Dashboard Page =====
const DashboardPage = {
  render(container) {
    const d = MockData.stats;
    container.innerHTML = `
      <h1 class="text-xl font-bold text-gray-800 mb-4">儀表板</h1>

      <!-- Stat Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="stat-card">
          <div class="stat-value text-blue-600">${d.onlineUsers}</div>
          <div class="stat-label">目前在線人數</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${d.todayConversations}</div>
          <div class="stat-label">今日對話數</div>
        </div>
        <div class="stat-card">
          <div class="stat-value text-green-600">${d.aiResolutionRate}%</div>
          <div class="stat-label">AI 解決率</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${d.avgResponseTime}s</div>
          <div class="stat-label">平均回覆時間</div>
        </div>
      </div>

      <!-- SLA & AI Quality -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h2 class="font-semibold text-gray-700 mb-4">SLA 達成率</h2>
          <div class="space-y-3">
            ${this.slaBar('AI 回覆 ≤ 5 秒', 94)}
            ${this.slaBar('STT 處理 ≤ 3 秒', 97)}
            ${this.slaBar('系統可用率', d.uptime)}
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h2 class="font-semibold text-gray-700 mb-4">AI 品質指標</h2>
          <div class="space-y-3">
            ${this.slaBar('意圖辨識準確率 (≥85%)', d.intentAccuracy, d.intentAccuracy >= 85)}
            ${this.slaBar('回覆正確率 (≥90%)', d.replyAccuracy, d.replyAccuracy >= 90)}
            ${this.slaBar('AI 無法回答率（建議留言）', d.suggestMessageRate, true, true)}
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h2 class="font-semibold text-gray-700 mb-4">今日對話量（每小時）</h2>
          <canvas id="hourlyChart" height="200"></canvas>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h2 class="font-semibold text-gray-700 mb-4">意圖分布</h2>
          <canvas id="intentChart" height="200"></canvas>
        </div>
      </div>

      <!-- Satisfaction -->
      <div class="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-700">滿意度回饋（Feedback SDK）</h2>
          <div>${starRating(MockData.feedback.avgScore)} <span class="text-gray-400 text-sm ml-2">(${MockData.feedback.total} 則)</span></div>
        </div>
        <div class="flex items-end gap-2 h-24">
          ${MockData.feedback.distribution.map((count, i) => {
            const pct = (count / MockData.feedback.total * 100);
            return `<div class="flex-1 flex flex-col items-center gap-1">
              <span class="text-xs text-gray-500">${count}</span>
              <div class="w-full bg-yellow-100 rounded-t" style="height: ${Math.max(pct, 4)}%">
                <div class="w-full h-full bg-yellow-400 rounded-t"></div>
              </div>
              <span class="text-xs text-gray-500">${i + 1}★</span>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Conversation History -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-700">對話紀錄</h2>
          <div class="flex gap-2">
            <input type="text" placeholder="搜尋關鍵字..." class="form-input" style="width:200px" id="conv-search">
            <select class="form-select" style="width:120px" id="conv-filter">
              <option value="">全部類型</option>
              <option value="文字">文字</option>
              <option value="語音">語音</option>
            </select>
          </div>
        </div>
        <div id="conv-table-wrap">
          ${this.renderConversationTable(MockData.conversations)}
        </div>
      </div>
    `;

    this.initCharts();
    this.bindEvents();
  },

  slaBar(label, value, pass = true, invert = false) {
    const color = invert
      ? (value <= 20 ? 'bg-green-500' : 'bg-yellow-500')
      : (pass ? 'bg-green-500' : 'bg-red-500');
    return `
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span class="text-gray-600">${label}</span>
          <span class="font-semibold ${pass || invert ? 'text-green-700' : 'text-red-600'}">${value}%</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="${color} h-2 rounded-full" style="width: ${Math.min(value, 100)}%"></div>
        </div>
      </div>
    `;
  },

  renderConversationTable(conversations) {
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>對話編號</th>
            <th>時間</th>
            <th>類型</th>
            <th>語系</th>
            <th>意圖</th>
            <th>信心度</th>
            <th>狀態</th>
            <th>滿意度</th>
          </tr>
        </thead>
        <tbody>
          ${conversations.map(c => `
            <tr class="clickable" onclick="DashboardPage.showConversation('${c.id}')">
              <td class="font-mono text-xs">${c.id}</td>
              <td>${c.startTime}</td>
              <td><span class="badge ${c.type === '語音' ? 'badge-blue' : 'badge-gray'}">${c.type}</span></td>
              <td>${c.language}</td>
              <td>${c.intent}</td>
              <td>${confidenceBadge(c.confidence)}</td>
              <td>${c.resolved
                ? '<span class="badge badge-green">AI 解決</span>'
                : '<span class="badge badge-yellow">建議留言</span>'
              }</td>
              <td>${'★'.repeat(c.satisfaction)}${'☆'.repeat(5 - c.satisfaction)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  },

  showConversation(id) {
    const conv = MockData.conversations.find(c => c.id === id);
    if (!conv) return;

    showModal(`
      <div class="modal-header">
        <div>
          <h3 class="font-semibold text-gray-800">對話紀錄 — ${conv.id}</h3>
          <div class="text-sm text-gray-500 mt-1">${conv.startTime} · ${conv.duration} · ${conv.language} · ${conv.intent}</div>
        </div>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <div class="modal-body space-y-3">
        ${conv.messages.map(m => `
          <div class="flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}">
            <div>
              <div class="text-xs text-gray-400 mb-1 ${m.role === 'user' ? 'text-right' : ''}">${m.role === 'user' ? '使用者' : m.role === 'agent' ? '📝 留言回覆' : '🤖 AI'}</div>
              <div class="chat-bubble ${m.role}">${m.text.replace(/\n/g, '<br>')}</div>
              ${m.sources && m.sources.length > 0 ? `
                <div class="mt-1 flex flex-wrap gap-1">
                  ${m.sources.map(s => `<span class="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">📎 ${s}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
      <div class="modal-footer">
        <div class="flex-1 flex items-center gap-2">
          <span class="text-sm text-gray-500">品質標記：</span>
          <button class="btn btn-sm btn-secondary" onclick="DashboardPage.markQuality('${conv.id}', 'correct')">✓ 正確</button>
          <button class="btn btn-sm btn-secondary" onclick="DashboardPage.markQuality('${conv.id}', 'partial')">△ 部分正確</button>
          <button class="btn btn-sm btn-secondary" onclick="DashboardPage.markQuality('${conv.id}', 'wrong')">✗ 錯誤</button>
        </div>
        <button onclick="closeModal()" class="btn btn-secondary">關閉</button>
      </div>
    `);
  },

  markQuality(id, quality) {
    const labels = { correct: '正確', partial: '部分正確', wrong: '錯誤' };
    closeModal();
    showToast(`已將 ${id} 標記為「${labels[quality]}」`);
  },

  initCharts() {
    // Hourly chart
    const hourlyCtx = document.getElementById('hourlyChart');
    if (hourlyCtx) {
      new Chart(hourlyCtx, {
        type: 'bar',
        data: {
          labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          datasets: [{
            label: '對話數',
            data: MockData.hourlyData,
            backgroundColor: 'rgba(4, 120, 87, 0.6)',
            borderRadius: 4,
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 5 } },
            x: { ticks: { font: { size: 10 } } }
          }
        }
      });
    }

    // Intent chart
    const intentCtx = document.getElementById('intentChart');
    if (intentCtx) {
      const colors = ['#047857', '#0d9488', '#0284c7', '#7c3aed', '#db2777', '#9ca3af'];
      new Chart(intentCtx, {
        type: 'doughnut',
        data: {
          labels: MockData.intentDistribution.map(i => i.label),
          datasets: [{
            data: MockData.intentDistribution.map(i => i.value),
            backgroundColor: colors,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'right', labels: { font: { size: 12 } } }
          }
        }
      });
    }
  },

  bindEvents() {
    const search = document.getElementById('conv-search');
    const filter = document.getElementById('conv-filter');
    if (search && filter) {
      const doFilter = () => {
        const keyword = search.value.toLowerCase();
        const type = filter.value;
        const filtered = MockData.conversations.filter(c => {
          const matchKeyword = !keyword ||
            c.id.toLowerCase().includes(keyword) ||
            c.intent.includes(keyword) ||
            c.language.includes(keyword);
          const matchType = !type || c.type === type;
          return matchKeyword && matchType;
        });
        document.getElementById('conv-table-wrap').innerHTML = this.renderConversationTable(filtered);
      };
      search.addEventListener('input', doFilter);
      filter.addEventListener('change', doFilter);
    }
  },
};
