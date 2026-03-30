// ===== Mock Data =====
const MockData = {
  // Dashboard stats
  stats: {
    onlineUsers: 12,
    todayConversations: 87,
    aiResolutionRate: 82,
    avgResponseTime: 2.8,
    sttLatency: 1.9,
    intentAccuracy: 88,
    replyAccuracy: 91,
    suggestMessageRate: 18,
    uptime: 99.7,
    satisfactionScore: 4.2,
  },

  // Hourly conversation data for chart
  hourlyData: [2, 1, 0, 0, 1, 3, 8, 15, 22, 18, 14, 12, 19, 16, 13, 11, 15, 20, 12, 8, 5, 4, 3, 2],

  // Intent distribution for chart
  intentDistribution: [
    { label: '入境檢疫流程', value: 35 },
    { label: '狂犬病抗體檢測', value: 22 },
    { label: '疫苗與晶片', value: 18 },
    { label: '出境檢疫', value: 12 },
    { label: '隔離規定', value: 8 },
    { label: '其他', value: 5 },
  ],

  // Conversations
  conversations: [
    {
      id: 'C-20260320-001',
      user: '匿名使用者',
      startTime: '2026-03-20 09:12',
      duration: '4 分鐘',
      type: '文字',
      language: '中文',
      intent: '入境檢疫流程',
      confidence: 0.92,
      resolved: true,
      satisfaction: 5,
      messages: [
        { role: 'bot', text: '您好！歡迎使用犬貓出入境檢疫智慧客服系統。請問有什麼可以為您服務的？' },
        { role: 'user', text: '我想從日本帶狗回台灣，需要什麼手續？' },
        { role: 'bot', text: '從日本（非狂犬病疫區）攜帶犬隻入境台灣，您需要準備以下文件：\n\n1. 輸出國政府機關核發之動物健康證明書\n2. 狂犬病預防注射證明（有效期內）\n3. 寵物晶片植入證明\n4. 狂犬病中和抗體力價檢測報告（≥ 0.5 IU/ml）\n\n📎 相關法規：《犬貓輸入檢疫作業辦法》第3條', sources: ['犬貓輸入檢疫作業辦法 第3條', '動物傳染病防治條例 第34條'] },
        { role: 'user', text: '抗體檢測要在哪裡做？' },
        { role: 'bot', text: '狂犬病中和抗體力價檢測須由OIE認可實驗室執行。在台灣，可至農業部家畜衛生試驗所辦理。\n\n⚠️ 請注意：採血日須距入境日至少 180 天以上。\n\n📎 相關法規：《狂犬病防治作業辦法》第5條', sources: ['狂犬病防治作業辦法 第5條'] },
      ]
    },
    {
      id: 'C-20260320-002',
      user: '匿名使用者',
      startTime: '2026-03-20 10:05',
      duration: '6 分鐘',
      type: '文字',
      language: '英文',
      intent: '狂犬病抗體檢測',
      confidence: 0.45,
      resolved: false,
      handoff: true,
      satisfaction: 3,
      messages: [
        { role: 'bot', text: 'Hello! Welcome to the Pet Import/Export Quarantine Service. How can I help you?' },
        { role: 'user', text: 'My dog\'s rabies titer test result is 0.3 IU/ml, can I still bring it to Taiwan?' },
        { role: 'bot', text: 'Based on the regulations, the rabies neutralizing antibody titer must be ≥ 0.5 IU/ml. A result of 0.3 IU/ml does not meet the requirement.\n\nYou will need to:\n1. Re-vaccinate your dog against rabies\n2. Wait 30 days after vaccination\n3. Conduct a new antibody titer test\n\n📎 Reference: Article 5, Rabies Prevention Regulations', sources: ['狂犬病防治作業辦法 第5條'] },
        { role: 'user', text: 'But I already booked my flight for next week, is there any exception?' },
        { role: 'bot', text: '⚠️ 此問題較為複雜，建議您透過留言板留下詳細資訊，將由專人為您回覆。\n\n請至「線上留言」填寫您的問題，我們將盡速回覆。', sources: [] },
      ]
    },
    {
      id: 'C-20260320-003',
      user: '匿名使用者',
      startTime: '2026-03-20 11:30',
      duration: '2 分鐘',
      type: '語音',
      language: '中文',
      intent: '疫苗與晶片',
      confidence: 0.88,
      resolved: true,
      satisfaction: 4,
      messages: [
        { role: 'bot', text: '您好！歡迎使用語音客服。請問有什麼可以為您服務的？' },
        { role: 'user', text: '狗的晶片有規格要求嗎？' },
        { role: 'bot', text: '是的，犬隻晶片須符合 ISO 11784/11785 國際標準規格（15碼）。\n\n若您的寵物植入的晶片非 ISO 標準規格，請自備可讀取該晶片之讀取器。\n\n📎 相關法規：《犬貓輸入檢疫作業辦法》第4條', sources: ['犬貓輸入檢疫作業辦法 第4條'] },
      ]
    },
    {
      id: 'C-20260320-004',
      user: '匿名使用者',
      startTime: '2026-03-20 14:22',
      duration: '3 分鐘',
      type: '文字',
      language: '越南語',
      intent: '入境檢疫流程',
      confidence: 0.79,
      resolved: true,
      satisfaction: 4,
      messages: [
        { role: 'bot', text: 'Xin chào! Chào mừng bạn đến với hệ thống tư vấn kiểm dịch thú cưng.' },
        { role: 'user', text: 'Tôi muốn mang mèo từ Việt Nam sang Đài Loan' },
        { role: 'bot', text: 'Việt Nam thuộc vùng có bệnh dại. Để mang mèo từ Việt Nam vào Đài Loan, bạn cần:\n\n1. Giấy chứng nhận sức khỏe động vật\n2. Chứng nhận tiêm phòng dại (còn hiệu lực)\n3. Chip nhận dạng (ISO 11784/11785)\n4. Xét nghiệm kháng thể dại (≥ 0.5 IU/ml)\n5. Thời gian chờ ≥ 180 ngày sau khi lấy máu xét nghiệm\n\n📎 Quy định: Điều 3, Quy chế kiểm dịch nhập khẩu chó mèo', sources: ['犬貓輸入檢疫作業辦法 第3條'] },
      ]
    },
    {
      id: 'C-20260320-005',
      user: '匿名使用者',
      startTime: '2026-03-20 15:48',
      duration: '1 分鐘',
      type: '文字',
      language: '中文',
      intent: '隔離規定',
      confidence: 0.95,
      resolved: true,
      satisfaction: 5,
      messages: [
        { role: 'bot', text: '您好！歡迎使用犬貓出入境檢疫智慧客服系統。' },
        { role: 'user', text: '隔離檢疫要幾天？費用多少？' },
        { role: 'bot', text: '犬貓入境隔離檢疫相關規定如下：\n\n• 隔離天數：7 天（自入境日起算）\n• 隔離場所：行政院農業委員會指定之動物隔離場\n• 費用：隔離費用依各隔離場所公告收費標準，約 NT$3,000-5,000/日\n• 費用由飼主自行負擔\n\n📎 相關法規：《犬貓輸入檢疫作業辦法》第8條', sources: ['犬貓輸入檢疫作業辦法 第8條'] },
      ]
    },
  ],

  // Knowledge Base Items
  knowledgeBase: {
    categories: [
      {
        name: '法規條文', icon: '📜', children: [
          { name: '動物傳染病防治條例', count: 12 },
          { name: '犬貓輸出入檢疫相關規定', count: 8 },
          { name: '狂犬病防治相關法規', count: 6 },
        ]
      },
      {
        name: '標準作業程序 (SOP)', icon: '📋', children: [
          { name: '入境檢疫流程', count: 5 },
          { name: '出境檢疫流程', count: 3 },
          { name: '狂犬病抗體檢測流程', count: 4 },
          { name: '隔離檢疫流程', count: 3 },
        ]
      },
      {
        name: '公告與最新消息', icon: '📢', children: [
          { name: '疫區/非疫區國家清單更新', count: 2 },
          { name: '政策異動公告', count: 5 },
        ]
      },
      {
        name: '常見問答 (FAQ)', icon: '❓', children: [
          { name: '入境相關', count: 15 },
          { name: '出境相關', count: 8 },
          { name: '疫苗與晶片', count: 10 },
          { name: '狂犬病抗體', count: 7 },
        ]
      },
      {
        name: '歷史答詢紀錄', icon: '📁', children: [
          { name: '經審核之優質回覆範例', count: 20 },
        ]
      },
    ],
    items: [
      { id: 'K001', title: '犬貓輸入檢疫作業辦法', category: '法規條文', status: 'published', updatedAt: '2026-03-15', updatedBy: '王小明', version: 'v3.2', embeddingStatus: 'done', law: '動植物檢疫法 子法' },
      { id: 'K002', title: '狂犬病防治作業辦法', category: '法規條文', status: 'published', updatedAt: '2026-03-10', updatedBy: '王小明', version: 'v2.1', embeddingStatus: 'done', law: '動物傳染病防治條例 子法' },
      { id: 'K003', title: '2026年度疫區國家清單', category: '公告與最新消息', status: 'published', updatedAt: '2026-03-01', updatedBy: '李小華', version: 'v1.3', embeddingStatus: 'done', law: '' },
      { id: 'K004', title: '入境檢疫申請 SOP', category: '標準作業程序 (SOP)', status: 'published', updatedAt: '2026-02-20', updatedBy: '王小明', version: 'v2.0', embeddingStatus: 'done', law: '' },
      { id: 'K005', title: '非疫區國家犬貓入境簡化流程公告', category: '公告與最新消息', status: 'review', updatedAt: '2026-03-19', updatedBy: '李小華', version: 'v1.0', embeddingStatus: 'pending', law: '' },
      { id: 'K006', title: '常見問題：抗體力價不足之處理方式', category: '常見問答 (FAQ)', status: 'draft', updatedAt: '2026-03-20', updatedBy: '陳小芳', version: 'v0.1', embeddingStatus: 'none', law: '' },
      { id: 'K007', title: '狂犬病抗體檢測實驗室清單', category: '標準作業程序 (SOP)', status: 'published', updatedAt: '2026-01-15', updatedBy: '王小明', version: 'v1.5', embeddingStatus: 'done', law: '' },
      { id: 'K008', title: '出境檢疫申請 SOP', category: '標準作業程序 (SOP)', status: 'published', updatedAt: '2026-02-28', updatedBy: '李小華', version: 'v1.2', embeddingStatus: 'done', law: '' },
    ],
    versions: [
      { version: 'v3.2', date: '2026-03-15', author: '王小明', note: '更新第3條隔離天數規定', changes: '+隔離天數由14天調整為7天\n-原隔離天數14天' },
      { version: 'v3.1', date: '2026-02-01', author: '王小明', note: '新增第12條罰則說明' },
      { version: 'v3.0', date: '2026-01-10', author: '李小華', note: '配合修法全面更新' },
      { version: 'v2.5', date: '2025-11-20', author: '王小明', note: '更新附表一非疫區清單' },
    ],
  },

  // Message Board
  messages: [
    {
      id: 'M001',
      name: '陳大文',
      email: 'chen.dawen@gmail.com',
      category: '入境檢疫流程',
      description: '我預計下個月從日本帶柴犬回台灣，請問狂犬病抗體檢測報告需要在哪裡做？有效期限是多久？謝謝。',
      status: 'replied',
      createdAt: '2026-03-28 14:30',
      repliedAt: '2026-03-28 16:15',
      repliedBy: '李小華',
      reply: '您好，狂犬病中和抗體力價檢測須由 OIE 認可實驗室執行。在台灣可至農業部家畜衛生試驗所辦理。採血日須距入境日至少 180 天以上，報告效期為施打狂犬病疫苗有效期限內。如有其他疑問歡迎再次留言。',
    },
    {
      id: 'M002',
      name: 'John Smith',
      email: 'john.smith@email.com',
      category: '狂犬病抗體檢測',
      description: 'My dog\'s rabies titer test result is 0.3 IU/ml. I\'ve already booked my flight for next week. Is there any way I can still bring my dog to Taiwan?',
      status: 'pending',
      createdAt: '2026-03-29 09:20',
      repliedAt: null,
      repliedBy: null,
      reply: '',
    },
    {
      id: 'M003',
      name: '阮氏秋',
      email: 'nguyen.thu@email.com',
      category: '入境檢疫流程',
      description: '我從越南要帶貓來台灣，請問需要準備哪些文件？貓沒有打過疫苗也沒有晶片，可以入境嗎？',
      status: 'pending',
      createdAt: '2026-03-29 11:05',
      repliedAt: null,
      repliedBy: null,
      reply: '',
    },
    {
      id: 'M004',
      name: '林小美',
      email: 'lin.mei@yahoo.com.tw',
      category: '隔離規定',
      description: '請問犬隻入境隔離檢疫期間，飼主可以探視嗎？隔離場所的環境如何？費用大概多少？',
      status: 'replied',
      createdAt: '2026-03-27 10:00',
      repliedAt: '2026-03-27 14:30',
      repliedBy: '陳小芳',
      reply: '您好，隔離期間飼主可依各隔離場所規定預約探視。隔離天數為 7 天（自入境日起算），費用約 NT$3,000-5,000/日，由飼主自行負擔。各隔離場所環境及探視規定略有不同，建議您直接聯繫預定使用的隔離場所確認細節。',
    },
    {
      id: 'M005',
      name: '張志豪',
      email: 'chang.chihao@gmail.com',
      category: '疫苗與晶片',
      description: '狗的晶片是在國外植入的，規格是 AVID 系統的 9 碼晶片，這樣可以入境嗎？還是一定要換成 ISO 標準的？',
      status: 'processing',
      createdAt: '2026-03-29 15:40',
      repliedAt: null,
      repliedBy: null,
      reply: '',
    },
  ],

  messageCategories: ['入境檢疫流程', '出境檢疫流程', '狂犬病抗體檢測', '疫苗與晶片', '隔離規定', '其他'],

  // Accounts
  accounts: [
    { id: 'U001', name: '王小明', email: 'wang@baphiq.gov.tw', role: '系統管理員', status: 'active', lastLogin: '2026-03-20 08:30' },
    { id: 'U002', name: '李小華', email: 'lee@baphiq.gov.tw', role: '知識管理員', status: 'active', lastLogin: '2026-03-20 09:15' },
    { id: 'U003', name: '陳小芳', email: 'chen@baphiq.gov.tw', role: '客服督導', status: 'active', lastLogin: '2026-03-20 08:45' },
    { id: 'U004', name: '林小傑', email: 'lin@baphiq.gov.tw', role: '客服人員', status: 'active', lastLogin: '2026-03-20 09:00' },
    { id: 'U005', name: '張小美', email: 'chang@baphiq.gov.tw', role: '客服人員', status: 'inactive', lastLogin: '2026-03-18 17:30' },
  ],

  // AI Settings
  aiSettings: {
    temperature: 0.3,
    maxTokens: 2048,
    systemPrompt: '你是農業部動植物防疫檢疫署的犬貓出入境檢疫智慧客服。請依據知識庫內容回答問題，並附上相關法規來源。如果不確定答案，請誠實告知並建議使用者透過留言板留下問題。',
    confidenceThreshold: 0.6,
    languages: ['中文', '英文', '越南語', '印尼語', '泰語', '日語', '韓語', '菲律賓語', '馬來語'],
    welcomeMessage: '您好！歡迎使用犬貓出入境檢疫智慧客服系統。請問有什麼可以為您服務的？',
    serviceHours: { start: '08:30', end: '17:30' },
    announcements: [
      { id: 'A001', title: '系統維護通知：3/25 凌晨 2-4 點', active: true, date: '2026-03-20' },
      { id: 'A002', title: '新增越南語語音客服支援', active: true, date: '2026-03-15' },
    ],
  },

  // Audit Logs
  auditLogs: [
    { id: 'L001', time: '2026-03-20 09:15:32', user: '王小明', action: '登入系統', target: '-', ip: '10.0.1.52' },
    { id: 'L002', time: '2026-03-20 09:20:15', user: '李小華', action: '上傳知識文件', target: '非疫區國家犬貓入境簡化流程公告', ip: '10.0.1.55' },
    { id: 'L003', time: '2026-03-20 09:25:48', user: '王小明', action: '修改系統設定', target: 'AI 信心度閾值 0.5 → 0.6', ip: '10.0.1.52' },
    { id: 'L004', time: '2026-03-20 09:30:22', user: '李小華', action: '送審知識文件', target: '非疫區國家犬貓入境簡化流程公告', ip: '10.0.1.55' },
    { id: 'L005', time: '2026-03-20 10:05:11', user: '陳小芳', action: '登入系統', target: '-', ip: '10.0.1.60' },
    { id: 'L006', time: '2026-03-20 10:12:33', user: '林小傑', action: '回覆留言', target: 'M001', ip: '10.0.1.61' },
    { id: 'L007', time: '2026-03-20 10:20:45', user: '陳小芳', action: '查詢對話紀錄', target: 'C-20260320-001', ip: '10.0.1.60' },
    { id: 'L008', time: '2026-03-20 10:35:18', user: '王小明', action: '匯出稽核日誌', target: '2026-03 操作日誌', ip: '10.0.1.52' },
    { id: 'L009', time: '2026-03-20 11:00:05', user: '李小華', action: '更新知識文件', target: '犬貓輸入檢疫作業辦法', ip: '10.0.1.55' },
    { id: 'L010', time: '2026-03-20 11:15:29', user: '王小明', action: '新增使用者帳號', target: '張小美 (chang@baphiq.gov.tw)', ip: '10.0.1.52' },
  ],

  // Data retention settings
  dataRetention: {
    conversationDays: 365,
    voiceFileDays: 90,
    auditLogDays: 730,
    personalDataNote: '依個資法規定，當事人得請求刪除其個人資料',
  },

  // Feedback
  feedback: {
    total: 87,
    avgScore: 4.2,
    distribution: [2, 3, 8, 28, 46], // 1-5 stars
  },
};
