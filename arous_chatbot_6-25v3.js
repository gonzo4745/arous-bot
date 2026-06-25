(function () {

  // ─── CONFIG ───────────────────────────────────────────────────────────────
  var WEBHOOK = "https://arous.app.n8n.cloud/webhook/b7286461-b675-4882-84e4-d0dbb73a2ca3";
  var GREETING = "Hi, I'm Arous Concierge. How can I help your business today?";
  var ICON = "https://i.imgur.com/jl9rwAJ.png";
  var SESSION_ID = Math.random().toString(36).slice(2);

  // ─── STYLES ───────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = `
    #arous-bubble-wrap {
      position: fixed;
      bottom: 16px;
      right: 28px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0px;
      z-index: 999999;
      cursor: pointer;
      transition: transform .2s ease;
    }
    #arous-bubble-wrap:hover { transform: scale(1.08); }
    #arous-bubble {
      width: 72px;
      height: 72px;
      border: none;
      background: transparent;
      cursor: pointer;
      padding: 0;
      display: block;
    }
    #arous-bubble img { width: 100%; height: 100%; object-fit: contain; }
    #arous-chat-label {
      font-size: 11px;
      font-weight: 700;
      color: #1a237e;
      font-family: sans-serif;
      letter-spacing: 0.5px;
      pointer-events: none;
      text-align: center;
      margin-top: -12px;
    }
    @media (max-width: 600px) {
      #arous-bubble-wrap { right: 18px; bottom: 10px; }
    }

    #arous-window {
      position: fixed;
      bottom: 115px;
      right: 28px;
      width: 360px;
      height: 520px;
      border-radius: 16px;
      background: #0a0a0f;
      border: 1px solid rgba(255,255,255,.08);
      box-shadow: 0 24px 64px rgba(0,0,0,.6);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 999998;
      font-family: sans-serif;
    }
    #arous-window.open { display: flex; }

    #arous-header {
      background: linear-gradient(135deg, #0a1628, #0d2255);
      padding: 16px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      flex-shrink: 0;
    }
    #arous-close {
      background: none;
      border: none;
      color: rgba(255,255,255,.6);
      cursor: pointer;
      font-size: 22px;
      line-height: 1;
      padding: 0;
    }

    #arous-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    #arous-input-area {
      padding: 12px 12px 10px;
      border-top: 1px solid rgba(255,255,255,.06);
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
    #arous-input {
      flex: 1;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 10px;
      padding: 10px 12px;
      color: #fff;
      resize: none;
      outline: none;
      font-size: 16px;
      font-family: inherit;
    }
    #arous-send {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      background: linear-gradient(135deg, #1a56db, #3b82f6);
      color: #fff;
      font-size: 18px;
      flex-shrink: 0;
    }

    #arous-footer {
      padding: 8px;
      text-align: center;
      color: rgba(255,255,255,.25);
      font-size: 10px;
      flex-shrink: 0;
    }

    .arous-bot, .arous-user {
      padding: 10px 13px;
      border-radius: 14px;
      font-size: 13.5px;
      line-height: 1.55;
      max-width: 85%;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .arous-bot {
      background: rgba(255,255,255,.06);
      color: rgba(255,255,255,.9);
      align-self: flex-start;
      border-radius: 4px 14px 14px 14px;
    }
    .arous-user {
      background: linear-gradient(135deg, #3b1278, #5b21b6);
      color: #fff;
      align-self: flex-end;
      border-radius: 14px 4px 14px 14px;
    }
    .arous-bot a { color: #a78bfa; text-decoration: underline; }

    /* ── Menu panel — replaces in-place, never stacks ── */
    #arous-menu-panel {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-self: stretch;
    }
    .arous-btn-stack { display: flex; flex-direction: column; gap: 8px; align-self: stretch; }
    .arous-btn {
      background: transparent;
      border: 1px solid rgba(167,139,250,.4);
      color: #a78bfa;
      border-radius: 10px;
      padding: 10px 16px;
      cursor: pointer;
      font-size: 13px;
      text-align: left;
      font-family: sans-serif;
      transition: background .2s, border-color .2s;
      width: 100%;
    }
    .arous-btn:hover { background: rgba(167,139,250,.1); border-color: #a78bfa; }

    .arous-menu-label {
      font-size: 12.5px;
      color: rgba(255,255,255,.5);
      padding: 2px 0 4px 2px;
      font-style: italic;
    }
    .arous-menu-content {
      font-size: 13px;
      color: rgba(255,255,255,.75);
      line-height: 1.6;
      white-space: pre-wrap;
      padding: 2px 0 6px 0;
    }

    .arous-nav-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 2px;
    }
    .arous-nav-btn {
      background: transparent;
      border: 1px solid rgba(167,139,250,.25);
      color: rgba(167,139,250,.6);
      border-radius: 8px;
      padding: 5px 12px;
      cursor: pointer;
      font-size: 11px;
      font-family: sans-serif;
      transition: background .2s, color .2s;
      white-space: nowrap;
    }
    .arous-nav-btn:hover { background: rgba(167,139,250,.08); color: rgba(167,139,250,.9); }

    /* ── Thinking indicator ── */
    #arous-thinking {
      display: none;
      align-items: center;
      gap: 8px;
      align-self: flex-start;
      padding: 10px 13px;
      background: rgba(255,255,255,.06);
      border-radius: 4px 14px 14px 14px;
    }
    #arous-thinking.visible { display: flex; }
    #arous-thinking .brain {
      font-size: 18px;
      animation: brainPulse 1s ease-in-out infinite;
    }
    #arous-thinking .think-label {
      font-size: 12px;
      color: #a78bfa;
      animation: fadeInOut 1s ease-in-out infinite;
    }
    @keyframes brainPulse {
      0%,100% { transform: scale(1); filter: drop-shadow(0 0 0px #a78bfa); }
      50%      { transform: scale(1.25); filter: drop-shadow(0 0 6px #a78bfa); }
    }
    @keyframes fadeInOut {
      0%,100% { opacity: .4; }
      50%      { opacity: 1; }
    }

    #arous-call-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 6px 14px 10px;
      background: #0a0a0f;
      flex-shrink: 0;
      border-top: 1px solid rgba(255,255,255,.05);
    }
    #arous-call-bar span {
      font-size: 11px;
      color: rgba(255,255,255,.35);
      font-family: sans-serif;
    }
    .arous-call-link {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11.5px;
      font-weight: 700;
      font-family: sans-serif;
      color: #a78bfa;
      text-decoration: none;
      transition: opacity .15s;
    }
    .arous-call-link:hover { opacity: 0.7; }

    @media (max-width: 600px) {
      #arous-window {
        width: calc(100vw - 24px);
        height: 72vh;
        right: 12px;
        bottom: 110px;
      }
      #arous-bubble { right: 18px; bottom: 18px; }
    }
  `;
  document.head.appendChild(style);

  // ─── HTML ─────────────────────────────────────────────────────────────────
  var win = document.createElement('div');
  win.id = 'arous-window';
  win.innerHTML = `
    <div id="arous-header">
      <span style="font-size:14px;font-weight:600">Arous Concierge</span>
      <button id="arous-close">&times;</button>
    </div>
    <div id="arous-messages"></div>
    <div id="arous-input-area">
      <textarea id="arous-input" placeholder="Ask anything..." rows="1"></textarea>
      <button id="arous-send">&#10148;</button>
    </div>
    <div id="arous-call-bar">
      <span>Call or text us:</span>
      <a class="arous-call-link" href="tel:6292483707">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.36 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 5.53 5.53l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        Call 629-248-3707
      </a>
      <a class="arous-call-link" href="sms:6292483707">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        Text Us
      </a>
    </div>
    <div id="arous-footer">AROUS AI &middot;</div>
  `;
  document.body.appendChild(win);

  var wrap = document.createElement('div');
  wrap.id = 'arous-bubble-wrap';

  var bubble = document.createElement('button');
  bubble.id = 'arous-bubble';
  bubble.innerHTML = '<img src="' + ICON + '"/>';
  wrap.appendChild(bubble);

  var chatLabel = document.createElement('div');
  chatLabel.id = 'arous-chat-label';
  chatLabel.textContent = 'Chat';
  wrap.appendChild(chatLabel);

  document.body.appendChild(wrap);

  // ─── ELEMENTS ─────────────────────────────────────────────────────────────
  var M = document.getElementById('arous-messages');
  var input = document.getElementById('arous-input');

  // ─── THINKING INDICATOR ───────────────────────────────────────────────────
  var thinking = document.createElement('div');
  thinking.id = 'arous-thinking';
  thinking.innerHTML = '<span class="brain">🧠</span><span class="think-label">Thinking...</span>';

  function showThinking() {
    M.appendChild(thinking);
    thinking.classList.add('visible');
    M.scrollTop = M.scrollHeight;
  }
  function hideThinking() {
    thinking.classList.remove('visible');
  }

  // ─── MENU PANEL ───────────────────────────────────────────────────────────
  // One persistent panel anchored after the greeting. All menu navigation
  // replaces its contents — never appends new chat bubbles.
  var menuPanel = document.createElement('div');
  menuPanel.id = 'arous-menu-panel';

  function setMenu(html) {
    menuPanel.innerHTML = html;
    M.scrollTop = M.scrollHeight;
  }

  function buildBtnStack(items) {
    var stack = document.createElement('div');
    stack.className = 'arous-btn-stack';
    items.forEach(function(b) {
      var btn = document.createElement('button');
      btn.className = 'arous-btn';
      btn.textContent = b.label;
      var ctx = b.context || null;
      btn.onclick = b.action ? b.action : (function(msg, c) { return function() { input.value = msg; sendMessage(c); }; })(b.msg, ctx);
      stack.appendChild(btn);
    });
    return stack;
  }

  function buildNavRow(items) {
    var row = document.createElement('div');
    row.className = 'arous-nav-row';
    items.forEach(function(b) {
      var btn = document.createElement('button');
      btn.className = 'arous-nav-btn';
      btn.textContent = b.label;
      var ctx = b.context || null;
      btn.onclick = b.action ? b.action : (function(msg, c) { return function() { input.value = msg; sendMessage(c); }; })(b.msg, ctx);
      row.appendChild(btn);
    });
    return row;
  }

  function renderMenu(label, btnItems, navItems) {
    menuPanel.innerHTML = '';
    if (label) {
      var lbl = document.createElement('div');
      lbl.className = 'arous-menu-label';
      lbl.textContent = label;
      menuPanel.appendChild(lbl);
    }
    menuPanel.appendChild(buildBtnStack(btnItems));
    if (navItems && navItems.length) menuPanel.appendChild(buildNavRow(navItems));
    M.scrollTop = M.scrollHeight;
  }

  function renderContent(text, btnItems, navItems) {
    menuPanel.innerHTML = '';
    var content = document.createElement('div');
    content.className = 'arous-menu-content';
    content.textContent = text;
    menuPanel.appendChild(content);
    if (btnItems && btnItems.length) menuPanel.appendChild(buildBtnStack(btnItems));
    if (navItems && navItems.length) menuPanel.appendChild(buildNavRow(navItems));
    M.scrollTop = M.scrollHeight;
  }

  // ─── EVENTS ───────────────────────────────────────────────────────────────
  wrap.onclick = function () { win.classList.toggle('open'); };
  document.getElementById('arous-close').onclick = function () { win.classList.remove('open'); };
  document.getElementById('arous-send').onclick = sendMessage;
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // ─── HELPERS ──────────────────────────────────────────────────────────────
  function renderText(t) {
    var s = t
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    s = s.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/(\+?1?\s?[\(]?\d{3}[\)]?[\s\-\.]?\d{3}[\s\-\.]?\d{4})/g, function (m) {
      return '<a href="tel:' + m.replace(/\D/g, '') + '">' + m + '</a>';
    });
    return s;
  }

  function addMsg(text, role) {
    var div = document.createElement('div');
    div.className = role === 'bot' ? 'arous-bot' : 'arous-user';
    if (role === 'bot') div.innerHTML = renderText(text);
    else div.textContent = text;
    // Insert before menuPanel so chat messages appear above it
    M.insertBefore(div, menuPanel);
    M.scrollTop = M.scrollHeight;
  }

  // ─── MENU FUNCTIONS ───────────────────────────────────────────────────────

  function showMainButtons() {
    renderMenu(null, [
      { label: '📅 Schedule Assessment', action: showAssessmentMenu },
      { label: '🛠 Services',            action: showServicesMenu },
      { label: '💡 Business Challenges', msg: 'Business Challenges' },
      { label: '💬 Talk to Daniel',      msg: 'Talk to Daniel' },
    ]);
  }

  function showAssessmentMenu() {
    renderMenu(
      'Which assessment are you interested in?',
      [
        { label: '🔍 Lost Opportunities Assessment', msg: 'I would like to schedule a Lost Opportunities Assessment' },
        { label: '📊 Business Operations Assessment', msg: 'I would like to schedule a Business Operations Assessment' },
      ],
      [{ label: '🏠 Main Menu', action: showMainButtons }]
    );
  }

  function showServicesMenu() {
    renderContent(
      'What can we help you with today?\n\nSelect one of the services below to learn more.',
      [
        { label: '🔍 Lost Opportunities Assessment', action: showLostOpportunitiesDetail },
        { label: '📊 Business Operations Assessment', action: showBusinessOperationsDetail },
        { label: '🤖 AI Website Concierge',           action: showAIConciergeDetail },
        { label: '⚡ AI Solutions & Implementations',  action: showAISolutionsMenu },
      ],
      [{ label: '🏠 Main Menu', action: showMainButtons }]
    );
  }

  function showLostOpportunitiesDetail() {
    renderContent(
      'Identify where customer inquiries, leads, and revenue may be slipping through the cracks.\n\nWe\'ll evaluate your customer touchpoints, response processes, lead capture, follow-up, and communication to identify practical opportunities for improvement.\n\nDeliverables include:\n• Executive Summary  • Key Findings\n• Prioritized Recommendations  • Action Plan',
      [{ label: '📅 Schedule This Assessment', msg: 'I would like to schedule a Lost Opportunities Assessment' }],
      [
        { label: '⬅ Services',   action: showServicesMenu },
        { label: '🏠 Main Menu', action: showMainButtons },
      ]
    );
  }

  function showBusinessOperationsDetail() {
    renderContent(
      'Evaluate your business operations, workflows, customer experience, and technology to identify opportunities for greater efficiency and growth.\n\nThis assessment also includes an AI Readiness Evaluation to determine where AI can realistically provide value within your organization.\n\nDeliverables include:\n• Executive Summary  • Operational Findings\n• AI Readiness Evaluation\n• Prioritized Recommendations  • Action Plan',
      [{ label: '📅 Schedule This Assessment', msg: 'I would like to schedule a Business Operations Assessment' }],
      [
        { label: '⬅ Services',   action: showServicesMenu },
        { label: '🏠 Main Menu', action: showMainButtons },
      ]
    );
  }

  function showAIConciergeDetail() {
    renderContent(
      'Provide your website visitors with an AI-powered assistant that answers questions, captures leads, assists with scheduling, and helps customers find the information they need 24/7.\n\nYour concierge is customized to your business, services, FAQs, and brand voice to create a consistent customer experience.',
      [],
      [
        { label: '💬 Talk to Daniel', msg: 'Talk to Daniel' },
        { label: '⬅ Services',       action: showServicesMenu },
        { label: '🏠 Main Menu',     action: showMainButtons },
      ]
    );
  }

  function showAISolutionsMenu() {
    renderContent(
      'Every business is different.\n\nArous AI designs and implements practical AI solutions based on your operational goals, existing systems, and business needs.\n\nSelect one of the solutions below to learn more.',
      [
        { label: '⚙️ Workflow Automation',     action: showWorkflowAutomation },
        { label: '📆 AI Scheduling Assistant', action: showAIScheduling },
        { label: '🔗 CRM Integrations',        action: showCRMIntegrations },
        { label: '📲 Missed Call Text-Back',   action: showMissedCallTextBack },
        { label: '💬 AI SMS Assistant',        action: showAISMSAssistant },
        { label: '🎙️ AI Voice Assistant',      action: showAIVoiceAssistant },
        { label: '🧠 Custom AI Solutions',     action: showCustomAIAgents },
      ],
      [
        { label: '⬅ Services',   action: showServicesMenu },
        { label: '🏠 Main Menu', action: showMainButtons },
      ]
    );
  }

  function showWorkflowAutomation() {
    renderContent(
      'Reduce repetitive work by automating routine business processes such as notifications, follow-up, lead routing, approvals, and other operational workflows.',
      [],
      [
        { label: '💬 Talk to Daniel', msg: 'Talk to Daniel', context: 'ai-solution' },
        { label: '⬅ AI Solutions',   action: showAISolutionsMenu },
        { label: '🏠 Main Menu',     action: showMainButtons },
      ]
    );
  }

  function showAIScheduling() {
    renderContent(
      'Allow customers to request appointments, submit scheduling preferences, and streamline the scheduling process through an intelligent conversational experience.',
      [],
      [
        { label: '💬 Talk to Daniel', msg: 'Talk to Daniel', context: 'ai-solution' },
        { label: '⬅ AI Solutions',   action: showAISolutionsMenu },
        { label: '🏠 Main Menu',     action: showMainButtons },
      ]
    );
  }

  function showCRMIntegrations() {
    renderContent(
      'Connect your AI solutions with supported CRM platforms to improve lead management, reduce manual entry, and keep customer information synchronized.',
      [],
      [
        { label: '💬 Talk to Daniel', msg: 'Talk to Daniel', context: 'ai-solution' },
        { label: '⬅ AI Solutions',   action: showAISolutionsMenu },
        { label: '🏠 Main Menu',     action: showMainButtons },
      ]
    );
  }

  function showMissedCallTextBack() {
    renderContent(
      'Automatically respond to missed phone calls with a personalized text message, helping recover opportunities that might otherwise be lost.\n\nAvailability depends on your existing phone system.',
      [],
      [
        { label: '💬 Talk to Daniel', msg: 'Talk to Daniel', context: 'ai-solution' },
        { label: '⬅ AI Solutions',   action: showAISolutionsMenu },
        { label: '🏠 Main Menu',     action: showMainButtons },
      ]
    );
  }

  function showAISMSAssistant() {
    renderContent(
      'Provide customers with intelligent two-way text messaging for answering questions, collecting information, and supporting customer communication.\n\nAvailability depends on your existing messaging platform.',
      [],
      [
        { label: '💬 Talk to Daniel', msg: 'Talk to Daniel', context: 'ai-solution' },
        { label: '⬅ AI Solutions',   action: showAISolutionsMenu },
        { label: '🏠 Main Menu',     action: showMainButtons },
      ]
    );
  }

  function showAIVoiceAssistant() {
    renderContent(
      'Answer incoming phone calls with an AI-powered voice assistant capable of responding to common questions, gathering customer information, and routing calls when appropriate.',
      [],
      [
        { label: '💬 Talk to Daniel', msg: 'Talk to Daniel', context: 'ai-solution' },
        { label: '⬅ AI Solutions',   action: showAISolutionsMenu },
        { label: '🏠 Main Menu',     action: showMainButtons },
      ]
    );
  }

  function showCustomAIAgents() {
    renderContent(
      'Every business has unique challenges.\n\nIf your business requires something beyond our standard solutions, Arous AI can design and implement custom AI solutions tailored specifically to your operational needs.',
      [],
      [
        { label: '💬 Talk to Daniel', msg: 'Talk to Daniel', context: 'ai-solution' },
        { label: '⬅ AI Solutions',   action: showAISolutionsMenu },
        { label: '🏠 Main Menu',     action: showMainButtons },
      ]
    );
  }

  // ─── SEND MESSAGE ─────────────────────────────────────────────────────────
  // Tracks which context triggered the outbound message so post-response
  // nav can be scoped correctly (e.g. Talk to Daniel from an AI solution page).
  var _msgContext = null;

  var BUTTON_LABELS = {
    'Business Challenges': '💡 Business Challenges',
    'Talk to Daniel': '💬 Talk to Daniel',
    'I would like to schedule a Lost Opportunities Assessment': '🔍 Lost Opportunities Assessment',
    'I would like to schedule a Business Operations Assessment': '📊 Business Operations Assessment',
  };

  async function sendMessage(context) {
    var text = input.value.trim();
    if (!text) return;
    _msgContext = context || null;
    var displayText = BUTTON_LABELS[text] || text;
    addMsg(displayText, 'user');
    input.value = '';

    // Hide menu panel while waiting for response
    menuPanel.innerHTML = '';
    showThinking();

    try {
      var res = await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: SESSION_ID })
      });
      var data = await res.json();
      var r = Array.isArray(data)
        ? (data[0]?.output || data[0]?.message || 'OK.')
        : (data.output || data.message || data.response || 'OK.');
      hideThinking();
      addMsg(r.replace(/##LC##/g, '').trim(), 'bot');

      // Show assessment buttons if response invites scheduling
      var isAssessmentSelection = text === 'I would like to schedule a Lost Opportunities Assessment' ||
                                   text === 'I would like to schedule a Business Operations Assessment';
      var lower = r.toLowerCase();
      var scheduleIntent = !isAssessmentSelection && (
                           lower.indexOf('schedule an assessment') !== -1 ||
                           lower.indexOf('go ahead and schedule') !== -1 ||
                           lower.indexOf('schedule a') !== -1 ||
                           lower.indexOf('book an assessment') !== -1);

      if (scheduleIntent) {
        renderMenu(
          'Which assessment would you like to schedule?',
          [
            { label: '🔍 Lost Opportunities Assessment', msg: 'I would like to schedule a Lost Opportunities Assessment' },
            { label: '📊 Business Operations Assessment', msg: 'I would like to schedule a Business Operations Assessment' },
          ],
          [
            { label: '🏠 Main Menu', action: showMainButtons },
          ]
        );
      } else if (_msgContext === 'ai-solution') {
        renderMenu(null, [],
          [
            { label: '⬅ AI Solutions', action: showAISolutionsMenu },
            { label: '🏠 Main Menu', action: showMainButtons },
          ]
        );
      } else {
        showMainButtons();
      }

      _msgContext = null;

    } catch (e) {
      hideThinking();
      addMsg('Something went wrong. Please try again.', 'bot');
      _msgContext = null;
      showMainButtons();
    }
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  M.appendChild(menuPanel);
  addMsg(GREETING, 'bot');
  showMainButtons();

})();
