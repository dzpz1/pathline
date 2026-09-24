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
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>'
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
    return `<div class="frow ${opts.hl ? 'hl' : ''}" data-a="${action}" ${data || ''}><span class="k">${label}</span><span class="v ${opts.need ? 'need-t' : ''}">${value}</span><span class="chev">${ic('chev', 'sm')}</span></div>`;
  };

  /* ---------- routes ---------- */
  PL.ROUTES = [
    { id: 'start', m: 0, label: 'Welcome' },
    { id: 'import', m: 1, label: 'Import & what the role needs', step: 1 },
    { id: 'requirements', m: 1, label: 'Requirements', step: 2 },
    { id: 'review', m: 1, label: 'Review & pool', step: 3 },
    { id: 'shortlist', m: 1, label: 'Shortlist', step: 4 },
    { id: 'see', m: 2, label: 'What candidates will see', step: 1 },
    { id: 'sequence', m: 2, label: 'Email sequence', step: 2 },
    { id: 'started', m: 2, label: 'Outreach started', step: 3 },
    { id: 'monitor', m: 3, label: 'Monitoring' },
    { id: 'replies', m: 4, label: 'Replies' },
    { id: 'postchat', m: 4, label: 'After the chat' },
    { id: 'takehome', m: 4, label: 'Take-home' },
    { id: 'thsent', m: 4, label: 'Take-home sent' },
    { id: 'reviewq', m: 5, label: 'Take-home reviews' },
    { id: 'onsite', m: 5, label: 'Onsite' }
  ];
  PL.MILESTONES = { 1: 'Shortlist', 2: 'Outreach', 3: 'Monitoring', 4: 'Chat & take-home', 5: 'Review → onsite' };
  PL.GOALS = { 1: 'Shortlist for outreach', 2: 'Outreach', 3: 'Keep pace with your start date', 4: 'Chat & take-home', 5: 'Review & onsite' };
  PL.routeIdx = id => PL.ROUTES.findIndex(r => r.id === id);
  PL.stepsIn = m => PL.ROUTES.filter(r => r.m === m && r.step).length;

  PL.ABOUT = {
    start: { g: 'Every hire raises the bar', p: 'Pathline is a recruiting tool for tech companies in their scaling phase. It finds experienced people with real evidence of what a role needs, reaches out on your behalf, and tests them rigorously without losing their interest.', t: ['Start the demo as Farah, CTO at Nectar Social, hiring a Senior PM, AI.', 'Use the steps on the left to jump anywhere.'] },
    import: { g: 'From job description to what the role needs', p: 'Paste a link or the text; Pathline tells which. The role header shows it understood the role, and the focus is the ranked list of attributes the role needs.', t: ['Tap Import: Nectar’s link is pre-filled.', 'Answer the two questions in the role header.', 'Tap an attribute to see its evidence, then Edit.', 'Hold and drag an attribute to reorder.'] },
    requirements: { g: 'Hard parameters only, as your JD wrote them', p: 'Must-haves are kept word for word and structured so they can be checked against profiles. Pathline also asks about what the JD left out.', t: ['Tap a row to see the original wording.', 'Answer visa sponsorship and relocation.', 'Add a requirement: type, level, Add.'] },
    review: { g: 'How big is your realistic talent pool?', p: 'Set when you need them to start. The funnel narrows from must-haves to people who are strong on your attributes, likely to move, and within your base range. Tap any layer to adjust what’s behind it.', t: ['Change the start date.', 'Tap “Base range fits” and raise the top of the range.', 'Tap “Why 25?”.'] },
    shortlist: { g: 'The people Pathline sourced', p: 'Everyone here is included by default. Tap a card for their evidence; Pass on anyone who isn’t right, and the next best takes their place.', t: ['Tap a card to see evidence by attribute.', 'Pass on someone, then Undo.', 'Continue to outreach.'] },
    see: { g: 'Everything candidates see, and when', p: 'Give first: comp, the process and your response commitment are disclosed before candidates are asked for effort. This sits right before the emails because it’s what they disclose.', t: ['Tap a row to fill it in, or use demo values.', 'Open Hiring process and drag a stage.', 'Edit what success looks like.'] },
    sequence: { g: 'Five emails that reveal more each time', p: 'Sent from Farah’s mailbox. Every fact comes from the company fact bank; personalized lines show their source; blanks block approval.', t: ['Expand an email and edit any text directly.', 'Ask one email to be shorter.', 'Change all emails: tap Growth.', 'Preview as a different pre-candidate.'] },
    started: { g: 'Outreach is live', p: 'Pathline paces outreach by how many pre-candidates are active at a time. When someone replies or finishes the sequence, the next person starts.', t: ['Change how many are active.', 'Skip ahead 10 days.'] },
    monitor: { g: 'Milestone 3: keep pace with your start date', p: 'Replies are the headline metric; opens are approximate. Suggestions appear only when they’d help, and nothing new joins without your say-so.', t: ['Apply the send-timing suggestion.', 'Review the 4 new matches.', 'Open the replies waiting for you.'] },
    replies: { g: 'The moment of connection', p: 'When a pre-candidate replies, they become a candidate and join the Pathline network. Their reply shows they’re open to a move, so they’re a warm lead for this role and others.', t: ['Open Maya’s reply and choose “Chat first”.', 'Open Aisha’s and go straight to the take-home.'] },
    postchat: { g: 'Gut check first', p: 'The hiring manager’s impression is captured before anything else, so it’s an independent check. Pathline reads the transcript too, but that read stays internal.', t: ['Give a gut check, paste the sample transcript, confirm consent.', 'Send the take-home, or try Pass to see the graceful decline.'] },
    takehome: { g: 'A take-home that tests every attribute', p: 'Generated from the fact bank around a fictional company, so it’s realistic without being free work. The coverage list shows how many sections test each attribute.', t: ['Expand the sections.', 'Check coverage: Adaptability is weighted up because the chat didn’t show it.'] },
    thsent: { g: 'The candidate knows when they’ll hear back', p: 'Review-by and decision dates come from your response commitment and are tracked. The take-home is AI-graded per attribute, and a strong one boosts the candidate across Pathline if they opt in.', t: ['Skip ahead to when submissions arrive.'] },
    reviewq: { g: 'Milestone 5: decide by the dates you committed to', p: 'Submissions sorted by deadline. Each reviewer decides independently; decisions are revealed after you submit.', t: ['Tap Maya’s card to see her submission.', 'Decide, and see Kaan’s decision revealed.'] },
    onsite: { g: 'Ready for onsites', p: 'Advanced candidates, grouped by scheduling status. Scheduling happens on your own calendar; Pathline nudges when someone hasn’t booked.', t: ['Send a scheduling link.', 'Mark someone as scheduled.'] }
  };

  /* ---------- state ---------- */
  const KEY = 'pathline-prototype-v2';
  PL.initialState = () => ({
    route: 'start',
    jd: { input: D.JD_URL, parsing: false, parseStep: 0, imported: false, source: '', work: null },
    attrs: D.ATTRS.map(a => Object.assign({}, a, { strong: a.strong.slice(), weak: a.weak.slice() })),
    newAttrId: null,
    ui: { attrEdit: null, otherOpen: false, addQuery: '', addWarn: false, reqType: 'Skill', reqLevel: 'Uses daily', reqYears: '', reqLabel: '', openEmail: 0, secOpen: { scenario: true }, passReasons: [] },
    reqs: { minYears: 5, role: 'Product manager', metricsLevel: 'Uses daily', aiEither: true, office: 'Palo Alto', days: 4, visa: null, relocation: null, custom: [] },
    see: { title: null, whyType: null, whyLine: '', success: D.OUTCOMES.slice(), successEdited: false, reportsTo: '', engineers: '', otherPMs: '', directReports: '0', baseMin: 170, baseMax: 225, equity: '', vesting: '4 yr, 1 yr cliff', bonus: '', start: 'Dec 2026', hm: '', commitment: 48, promoted: {},
      stages: [{ name: 'Take-home assignment', h: 3 }, { name: 'Onsite interview', h: 4 }, { name: 'Final interview', h: 1 }] },
    sl: { dec: {}, final: null },
    seq: { versions: { v1: { name: 'v1 Balanced', kind: 'base', emails: [0, 1, 2, 3, 4].map(() => ({ variant: 'base', hist: [], edits: {}, applied: null })) } },
      order: ['v1'], active: 'v1', preview: null, revising: null, revisingAll: false, approved: false, oneTap: true,
      facts: { rev: '', revShare: 'approx', custNow: '', custThen: '', custShare: 'exact', teamNow: '', teamNext: '', teamShare: 'exact' } },
    out: { active: 6, started: false, disResolved: {}, timingApplied: false, timingDismissed: false, activeDismissed: false, newAdded: {}, newPassed: {} },
    network: 0, fromYou: 0,
    m4: { status: { c1: 'new', c2: 'new', c3: 'new' }, bookingLink: 'cal.example.com/farah-nectar', chat: { overall: null, want: null, note: '', transcript: '', consent: false },
      thCand: 'c1', timebox: '3h', thSent: false },
    m5: { mine: {}, final: {}, onsite: [{ id: 'c7', state: 'toschedule', sent: 'Oct 10', nudge: true }, { id: 'c6', state: 'scheduled', date: 'Oct 21' }] },
    sheet: null, toast: null
  });

  PL.load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      s.sheet = null; s.toast = null;
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
    S.route = route; S.sheet = null;
  };

  /* ---------- actions registry ---------- */
  PL.A = PL.A || {}; PL.I = PL.I || {}; PL.C = PL.C || {};
  PL.SCREENS = PL.SCREENS || {}; PL.SHEETS = PL.SHEETS || {}; PL.SHEET_CLOSE = PL.SHEET_CLOSE || {};
  PL.SORT = PL.SORT || {};
  PL.UNDO = PL.UNDO || {};
  const A = PL.A;
  A.go = d => PL.go(d.r);
  A.noop = () => {};
  A.reset = () => { try { localStorage.removeItem(KEY); } catch (e) { } PL.S = PL.initialState(); PL.closeDrawer(); };
  A.closeSheet = () => { const sh = PL.S.sheet; if (sh && PL.SHEET_CLOSE[sh.type]) PL.SHEET_CLOSE[sh.type](sh); PL.S.sheet = null; };
  A.drawer = () => { document.getElementById('drawer').classList.add('on'); };
  A.closeDrawer = () => PL.closeDrawer();
  PL.closeDrawer = () => { const d = document.getElementById('drawer'); if (d) d.classList.remove('on'); };
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
  function navHTML() {
    const S = PL.S, cur = PL.routeIdx(S.route);
    let h = '';
    for (let m = 1; m <= 5; m++) {
      h += `<div class="nav-m"><div class="nav-m-title">Milestone ${m} · ${PL.MILESTONES[m]}</div>`;
      let n = 0;
      PL.ROUTES.forEach((r, i) => {
        if (r.m !== m) return; n++;
        const cls = i === cur ? 'cur' : (i < cur ? 'done' : '');
        h += `<button class="nav-step ${cls}" data-a="go" data-r="${r.id}"><span class="n">${i < cur ? '✓' : n}</span>${esc(r.label)}</button>`;
      });
      h += '</div>';
    }
    return h;
  }
  function leftHTML() {
    const S = PL.S;
    return `<div class="wordmark"><span class="dotmark"></span>Pathline</div>
      <div class="kicker">Employer prototype · outbound flow<br>Nectar Social is hiring a Senior PM, AI</div>
      <nav class="nav">${navHTML()}</nav>
      <div class="panel-foot">
        <div class="network-pill"><b>${S.network}</b><span>in the Pathline network<br><span class="muted small">${S.fromYou} joined through your outreach</span></span></div>
        <span class="demo-badge">Demo data: candidates, numbers and replies are fictional</span>
        <button class="linkbtn" data-a="reset">Reset demo</button>
      </div>`;
  }
  function rightHTML() {
    const S = PL.S, r = PL.ROUTES[PL.routeIdx(S.route)], a = PL.ABOUT[S.route] || PL.ABOUT.start;
    const m = r.m ? `Milestone ${r.m} · ${PL.MILESTONES[r.m]}` : 'Welcome';
    return `<div class="about fade-in"><div class="m">${m}</div><h3>${esc(a.g)}</h3><p>${esc(a.p)}</p>
      <div class="try">Try</div><ul>${a.t.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>`;
  }
  let panelKey = '';
  function renderPanels() {
    const S = PL.S, key = `${S.route}|${S.network}|${S.fromYou}`;
    if (key === panelKey) return;
    const routeChanged = panelKey.split('|')[0] !== S.route;
    panelKey = key;
    const left = document.getElementById('left'), nav = left.querySelector('.nav'), st = nav ? nav.scrollTop : 0;
    left.innerHTML = leftHTML();
    const nn = left.querySelector('.nav');
    if (nn) { nn.scrollTop = st; const cur = nn.querySelector('.cur'); if (cur && routeChanged) cur.scrollIntoView({ block: 'nearest' }); }
    if (routeChanged) document.getElementById('right').innerHTML = rightHTML();
    document.getElementById('drawer').innerHTML = `<div class="dbg" data-a="closeDrawer"></div><div class="dpanel">${leftHTML()}</div>`;
  }

  function renderApp() {
    const S = PL.S, app = document.getElementById('app');
    const prev = document.getElementById('scroll');
    const prevScroll = prev ? prev.scrollTop : 0;
    const same = app.dataset.route === S.route;
    const scr = PL.SCREENS[S.route]();
    const r = PL.ROUTES[PL.routeIdx(S.route)];
    let h = '';
    if (!scr.noBar) {
      const n = PL.stepsIn(r.m);
      const goal = r.m ? `${PL.GOALS[r.m]}${r.step ? ` · Step ${r.step} of ${n}` : ''}` : '';
      h += `<div class="appbar">${scr.back ? `<button class="back" data-a="go" data-r="${scr.back}" aria-label="Back">${ic('back', 'lg')}</button>` : ''}<div class="tt"><div class="t">${esc(scr.title)}</div>${goal ? `<div class="goal">${esc(goal)}</div>` : ''}</div></div>`;
      if (r.step) h += `<div class="progress"><i style="width:${r.step / n * 100}%"></i></div>`;
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

  PL.render = () => { renderPanels(); renderApp(); renderSheet(); renderToast(); };

  /* ---------- events ---------- */
  let suppressClick = false;
  document.addEventListener('click', e => {
    if (suppressClick) { suppressClick = false; e.preventDefault(); e.stopPropagation(); return; }
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
    if (e.key === 'Escape' && PL.S.sheet) { A.closeSheet(); PL.save(); PL.render(); }
  });
  document.addEventListener('focusout', e => {
    const t = e.target;
    if (t && t.dataset && t.dataset.edit && PL.saveEdit) {
      if (PL.saveEdit(t)) { PL.save(); setTimeout(PL.render, 0); }
    }
  });

  /* ---------- hold-and-drag to reorder ----------
     Items: [data-sort="listName"] siblings with data-idx. PL.SORT[listName](from, to) applies the move. */
  let sort = null;
  const zoom = () => PL.zoom || 1;
  document.addEventListener('pointerdown', e => {
    const it = e.target.closest('[data-sort]');
    if (!it || e.button > 0 || e.target.closest('input,textarea,select,button')) return;
    sort = { it, x: e.clientX, y: e.clientY, started: false };
    sort.timer = setTimeout(() => {
      if (!sort) return;
      const items = [...it.parentElement.querySelectorAll(':scope > [data-sort]')];
      sort.items = items; sort.from = items.indexOf(it); sort.to = sort.from;
      sort.rects = items.map(el => el.getBoundingClientRect());
      sort.started = true;
      items.forEach(el => { if (el !== it) el.classList.add('sort-anim'); });
      it.classList.add('dragging');
      if (navigator.vibrate) navigator.vibrate(8);
    }, 280);
  });
  document.addEventListener('pointermove', e => {
    if (!sort) return;
    const dx = e.clientX - sort.x, dy = e.clientY - sort.y;
    if (!sort.started) { if (Math.hypot(dx, dy) > 8) { clearTimeout(sort.timer); sort = null; } return; }
    e.preventDefault();
    const k = zoom(), r0 = sort.rects[sort.from];
    sort.it.style.transform = `translateY(${dy / k}px)`;
    const mid = r0.top + r0.height / 2 + dy;
    let to = sort.from;
    sort.rects.forEach((r, i) => { if (i < sort.from && mid < r.top + r.height / 2) to = Math.min(to, i); if (i > sort.from && mid > r.top + r.height / 2) to = Math.max(to, i); });
    sort.to = to;
    const gap = sort.rects.length > 1 ? (sort.rects[1].top - sort.rects[0].bottom) : 8;
    const shift = (r0.height + gap) / k;
    sort.items.forEach((el, i) => {
      if (el === sort.it) return;
      let y = 0;
      if (sort.from < to && i > sort.from && i <= to) y = -shift;
      if (sort.from > to && i < sort.from && i >= to) y = shift;
      el.style.transform = y ? `translateY(${y}px)` : '';
    });
  });
  const endSort = () => {
    if (!sort) return;
    clearTimeout(sort.timer);
    const s = sort; sort = null;
    if (!s.started) return;
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 350);
    s.items.forEach(el => { el.style.transform = ''; el.classList.remove('sort-anim', 'dragging'); });
    const list = s.it.dataset.sort;
    if (s.to !== s.from && PL.SORT[list]) { PL.SORT[list](s.from, s.to); PL.save(); }
    PL.render();
  };
  document.addEventListener('pointerup', endSort);
  document.addEventListener('pointercancel', endSort);
  document.addEventListener('touchmove', e => { if (sort && sort.started) e.preventDefault(); }, { passive: false });
  document.addEventListener('contextmenu', e => { if (e.target.closest('[data-sort]')) e.preventDefault(); });
  PL.move = (arr, from, to) => { const [x] = arr.splice(from, 1); arr.splice(to, 0, x); };

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

  PL.boot = () => { PL.fit(); PL.render(); };
})(window.PL);
