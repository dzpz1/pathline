/* Pathline prototype — core: state, rendering, sheets, navigation, events. */
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
    chevDown: '<path d="M6 9l6 6 6-6"/>',
    up: '<path d="M6 15l6-6 6 6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    spark: '<path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"/><path d="M19 16v4M17 18h4"/>',
    alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.3v.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
    reply: '<path d="M9 8V5l-6 6 6 6v-3c5 0 8.5 1.3 12 5-1-5.5-4.5-10-12-11z"/>',
    link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 4.5a3.5 3.5 0 010 7M21 20c0-2.6-1.7-4.9-4-5.7"/>',
    refresh: '<path d="M20 11a8 8 0 10-2.3 5.7"/><path d="M20 4.5V11h-6.5"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 15.5V19a1 1 0 001 1h14a1 1 0 001-1v-3.5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
    clip: '<rect x="6" y="4.5" width="12" height="16" rx="2"/><path d="M9.5 3h5v3h-5z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    cal: '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h4"/>',
    star: '<path d="M12 4l2.4 5 5.6.8-4 3.9.9 5.5L12 16.6l-4.9 2.6.9-5.5-4-3.9 5.6-.8z"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H12"/>',
    send: '<path d="M5 12l14-7-5 15-3-6z"/><path d="M11 14l8-9"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".6"/>',
    pause: '<path d="M9 6v12M15 6v12"/>',
    grip: '<path d="M9 7h.01M15 7h.01M9 12h.01M15 12h.01M9 17h.01M15 17h.01"/>',
    trend: '<path d="M4 17l6-6 4 4 6-7"/><path d="M15 8h5v5"/>',
    bolt: '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>'
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
    `<button class="chip ${on ? 'on' : ''} ${cls || ''}" data-a="${action}" ${data || ''}>${on ? ic('check', 'sm') : ''}${label}</button>`;
  PL.stepper = (val, action, data) =>
    `<span class="stepper"><button data-a="${action}" data-d="-1" ${data || ''} aria-label="Decrease">−</button><span>${val}</span><button data-a="${action}" data-d="1" ${data || ''} aria-label="Increase">+</button></span>`;
  PL.options = (list, cur, placeholder) =>
    (placeholder ? `<option value="" ${!cur ? 'selected' : ''} disabled>${esc(placeholder)}</option>` : '') +
    list.map(o => { const v = typeof o === 'object' ? o.v : o, l = typeof o === 'object' ? o.l : o; return `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(l)}</option>`; }).join('');

  /* ---------- routes ---------- */
  PL.ROUTES = [
    { id: 'start', m: 0, label: 'Welcome' },
    { id: 'import', m: 1, label: 'Import & structure', step: 1 },
    { id: 'attributes', m: 1, label: 'Attributes', step: 2 },
    { id: 'requirements', m: 1, label: 'Requirements', step: 3 },
    { id: 'see', m: 1, label: 'What candidates will see', step: 4 },
    { id: 'review', m: 1, label: 'Review & pool', step: 5 },
    { id: 'shortlist', m: 1, label: 'Shortlist', step: 6 },
    { id: 'sequence', m: 2, label: 'Email sequence' },
    { id: 'started', m: 2, label: 'Outreach started' },
    { id: 'monitor', m: 3, label: 'Monitoring' },
    { id: 'replies', m: 4, label: 'Replies' },
    { id: 'postchat', m: 4, label: 'After the chat' },
    { id: 'takehome', m: 4, label: 'Take-home' },
    { id: 'thsent', m: 4, label: 'Take-home sent' },
    { id: 'reviewq', m: 5, label: 'Take-home reviews' },
    { id: 'onsite', m: 5, label: 'Onsite' }
  ];
  PL.MILESTONES = { 1: 'Shortlist', 2: 'Outreach', 3: 'Monitoring', 4: 'Chat & take-home', 5: 'Review → onsite' };
  PL.routeIdx = id => PL.ROUTES.findIndex(r => r.id === id);

  PL.ABOUT = {
    start: { g: 'Grow the team without lowering the bar', p: 'Pathline is a recruiting tool for tech companies in their scaling phase. It finds experienced people with real evidence of what a role needs, reaches out on your behalf, and tests them rigorously without losing their interest.', t: ['Start the demo as Farah, CTO at Nectar Social, hiring a Senior PM, AI.', 'Use the steps on the left to jump anywhere.'] },
    import: { g: 'One step from job description to structured role', p: 'Paste, upload, link or talk. Pathline structures the posting, drafts 12–18 month outcomes and catches contradictions before any candidate sees them.', t: ['Tap Import: Nectar’s posting is pre-filled.', 'Resolve the two conflicts the parser found.', 'Fill in the blank in outcome 1.'] },
    attributes: { g: 'What this role needs, ranked', p: 'Attributes are properties of the person, not past experience. They’re generated from the JD and ranked by impact on the next 12–18 months. Rank is the only priority signal.', t: ['Tap a row to see the evidence we’ll look for.', 'Reorder with the arrows.', 'Add Intellectual honesty and see where Pathline suggests ranking it.'] },
    requirements: { g: 'Hard parameters only, as your JD wrote them', p: 'Must-haves are kept word for word and structured so they can be checked against profiles. Pathline also asks about what the JD left out.', t: ['Tap a row to see the original wording.', 'Answer visa sponsorship and relocation.', 'Add a requirement of your own.'] },
    see: { g: 'Everything candidates see, and when', p: 'Give first: comp, the process and your response commitment are disclosed before candidates are asked for effort. ✉ fields appear in outreach; ↩ fields after they reply.', t: ['Fill the required fields, or use demo values.', 'Reorder the hiring process stages.', 'Try a 24h commitment.'] },
    review: { g: 'How big is your realistic talent pool?', p: 'Approximate ranges, narrowing from must-haves to people who are strong on your top attributes, likely to move, and within your base range. Tap any layer to adjust what’s behind it.', t: ['Tap “Base range fits” and raise the top of the range.', 'Tap “+ location” and turn relocation off.', 'Watch the verdict change.'] },
    shortlist: { g: 'Milestone 1: your shortlist', p: 'Recommended pre-candidates, sized to your start date. Each card says what the person is exceptional at and why they’re a great fit. This is where you exercise judgment.', t: ['Tap a card to see evidence by attribute.', 'Pass on a few candidates with no B2B background and watch for a suggestion.', 'Approve all, then start outreach.'] },
    sequence: { g: 'Five emails that reveal more each time', p: 'Sent from Farah’s mailbox. Every fact comes from the company fact bank; personalized lines show their source; blanks block approval.', t: ['Expand an email and edit any text directly.', 'Ask one email to be shorter.', 'Change all emails: tap Growth.', 'Preview as a different pre-candidate.'] },
    started: { g: 'Outreach is live', p: 'Pathline paces outreach by how many pre-candidates are active at a time. When someone replies or finishes the sequence, the next person starts.', t: ['Change how many are active.', 'Skip ahead 10 days.'] },
    monitor: { g: 'Milestone 3: keep pace with your start date', p: 'Replies are the headline metric; opens are approximate. Suggestions appear only when they’d help, and nothing new joins without your approval.', t: ['Apply the send-timing suggestion.', 'Review the 4 new matches.', 'Open the replies waiting for you.'] },
    replies: { g: 'The moment of connection', p: 'When a pre-candidate replies, they become a candidate and join the Pathline network. Their reply shows they’re open to a move, so they’re a warm lead for this role and others.', t: ['Open Maya’s reply and choose “Chat first”.', 'Open Aisha’s and go straight to the take-home.'] },
    postchat: { g: 'Gut check first', p: 'The hiring manager’s impression is captured before anything else, so it’s an independent check. Pathline reads the transcript too, but that read stays internal.', t: ['Give a gut check, paste the sample transcript, confirm consent.', 'Send the take-home, or try Pass to see the graceful decline.'] },
    takehome: { g: 'A take-home that tests every attribute', p: 'Generated from the fact bank around a fictional company, so it’s realistic without being free work. The coverage map shows which section tests which attribute.', t: ['Expand the sections.', 'Check coverage: Adaptability is weighted up because the chat didn’t show it.'] },
    thsent: { g: 'The candidate knows when they’ll hear back', p: 'Review-by and decision dates come from your 48h commitment and are tracked. The take-home is AI-graded per attribute, and a strong one boosts the candidate across Pathline if they opt in.', t: ['Skip ahead to when submissions arrive.'] },
    reviewq: { g: 'Milestone 5: decide by the dates you committed to', p: 'Submissions sorted by deadline. Each reviewer decides independently; decisions are revealed after you submit.', t: ['Open Maya’s submission.', 'Decide, and see Kaan’s decision revealed.'] },
    onsite: { g: 'Ready for onsites', p: 'Advanced candidates, grouped by scheduling status. Scheduling happens on your own calendar; Pathline nudges when someone hasn’t booked.', t: ['Send a scheduling link.', 'Mark someone as scheduled.'] }
  };

  /* ---------- state ---------- */
  const KEY = 'pathline-prototype-v1';
  PL.initialState = () => ({
    route: 'start',
    jd: { source: 'paste', text: D.JD_TEXT, link: D.JD_URL, parsing: false, parseStep: 0, imported: false, work: null, outcomeBlank: '', showOrig: false, editSummary: false, summary: D.SUMMARY },
    attrs: D.ATTRS.map(a => Object.assign({}, a, { strong: a.strong.slice(), weak: a.weak.slice() })),
    newAttrId: null,
    ui: { editAttr: null, otherOpen: false, addQuery: '', addWarn: false, evEdit: null, evWorking: false, placeRank: 5, reqType: 'Skill', reqLevel: 'Uses daily', openEmail: 0, secOpen: { scenario: true }, passReasons: [] },
    reqs: { minYears: 5, role: 'Product manager', metricsLevel: 'Uses daily', aiEither: true, office: 'Palo Alto', days: 4, visa: null, relocation: null, custom: [] },
    see: { title: null, whyType: null, whyLine: '', reportsTo: '', engineers: '', otherPMs: '', directReports: '0', baseMin: 170, baseMax: 225, equity: '', vesting: '4 yr, 1 yr cliff', bonus: '', start: 'Dec 2026', hm: '', commitment: 48,
      stages: [{ name: 'Take-home assignment', h: 3 }, { name: 'Onsite interview', h: 4 }, { name: 'Final interview', h: 1 }] },
    sl: { dec: {}, suggDismissed: false, disDismissed: false },
    seq: { versions: { v1: { name: 'v1 Balanced', kind: 'base', emails: [0, 1, 2, 3, 4].map(() => ({ variant: 'base', hist: [], edits: {}, applied: null })) } },
      order: ['v1'], active: 'v1', preview: null, revising: null, revisingAll: false, approved: false, oneTap: true,
      facts: { rev: '', revShare: 'approx', custNow: '', custThen: '', custShare: 'exact', teamNow: '', teamNext: '', teamShare: 'exact' } },
    out: { active: 6, started: false, timingApplied: false, timingDismissed: false, activeDismissed: false, newAdded: {}, newPassed: {} },
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
  const A = PL.A;
  A.go = d => PL.go(d.r);
  A.noop = () => {};
  A.reset = () => { try { localStorage.removeItem(KEY); } catch (e) { } PL.S = PL.initialState(); PL.closeDrawer(); };
  A.closeSheet = () => { const sh = PL.S.sheet; if (sh && PL.SHEET_CLOSE[sh.type]) PL.SHEET_CLOSE[sh.type](sh); PL.S.sheet = null; };
  A.drawer = () => { document.getElementById('drawer').classList.add('on'); };
  A.closeDrawer = () => PL.closeDrawer();
  PL.closeDrawer = () => { const d = document.getElementById('drawer'); if (d) d.classList.remove('on'); };
  A.toastUndo = () => { const t = PL.S.toast; if (t && t.undo && PL.UNDO[t.undo]) PL.UNDO[t.undo](t.data); PL.S.toast = null; };
  PL.UNDO = PL.UNDO || {};
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
        h += `<button class="nav-step ${cls}" data-a="go" data-r="${r.id}"><span class="n">${i < cur ? ic('check', 'sm').replace('class="ic sm"', 'class="ic" style="width:12px;height:12px"') : n}</span>${esc(r.label)}</button>`;
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
        <span class="demo-badge">${ic('info', 'sm')}Demo data: candidates, numbers and replies are fictional</span>
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
    const dr = document.getElementById('drawer');
    dr.innerHTML = `<div class="dbg" data-a="closeDrawer"></div><div class="dpanel">${leftHTML()}</div>`;
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
      h += `<div class="appbar">${scr.back ? `<button class="back" data-a="go" data-r="${scr.back}" aria-label="Back">${ic('back', 'lg')}</button>` : ''}<div class="t">${esc(scr.title)}</div>${r.step ? `<span class="step">${r.step}/6</span>` : ''}${scr.right || ''}</div>`;
      if (r.step) h += `<div class="progress"><i style="width:${r.step / 6 * 100}%"></i></div>`;
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
      ${def.title ? `<div class="sheet-head" data-grab><div class="t">${def.title}${def.sub ? `<div class="sub">${def.sub}</div>` : ''}</div>${def.headRight || ''}<button class="icon-btn" data-a="closeSheet" aria-label="Close">${ic('x')}</button></div>` : ''}
      <div class="sheet-body" id="sheet-body">${def.body}</div>
      ${def.foot ? `<div class="sheet-foot">${def.foot}</div>` : ''}`;
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
    const key = sh.type + ':' + (sh.id || sh.screen || sh.layer || '');
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
    root.innerHTML = `<div class="toast">${ic('check')}<span>${t.text}</span>${t.undo ? `<button data-a="toastUndo">Undo</button>` : ''}</div>`;
  }

  PL.render = () => { renderPanels(); renderApp(); renderSheet(); renderToast(); };

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-a]');
    if (!t) return;
    const fn = A[t.dataset.a];
    if (!fn) return;
    if (t.tagName === 'A') e.preventDefault();
    fn(t.dataset, t, e);
    PL.save(); PL.render();
  });
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
    drag.sheet.style.transform = `translateY(${drag.dy}px)`;
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

  PL.boot = () => { PL.render(); };
})(window.PL);
