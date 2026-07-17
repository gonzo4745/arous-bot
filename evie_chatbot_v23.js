// evie_chatbot_v20.js
// v20 — 2026-07-17
// Changes from v19: Fixed the avatar image (header + floating bubble icon).
// The old src pointed at a dead WordPress-style URL
// (birthingbycalm.com/wp-content/uploads/...) that never resolved on this
// Squarespace-hosted site — this was broken in v18 too, unrelated to any
// JS change. Now points at the correct GitHub-hosted logo:
// https://raw.githubusercontent.com/gonzo4745/arous-bot/main/evielogo.png
// No other menus, flows, styling, or logic changed.

// evie_chatbot_v23.js
// v23 — 2026-07-17
// Changes from v22: Added the same #689F38 green color override to the
// therootempowermentcenter.com link (Wellness Services message), matching
// the metrodetroithypnosis.com link. Both are targeted overrides — every
// other auto-linked URL and phone number in bot messages keeps the
// default link color. No other menus, flows, or logic changed.

(function () {
  var WEBHOOK = 'https://arous.app.n8n.cloud/webhook/evie-concierge';
  var EVENTS_WEBHOOK = 'https://arous.app.n8n.cloud/webhook/Evie-actions';
  var GREETING = "Hello! I'm Evie, your Birthing By Calm concierge.\n\nI'm here to answer your questions about HypnoBirthing classes, help you get started on your journey, or connect you with Tiffany.\n\nHow can I help you today?";
  var SESSION_ID = Math.random().toString(36).slice(2);

  // Fire-and-forget event logging — never blocks or affects existing chat
  // behavior. Logs to a separate "Evie Actions" sheet tab via its own
  // webhook; does not touch the existing conversation-log webhook/sheet.
  function trackEvent(eventType, eventLabel, page) {
    try {
      fetch(EVENTS_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SessionID: SESSION_ID,
          EventType: eventType,
          EventLabel: eventLabel,
          Page: page || ''
        })
      });
    } catch (e) { /* non-blocking: tracking failures never interrupt the chat */ }
  }

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
    #evie-name { font-size: 14px; font-weight: 600; color: #9E3A26; display: block; }
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
      background: #FF6EC7; color: #fff; font-size: 18px; flex-shrink: 0;
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
      background: transparent; border: 1px solid rgba(255,110,199,.5); color: #FF6EC7;
      border-radius: 10px; padding: 8px 14px; cursor: pointer; font-size: 12.5px;
      text-align: left; transition: background .2s, border-color .2s; white-space: nowrap;
    }
    .evie-btn:hover { background: rgba(255,110,199,.12); border-color: #FF6EC7; }
    .evie-buttons { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
    .evie-buttons-stack { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; width: 100%; align-self: stretch; }
    .evie-buttons-stack .evie-btn { width: 100%; text-align: left; padding: 10px 16px; }
    .evie-register-btn {
      display: inline-block; margin-top: 10px; padding: 9px 18px;
      background: #FF6EC7; color: #fff;
      border-radius: 10px; font-size: 13px; font-weight: 600; text-decoration: none;
      border: none; cursor: pointer; transition: opacity .2s;
    }
    .evie-register-btn:hover { opacity: 0.88; }
    .evie-back-nav { display: flex; gap: 6px; margin-top: 10px; align-self: flex-start; }
    .evie-back-btn { background: transparent; border: 1px solid rgba(255,110,199,.4); color: #FF6EC7;
      border-radius: 8px; padding: 5px 10px; cursor: pointer; font-size: 11px;
      transition: background .2s, color .2s; white-space: nowrap; }
    .evie-back-btn:hover { background: rgba(255,110,199,.12); color: #FF6EC7; }

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
        <div id="evie-avatar"><img src="https://raw.githubusercontent.com/gonzo4745/arous-bot/main/evielogo.png" style="width:28px;height:28px;object-fit:contain;border-radius:50%;"></div>
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
  bubble.innerHTML = '<img src="https://raw.githubusercontent.com/gonzo4745/arous-bot/main/evielogo.png" style="width:52px;height:52px;object-fit:contain;border-radius:50%;transform:scaleX(-1);">';
  document.body.appendChild(bubble);

  var blabel = document.createElement('div');
  blabel.id = 'evie-bubble-label';
  blabel.textContent = 'Ask Evie';
  blabel.style.cssText = 'position:fixed;bottom:10px;right:28px;font-size:10px;color:#9E3A26;font-family:Arial,sans-serif;font-weight:600;text-align:center;width:72px;z-index:999999;letter-spacing:0.3px;pointer-events:none;';
  document.body.appendChild(blabel);

  var M = document.getElementById('evie-messages');
  var input = document.getElementById('evie-input');

  bubble.onclick = function () {
    win.classList.toggle('open');
    if (win.classList.contains('open')) trackEvent('widget_open', 'Evie Widget Opened', '');
  };
  document.getElementById('evie-close').onclick = function () { win.classList.remove('open'); };
  document.getElementById('evie-send').onclick = sendMessage;
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  function renderText(t) {
    var s = t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    s = s.replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/(\+?1?\s?[\(]?\d{3}[\)]?[\s\-\.]?\d{3}[\s\-\.]?\d{4})/g,function(m){return '<a href="tel:'+m.replace(/\D/g,'')+'">' +m+'</a>';});
    // Special-case color overrides — only these specific links get the
    // green accent; every other auto-linked URL/phone number keeps the
    // default link color.
    s = s.replace(
      '<a href="https://www.metrodetroithypnosis.com" target="_blank" rel="noopener">https://www.metrodetroithypnosis.com</a>',
      '<a href="https://www.metrodetroithypnosis.com" target="_blank" rel="noopener" style="color:#689F38;">https://www.metrodetroithypnosis.com</a>'
    );
    s = s.replace(
      '<a href="https://www.therootempowermentcenter.com" target="_blank" rel="noopener">https://www.therootempowermentcenter.com</a>',
      '<a href="https://www.therootempowermentcenter.com" target="_blank" rel="noopener" style="color:#689F38;">https://www.therootempowermentcenter.com</a>'
    );
    return s;
  }

  function addMsg(text, role) {
    var div = document.createElement('div');
    div.className = role === 'bot' ? 'evie-bot' : 'evie-user';
    if (role === 'bot') div.innerHTML = renderText(text);
    else div.textContent = text;
    M.appendChild(div);
    M.scrollTop = M.scrollHeight;
    return div;
  }

  function addButtons(buttons) {
    var btnWrap = document.createElement('div');
    btnWrap.className = 'evie-buttons';
    buttons.forEach(function(b) {
      var btn = document.createElement('button');
      btn.className = 'evie-btn';
      btn.textContent = b.label;
      btn.onclick = function() {
        trackEvent('button_click', b.label, '');
        // remove all button sets when one is clicked
        var allBtns = M.querySelectorAll('.evie-buttons');
        allBtns.forEach(function(el) { el.remove(); });
        if (b.action) { b.action(); }
        else { input.value = b.msg; sendMessage(); }
      };
      btnWrap.appendChild(btn);
    });
    M.appendChild(btnWrap);
    M.scrollTop = M.scrollHeight;
  }

  function addRegisterBtn(label, url) {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'align-self:flex-start; margin-top:8px; display:flex; flex-direction:column; gap:6px;';
    var prompt = document.createElement('span');
    prompt.style.cssText = 'font-size:12.5px; color:rgba(255,255,255,.6); font-style:italic;';
    prompt.textContent = 'Ready to reserve your spot?';
    var a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'evie-register-btn';
    a.textContent = label;
    a.onclick = function() { trackEvent('outbound_click', label, url); };
    wrap.appendChild(prompt);
    wrap.appendChild(a);
    M.appendChild(wrap);
    M.scrollTop = M.scrollHeight;
  }

  function addStackedButtons(buttons) {
    var btnWrap = document.createElement('div');
    btnWrap.className = 'evie-buttons-stack';
    buttons.forEach(function(b) {
      var btn = document.createElement('button');
      btn.className = 'evie-btn';
      btn.textContent = b.label;
      btn.onclick = function() {
        trackEvent('button_click', b.label, '');
        var allBtns = M.querySelectorAll('.evie-buttons-stack, .evie-buttons');
        allBtns.forEach(function(el) { el.remove(); });
        if (b.action) { b.action(); }
        else { input.value = b.msg; sendMessage(); }
      };
      btnWrap.appendChild(btn);
    });
    M.appendChild(btnWrap);
    M.scrollTop = M.scrollHeight;
  }

  function showMainMenu() {
    addStackedButtons([
      { label: '🌸 Services & Pricing',   action: showServiceCategories },
      { label: '🎁 Free Intro Workshop',  action: showFreeWorkshop },
      { label: '📞 Contact Tiffany',      msg:    'I would like to get in touch with Tiffany' },
    ]);
  }

  function addBackNav(buttons) {
    var wrap = document.createElement('div');
    wrap.className = 'evie-back-nav';
    buttons.forEach(function(b) {
      var btn = document.createElement('button');
      btn.className = 'evie-back-btn';
      btn.textContent = b.label;
      btn.onclick = function() {
        trackEvent('button_click', b.label, '');
        var allNavs = M.querySelectorAll('.evie-back-nav, .evie-buttons, .evie-buttons-stack');
        allNavs.forEach(function(el) { el.remove(); });
        if (b.action) { b.action(); }
        else { input.value = b.msg; sendMessage(); }
      };
      wrap.appendChild(btn);
    });
    M.appendChild(wrap);
    M.scrollTop = M.scrollHeight;
  }

  // ── SUB-MENU HANDLERS ──

  function showServiceCategories() {
    addMsg("Which service would you like to learn more about? 🌸", 'bot');
    addStackedButtons([
      { label: '🌸 HypnoBirthing Classes', action: showHypnoBirthing },
      { label: '🧠 Private Hypnosis',      action: showPrivateHypnosis },
      { label: '🧘 Wellness Services',     action: showWellness },
    ]);
    addBackNav([{ label: '⬅ Main Menu', action: showMainMenu }]);
  }

  function showHypnoBirthing() {
    addMsg("Which HypnoBirthing class would you like to explore?", 'bot');
    addButtons([
      { label: '📚 Complete Class',   action: showCompleteClass },
      { label: '🏠 Private Class',    action: showPrivateClass },
      { label: '🔄 Refresher Course', action: showRefresherCourse },
      { label: '🎁 Free Workshop',    action: showFreeWorkshop },
    ]);
    addBackNav([
      { label: '⬅ Services', action: showServiceCategories },
      { label: '🏠 Main Menu', action: showMainMenu },
    ]);
  }

  function showCompleteClass() {
    addMsg("📚 Complete HypnoBirthing Class — $395\n\n✓ 5 weekly sessions\n✓ Thursday 6:30–9:00 PM or Sunday 10:30 AM–1:00 PM\n✓ Includes: book, workbook, audio downloads, tote bag & handouts\n\nThis is the full HypnoBirthing® program — everything you need for a calm, confident birth.", 'bot');
    addRegisterBtn('Register Now →', 'https://birthingbycalm.com/classes/');
    addBackNav([
      { label: '⬅ Classes', action: showHypnoBirthing },
      { label: '🏠 Main Menu', action: showMainMenu },
    ]);
  }

  function showPrivateClass() {
    addMsg("🏠 Private HypnoBirthing Class — $695\n\n✓ Same complete curriculum as the group class\n✓ Fully customized schedule — you choose the times\n✓ Available in-person or via Zoom\n\nPerfect for families who want a flexible schedule, personalized instruction, or the convenience of learning from home via Zoom.", 'bot');
    addRegisterBtn('Register Now →', 'https://birthingbycalm.com/classes/');
    addBackNav([
      { label: '⬅ Classes', action: showHypnoBirthing },
      { label: '🏠 Main Menu', action: showMainMenu },
    ]);
  }

  function showRefresherCourse() {
    addMsg("🔄 HypnoBirthing Refresher Course — $275\n\n✓ Condensed 2-day course\n✓ Designed for previous HypnoBirthing parents\n✓ Refresh your skills before your new arrival\n\nA great way to reconnect with the techniques for your next birth.", 'bot');
    addRegisterBtn('Register Now →', 'https://birthingbycalm.com/classes/');
    addBackNav([
      { label: '⬅ Classes', action: showHypnoBirthing },
      { label: '🏠 Main Menu', action: showMainMenu },
    ]);
  }

  function showFreeWorkshop() {
    addMsg("🎁 Free Intro Workshop\n\n✓ Monthly intro event — no commitment required\n✓ Get a feel for HypnoBirthing before enrolling\n✓ Ask questions and meet Tiffany in person\n\nA wonderful first step for any expectant parent curious about HypnoBirthing.", 'bot');
    addRegisterBtn('Register Now →', 'https://birthingbycalm.com/workshops/');
    addBackNav([
      { label: '⬅ Classes', action: showHypnoBirthing },
      { label: '🏠 Main Menu', action: showMainMenu },
    ]);
  }

  function showPrivateHypnosis() {
    addMsg("🧠 Private Hypnosis Services\n\nTiffany offers personalized one-on-one hypnosis sessions for:\n\n✓ Stress Relief\n✓ Anxiety & Fear Reduction\n✓ Smoking Cessation\n✓ Weight Loss Support\n✓ Confidence & Goal Achievement\n\nLearn more: https://www.metrodetroithypnosis.com", 'bot');
    addBackNav([
      { label: '⬅ Services', action: showServiceCategories },
      { label: '🏠 Main Menu', action: showMainMenu },
    ]);
  }

  function showWellness() {
    addMsg("🧘 Wellness Services\n\nBirthing By Calm connects you with a community of wellness practitioners offering:\n\n✓ Yoga\n✓ Massage Therapy\n✓ Wellness Practitioners\n✓ Community Events\n\nLearn more: https://www.therootempowermentcenter.com", 'bot');
    addBackNav([
      { label: '⬅ Services', action: showServiceCategories },
      { label: '🏠 Main Menu', action: showMainMenu },
    ]);
  }

  // ── SEND MESSAGE ──

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
      addBackNav([{ label: '🏠 Main Menu', action: showMainMenu }]);
    } catch (e) {
      var ti = document.getElementById('evie-thinking-indicator');
      if (ti) ti.remove();
      addMsg('Sorry, something went wrong. Please try again!', 'bot');
      addBackNav([{ label: '🏠 Main Menu', action: showMainMenu }]);
    }
  }

  // ── INITIAL GREETING + MAIN BUTTONS ──

  addMsg(GREETING, 'bot');
  addStackedButtons([
    { label: '🌸 Services & Pricing',  action: showServiceCategories },
    { label: '🎁 Free Intro Workshop', action: showFreeWorkshop },
    { label: '📞 Contact Tiffany',     msg:    'I would like to get in touch with Tiffany' },
  ]);

})();
