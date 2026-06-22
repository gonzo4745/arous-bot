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
    .arous-btn-stack { display: flex; flex-direction: column; gap: 8px; margin-top: 6px; align-self: stretch; }
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
  M.appendChild(thinking);

  function showThinking() {
    M.appendChild(thinking);
    thinking.classList.add('visible');
    M.scrollTop = M.scrollHeight;
  }
  function hideThinking() {
    thinking.classList.remove('visible');
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

  // ─── FUNCTIONS ────────────────────────────────────────────────────────────
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
    M.appendChild(div);
    M.scrollTop = M.scrollHeight;
  }

  function showAssessmentBackNav() {
    var nav = document.createElement('div');
    nav.style.cssText = 'align-self:flex-start; margin-top:4px; display:flex; gap:6px;';
    var backBtn = document.createElement('button');
    backBtn.style.cssText = 'background:transparent;border:1px solid rgba(167,139,250,.25);color:rgba(167,139,250,.6);border-radius:8px;padding:5px 12px;cursor:pointer;font-size:11px;font-family:sans-serif;';
    backBtn.textContent = '⬅ Back';
    backBtn.onclick = function() { nav.remove(); showAssessmentMenu(); };
    var mainBtn = document.createElement('button');
    mainBtn.style.cssText = 'background:transparent;border:1px solid rgba(167,139,250,.25);color:rgba(167,139,250,.6);border-radius:8px;padding:5px 12px;cursor:pointer;font-size:11px;font-family:sans-serif;';
    mainBtn.textContent = '🏠 Main Menu';
    mainBtn.onclick = function() { nav.remove(); showMainButtons(); };
    nav.appendChild(backBtn);
    nav.appendChild(mainBtn);
    M.appendChild(nav);
    M.scrollTop = M.scrollHeight;
  }

  function showBackNav() {
    var nav = document.createElement('div');
    nav.style.cssText = 'align-self:flex-start; margin-top:4px;';
    var btn = document.createElement('button');
    btn.style.cssText = 'background:transparent;border:1px solid rgba(167,139,250,.25);color:rgba(167,139,250,.6);border-radius:8px;padding:5px 12px;cursor:pointer;font-size:11px;font-family:sans-serif;';
    btn.textContent = '🏠 Main Menu';
    btn.onclick = function() {
      nav.remove();
      showMainButtons();
    };
    nav.appendChild(btn);
    M.appendChild(nav);
    M.scrollTop = M.scrollHeight;
  }

  function showAssessmentMenu() {
    var existing = M.querySelector('.arous-btn-stack');
    if (existing) existing.remove();

    addMsg("Which assessment are you interested in?\n\nLost Opportunities Assessment is designed for service businesses. Business Operations Assessment is designed for growing organizations and includes an AI Readiness Evaluation.", 'bot');

    var btnStack = document.createElement('div');
    btnStack.className = 'arous-btn-stack';

    var assessments = [
      { label: '🔍 Lost Opportunities Assessment', msg: 'I would like to schedule a Lost Opportunities Assessment' },
      { label: '📊 Business Operations Assessment', msg: 'I would like to schedule a Business Operations Assessment' },
    ];

    assessments.forEach(function(b) {
      var btn = document.createElement('button');
      btn.className = 'arous-btn';
      btn.textContent = b.label;
      btn.onclick = function() {
        btnStack.remove();
        input.value = b.msg;
        sendMessage();
      };
      btnStack.appendChild(btn);
    });

    M.appendChild(btnStack);

    // Back nav
    var nav = document.createElement('div');
    nav.style.cssText = 'align-self:flex-start; margin-top:4px; display:flex; gap:6px;';
    var backBtn = document.createElement('button');
    backBtn.style.cssText = 'background:transparent;border:1px solid rgba(167,139,250,.25);color:rgba(167,139,250,.6);border-radius:8px;padding:5px 12px;cursor:pointer;font-size:11px;font-family:sans-serif;';
    backBtn.textContent = '🏠 Main Menu';
    backBtn.onclick = function() { nav.remove(); btnStack.remove(); showMainButtons(); };
    nav.appendChild(backBtn);
    M.appendChild(nav);
    M.scrollTop = M.scrollHeight;
  }

  function showMainButtons() {
    // Remove any existing button stack first
    var existing = M.querySelector('.arous-btn-stack');
    if (existing) existing.remove();

    var btnStack = document.createElement('div');
    btnStack.className = 'arous-btn-stack';

    var buttons = [
      { label: '📅 Schedule Assessment', action: showAssessmentMenu },
      { label: '🛠 Services',            msg: 'Services' },
      { label: '💡 Business Challenges', msg: 'Business Challenges' },
      { label: '💬 Talk to Daniel',      msg: 'Talk to Daniel' },
    ];

    buttons.forEach(function(b) {
      var btn = document.createElement('button');
      btn.className = 'arous-btn';
      btn.textContent = b.label;
      btn.onclick = function() {
        btnStack.remove();
        if (b.action) { b.action(); }
        else { input.value = b.msg; sendMessage(); }
      };
      btnStack.appendChild(btn);
    });

    M.appendChild(btnStack);
    M.scrollTop = M.scrollHeight;
  }

  var BUTTON_LABELS = {
    'Services': '🛠 Services',
    'Business Challenges': '💡 Business Challenges',
    'Talk to Daniel': '💬 Talk to Daniel',
    'I would like to schedule a Lost Opportunities Assessment': '🔍 Lost Opportunities Assessment',
    'I would like to schedule a Business Operations Assessment': '📊 Business Operations Assessment',
  };

  async function sendMessage() {
    var text = input.value.trim();
    if (!text) return;
    var displayText = BUTTON_LABELS[text] || text;
    addMsg(displayText, 'user');
    input.value = '';
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
      // BUT not if the user just selected an assessment already
      var isAssessmentSelection = text === 'I would like to schedule a Lost Opportunities Assessment' ||
                                   text === 'I would like to schedule a Business Operations Assessment';
      var lower = r.toLowerCase();
      var scheduleIntent = !isAssessmentSelection && (
                           lower.indexOf('schedule an assessment') !== -1 ||
                           lower.indexOf('go ahead and schedule') !== -1 ||
                           lower.indexOf('schedule a') !== -1 ||
                           lower.indexOf('book an assessment') !== -1);

      if (scheduleIntent) {
        // Show inline assessment buttons + main menu
        var btnStack = document.createElement('div');
        btnStack.className = 'arous-btn-stack';
        var assessments = [
          { label: '🔍 Lost Opportunities Assessment', msg: 'I would like to schedule a Lost Opportunities Assessment' },
          { label: '📊 Business Operations Assessment', msg: 'I would like to schedule a Business Operations Assessment' },
        ];
        assessments.forEach(function(b) {
          var btn = document.createElement('button');
          btn.className = 'arous-btn';
          btn.textContent = b.label;
          btn.onclick = function() {
            btnStack.remove();
            input.value = b.msg;
            sendMessage();
          };
          btnStack.appendChild(btn);
        });
        M.appendChild(btnStack);

        // Main menu nav below buttons
        var nav = document.createElement('div');
        nav.style.cssText = 'align-self:flex-start; margin-top:4px;';
        var homeBtn = document.createElement('button');
        homeBtn.style.cssText = 'background:transparent;border:1px solid rgba(167,139,250,.25);color:rgba(167,139,250,.6);border-radius:8px;padding:5px 12px;cursor:pointer;font-size:11px;font-family:sans-serif;';
        homeBtn.textContent = '🏠 Main Menu';
        homeBtn.onclick = function() { nav.remove(); btnStack.remove(); showMainButtons(); };
        nav.appendChild(homeBtn);
        M.appendChild(nav);
      } else {
        showAssessmentBackNav();
      }

      M.scrollTop = M.scrollHeight;
    } catch (e) {
      hideThinking();
      addMsg('Err.', 'bot');
      showAssessmentBackNav();
    }
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  addMsg(GREETING, 'bot');

  // ── CANNED REPLIES ──────────────────────────────────────────────────────
  // ── MAIN BUTTONS ─────────────────────────────────────────────────────────
  showMainButtons();

})();
