/* Pathline prototype — core: state, rendering, sheets, navigation, events, drag-to-reorder. */
window.PL = window.PL || {};
(function (PL) {
  const D = PL.D;

  /* ---------- utils ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  PL.esc = esc;
  PL.hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

  const ICONS = {
    back: '<path d="M15 6l-6 6 6 6"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    up: '<path d="M7 14l5-5 5 5"/>',
    down: '<path d="M7 10l5 5 5-5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
    upload: '<path d="M12 15V4M7 9l5-5 5 5"/><path d="M4 15.5V19a1 1 0 001 1h14a1 1 0 001-1v-3.5"/>'
  };
  PL.ic = (n, cls) => `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const ic = PL.ic;

  PL.avatar = (c, size) => {
    const col = D.AVATAR_COLORS[PL.hash(c.id) % D.AVATAR_COLORS.length];
    const ini = c.name.split(' ').map(p => p[0]).slice(0, 2).join('');
    const s = size ? `width:${size}px;height:${size}px;font-size:${Math.round(size * .36)}px;` : '';
    return `<div class="avatar" style="background:${col};${s}">${esc(ini)}</div>`;
  };
  PL.chip = (label, on, action, data, cls) =>
    `<button class="chip ${on ? 'on' : ''} ${cls || ''}" data-a="${action}" ${data || ''}>${label}</button>`;
  PL.options = (list, cur, placeholder) =>
    (placeholder ? `<option value="" ${!cur ? 'selected' : ''} disabled>${esc(placeholder)}</option>` : '') +
    list.map(o => { const v = typeof o === 'object' ? o.v : o, l = typeof o === 'object' ? o.l : o; return `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(l)}</option>`; }).join('');
  PL.row = (label, value, action, data, opts) => {
    opts = opts || {};
    return `<div class="frow ${opts.hl ? 'hl' : ''} ${opts.off ? 'off' : ''}" data-a="${action}" ${data || ''}><span class="k">${label}</span><span class="v ${opts.need ? 'need-t' : ''}">${value}</span></div>`;
  };

  PL.rankCol = (i, n, action, data) => `<div class="rankcol"><span class="attr-rank">${i + 1}</span><div class="rk-arrows">
      ${i > 0 ? `<button class="rk" data-a="${action}" ${data} data-d="-1" aria-label="Move up">${ic('up', 'sm')}</button>` : '<span class="rk-sp"></span>'}
      ${i < n - 1 ? `<button class="rk" data-a="${action}" ${data} data-d="1" aria-label="Move down">${ic('down', 'sm')}</button>` : '<span class="rk-sp"></span>'}</div></div>`;

  /* ---------- routes ---------- */
  PL.ROUTES = [
    { id: 'start', m: 0, label: 'Welcome' },
    { id: 'jd', m: 1, label: 'Job description' },
    { id: 'import', m: 1, label: 'Candidate attributes' },
    { id: 'review', m: 1, label: 'Role requirements' },
    { id: 'shortlist', m: 1, label: 'Shortlist' },
    { id: 'see', m: 2, label: 'Outreach fact sheet' },
    { id: 'sequence', m: 2, label: 'Email sequence' },
    { id: 'monitor', m: 3, label: 'Optimize outreach', noStep: true },
    { id: 'assess', m: 4, label: 'Practical assessment', noStep: true }
  ];
  PL.GOALS = { 1: 'Shortlist for outreach', 2: 'Outreach', 3: 'Monitoring', 4: 'Chat & practical assessment', 5: 'Review & onsite' };
  PL.STARTS = { 2: 'Starts when your shortlist is ready', 3: 'Starts when outreach begins', 4: 'Starts when someone replies', 5: 'Starts when a practical assessment comes in' };
  PL.routeIdx = id => PL.ROUTES.findIndex(r => r.id === id);
  /* The menu: a flat list of places. It holds no state; each screen shows its own. */
  PL.MENU = ['jd', 'import', 'review', 'shortlist', 'see', 'sequence', 'monitor', 'assess'];

  /* ---------- state ---------- */
  const KEY = 'pathline-prototype-v4';
  PL.initialState = () => ({
    route: 'start', maxIdx: 0,
    jd: { input: '', parsing: false, parseStep: 0, imported: false, source: '', work: 'hybrid' },
    attrs: D.ATTRS.map(a => Object.assign({}, a, { strong: a.strong.slice(), weak: a.weak.slice() })),
    newAttrId: null,
    ui: { voice: {}, listening: null, confirmRemove: null, addQuery: '', addWarn: false, reqType: 'Skill', reqLevel: 'Uses daily', reqYears: '', reqLabel: '', openEmail: 0, secOpen: { scenario: true }, passReasons: [] },
    reqs: { minYears: 5, role: 'Product manager', metricsLevel: 'Uses daily', aiEither: true, office: 'Palo Alto', days: 4, visa: null, relocation: null, custom: [] },
    see: { title: null, whyType: 'New role', whyLine: '', place: {}, hidden: {}, custom: [], reportsTo: 'Misbah (CEO)', engineers: '6', otherPMs: '1', directReports: '0', facts: PL.D.FACTS.slice(), baseMin: 170, baseMax: 225, equity: '0.1–0.2%', vesting: '4 yr, 1 yr cliff', bonus: '10% target', start: 'Dec 2026', hm: PL.D.HMS[0], commitment: 48,
      inferred: { why: true, hm: true, team: true, equity: true, bonus: true },
      stages: [{ name: 'Practical assessment', h: 3 }, { name: 'Onsite interview', h: 4 }, { name: 'Final interview', h: 1 }] },
    sl: { dec: {}, final: null },
    seq: { versions: { v1: { name: 'v1 Balanced', kind: 'base', emails: [0, 1, 2, 3, 4].map(() => ({ variant: 'base', hist: [], edits: {}, applied: null })) } },
      order: ['v1'], active: 'v1', preview: null, revising: null, revisingAll: false, approved: false,
      facts: { rev: '', revShare: 'approx', custNow: '', custThen: '', custShare: 'exact', teamNow: '', teamNext: '', teamShare: 'exact' } },
    out: { active: 6, started: false, from: 'misbah@nectarsocial.com', window: 'Weekday mornings', timingDismissed: false, activeDismissed: false, newAdded: {}, newPassed: {} },
    network: 0, fromYou: 0,
    m4: { status: { c1: 'chatted', c2: 'new', c3: 'new', c12: 'sent' }, due: { c12: 'Oct 16' }, bookingLink: 'cal.example.com/misbah-nectar', chat: { overall: null, want: null, note: '', transcript: '', consent: false },
      thCand: null, chatCand: null, timebox: '3h', tweaks: {} },
    m5: { mine: {}, final: {}, onsite: [{ id: 'c7', state: 'toschedule', sent: 'Oct 10', nudge: true }, { id: 'c6', state: 'scheduled', date: 'Oct 21' }] },
    sheet: null, toast: null
  });

  PL.load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      s.sheet = null; s.toast = null; s.navOpen = false;
      if (PL.routeIdx(s.route) < 0) s.route = 'shortlist';
      return s;
    } catch (e) { return null; }
  };
  PL.save = () => { try { localStorage.setItem(KEY, JSON.stringify(PL.S)); } catch (e) { /* storage unavailable */ } };
  PL.S = PL.load() || PL.initialState();

  /* ---------- navigation ---------- */
  PL.FILL = PL.FILL || {};
  PL.go = (route) => {
    const S = PL.S;
    const target = PL.routeIdx(route);
    for (let i = 0; i < target; i++) { const f = PL.FILL[PL.ROUTES[i].id]; if (f) f(); }
    S.route = route; S.sheet = null; S.navOpen = false;
    S.maxIdx = Math.max(S.maxIdx || 0, target);
  };

  /* ---------- actions registry ---------- */
  PL.A = PL.A || {}; PL.I = PL.I || {}; PL.C = PL.C || {};
  PL.SCREENS = PL.SCREENS || {}; PL.SHEETS = PL.SHEETS || {}; PL.SHEET_CLOSE = PL.SHEET_CLOSE || {};
  PL.SORT = PL.SORT || {};
  PL.UNDO = PL.UNDO || {};
  const A = PL.A;
  A.go = d => PL.go(d.r);
  A.noop = () => {};
  A.reset = () => { try { localStorage.removeItem(KEY); } catch (e) { } PL.S = PL.initialState(); };
  A.closeSheet = () => { const sh = PL.S.sheet; if (sh && PL.SHEET_CLOSE[sh.type]) PL.SHEET_CLOSE[sh.type](sh); PL.S.sheet = null; };
  A.toastUndo = () => { const t = PL.S.toast; if (t && t.undo && PL.UNDO[t.undo]) PL.UNDO[t.undo](t.data); PL.S.toast = null; };
  PL.openSheet = (type, props) => { PL.S.sheet = Object.assign({ type }, props || {}); };

  let toastTimer = null;
  PL.toast = (text, undo, data) => {
    PL.S.toast = { text, undo, data, id: Date.now() };
    clearTimeout(toastTimer);
    const id = PL.S.toast.id;
    toastTimer = setTimeout(() => { if (PL.S.toast && PL.S.toast.id === id) { PL.S.toast = null; renderToast(); } }, 4200);
  };

  /* ---------- rendering ---------- */
  function renderApp() {
    const S = PL.S, app = document.getElementById('app');
    const prev = document.getElementById('scroll');
    const prevScroll = prev ? prev.scrollTop : 0;
    const same = app.dataset.route === S.route;
    const scr = PL.SCREENS[S.route]();
    const r = PL.ROUTES[PL.routeIdx(S.route)];
    let h = '';
    if (!scr.noBar) {
      const step = r.noStep ? 0 : PL.MENU.indexOf(r.id) + 1, n = PL.ROUTES.filter(x => PL.MENU.includes(x.id) && !x.noStep).length;
      const todo = Object.values(PL.todos ? PL.todos() : {}).reduce((a, b) => a + b, 0);
      const task = scr.task || r.label;
      const sub = scr.sub != null ? scr.sub : step ? `Step ${step} of ${n} · ${task}` : task;
      h += `<div class="appbar">${scr.back ? `<button class="back" ${scr.backA ? `data-a="${scr.backA}"` : `data-a="go" data-r="${scr.back}"`} aria-label="Back">${ic('back', 'lg')}</button>` : ''}<div class="tt"><div class="t">${esc(scr.head || PL.GOALS[r.m])}</div><div class="goal">${esc(sub)}</div></div>
        <button class="menu-ic" data-a="openMenu" aria-label="Menu${todo ? `, ${todo} to-do${todo === 1 ? '' : 's'}` : ''}">${ic('menu', 'lg')}${todo ? `<span class="badge">${todo}</span>` : ''}</button></div>`;
      if (step && !scr.head) h += `<div class="progress"><i style="width:${step / n * 100}%"></i></div>`;
    }
    h += `<div class="scroll ${same ? '' : 'fade-in'}" id="scroll">${scr.body}</div>`;
    if (scr.footer) h += `<div class="footer" id="footer">${scr.footer}</div>`;
    app.innerHTML = h;
    app.dataset.route = S.route;
    if (same) document.getElementById('scroll').scrollTop = prevScroll;
  }
  PL.liveFooter = () => {
    const scr = PL.SCREENS[PL.S.route]();
    const f = document.getElementById('footer');
    if (f && scr.footer) f.innerHTML = scr.footer;
  };

  function sheetInner(def) {
    return `<div class="sheet-grab" data-grab><i></i></div>
      ${def.title ? `<div class="sheet-head" data-grab><div class="t">${def.title}${def.sub ? `<div class="sub">${def.sub}</div>` : ''}</div><button class="icon-btn" data-a="closeSheet" aria-label="Close">${ic('x')}</button></div>` : ''}
      <div class="sheet-body" id="sheet-body">${def.body}</div>
      ${def.foot ? `<div class="sheet-foot" id="sheet-foot">${def.foot}</div>` : ''}`;
  }
  function renderSheet() {
    const S = PL.S, root = document.getElementById('sheet-root');
    const sh = S.sheet;
    document.body.classList.toggle('sheet-open', !!sh);
    if (!sh) {
      if (root.classList.contains('on')) {
        root.classList.remove('show');
        root.dataset.key = '';
        setTimeout(() => { if (!PL.S.sheet) { root.classList.remove('on'); root.innerHTML = ''; } }, 330);
      }
      return;
    }
    const def = PL.SHEETS[sh.type](sh);
    const key = sh.type + ':' + (sh.id || sh.screen || sh.layer || sh.key || '');
    const existing = root.querySelector('.sheet');
    if (existing && root.classList.contains('show')) {
      const body = root.querySelector('.sheet-body');
      const st = body ? body.scrollTop : 0;
      existing.className = `sheet ${def.tall ? 'tall' : ''}`;
      existing.dataset.prev = def.swipePrev || ''; existing.dataset.next = def.swipeNext || '';
      existing.innerHTML = sheetInner(def);
      const nb = root.querySelector('.sheet-body');
      if (root.dataset.key === key && nb) nb.scrollTop = st; else if (nb) { nb.scrollTop = 0; scrollToHl(nb); }
      root.dataset.key = key;
      return;
    }
    root.innerHTML = `<div class="backdrop" data-a="closeSheet"></div><div class="sheet ${def.tall ? 'tall' : ''}" data-prev="${def.swipePrev || ''}" data-next="${def.swipeNext || ''}">${sheetInner(def)}</div>`;
    root.dataset.key = key;
    root.classList.add('on');
    void root.offsetHeight;
    requestAnimationFrame(() => { root.classList.add('show'); const nb = root.querySelector('.sheet-body'); if (nb) setTimeout(() => scrollToHl(nb), 250); });
  }
  function scrollToHl(body) {
    const hl = body.querySelector('.hl');
    if (hl) body.scrollTo({ top: Math.max(0, hl.offsetTop - 70), behavior: 'smooth' });
  }
  PL.renderSheetOnly = renderSheet;

  function renderToast() {
    const t = PL.S.toast, root = document.getElementById('toast-root');
    if (!t) { root.innerHTML = ''; return; }
    if (root.dataset.id === String(t.id) && root.innerHTML) return;
    root.dataset.id = t.id;
    root.innerHTML = `<div class="toast"><span>${t.text}</span>${t.undo ? `<button data-a="toastUndo">Undo</button>` : ''}</div>`;
  }

  PL.render = () => { renderApp(); renderSheet(); renderNav(); renderToast(); };

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-a]');
    if (!t) return;
    const fn = A[t.dataset.a];
    if (!fn) return;
    if (t.tagName === 'A') e.preventDefault();
    fn(t.dataset, t, e);
    PL.save(); PL.render();
  }, true);
  document.addEventListener('input', e => {
    const t = e.target.closest('[data-i]');
    if (!t) return;
    const fn = PL.I[t.dataset.i];
    if (fn) fn(t.value, t.dataset, t);
    PL.save();
  });
  document.addEventListener('change', e => {
    const t = e.target.closest('[data-c]');
    if (!t) return;
    const fn = PL.C[t.dataset.c];
    if (fn) fn(t.type === 'checkbox' ? t.checked : t.value, t.dataset, t);
    PL.save(); PL.render();
  });
  document.addEventListener('keydown', e => {
    const t = e.target;
    if (e.key === 'Enter' && t.dataset && t.dataset.enter && !e.shiftKey) {
      e.preventDefault();
      const fn = A[t.dataset.enter];
      if (fn) { fn(t.dataset, t, e); PL.save(); PL.render(); }
    }
    if (e.key === 'Escape' && PL.S.navOpen) { PL.S.navOpen = false; PL.render(); return; }
    if (e.key === 'Escape' && PL.S.sheet) { A.closeSheet(); PL.save(); PL.render(); }
  });
  document.addEventListener('focusout', e => {
    const t = e.target;
    if (t && t.dataset && t.dataset.edit && PL.saveEdit) {
      if (PL.saveEdit(t)) { PL.save(); setTimeout(PL.render, 0); }
    }
  });

  PL.move = (arr, from, to) => { const [x] = arr.splice(from, 1); arr.splice(to, 0, x); };
  const zoom = () => PL.zoom || 1;

  /* Sheet drag-to-dismiss and horizontal swipe between items */
  let drag = null;
  document.addEventListener('pointerdown', e => {
    const g = e.target.closest('[data-grab]');
    if (!g || e.target.closest('button')) return;
    const sheet = g.closest('.sheet');
    drag = { y0: e.clientY, sheet, dy: 0 };
    sheet.classList.add('dragging');
  });
  document.addEventListener('pointermove', e => {
    if (!drag) return;
    drag.dy = Math.max(0, e.clientY - drag.y0);
    drag.sheet.style.transform = `translateY(${drag.dy / zoom()}px)`;
  });
  document.addEventListener('pointerup', () => {
    if (!drag) return;
    const d = drag; drag = null;
    d.sheet.classList.remove('dragging');
    d.sheet.style.transform = '';
    if (d.dy > 110) { A.closeSheet(); PL.save(); PL.render(); }
  });
  let touch = null;
  document.addEventListener('touchstart', e => {
    const b = e.target.closest('.sheet-body');
    if (!b) return;
    touch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if (!touch) return;
    const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
    touch = null;
    if (Math.abs(dx) < 70 || Math.abs(dy) > 45) return;
    const sheet = document.querySelector('.sheet');
    const act = dx < 0 ? sheet && sheet.dataset.next : sheet && sheet.dataset.prev;
    if (act) { const [a, id] = act.split(':'); if (A[a]) { A[a]({ id }); PL.save(); PL.render(); } }
  });

  /* ---------- fit the phone frame to the viewport, keeping its aspect ratio ---------- */
  PL.fit = () => {
    const small = window.innerWidth <= 500;
    const k = small ? 1 : Math.min(1, (window.innerHeight - 32) / 860);
    PL.zoom = k;
    document.documentElement.style.setProperty('--k', k.toFixed(3));
  };
  window.addEventListener('resize', PL.fit);

  /* Simulated voice input: "Talk it through" under a field fills it with a transcript. */
  PL.VOICE = {};
  A.talk = d => {
    const S = PL.S, key = d.t;
    S.ui.listening = key;
    setTimeout(() => {
      PL.S.ui.listening = null;
      const text = PL.VOICE[key.replace(/-\d+$/, '-n')] || PL.VOICE[key] || '';
      if (PL.VOICE_APPLY && PL.VOICE_APPLY[key.replace(/-\d+$/, '-n')]) PL.VOICE_APPLY[key.replace(/-\d+$/, '-n')](text, key);
      else PL.S.ui.voice[key] = text;
      PL.save(); PL.render();
    }, 1300);
  };
  PL.micBtn = key => `<button class="tool ${PL.S.ui.listening === key ? 'on' : ''}" data-a="talk" data-t="${key}" aria-label="Talk it through">${ic('mic')}</button>`;
  /* A plain ask-for-a-change box: the mic sits inside the field, on the right. */
  PL.askBox = (key, ph, enter, extra) => { const on = PL.S.ui.listening === key; return `<div class="ask"><input class="field" id="${key}" value="${esc(PL.S.ui.voice[key] || '')}" placeholder="${on ? 'Listening…' : esc(ph)}" data-enter="${enter}" ${extra || ''}><button class="ask-mic ${on ? 'on' : ''}" data-a="talk" data-t="${key}" aria-label="${on ? 'Listening' : 'Talk it through'}">${ic('mic')}</button></div>`; };

  /* ---------- Menu: every step, with red badges on what needs attention ---------- */
  A.openMenu = () => { PL.S.sheet = null; PL.S.navOpen = true; };
  A.closeNav = () => { PL.S.navOpen = false; };
  /* Open the shortlist at a milestone's section, filling in everything before it so any step can be jumped to. */
  PL.openHub = anchor => {
    if (!PL.S.out.started) PL.go('monitor');
    PL.go('shortlist');
    setTimeout(() => { const el = document.getElementById('sec-' + anchor), sc = document.getElementById('scroll'); if (el && sc) sc.scrollTop = el.offsetTop - (el.offsetParent === sc ? 0 : sc.offsetTop) - 8; }, 30);
  };
  A.navGo = d => { PL.S.navOpen = false; PL.go(d.r); };
  A.openHub = d => PL.openHub(d.k || 'needs');
  function renderNav() {
    const S = PL.S, root = document.getElementById('nav-root');
    if (!S.navOpen) {
      if (root.classList.contains('on')) { root.classList.remove('show'); setTimeout(() => { if (!PL.S.navOpen) { root.classList.remove('on'); root.innerHTML = ''; } }, 300); }
      return;
    }
    let h = `<div class="nav-bd" data-a="closeNav"></div><aside class="nav-panel" aria-label="Menu">
      <div class="nav-head"><div><div class="nav-role">${esc(PL.titleText())}</div><div class="nav-co">Nectar Social</div></div><button class="icon-btn" data-a="closeNav" aria-label="Close menu">${ic('x')}</button></div><div class="nav-body"><div class="nav-list">`;
    const todos = PL.todos ? PL.todos() : {};
    PL.MENU.forEach(id => {
      const r = PL.ROUTES[PL.routeIdx(id)];
      const t = todos[id] || 0;
      h += `<button class="nav-item ${id === S.route ? 'cur' : ''}" data-a="navGo" data-r="${id}"${id === S.route ? ' aria-current="page"' : ''}><span class="nav-l">${esc(r.label)}</span>${t ? `<span class="nbadge" aria-label="${t} to-do${t === 1 ? '' : 's'}">${t}</span>` : ''}</button>`;
    });
    h += '</div><button class="nav-reset" data-a="reset">Reset demo</button>';
    h += '</div></aside>';
    const wasShown = root.classList.contains('show');
    root.innerHTML = h;
    root.classList.add('on');
    if (!wasShown) { void root.offsetHeight; requestAnimationFrame(() => root.classList.add('show')); } else root.classList.add('show');
  }
  /* swipe the panel away to the right */
  let navSwipe = null;
  document.addEventListener('pointerdown', e => { const p = e.target.closest('.nav-panel'); if (p) navSwipe = { x: e.clientX, y: e.clientY }; });
  document.addEventListener('pointerup', e => {
    if (!navSwipe) return;
    const dx = e.clientX - navSwipe.x, dy = e.clientY - navSwipe.y; navSwipe = null;
    if (dx > 80 && Math.abs(dy) < 60) { PL.S.navOpen = false; PL.render(); }
  });

  PL.boot = () => { PL.fit(); PL.render(); };
})(window.PL);
