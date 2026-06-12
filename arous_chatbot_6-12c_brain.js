(function () {

  // ─── CONFIG ───────────────────────────────────────────────────────────────
  var WEBHOOK = "https://arous.app.n8n.cloud/webhook/b7286461-b675-4882-84e4-d0dbb73a2ca3";
  var GREETING = "Hello — I'm Arous Concierge.\n\nFeel free to ask questions about operational assessments, workflow improvements, AI automation, customer communication systems, or general business process ideas.\n\nHow can I help today?";
  var ICON = "https://i.imgur.com/jl9rwAJ.png";
  var SESSION_ID = Math.random().toString(36).slice(2);

  // ─── STYLES ───────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = `
    #arous-bubble {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 72px;
      height: 72px;
      border: none;
      background: transparent;
      cursor: pointer;
      z-index: 999999;
      transition: transform .2s ease;
      padding: 0;
    }
    #arous-bubble:hover { transform: scale(1.08); }
    #arous-chat-label {
      position: fixed;
      bottom: 2px;
      right: 28px;
      width: 72px;
      text-align: center;
      font-size: 11px;
      font-weight: 700;
      color: #1a237e;
      font-family: sans-serif;
      letter-spacing: 0.5px;
      z-index: 999999;
      pointer-events: none;
    }
    @media (max-width: 600px) {
      #arous-chat-label { right: 18px; bottom: 2px; }
    }
    #arous-bubble img { width: 100%; height: 100%; object-fit: contain; }

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
      padding: 12px;
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
    <div id="arous-footer">AROUS AI &middot;</div>
  `;
  document.body.appendChild(win);

  var bubble = document.createElement('button');
  bubble.id = 'arous-bubble';
  bubble.innerHTML = '<img src="' + ICON + '"/>';
  document.body.appendChild(bubble);

  var chatLabel = document.createElement('div');
  chatLabel.id = 'arous-chat-label';
  chatLabel.textContent = 'Chat';
  document.body.appendChild(chatLabel);

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
  bubble.onclick = function () { win.classList.toggle('open'); };
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

  async function sendMessage() {
    var text = input.value.trim();
    if (!text) return;
    addMsg(text, 'user');
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
    } catch (e) {
      hideThinking();
      addMsg('Err.', 'bot');
    }
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  addMsg(GREETING, 'bot');

  // Schedule Now button
  var b = document.createElement('button');
  b.textContent = 'Schedule Assessment';
  b.style.cssText = 'margin:4px 0;background:transparent;border:1px solid rgba(167,139,250,.5);color:#a78bfa;border-radius:10px;padding:8px 16px;cursor:pointer;font-size:13px;';
  b.onclick = function () {
    input.value = 'I want to schedule an assessment';
    sendMessage();
  };
  M.appendChild(b);

})();
