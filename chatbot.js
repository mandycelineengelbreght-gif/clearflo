// =============================================
// ClearFlo Plumbing — chatbot.js
// Rule-based assistant. No API used.
// =============================================

(function () {
  'use strict';

  const WA = '27772517253';

  // ── Service keywords ──
  const SERVICES = [
    { name: 'Geyser Repair / Replacement', keys: ['geyser','hot water','no hot water','boiler','heater','water heater','solar geyser','cold shower','element','thermostat','lukewarm'] },
    { name: 'Burst / Leaking Pipe',        keys: ['leak','leaking','burst','pipe','broken pipe','dripping','drip','wet floor','water damage','puddle','water everywhere','cracked pipe'] },
    { name: 'Blocked Drain / Toilet',      keys: ['block','blocked','clog','clogged','drain','slow drain','overflow','backup','gurgling','standing water','sink blocked','shower drain','toilet blocked'] },
    { name: 'Leak Detection',              keys: ['detect','find leak','hidden leak','wall leak','underground leak','trace','locate','damp','moisture','wet wall','mould','mold','rising damp','ceiling wet','water meter'] },
    { name: 'Tap / Fixture Repair',        keys: ['tap','faucet','dripping tap','loose tap','basin','bath tap','shower head','low pressure','mixer','washer','fixture'] },
    { name: 'Commercial Plumbing',         keys: ['commercial','office','restaurant','business','shop','building','factory','complex','warehouse','body corporate','sectional title'] },
  ];

  // ── FAQ keyword map ──
  const FAQS = [
    {
      keys: ['hour','open','available','when','operating','close','working hours','trading'],
      ans: `Our hours:<br><br>🕐 <strong>Mon–Fri:</strong> 7am – 6pm<br>🕐 <strong>Saturday:</strong> 8am – 2pm<br>🚨 <strong>Emergencies:</strong> 24/7 any time, any day`
    },
    {
      keys: ['area','suburb','cover','service area','come to','reach','bellville','claremont','woodstock','pinelands','blouberg','somerset','goodwood','parow','northern','southern','atlantic'],
      ans: `We cover <strong>all of Cape Town</strong> — Northern Suburbs (Bellville, Parow, Goodwood), Southern Suburbs (Claremont, Constantia, Pinelands), Atlantic Seaboard (Sea Point, Camps Bay, Blouberg) and everywhere in between. 📍`
    },
    {
      keys: ['price','cost','charge','fee','how much','quote','rand','pricing','call out','callout','expensive'],
      ans: `We offer <strong>free quotes</strong> with no call-out fee. You'll know the full cost before we start. 💰`
    },
    {
      keys: ['emergency','urgent','asap','now','tonight','midnight','weekend','after hours','sunday','public holiday'],
      ans: `Yes — we're available <strong>24/7 for emergencies</strong>, including weekends and public holidays. 🚨<br><br>Call or WhatsApp <strong>+27 77 251 7253</strong> for the fastest response.`
    },
    {
      keys: ['licensed','qualified','certified','registered','pirb','insured','experience','professional','coc','certificate'],
      ans: `ClearFlo Plumbing is <strong>PIRB registered, fully licensed and insured</strong>. We issue <strong>Certificates of Compliance (COC)</strong> and carry R2M liability cover. Over 20 years of experience in Cape Town. ✅`
    },
    {
      keys: ['contact','call','phone','number','whatsapp','email','reach','get in touch'],
      ans: `📱 <strong>WhatsApp / Call:</strong> +27 77 251 7253<br>📧 <strong>Email:</strong> hello@clearfloplumbing.co.za<br>📍 <strong>Address:</strong> 56 Bree Street, Cape Town<br><br>We reply within minutes during business hours.`
    },
    {
      keys: ['how long','arrive','eta','response time','fast','quick','how soon'],
      ans: `For <strong>emergencies</strong> we aim to be there within <strong>30 minutes</strong>. For scheduled jobs we'll agree on a time that suits you. 🚗`
    },
    {
      keys: ['payment','pay','cash','card','eft','invoice','deposit','snapscan'],
      ans: `We accept <strong>cash, EFT and card</strong>. A written invoice is provided for every job. Deposits may apply to larger jobs. 💳`
    },
    {
      keys: ['guarantee','warranty','workmanship','promise','come back','not fixed'],
      ans: `Every job comes with a <strong>written workmanship guarantee</strong>. If it's not right, we come back and fix it at no extra charge. ✅`
    },
    {
      keys: ['hi','hello','hey','good morning','good afternoon','howzit','helo','hii','yo','sup','hiya'],
      ans: `Hey! 👋 Welcome to <strong>ClearFlo Plumbing</strong>. How can I help you today?`
    },
    {
      keys: ['location','address','where','bree','office','base','find you'],
      ans: `We're based at <strong>56 Bree Street, Cape Town, 8001</strong> — but we come to you! We cover all of Cape Town and surrounding suburbs. 📍`
    },
    {
      keys: ['solar','solar geyser','solar hot water'],
      ans: `Yes! We install, repair and replace <strong>solar geysers</strong>. All work is SANS 10254 compliant. Great for saving on electricity costs. ☀️`
    },
    {
      keys: ['blocked toilet','toilet blocked','toilet clogged','toilet overflow'],
      ans: `We clear blocked toilets fast — usually same day. <strong>No call-out fee</strong> and we'll quote you before starting. 🚽`
    },
    {
      keys: ['water pressure','low pressure','no water','water supply'],
      ans: `Low water pressure can be caused by a number of things — leaks, blocked pipes, or geyser issues. We diagnose and fix it properly. 💧`
    },
  ];

  // ── Services info ──
  const SERVICES_INFO = `Here's what we handle:<br><br>
🔥 <strong>Geyser Repair &amp; Replacement</strong> — same-day repairs, solar included<br>
🚰 <strong>Burst &amp; Leaking Pipes</strong> — 30-min emergency response<br>
🚿 <strong>Blocked Drains &amp; Toilets</strong> — high-pressure hydro-jetting<br>
🔍 <strong>Leak Detection</strong> — thermal imaging, no unnecessary digging<br>
🔧 <strong>Tap &amp; Fixture Repairs</strong> — dripping taps, running toilets fixed fast<br>
🏢 <strong>Commercial Plumbing</strong> — maintenance contracts &amp; after-hours service`;

  // ── Areas info ──
  const AREAS_INFO = `We cover <strong>all of Cape Town</strong>, including:<br><br>
📍 <strong>Northern Suburbs</strong> — Bellville, Parow, Goodwood, Durbanville, Brackenfell<br>
📍 <strong>Southern Suburbs</strong> — Claremont, Wynberg, Constantia, Pinelands, Rondebosch<br>
📍 <strong>Atlantic Seaboard</strong> — Sea Point, Green Point, Camps Bay, Blouberg, Milnerton<br><br>
Not sure if we cover your area? Just ask! 😊`;

  // ── Hours info ──
  const HOURS_INFO = `Our operating hours:<br><br>
🕐 <strong>Monday – Friday:</strong> 7am – 6pm<br>
🕐 <strong>Saturday:</strong> 8am – 2pm<br>
🚨 <strong>Emergencies:</strong> 24/7, including Sundays &amp; public holidays`;

  // ── State ──
  let step = 'idle', isOpen = false;
  let lead = { name: null, phone: null, area: null };

  // ── Inject CSS ──
  const css = document.createElement('style');
  css.textContent = `
  #fm * { box-sizing:border-box; margin:0; padding:0; font-family:'Barlow','Segoe UI',sans-serif; }

  #fm-btn {
    position:fixed; bottom:90px; right:28px;
    width:50px; height:50px; border-radius:50%;
    background:#0a1628; border:2px solid #5ba4cf;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; z-index:901;
    box-shadow:0 4px 20px rgba(10,22,40,0.5);
    transition:transform .22s ease, box-shadow .22s ease;
  }
  #fm-btn:hover { transform:scale(1.08) translateY(-2px); box-shadow:0 8px 28px rgba(10,22,40,0.6); }
  #fm-btn::before {
    content:''; position:absolute; inset:0; border-radius:50%;
    background:rgba(91,164,207,0.25);
    animation:fmPop 2.4s ease-out infinite; z-index:-1;
  }
  #fm-btn svg { width:22px; height:22px; fill:#5ba4cf; }
  #fm-badge {
    position:absolute; top:-1px; right:-1px;
    width:12px; height:12px; border-radius:50%;
    background:#e53e3e; border:2px solid white; display:none;
  }
  #fm-tip {
    position:absolute; right:60px;
    background:#0a1628; color:#fff;
    font-size:.7rem; font-weight:600; padding:5px 10px;
    border-radius:6px; white-space:nowrap;
    opacity:0; pointer-events:none; transform:translateX(4px);
    transition:opacity .2s, transform .2s;
    border:1px solid rgba(255,255,255,0.1);
  }
  #fm-tip::after { content:''; position:absolute; right:-5px; top:50%; transform:translateY(-50%); border:5px solid transparent; border-right:none; border-left-color:#0a1628; }
  #fm-btn:hover #fm-tip { opacity:1; transform:translateX(0); }

  #fm-win {
    position:fixed; bottom:152px; left:28px;
    width:348px; background:#fff; border-radius:16px;
    border-top:3px solid #5ba4cf;
    box-shadow:0 24px 64px rgba(10,22,40,0.25);
    display:flex; flex-direction:column; z-index:901;
    overflow:hidden; max-height:540px;
    transform:scale(.9) translateY(12px); opacity:0; pointer-events:none;
    transform-origin:bottom left;
    transition:transform .3s cubic-bezier(.34,1.56,.64,1), opacity .2s ease;
  }
  #fm-win.open { transform:scale(1) translateY(0); opacity:1; pointer-events:all; }

  #fm-head {
    background:#0a1628; padding:13px 15px;
    display:flex; align-items:center; gap:10px; flex-shrink:0;
    border-bottom:1px solid rgba(255,255,255,0.07);
  }
  #fm-av {
    width:34px; height:34px; border-radius:8px; background:#5ba4cf;
    display:flex; align-items:center; justify-content:center;
    font-size:.95rem; flex-shrink:0;
  }
  #fm-hname { color:#fff; font-weight:700; font-size:.85rem; }
  #fm-hstat { display:flex; align-items:center; gap:5px; color:rgba(255,255,255,.38); font-size:.66rem; margin-top:2px; }
  #fm-dot   { width:5px; height:5px; border-radius:50%; background:#4ade80; animation:fmGlow 2s ease infinite; }
  #fm-x {
    background:rgba(255,255,255,.07); border:none; color:rgba(255,255,255,.5);
    width:26px; height:26px; border-radius:6px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    font-size:.8rem; margin-left:auto; transition:background .2s; flex-shrink:0;
  }
  #fm-x:hover { background:rgba(255,255,255,.15); color:#fff; }

  #fm-body {
    flex:1; overflow-y:auto; padding:11px 10px;
    display:flex; flex-direction:column; gap:8px; background:#f7f9fc;
    scroll-behavior:smooth;
  }
  #fm-body::-webkit-scrollbar { width:3px; }
  #fm-body::-webkit-scrollbar-thumb { background:#ddd; border-radius:3px; }

  .fm-m { display:flex; flex-direction:column; max-width:85%; animation:fmUp .24s ease both; }
  .fm-m.b { align-self:flex-start; }
  .fm-m.u { align-self:flex-end; }
  .fm-bub { padding:9px 12px; border-radius:10px; font-size:.81rem; line-height:1.65; }
  .fm-m.b .fm-bub { background:#fff; color:#0a1628; border-bottom-left-radius:3px; box-shadow:0 2px 8px rgba(10,22,40,.07); }
  .fm-m.u .fm-bub { background:#0a1628; color:#fff; border-bottom-right-radius:3px; }
  .fm-t { font-size:.6rem; color:#bbb; margin-top:3px; padding:0 2px; }
  .fm-m.u .fm-t { text-align:right; }

  .fm-typing {
    display:flex; align-items:center; gap:4px;
    padding:9px 12px; background:#fff;
    border-radius:10px; border-bottom-left-radius:3px;
    box-shadow:0 2px 8px rgba(10,22,40,.07);
    width:fit-content; animation:fmUp .24s ease both;
  }
  .fm-typing span { width:5px; height:5px; background:#5ba4cf; border-radius:50%; animation:fmDot 1.2s ease infinite; }
  .fm-typing span:nth-child(2) { animation-delay:.2s; }
  .fm-typing span:nth-child(3) { animation-delay:.4s; }

  .fm-qr {
    display:flex; flex-wrap:wrap; gap:5px; margin-top:3px;
    animation:fmUp .3s .08s ease both; opacity:0; animation-fill-mode:forwards;
  }
  .fm-q {
    background:#fff; border:1.5px solid #5ba4cf; color:#0a1628;
    padding:5px 11px; border-radius:20px;
    font-size:.74rem; font-weight:600; cursor:pointer;
    transition:all .18s; white-space:nowrap;
    font-family:'Barlow',sans-serif;
  }
  .fm-q:hover { background:#0a1628; color:#fff; border-color:#0a1628; }

  .fm-wa {
    display:inline-flex; align-items:center; gap:6px;
    background:#25d366; color:#fff !important;
    padding:8px 14px; border-radius:8px;
    font-size:.78rem; font-weight:700;
    text-decoration:none; margin-top:7px;
    transition:background .18s; width:fit-content;
    font-family:'Barlow',sans-serif;
  }
  .fm-wa:hover { background:#1da851; }

  #fm-foot {
    padding:9px 10px; background:#fff;
    border-top:1px solid #e2e8f0;
    display:flex; gap:7px; align-items:center; flex-shrink:0;
  }
  #fm-in {
    flex:1; border:1.5px solid #e2e8f0; border-radius:8px;
    padding:8px 12px; font-size:.81rem; color:#0a1628;
    outline:none; transition:border-color .18s;
    font-family:'Barlow',sans-serif;
  }
  #fm-in:focus { border-color:#5ba4cf; }
  #fm-in::placeholder { color:#c0c4cc; }
  #fm-go {
    width:32px; height:32px; background:#0a1628; border:none;
    border-radius:8px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:background .18s; flex-shrink:0;
  }
  #fm-go:hover { background:#142244; }
  #fm-go svg { width:13px; height:13px; stroke:#5ba4cf; fill:none; margin-left:1px; }

  #fm-pw {
    text-align:center; font-size:.56rem; color:#ccc;
    padding:4px; background:#fff;
    border-top:1px solid #f0f0f0; flex-shrink:0;
    letter-spacing:0.05em;
  }

  @media (max-width:480px) {
    #fm-win { left:10px; right:10px; width:auto; bottom:142px; }
    #fm-btn { right:20px; bottom:82px; }
  }

  @keyframes fmPop  { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.8);opacity:0} }
  @keyframes fmGlow { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes fmUp   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fmDot  { 0%,80%,100%{transform:scale(.7);opacity:.5} 40%{transform:scale(1);opacity:1} }
  `;
  document.head.appendChild(css);

  // ── Inject HTML ──
  const el = document.createElement('div');
  el.id = 'fm';
  el.innerHTML = `
    <div id="fm-btn">
      <svg viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 21.2a.5.5 0 00.63.63l4.032-.892A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
      </svg>
      <div id="fm-badge"></div>
      <div id="fm-tip">Ask us anything</div>
    </div>

    <div id="fm-win">
      <div id="fm-head">
        <div id="fm-av">🔧</div>
        <div>
          <div id="fm-hname">ClearFlo Plumbing</div>
          <div id="fm-hstat"><div id="fm-dot"></div> Online — replies instantly</div>
        </div>
        <button id="fm-x">✕</button>
      </div>
      <div id="fm-body"></div>
      <div id="fm-foot">
        <input id="fm-in" type="text" placeholder="Type a message…" autocomplete="off"/>
        <button id="fm-go">
          <svg viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
      <div id="fm-pw">Powered by ClearFlo Assistant</div>
    </div>
  `;
  document.body.appendChild(el);

  const btn   = document.getElementById('fm-btn');
  const win   = document.getElementById('fm-win');
  const xBtn  = document.getElementById('fm-x');
  const body  = document.getElementById('fm-body');
  const inp   = document.getElementById('fm-in');
  const go    = document.getElementById('fm-go');
  const badge = document.getElementById('fm-badge');

  const ts     = () => new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  const scroll = () => setTimeout(() => { body.scrollTop = body.scrollHeight; }, 50);

  // ── Helpers ──
  function msg(html, who) {
    const d = document.createElement('div');
    d.className = `fm-m ${who}`;
    d.innerHTML = `<div class="fm-bub">${html}</div><div class="fm-t">${ts()}</div>`;
    body.appendChild(d);
    scroll();
    return d;
  }

  function qr(opts, cb) {
    const d = document.createElement('div');
    d.className = 'fm-qr';
    opts.forEach(o => {
      const b = document.createElement('button');
      b.className = 'fm-q';
      b.textContent = o.label;
      b.onclick = () => { d.remove(); msg(o.label, 'u'); cb(o.value || o.label); };
      d.appendChild(b);
    });
    body.appendChild(d);
    scroll();
  }

  function typing(cb, delay = 700) {
    const d = document.createElement('div');
    d.className = 'fm-m b';
    d.innerHTML = `<div class="fm-typing"><span></span><span></span><span></span></div>`;
    body.appendChild(d);
    scroll();
    setTimeout(() => { d.remove(); cb(); }, delay);
  }

  function waLink(label, prefill = '') {
    return `<br><a class="fm-wa" href="https://wa.me/${WA}?text=${encodeURIComponent(prefill)}" target="_blank" rel="noopener">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="white" style="flex-shrink:0">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.18-1.449A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.876 9.876 0 01-5.031-1.376l-.361-.214-3.736.876.936-3.629-.236-.374A9.855 9.855 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106c5.421 0 9.894 4.474 9.894 9.894 0 5.421-4.473 9.894-9.894 9.894z"/>
      </svg>
      ${label}</a>`;
  }

  // ── Match FAQ ──
  function matchFAQ(t) {
    const l = t.toLowerCase();
    for (const f of FAQS) {
      if (f.keys.some(k => l.includes(k))) return f.ans;
    }
    return null;
  }

  // ── Match service ──
  function matchService(t) {
    const l = t.toLowerCase();
    return SERVICES.filter(s => s.keys.some(k => l.includes(k)));
  }

  // ── Open / Close ──
  function open() {
    isOpen = true;
    win.classList.add('open');
    badge.style.display = 'none';
    if (!body.children.length) greet();
    setTimeout(() => inp.focus(), 350);
  }
  function close() {
    isOpen = false;
    win.classList.remove('open');
  }

  btn.addEventListener('click', () => isOpen ? close() : open());
  xBtn.addEventListener('click', close);

  // ── Greeting ──
  function greet() {
    typing(() => {
      msg(`👋 Hi there! Welcome to <strong>ClearFlo Plumbing</strong>.<br>Cape Town's most trusted plumbers. How can I help?`, 'b');
      typing(() => {
        qr([
          { label: '🔧 Book a plumber'   },
          { label: '🚨 Emergency help'   },
          { label: '🛠️ Services'         },
          { label: '📍 Areas'            },
          { label: '🕐 Hours'            },
          { label: '💬 Ask a question'   },
        ], mainMenu);
      }, 600);
    }, 850);
  }

  // ── Main menu handler ──
  function mainMenu(v) {
    if (v === '🔧 Book a plumber' || v === '🔧 Book for later') {
      typing(() => {
        msg(`We offer <strong>free quotes</strong> with no call-out fee. Let me grab your details quickly! 😊`, 'b');
        typing(() => startLead(), 500);
      }, 580);

    } else if (v === '🚨 Emergency help') {
      typing(() => {
        msg(
          `🚨 We're available <strong>24/7</strong> for emergencies — including weekends and public holidays.` +
          waLink('WhatsApp Emergency Line', 'Hi ClearFlo! I have a plumbing emergency — please call me ASAP.'),
          'b'
        );
        typing(() => {
          msg(`📞 You can also call us directly: <strong>+27 77 251 7253</strong>`, 'b');
          typing(() => {
            msg(`Anything else I can help with?`, 'b');
            qr([
              { label: '💬 Ask a question' },
              { label: '🔧 Book for later' },
            ], mainMenu);
          }, 600);
        }, 650);
      }, 500);

    } else if (v === '🛠️ Services') {
      typing(() => {
        msg(SERVICES_INFO, 'b');
        typing(() => {
          msg(`Would you like to book a plumber or ask something else?`, 'b');
          qr([
            { label: '🔧 Book a plumber'  },
            { label: '💬 Ask a question'  },
          ], mainMenu);
        }, 600);
      }, 580);

    } else if (v === '📍 Areas') {
      typing(() => {
        msg(AREAS_INFO, 'b');
        typing(() => {
          msg(`Anything else I can help with?`, 'b');
          qr([
            { label: '🔧 Book a plumber'  },
            { label: '💬 Ask a question'  },
          ], mainMenu);
        }, 600);
      }, 580);

    } else if (v === '🕐 Hours') {
      typing(() => {
        msg(HOURS_INFO, 'b');
        typing(() => {
          msg(`Anything else I can help with?`, 'b');
          qr([
            { label: '🔧 Book a plumber'  },
            { label: '🚨 Emergency help'  },
            { label: '💬 Ask a question'  },
          ], mainMenu);
        }, 600);
      }, 580);

    } else if (v === '💬 Ask a question' || v === '💬 Ask another question') {
      typing(() => {
        msg(`Of course! Ask me anything about our services, pricing, areas or hours. 😊`, 'b');
        step = 'chat';
      }, 500);
    }
  }

  // ── Lead capture flow — name, number, area ──
  function startLead() {
    step = 'name';
    msg(`What's your <strong>name</strong>?`, 'b');
  }

  function handleLead(t) {
    if (step === 'name') {
      lead.name = t;
      step = 'phone';
      typing(() => msg(`Nice to meet you, <strong>${lead.name}</strong>! 👋<br>What's your <strong>WhatsApp number</strong>?`, 'b'), 580);

    } else if (step === 'phone') {
      lead.phone = t;
      step = 'area';
      typing(() => msg(`Great! And which <strong>area</strong> are you in?`, 'b'), 580);

    } else if (step === 'area') {
      lead.area = t;
      step = 'done';
      confirmLead();
    }
  }

  function confirmLead() {
    typing(() => {
      msg(
        `✅ <strong>Got it! Here's your summary:</strong><br><br>` +
        `👤 <strong>Name:</strong> ${lead.name}<br>` +
        `📱 <strong>WhatsApp:</strong> ${lead.phone}<br>` +
        `📍 <strong>Area:</strong> ${lead.area}<br><br>` +
        `We'll get back to you <strong>within 30 minutes</strong>.`,
        'b'
      );
      typing(() => {
        msg(
          `For the fastest response, send us a WhatsApp:` +
          waLink(
            'Open WhatsApp Chat',
            `Hi ClearFlo! My name is ${lead.name}, I'm in ${lead.area} and I need a plumber. My number is ${lead.phone}.`
          ),
          'b'
        );
        typing(() => {
          msg(`Anything else I can help with?`, 'b');
          qr([
            { label: '💬 Ask a question'        },
            { label: '👋 No thanks, I\'m sorted' },
          ], v => {
            if (v.includes('sorted')) {
              typing(() => msg(`Perfect! Have a great day — we'll be in touch soon. 😊`, 'b'), 420);
            } else {
              mainMenu(v);
            }
          });
        }, 800);
      }, 800);
    }, 700);
  }

  // ── Chat mode (FAQ / service matching) ──
  function handleChat(t) {
    const faq = matchFAQ(t);
    if (faq) {
      typing(() => {
        msg(faq, 'b');
        typing(() => {
          msg(`Anything else I can help with?`, 'b');
          qr([
            { label: '🔧 Book a plumber'       },
            { label: '💬 Ask another question'  },
          ], mainMenu);
        }, 580);
      }, 650);
      return;
    }

    const svcs = matchService(t);
    if (svcs.length) {
      const list = svcs.map(s => `<strong>${s.name}</strong>`).join(' or ');
      typing(() => {
        msg(`That sounds like our ${list} service. We offer <strong>free quotes</strong> with no call-out fee. Want to book?`, 'b');
        qr([
          { label: '🔧 Yes, book a plumber' },
          { label: '💬 Ask something else'  },
        ], v => {
          if (v === '🔧 Yes, book a plumber') {
            typing(() => startLead(), 420);
          } else {
            typing(() => { msg(`Sure — what else would you like to know? 😊`, 'b'); step = 'chat'; }, 420);
          }
        });
      }, 650);
      return;
    }

    // Fallback
    typing(() => {
      msg(
        `Great question! Our team can answer that directly. 😊` +
        waLink('Ask us on WhatsApp', `Hi ClearFlo! I have a question: ${t}`),
        'b'
      );
      typing(() => {
        msg(`Or would you like to book a plumber?`, 'b');
        qr([
          { label: '🔧 Book a plumber'      },
          { label: '💬 Ask something else'  },
        ], mainMenu);
      }, 650);
    }, 650);
  }

  // ── Send message ──
  function send() {
    const t = inp.value.trim();
    if (!t) return;
    inp.value = '';
    msg(t, 'u');

    if (step === 'name' || step === 'phone' || step === 'area') {
      handleLead(t);
      return;
    }
    if (step === 'chat') {
      handleChat(t);
      return;
    }

    // Idle — catch free text and route
    const faq  = matchFAQ(t);
    const svcs = matchService(t);
    if (faq || svcs.length) {
      step = 'chat';
      handleChat(t);
      return;
    }

    typing(() => {
      msg(`What can I help you with today?`, 'b');
      qr([
        { label: '🔧 Book a plumber' },
        { label: '🚨 Emergency help' },
        { label: '🛠️ Services'       },
        { label: '📍 Areas'          },
        { label: '🕐 Hours'          },
        { label: '💬 Ask a question' },
      ], mainMenu);
    }, 500);
  }

  go.addEventListener('click', send);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

  // Show badge after 4s if not opened
  setTimeout(() => { if (!isOpen) badge.style.display = 'block'; }, 4000);

})();
