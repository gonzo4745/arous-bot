(function () {
  var WEBHOOK = 'https://arous.app.n8n.cloud/webhook/evie-concierge';
  var GREETING = "Hello! I'm Evie, your Birthing By Calm concierge.\n\nI'm here to answer your questions about HypnoBirthing classes, help you get started on your journey, or connect you with Tiffany.\n\nHow can I help you today?";
  var SESSION_ID = Math.random().toString(36).slice(2);

  var style = document.createElement('style');
  style.textContent = `
    #evie-bubble {
      position: fixed; bottom: 28px; right: 28px; width: 72px; height: 72px;
      border: none; background: #f3f3f3; cursor: pointer; z-index: 999999;
      transition: transform .2s ease; padding: 0; border-radius: 50%;
      font-size: 36px; display: flex; align-items: center; justify-content: center;
    }
    #evie-bubble:hover { transform: scale(1.08); }
    #evie-window {
      position: fixed; bottom: 115px; right: 28px; width: 360px; height: 560px;
      border-radius: 16px; background: #2d1a0e; border: 1px solid rgba(158,58,38,0.2);
      box-shadow: 0 24px 64px rgba(0,0,0,.6); display: none; flex-direction: column;
      overflow: hidden; z-index: 999998; font-family: sans-serif;
    }
    #evie-window.open { display: flex; }
    #evie-header {
      background: #A99889;
      padding: 16px 18px; display: flex; align-items: center;
      justify-content: space-between; color: #fff; flex-shrink: 0;
    }
    #evie-header-info { display: flex; align-items: center; gap: 10px; }
    #evie-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(158,58,38,0.2); border: 2px solid #9E3A26;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
    }
    #evie-name { font-size: 14px; font-weight: 600; color: #ffab01; display: block; }
    #evie-status { font-size: 11px; color: rgba(255,255,255,0.6); display: block; }
    #evie-close { background: none; border: none; color: rgba(255,255,255,.6); cursor: pointer; font-size: 22px; line-height: 1; padding: 0; }
    #evie-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
    #evie-input-area { padding: 12px; border-top: 1px solid rgba(158,58,38,.1); display: flex; gap: 8px; flex-shrink: 0; }
    #evie-input {
      flex: 1; background: rgba(255,255,255,.09); border: 1px solid rgba(158,58,38,.2);
      border-radius: 10px; padding: 10px 12px; color: #fff; resize: none;
      outline: none; font-size: 16px; font-family: inherit;
    }
    #evie-input:focus { border-color: #9E3A26; }
    #evie-send {
      width: 42px; height: 42px; border-radius: 10px; border: none; cursor: pointer;
      background: linear-gradient(135deg, #b51a00, #ffab01); color: #fff; font-size: 18px; flex-shrink: 0;
    }
    #evie-footer { padding: 6px; text-align: center; color: rgba(255,255,255,.2); font-size: 10px; flex-shrink: 0; }
    .evie-bot, .evie-user {
      padding: 10px 13px; border-radius: 14px; font-size: 13.5px; line-height: 1.55;
      max-width: 85%; white-space: pre-wrap; word-break: break-word;
    }
    .evie-bot {
      background: rgba(158,58,38,.08); color: rgba(255,255,255,.9);
      align-self: flex-start; border-radius: 4px 14px 14px 14px; border-left: 3px solid #9E3A26;
    }
    .evie-user {
      background: linear-gradient(135deg, #b51a00, #7a1000);
      color: #fff; align-self: flex-end; border-radius: 14px 4px 14px 14px;
    }
    .evie-bot a { color: #9E3A26; text-decoration: underline; }
    .evie-btn {
      background: transparent; border: 1px solid rgba(158,58,38,.4); color: #ffab01;
      border-radius: 10px; padding: 8px 14px; cursor: pointer; font-size: 12.5px;
      text-align: left; transition: background .2s, border-color .2s; white-space: nowrap;
    }
    .evie-btn:hover { background: rgba(255,171,1,.1); border-color: #9E3A26; }
    .evie-buttons { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }

    @keyframes evieBrainPulse {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px #9E3A26); }
      50% { transform: scale(1.15); filter: drop-shadow(0 0 10px #9E3A26); }
    }
    @keyframes evieFadeInOut {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
    @media (max-width: 600px) {
      #evie-window { width: calc(100vw - 24px); height: 72vh; right: 12px; bottom: 110px; }
      #evie-bubble { right: 18px; bottom: 18px; }
    }
  `;
  document.head.appendChild(style);

  var win = document.createElement('div');
  win.id = 'evie-window';
  win.innerHTML = `
    <div id="evie-header">
      <div id="evie-header-info">
        <div id="evie-avatar"><img src="https://birthingbycalm.com/wp-content/uploads/2025/07/logo-brown.png" style="width:28px;height:28px;object-fit:contain;border-radius:50%;"></div>
        <div>
          <span id="evie-name">Evie</span>
          <span id="evie-status">Birthing By Calm · Online</span>
        </div>
      </div>
      <button id="evie-close">&times;</button>
    </div>
    <div id="evie-messages"></div>
    <div id="evie-input-area">
      <textarea id="evie-input" placeholder="Ask me anything..." rows="1"></textarea>
      <button id="evie-send">&#10148;</button>
    </div>
    <div id="evie-footer">Birthing By Calm &middot; Powered by Arous AI</div>
  `;
  document.body.appendChild(win);

  var bubble = document.createElement('button');
  bubble.id = 'evie-bubble';
  bubble.innerHTML = '<img src="https://birthingbycalm.com/wp-content/uploads/2025/07/logo-brown.png" style="width:52px;height:52px;object-fit:contain;border-radius:50%;transform:scaleX(-1);">';
  document.body.appendChild(bubble);

  var M = document.getElementById('evie-messages');
  var input = document.getElementById('evie-input');

  bubble.onclick = function () { win.classList.toggle('open'); };
  document.getElementById('evie-close').onclick = function () { win.classList.remove('open'); };
  document.getElementById('evie-send').onclick = sendMessage;
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  function renderText(t) {
    var s = t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    s = s.replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/(\+?1?\s?[\(]?\d{3}[\)]?[\s\-\.]?\d{3}[\s\-\.]?\d{4})/g,function(m){return '<a href="tel:'+m.replace(/\D/g,'')+'">' +m+'</a>';});
    return s;
  }

  function addMsg(text, role) {
    var div = document.createElement('div');
    div.className = role === 'bot' ? 'evie-bot' : 'evie-user';
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
    var thinking = document.createElement('div');
    thinking.id = 'evie-thinking-indicator';
    thinking.style.cssText = 'display:flex;align-items:center;gap:8px;align-self:flex-start;padding:6px 0;';
    thinking.innerHTML = '<span style="font-size:22px;animation:evieBrainPulse 1.2s ease-in-out infinite;filter:drop-shadow(0 0 6px #9E3A26)">🧠</span><span style="font-size:12px;color:#ffab01;animation:evieFadeInOut 1.2s ease-in-out infinite">Evie is thinking...</span>';
    M.appendChild(thinking);
    M.scrollTop = M.scrollHeight;
    try {
      var res = await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: SESSION_ID })
      });
      var data = await res.json();
      var r = Array.isArray(data)?(data[0]?.output||data[0]?.message||'OK.'):(data.output||data.message||data.response||'OK.');
      var ti = document.getElementById('evie-thinking-indicator');
      if (ti) ti.remove();
      addMsg(r.replace(/##LC##/g,'').trim(),'bot');
    } catch (e) {
      var ti = document.getElementById('evie-thinking-indicator');
      if (ti) ti.remove();
      addMsg('Sorry, something went wrong. Please try again!', 'bot');
    }
  }

  function sendQuick(msg) { input.value = msg; sendMessage(); }

  addMsg(GREETING, 'bot');

  var buttons = [
    { label: '🌸 View Services', msg: 'What services do you offer?' },
    { label: '💰 Pricing', msg: 'What are your prices?' },
    { label: '📞 Contact Tiffany', msg: 'I would like to get in touch with Tiffany' },
    { label: '🎁 Free Intro Workshop', msg: 'Tell me about the free intro workshop' },
  ];

  var btnWrap = document.createElement('div');
  btnWrap.className = 'evie-buttons';
  buttons.forEach(function (b) {
    var btn = document.createElement('button');
    btn.className = 'evie-btn';
    btn.textContent = b.label;
    btn.onclick = function () { sendQuick(b.msg); };
    btnWrap.appendChild(btn);
  });
  M.appendChild(btnWrap);

})();
