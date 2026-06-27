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
      #arous-bubble-wrap { right: 16px; bottom: 20px; }
    }

    #arous-window {
      position: fixed;
      bottom: 115px;
      right: 28px;
      width: 360px;
      height: 580px;
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
    .arous-menu-title {
      font-size: 14px;
      font-weight: 700;
      color: rgba(255,255,255,.95);
      padding: 0 0 6px 0;
      letter-spacing: 0.2px;
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
        height: 82vh;
        right: 12px;
        bottom: 110px;
      }
      #arous-bubble { right: 18px; bottom: 18px; }
    }
    /* ── Calendly modal overlay ── */
    #arous-cal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.72);
      z-index: 1000000;
      align-items: center;
      justify-content: center;
      padding: 16px;
      box-sizing: border-box;
    }
    #arous-cal-overlay.open { display: flex; }
    #arous-cal-modal {
      position: relative;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 32px 80px rgba(0,0,0,.5);
      width: 90vw;
      max-width: 900px;
      height: 85vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    #arous-cal-close {
      position: fixed;
      top: max(16px, env(safe-area-inset-top, 16px));
      right: max(16px, env(safe-area-inset-right, 16px));
      width: 44px;
      height: 44px;
      border: none;
      background: #fff;
      border-radius: 50%;
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
      z-index: 1000002;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      box-shadow: 0 2px 12px rgba(0,0,0,.25);
      transition: background .15s, transform .15s;
    }
    #arous-cal-close:hover { background: #f0f0f0; transform: scale(1.08); }
    #arous-cal-body {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    /* Prevent iOS Safari auto-zoom on Calendly inputs */
    #arous-cal-modal iframe {
      touch-action: manipulation;
    }
    @media (max-width: 600px) {
      #arous-cal-overlay {
        padding: 0;
        align-items: flex-start;
      }
      #arous-cal-modal {
        width: 100%;
        height: 100%;
        height: 100dvh;
        border-radius: 0;
        position: fixed;
        inset: 0;
      }
    }
    @media (max-width: 600px) {
      #arous-cal-modal {
        width: 100%;
        height: 92vh;
        border-radius: 12px;
      }
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
  wrap.style.display = 'none';

  // ─── CALENDLY MODAL ───────────────────────────────────────────────────────
  var calOverlay = document.createElement('div');
  calOverlay.id = 'arous-cal-overlay';
  calOverlay.innerHTML = '<button id="arous-cal-close" aria-label="Close scheduling">&times;</button><div id="arous-cal-modal"><div id="arous-cal-body"></div></div>';
  document.body.appendChild(calOverlay);

  function openCalendly() {
    // Prevent iOS Safari auto-zoom by ensuring viewport maximum-scale is set
    var existingMeta = document.querySelector('meta[name="viewport"]');
    if (existingMeta) {
      var content = existingMeta.getAttribute('content');
      if (content && content.indexOf('maximum-scale') === -1) {
        existingMeta.setAttribute('content', content + ', maximum-scale=1.0');
      }
    }
    var body = document.getElementById('arous-cal-body');
    // Use a plain iframe each time — avoids Calendly session/cookie bleed
    // between opens that causes a blank widget on second open
    var iframe = document.createElement('iframe');
    iframe.src = 'https://calendly.com/hello-arous/30min';
    iframe.style.cssText = 'width:100%;height:100%;min-height:660px;border:none;display:block;';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'yes');
    iframe.setAttribute('allowtransparency', 'true');
    body.innerHTML = '';
    body.appendChild(iframe);
    calOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCalendly() {
    calOverlay.classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('arous-cal-body').innerHTML = '';
  }

  document.getElementById('arous-cal-close').onclick = closeCalendly;
  calOverlay.addEventListener('click', function(e) {
    if (e.target === calOverlay) closeCalendly();
  });

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

  // ─── MENU PANEL ─────────────────────────────────────────────────────────────
  // menuPanel is a single div, always the last child of M.
  // setPage() is the ONE function that writes into it — clears first, always.
  var menuPanel = document.createElement('div');
  menuPanel.id = 'arous-menu-panel';
  M.appendChild(menuPanel);

  function setPage(pageFn) {
    while (menuPanel.firstChild) menuPanel.removeChild(menuPanel.firstChild);
    if (menuPanel.parentNode !== M || M.lastChild !== menuPanel) M.appendChild(menuPanel);
    pageFn(menuPanel);
    M.scrollTop = M.scrollHeight;
  }

  // ─── DOM HELPERS ─────────────────────────────────────────────────────────────
  function el(tag, props) {
    var e = document.createElement(tag);
    Object.keys(props || {}).forEach(function(k) { e[k] = props[k]; });
    return e;
  }

  function btnStack(items) {
    var wrap = el('div', { className: 'arous-btn-stack' });
    items.forEach(function(b) {
      var btn = el('button', { className: 'arous-btn', textContent: b.label });
      btn.onclick = b.action || (function(m, fb) {
        return function() { input.value = m; sendMessage(fb); };
      })(b.msg, b.fromButton || false);
      wrap.appendChild(btn);
    });
    return wrap;
  }

  function navRow(items) {
    var row = el('div', { className: 'arous-nav-row' });
    items.forEach(function(b) {
      var btn = el('button', { className: 'arous-nav-btn', textContent: b.label });
      btn.onclick = b.action || (function(m, fb) {
        return function() { input.value = m; sendMessage(fb); };
      })(b.msg, b.fromButton || false);
      row.appendChild(btn);
    });
    return row;
  }

  function contentBlock(text) { return el('div', { className: 'arous-menu-content', textContent: text }); }
  function labelBlock(text)   { return el('div', { className: 'arous-menu-label',   textContent: text }); }
  function titleBlock(text)   { return el('div', { className: 'arous-menu-title',    textContent: text }); }

  // ─── HELPERS ──────────────────────────────────────────────────────────────
  function renderText(t) {
    var s = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
    M.insertBefore(div, menuPanel);
    M.scrollTop = M.scrollHeight;
    return div;
  }

  // ─── PAGE BUILDERS ───────────────────────────────────────────────────────────

  function pageMainMenu() {
    return function(p) {
      p.appendChild(btnStack([
        { label: '👋 About Arous',         msg: 'About Arous',   fromButton: true },
        { label: '👥 Who We Help',         msg: 'Who We Help',   fromButton: true },
        { label: '📋 What We Do',          msg: 'What We Do',    fromButton: true },
        { label: '🛠 Services',            action: function(){ setPage(pageServicesMenu()); } },
        { label: '💡 Business Challenges', action: function(){ setPage(pageBizChallenges()); } },
        { label: '❓ FAQs',               action: function(){ setPage(pageFAQs()); } },
        { label: '💬 Talk to Daniel',      action: function(){ setPage(pageTalkToDaniel()); } },
      ]));
    };
  }

  function pageAssessmentMenu() {
    return function(p) {
      p.appendChild(labelBlock('Which assessment are you interested in?'));
      p.appendChild(btnStack([
        { label: '🔍 Lost Opportunities Assessment', action: function(){ openCalendly(); } },
        { label: '📊 Business Operations Assessment', action: function(){ openCalendly(); } },
      ]));
      p.appendChild(navRow([
        { label: '🏠 Main Menu', action: function(){ setPage(pageMainMenu()); } },
      ]));
    };
  }

  function pageServicesMenu() {
    return function(p) {
      p.appendChild(contentBlock('What can we help you with today?\n\nSelect one of the services below to learn more.'));
      p.appendChild(btnStack([
        { label: '🔍 Lost Opportunities Assessment', action: function(){ setPage(pageLostOpportunities()); } },
        { label: '📊 Business Operations Assessment', action: function(){ setPage(pageBusinessOperations()); } },
        { label: '🤖 AI Website Concierge',           action: function(){ setPage(pageAIConcierge()); } },
        { label: '\u26A1 AI Solutions & Implementations',  action: function(){ setPage(pageAISolutionsMenu()); } },
      ]));
      p.appendChild(navRow([
        { label: '🏠 Main Menu', action: function(){ setPage(pageMainMenu()); } },
      ]));
    };
  }

  function pageLostOpportunities() {
    return function(p) {
      p.appendChild(titleBlock('Lost Opportunities Assessment'));
      p.appendChild(contentBlock('Identify where customer inquiries, leads, and revenue may be slipping through the cracks.\n\nWe\'ll evaluate your customer touchpoints, response processes, lead capture, follow-up, and communication to identify practical opportunities for improvement.\n\nDeliverables include:\n\u2022 Executive Summary  \u2022 Key Findings\n\u2022 Prioritized Recommendations  \u2022 Action Plan'));
      p.appendChild(btnStack([
        { label: '📅 Schedule This Assessment', action: function(){ openCalendly(); } },
      ]));
      p.appendChild(navRow([
        { label: '\u2B05 Services',   action: function(){ setPage(pageServicesMenu()); } },
        { label: '🏠 Main Menu', action: function(){ setPage(pageMainMenu()); } },
      ]));
    };
  }

  function pageBusinessOperations() {
    return function(p) {
      p.appendChild(titleBlock('Business Operations Assessment'));
      p.appendChild(contentBlock('Evaluate your business operations, workflows, customer experience, and technology to identify opportunities for greater efficiency and growth.\n\nThis assessment also includes an AI Readiness Evaluation to determine where AI can realistically provide value within your organization.\n\nDeliverables include:\n\u2022 Executive Summary  \u2022 Operational Findings\n\u2022 AI Readiness Evaluation\n\u2022 Prioritized Recommendations  \u2022 Action Plan'));
      p.appendChild(btnStack([
        { label: '📅 Schedule This Assessment', action: function(){ openCalendly(); } },
      ]));
      p.appendChild(navRow([
        { label: '\u2B05 Services',   action: function(){ setPage(pageServicesMenu()); } },
        { label: '🏠 Main Menu', action: function(){ setPage(pageMainMenu()); } },
      ]));
    };
  }

  function pageAIConcierge() {
    return function(p) {
      p.appendChild(titleBlock('AI Website Concierge'));
      p.appendChild(contentBlock('Provide your website visitors with an AI-powered assistant that answers questions, captures leads, assists with scheduling, and helps customers find the information they need 24/7.\n\nYour concierge is customized to your business, services, FAQs, and brand voice to create a consistent customer experience.'));
      p.appendChild(navRow([
        { label: '💬 Talk to Daniel', action: function(){ setPage(pageTalkToDaniel({ label: '\u2B05 Services', action: function(){ setPage(pageServicesMenu()); } })); } },
        { label: '\u2B05 Services',          action: function(){ setPage(pageServicesMenu()); } },
        { label: '🏠 Main Menu',      action: function(){ setPage(pageMainMenu()); } },
      ]));
    };
  }

  function pageSEO() {
    return function(p) {
      p.appendChild(titleBlock('Website SEO & AI Search Optimization'));
      p.appendChild(contentBlock('Improve your online visibility through technical SEO, on-page optimization, local search optimization, and content strategies that help customers find your business in both traditional search engines and emerging AI-powered search experiences.'));
      p.appendChild(navRow([
        { label: '💬 Talk to Daniel', action: function(){ setPage(pageTalkToDaniel({ label: '⬅ AI Solutions', action: function(){ setPage(pageAISolutionsMenu()); } })); } },
        { label: '⬅ AI Solutions', action: function(){ setPage(pageAISolutionsMenu()); } },
        { label: '🏠 Main Menu',   action: function(){ setPage(pageMainMenu()); } },
      ]));
    };
  }

  function pageAISolutionsMenu() {
    return function(p) {
      p.appendChild(contentBlock('Every business is different.\n\nArous AI designs and implements practical AI solutions based on your operational goals, existing systems, and business needs.\n\nSelect one of the solutions below to learn more.'));
      p.appendChild(btnStack([
        { label: '\u2699\uFE0F Workflow Automation',     action: function(){ setPage(pageAISolution('Workflow Automation',     'Reduce repetitive work by automating routine business processes such as notifications, follow-up, lead routing, approvals, and other operational workflows.')); } },
        { label: '📆 AI Scheduling Assistant', action: function(){ setPage(pageAISolution('AI Scheduling Assistant', 'Allow customers to request appointments, submit scheduling preferences, and streamline the scheduling process through an intelligent conversational experience.')); } },
        { label: '🔗 CRM Integrations',        action: function(){ setPage(pageAISolution('CRM Integrations',        'Connect your AI solutions with supported CRM platforms to improve lead management, reduce manual entry, and keep customer information synchronized.')); } },
        { label: '📲 Missed Call Text-Back',   action: function(){ setPage(pageAISolution('Missed Call Text-Back',   'Automatically respond to missed phone calls with a personalized text message, helping recover opportunities that might otherwise be lost.\n\nAvailability depends on your existing phone system.')); } },
        { label: '💬 AI SMS Assistant',        action: function(){ setPage(pageAISolution('AI SMS Assistant',        'Provide customers with intelligent two-way text messaging for answering questions, collecting information, and supporting customer communication.\n\nAvailability depends on your existing messaging platform.')); } },
        { label: '\uD83C\uDFA4 AI Voice Assistant',      action: function(){ setPage(pageAISolution('AI Voice Assistant',      'Answer incoming phone calls with an AI-powered voice assistant capable of responding to common questions, gathering customer information, and routing calls when appropriate.')); } },
        { label: '🧠 Custom AI Solutions',     action: function(){ setPage(pageAISolution('Custom AI Solutions',     'Every business has unique challenges.\n\nIf your business requires something beyond our standard solutions, Arous AI can design and implement custom AI solutions tailored specifically to your operational needs.')); } },
        { label: '🔍 Website SEO & AI Search Optimization', action: function(){ setPage(pageSEO()); } },
      ]));
      p.appendChild(navRow([
        { label: '\u2B05 Services',   action: function(){ setPage(pageServicesMenu()); } },
        { label: '🏠 Main Menu', action: function(){ setPage(pageMainMenu()); } },
      ]));
    };
  }

  var faqAnswers = {
    'what_happens': 'We begin with a conversation to understand your business, current processes, operational challenges, and goals. Depending on your needs, we may recommend either a Lost Opportunities Assessment or a Business Operations Assessment.\n\nOperational Assessments focus on workflows, communication processes, customer responsiveness, and operational efficiency opportunities.\n\nAI Readiness Evaluations evaluate organizational readiness, business processes, data, technology, governance considerations, and potential opportunities for AI adoption.\n\nFollowing the assessment, you\'ll receive a summary of findings, prioritized recommendations, and practical next steps tailored to your organization.',
    'how_long': 'Most assessments begin with a focused 30–45 minute conversation to better understand current operations, workflows, and business goals.',
    'what_issues': 'Assessments may uncover workflow bottlenecks, communication delays, missed customer opportunities, inefficient processes, scalability concerns, technology gaps, data challenges, organizational readiness issues, and areas where automation or AI may improve performance and efficiency.\n\nRecommendations are prioritized based on business impact, feasibility, and alignment with your organization\'s goals.',
    'what_types': 'Organizations looking to improve operations, evaluate AI opportunities, streamline workflows, or support future growth can benefit from an assessment. This includes service-based businesses, healthcare practices, professional services firms, construction and contracting companies, manufacturers, and growing organizations seeking greater efficiency, scalability, and operational clarity.\n\nLost Opportunities Assessments are often valuable for service-based businesses focused on customer responsiveness, lead capture, communication, and day-to-day operations.\n\nBusiness Operations Assessments are designed for organizations evaluating operational efficiency, business processes, technology, and how AI can support business goals. Each includes an AI Readiness Evaluation.',
    'software': 'Not always. Many businesses already have tools in place but aren\'t using them efficiently. Assessments focus on practical improvements, not unnecessary software purchases.',
    'ai_replacing': 'In most organizations, AI is most effective when used to support people — not replace them. The greatest value often comes from reducing repetitive tasks, improving access to information, streamlining workflows, and helping teams respond more efficiently.',
  };

  function pageFAQAnswer(question, answer) {
    return function(p) {
      p.appendChild(titleBlock(question));
      p.appendChild(contentBlock(answer));
      p.appendChild(navRow([
        { label: '⬅ FAQs',         action: function(){ setPage(pageFAQs()); } },
        { label: '🏠 Main Menu',   action: function(){ setPage(pageMainMenu()); } },
      ]));
    };
  }

  function pageFAQs() {
    return function(p) {
      p.appendChild(titleBlock('Frequently Asked Questions'));
      p.appendChild(contentBlock('If you don\'t see your question listed, feel free to ask me. I\'m happy to help.'));
      p.appendChild(btnStack([
        { label: '❓ What happens during an assessment?',       action: function(){ setPage(pageFAQAnswer('What happens during an assessment?',       faqAnswers['what_happens'])); } },
        { label: '⏱️ How long does an assessment take?',        action: function(){ setPage(pageFAQAnswer('How long does an assessment take?',        faqAnswers['how_long'])); } },
        { label: '🔍 What kinds of issues can be identified?',  action: function(){ setPage(pageFAQAnswer('What kinds of issues can be identified?',  faqAnswers['what_issues'])); } },
        { label: '🏢 What types of businesses benefit most?',   action: function(){ setPage(pageFAQAnswer('What types of businesses benefit most?',   faqAnswers['what_types'])); } },
        { label: '💻 Do I need new software?',                  action: function(){ setPage(pageFAQAnswer('Do I need new software?',                  faqAnswers['software'])); } },
        { label: '🤖 Is AI replacing employees?',               action: function(){ setPage(pageFAQAnswer('Is AI replacing employees?',               faqAnswers['ai_replacing'])); } },
      ]));
      p.appendChild(navRow([
        { label: '🏠 Main Menu', action: function(){ setPage(pageMainMenu()); } },
      ]));
    };
  }

  function pageBizChallenges() {
    return function(p) {
      p.appendChild(titleBlock('Business Challenges'));
      p.appendChild(contentBlock('Here are the most common challenges we help businesses solve:\n\nFor local service businesses:\n\u{1F4F5} Missed calls while on a job — leads going cold before you can call back\n\u{1F319} No way to handle after-hours inquiries — customers calling competitors instead\n\u{1F501} Repetitive questions eating up your time — pricing, hours, availability\n\u{1F310} A website that doesn\'t actively bring in business\n\nFor growing organizations:\n\u{1F504} Disconnected workflows and manual processes slowing teams down\n\u2753 Uncertainty about where AI can actually add value — and where it can\'t\n\u{1F4CA} No clear picture of operational readiness before investing in new technology\n\u{1F9E9} Teams spending time on repetitive tasks that could be automated\n\nDoes any of this sound familiar? Tell me a little about your business or the challenge you\'re trying to solve below.'));
      p.appendChild(navRow([
        { label: '💬 Talk to Daniel', action: function(){ setPage(pageTalkToDaniel()); } },
        { label: '🏠 Main Menu',      action: function(){ setPage(pageMainMenu()); } },
      ]));
    };
  }

  function pageTalkToDaniel(backAction) {
    return function(p) {
      p.appendChild(titleBlock('Talk to Daniel'));

      var info = document.createElement('div');
      info.className = 'arous-menu-content';
      info.innerHTML = [
        'Daniel DeSandre',
        'Founder, Arous AI',
        '',
        'Phone / Text: <a href="tel:6292483707" style="color:#a78bfa;text-decoration:underline;">(629) 248-3707</a>',
        'Email: <a href="mailto:hello@arous.ai" style="color:#a78bfa;text-decoration:underline;">hello@arous.ai</a>',
        '',
        'Based in Thompson\'s Station, TN — serving Middle Tennessee.',
        '',
        'Or share your name and the best number to reach you and Daniel will follow up personally.'
      ].join('<br>');
      p.appendChild(info);

      p.appendChild(navRow([
        { label: '🏠 Main Menu', action: function(){ setPage(pageMainMenu()); } },
      ].concat(backAction ? [backAction] : [])));
    };
  }

  function pageAISolution(name, body) {
    return function(p) {
      p.appendChild(titleBlock(name));
      p.appendChild(contentBlock(body));
      p.appendChild(navRow([
        { label: '💬 Talk to Daniel', action: function(){ setPage(pageTalkToDaniel({ label: '\u2B05 AI Solutions', action: function(){ setPage(pageAISolutionsMenu()); } })); } },
        { label: '\u2B05 AI Solutions',   action: function(){ setPage(pageAISolutionsMenu()); } },
        { label: '🏠 Main Menu',     action: function(){ setPage(pageMainMenu()); } },
      ]));
    };
  }

    // ─── EVENTS ───────────────────────────────────────────────────────────────
  wrap.onclick = function () { win.classList.toggle('open'); };
  document.getElementById('arous-close').onclick = function () { win.classList.remove('open'); };
  document.getElementById('arous-send').onclick = function() { sendMessage(); };
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // ─── SEND MESSAGE ─────────────────────────────────────────────────────────
  var BUTTON_LABELS = {
    'About Arous': '👋 About Arous',
    'Who We Help': '👥 Who We Help',
    'What We Do': '📋 What We Do',
    'Business Challenges': '💡 Business Challenges',
    'Talk to Daniel': '💬 Talk to Daniel',
    'I would like to schedule a Lost Opportunities Assessment': '🔍 Lost Opportunities Assessment',
    'I would like to schedule a Business Operations Assessment': '📊 Business Operations Assessment',
  };

  var PANEL_RESPONSES = {
    'About Arous': true,
    'Who We Help': true,
    'What We Do': true,
  };

  async function sendMessage(fromButton) {
    var text = input.value.trim();
    if (!text) return;
    var isPanelResponse = PANEL_RESPONSES[text] || false;
    var displayText = BUTTON_LABELS[text] || text;
    if (!fromButton) addMsg(displayText, 'user');
    input.value = '';

    setPage(function(p) {
      var t = el('div', {});
      t.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:12px;color:#a78bfa;padding:6px 0;';
      t.innerHTML = '🧠 Thinking...';
      p.appendChild(t);
    });

    try {
      var res = await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: SESSION_ID })
      });
      var data = await res.json();
      var r = Array.isArray(data)
        ? ((data[0] && data[0].output) || (data[0] && data[0].message) || 'OK.')
        : (data.output || data.message || data.response || 'OK.');
      var botText = r.replace(/##LC##/g, '').trim();

      var isAssessmentSelection = text === 'I would like to schedule a Lost Opportunities Assessment' ||
                                   text === 'I would like to schedule a Business Operations Assessment';
      var lower = r.toLowerCase();
      var scheduleIntent = !isAssessmentSelection && (
                           lower.indexOf('schedule an assessment') !== -1 ||
                           lower.indexOf('go ahead and schedule') !== -1 ||
                           lower.indexOf('schedule a') !== -1 ||
                           lower.indexOf('book an assessment') !== -1);

      if (isAssessmentSelection) {
        // Render response inside panel so it's cleared on next navigation
        setPage(function(p) {
          var resp = el('div', { className: 'arous-menu-content' });
          resp.textContent = botText;
          p.appendChild(resp);
          p.appendChild(navRow([
            { label: '⬅ Services',   action: function(){ setPage(pageServicesMenu()); } },
            { label: '🏠 Main Menu', action: function(){ setPage(pageMainMenu()); } },
          ]));
        });
        // Scroll to top of panel so user sees response from the beginning
        menuPanel.scrollIntoView({ block: 'start', behavior: 'smooth' });
      } else if (scheduleIntent) {
        var schedMsg = addMsg(botText, 'bot');
        setPage(function(p) {
          p.appendChild(labelBlock('Which assessment would you like to schedule?'));
          p.appendChild(btnStack([
            { label: '🔍 Lost Opportunities Assessment', action: function(){ openCalendly(); } },
            { label: '📊 Business Operations Assessment', action: function(){ openCalendly(); } },
          ]));
          p.appendChild(navRow([{ label: '🏠 Main Menu', action: function(){ setPage(pageMainMenu()); } }]));
        });
        schedMsg.scrollIntoView({ block: 'start', behavior: 'smooth' });
      } else if (isPanelResponse) {
        var _panelText = text;
        setPage(function(p) {
          var resp = el('div', { className: 'arous-menu-content' });
          resp.textContent = botText;
          p.appendChild(resp);
          var navItems = [
            { label: '🏠 Main Menu', action: function(){ setPage(pageMainMenu()); } },
          ];
          if (_panelText === 'What We Do') {
            navItems.unshift({ label: '🛠 Services', action: function(){ setPage(pageServicesMenu()); } });
          }
          p.appendChild(navRow(navItems));
        });
        menuPanel.scrollIntoView({ block: 'start', behavior: 'smooth' });
      } else {
        addMsg(botText, 'bot');
        setPage(pageMainMenu());
        menuPanel.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }

    } catch (e) {
      addMsg('Something went wrong. Please try again.', 'bot');
      setPage(pageMainMenu());
    }
  }

  // ─── GLOBAL HOOKS ────────────────────────────────────────────────────────
  // Call from any Framer button or page element to control the concierge.
  window.arousOpen = function() {
    win.classList.add('open');
    setPage(pageMainMenu());
  };
  window.arousClose = function() {
    win.classList.remove('open');
  };
  window.arousToggle = function() {
    win.classList.toggle('open');
  };
  window.arousOpenAssessment = function() {
    win.classList.add('open');
    setPage(pageAssessmentMenu());
  };

  // ─── DATA ATTRIBUTE WIRING ───────────────────────────────────────────────
  // Any element on the page with data-arous="open-assessment" will
  // open the chatbot directly to the assessment menu on click.
  // In Framer: select element → right panel → Attributes → add data-arous = open-assessment
  function wireArousButtons() {
    var els = document.querySelectorAll('[data-arous="open-assessment"]');
    for (var i = 0; i < els.length; i++) {
      els[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.arousOpenAssessment();
      });
    }
  }
  // Run on DOM ready and after a short delay to catch Framer's late renders
  wireArousButtons();
  setTimeout(wireArousButtons, 1000);
  setTimeout(wireArousButtons, 2500);

  // ─── INIT ─────────────────────────────────────────────────────────────────
  addMsg(GREETING, 'bot');
  setPage(pageMainMenu());

})();
