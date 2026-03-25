// ===== App Router & Utilities =====

const App = {
  currentPage: 'dashboard',

  init() {
    this.bindNav();
    this.handleHash();
    window.addEventListener('hashchange', () => this.handleHash());
  },

  bindNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const page = item.dataset.page;
        if (page) {
          window.location.hash = page;
        }
      });
    });
  },

  handleHash() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    this.navigate(hash);
  },

  navigate(page) {
    this.currentPage = page;

    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Render page
    const main = document.getElementById('main-content');
    main.innerHTML = '';
    main.classList.add('animate-in');
    setTimeout(() => main.classList.remove('animate-in'), 200);

    switch (page) {
      case 'dashboard': DashboardPage.render(main); break;
      case 'knowledge': KnowledgePage.render(main); break;
      case 'agent': AgentPage.render(main); break;
      case 'system': SystemPage.render(main); break;
      case 'audit': AuditPage.render(main); break;
      default: main.innerHTML = '<p class="text-gray-500">頁面不存在</p>';
    }
  },
};

// ===== Utility Functions =====

function showModal(html) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  content.innerHTML = html;
  overlay.classList.remove('hidden');
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  msgEl.textContent = msg;
  toast.classList.remove('hidden');
  toast.classList.add('toast-show');
  setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('toast-show');
  }, 2500);
}

function statusBadge(status) {
  const map = {
    published: { class: 'badge-green', text: '已發佈' },
    review: { class: 'badge-yellow', text: '審核中' },
    draft: { class: 'badge-gray', text: '草稿' },
    active: { class: 'badge-green', text: '啟用' },
    inactive: { class: 'badge-red', text: '停用' },
    done: { class: 'badge-green', text: '已完成' },
    pending: { class: 'badge-yellow', text: '處理中' },
    none: { class: 'badge-gray', text: '未執行' },
  };
  const s = map[status] || { class: 'badge-gray', text: status };
  return `<span class="badge ${s.class}">${s.text}</span>`;
}

function confidenceBadge(conf) {
  if (conf >= 0.8) return `<span class="badge badge-green">${(conf * 100).toFixed(0)}%</span>`;
  if (conf >= 0.6) return `<span class="badge badge-yellow">${(conf * 100).toFixed(0)}%</span>`;
  return `<span class="badge badge-red">${(conf * 100).toFixed(0)}%</span>`;
}

function starRating(score) {
  const full = Math.floor(score);
  const half = score - full >= 0.5;
  let stars = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) stars += '★';
    else if (i === full && half) stars += '☆';
    else stars += '☆';
  }
  return `<span class="text-yellow-500">${stars}</span> <span class="text-sm text-gray-500">${score}</span>`;
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => App.init());
