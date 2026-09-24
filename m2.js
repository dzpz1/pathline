/* Pathline prototype — Milestone 2: email sequence review/refine → start outreach → confirmation */
(function (PL) {
  const D = PL.D, A = PL.A, I = PL.I, C = PL.C, SCREENS = PL.SCREENS, SHEETS = PL.SHEETS, esc = PL.esc, ic = PL.ic;
  const S = () => PL.S;
  const VARIANTS = ['base', 'warmer', 'shorter'];

  const ver = () => S().seq.versions[S().seq.active];
  PL.previewCand = () => {
    const q = S().seq, ap = PL.approved();
    const c = ap.find(x => x.id === q.preview) || ap[0] || D.CANDS[0];
    return c;
  };
  PL.orderedPre = () => { const ap = PL.approved(); return ap.filter(c => c.warm).concat(ap.filter(c => !c.warm)); };

  /* ---------- rendering an email ---------- */
  const BLANK_RE = /\[(why now|reports to|# engineers|12-month outcome)\]/g;
  function fill(text, ctx, counter) {
    let plain = '', html = '', last = 0, onlyOptionalEmpty = false;
    const re = /\[\[(\w+)\]\]/g; let m;
    const trimmed = text.trim();
    while ((m = re.exec(text))) {
      const before = text.slice(last, m.index);
      html += esc(before); plain += before;
      const key = m[1], val = ctx[key];
      if (val) { html += `<span class="slot" title="${esc(PL.SLOT_SRC[key] || '')}">${esc(val)}</span>`; plain += val; }
      else if (PL.OPTIONAL.includes(key)) { if (trimmed === m[0] || trimmed === '- ' + m[0]) onlyOptionalEmpty = true; }
      else { const lbl = PL.BLANK_LABEL[key] || key; html += `<span class="blank" contenteditable="false" data-a="openBlank" data-f="${key}">[${esc(lbl)}]</span>`; plain += `[${lbl}]`; counter.n++; }
      last = re.lastIndex;
    }
    html += esc(text.slice(last)); plain += text.slice(last);
    return { html, plain, skip: onlyOptionalEmpty };
  }
  function editedHTML(t, counter) {
    return esc(t).replace(BLANK_RE, (x, l) => { counter.n++; const k = Object.keys(PL.BLANK_LABEL).find(k => PL.BLANK_LABEL[k] === l); return `<span class="blank" contenteditable="false" data-a="openBlank" data-f="${k}">${x}</span>`; });
  }
  PL.renderEmail = (vKey, i, cand, editable) => {
    const q = S().seq, v = q.versions[vKey], tpl = D.EMAILS[v.kind][i], st = v.emails[i];
    const paras = tpl[st.variant] || tpl.base;
    const ctx = PL.emailCtx(cand), counter = { n: 0 };
    let out = '', inList = false;
    paras.forEach((p, pi) => {
      const isLi = p.startsWith('- ');
      const raw = isLi ? p.slice(2) : p;
      let html, plain, skip = false;
      if (st.edits[pi] != null) { plain = st.edits[pi]; html = editedHTML(plain, counter); }
      else { const r = fill(raw, ctx, counter); html = r.html; plain = r.plain; skip = r.skip; }
      if (skip) return;
      const attrs = editable ? `contenteditable="true" data-edit="${vKey}|${i}|${pi}" data-orig="${esc(plain)}" spellcheck="false"` : '';
      if (isLi && !inList) { out += '<ul>'; inList = true; }
      if (!isLi && inList) { out += '</ul>'; inList = false; }
      out += isLi ? `<li ${attrs}>${html}</li>` : `<p ${attrs}>${html}</p>`;
    });
    if (inList) out += '</ul>';
    return { html: out, blanks: counter.n };
  };
  PL.blankCount = (vKey, cand) => [0, 1, 2, 3, 4].reduce((a, i) => a + PL.renderEmail(vKey, i, cand, false).blanks, 0);
  PL.saveEdit = el => {
    const [vKey, i, pi] = el.dataset.edit.split('|');
    const txt = el.innerText.replace(/\s+\n/g, '\n').trim();
    if (txt === (el.dataset.orig || '').trim()) return false;
    S().seq.versions[vKey].emails[Number(i)].edits[Number(pi)] = txt;
    return true;
  };

  /* ---------- sequence screen ---------- */
  SCREENS.sequence = () => {
    const s = S(), q = s.seq, v = ver(), cand = PL.previewCand(), ap = PL.approved();
    const tpls = D.EMAILS[v.kind];
    let totalBlanks = 0;
    const cards = tpls.map((t, i) => {
      const st = v.emails[i], open = s.ui.openEmail === i;
      const r = PL.renderEmail(q.active, i, cand, true);
      totalBlanks += r.blanks;
      const edited = Object.keys(st.edits).length > 0;
      const subj = t.subject;
      let body = '';
      if (open) {
        const status = q.revising === i ? `<div class="working" style="margin-top:8px">Revising email ${i + 1}…</div>` :
          (st.hist.length ? `<div class="rev-status">${st.applied ? `Applied “${esc(st.applied)}” · ` : ''}Revised ${st.hist.length}× <button class="text-btn" data-a="compareRev" data-idx="${i}">Compare</button><button class="text-btn" data-a="undoEmail" data-idx="${i}">${ic('undo', 'sm')}Undo</button></div>` : '');
        body = `<div class="email-body">
          <div class="from">From farah@nectarsocial.com · To ${esc(cand.name.split(' ')[0])} · ${i === 0 ? esc(subj) : 'Same thread'}</div>
          ${r.html}
          ${q.oneTap ? `<div class="onetap"><span>Interested</span><span>Tell me more</span><span>Not now</span><span>I know someone</span></div>` : ''}
          <div class="revise">
            <div class="row"><input class="field" id="rev-${i}" placeholder="Revise this email, e.g. “cut the customer list”" data-enter="reviseEmail" data-idx="${i}"><button class="send-btn" data-a="reviseEmail" data-idx="${i}" aria-label="Revise">${ic('send', 'sm')}</button></div>
            <div class="chips">${PL.chip('Shorter', false, 'reviseEmail', `data-idx="${i}" data-v="shorter"`, 'sm')}${PL.chip('Warmer', false, 'reviseEmail', `data-idx="${i}" data-v="warmer"`, 'sm')}${PL.chip(`${ic('refresh', 'sm')}Regenerate`, false, 'reviseEmail', `data-idx="${i}" data-v="regen"`, 'sm')}</div>
            ${status}
          </div></div>`;
      }
      return `<div class="email ${open ? 'open' : ''}">
        <div class="email-h" data-a="toggleEmail" data-idx="${i}"><span class="num">${i + 1}</span><div style="flex:1;min-width:0">
          <div class="meta">Day ${t.day} · ${esc(t.theme)}</div><div class="subj">${esc(subj)}</div>
          <div class="rev">Reveals: ${esc(t.reveals)}</div>
          ${r.blanks || edited || st.variant !== 'base' ? `<div class="row" style="margin-top:6px;gap:6px">${r.blanks ? `<span class="pill warn">${ic('alert', 'sm')}${r.blanks} blank${r.blanks > 1 ? 's' : ''}</span>` : ''}${edited ? '<span class="pill">Edited</span>' : ''}${st.variant !== 'base' ? `<span class="pill acc">${st.variant}</span>` : ''}</div>` : ''}
        </div><span style="color:var(--faint);margin-top:4px">${ic(open ? 'up' : 'chevDown', 'sm')}</span></div>${body}</div>`;
    }).join('');
    const versions = q.order.length > 1 ? `<div class="versions">${q.order.map(k => PL.chip(esc(q.versions[k].name), q.active === k, 'setVersion', `data-v="${k}"`, 'sm')).join('')}<span class="spacer"></span><button class="text-btn" data-a="compareVersions">Compare</button></div>` : '';
    return {
      title: 'Outreach sequence', back: 'shortlist',
      body: `<div class="card" style="padding:12px 14px"><div class="row"><div style="flex:1"><div style="font-weight:600;font-size:14.5px">From Farah · to ${ap.length} pre-candidates</div><div class="small muted" style="margin-top:2px">5 emails · stops when they reply · emails 2–5 in the same thread</div></div></div>
          <label class="field-label" style="margin:12px 2px 6px">Preview as</label><select class="field" style="padding:9px 32px 9px 11px;font-size:14px" data-c="seqPreview">${PL.options(ap.map(c => ({ v: c.id, l: `${c.name} · ${c.title}` })), cand.id)}</select>
          <label class="check" style="margin-top:10px;font-size:13px"><input type="checkbox" data-c="oneTap" ${q.oneTap ? 'checked' : ''}>One-tap replies under the signature</label></div>
        <div class="sec">Emails ${q.revisingAll ? '<span class="working" style="margin-left:6px">Rewriting all 5…</span>' : ''}</div>
        ${versions}${cards}
        <div class="change-all"><div class="t">Change all emails</div>
          <div class="row"><input class="field" id="rev-all" placeholder="e.g. “focus on growth” or “less salesy”" data-enter="reviseAll"><button class="send-btn" data-a="reviseAll" aria-label="Apply to all">${ic('send', 'sm')}</button></div>
          <div class="chips" style="margin-top:8px">${PL.chip(`${ic('trend', 'sm')}Growth`, false, 'reviseAll', 'data-v="growth"', 'sm')}${PL.chip('Shorter', false, 'reviseAll', 'data-v="shorter"', 'sm')}${PL.chip('Warmer', false, 'reviseAll', 'data-v="warmer"', 'sm')}</div>
          <p class="small muted" style="margin:8px 2px 0">Tone changes apply directly. A new angle shows you a plan first.</p></div>
        <div class="note" style="margin-top:12px">${ic('lock')}<div>Every fact comes from your company fact bank: your JD, your settings and the sample emails you shared. Nothing is invented.</div></div>`,
      footer: `<button class="btn btn-primary" data-a="approveSeq" ${totalBlanks ? 'disabled' : ''}>${totalBlanks ? `${totalBlanks} blank${totalBlanks > 1 ? 's' : ''} to fill before approving` : `Approve sequence ${ic('arrowR')}`}</button>`
    };
  };
  A.toggleEmail = d => { const u = S().ui, i = Number(d.idx); u.openEmail = u.openEmail === i ? -1 : i; };
  C.seqPreview = v => { S().seq.preview = v; };
  C.oneTap = v => { S().seq.oneTap = v; };
  A.setVersion = d => { S().seq.active = d.v; };
  A.openBlank = d => {
    const f = d.f;
    if (f === 'outcome1') { PL.openSheet('outcome'); return; }
    PL.openSheet('screenSheet', { screen: 'see', hl: f === 'whyNow' ? 'why' : 'team' });
  };
  SHEETS.outcome = () => ({
    title: 'Outcome 1', sub: 'From Import & structure',
    body: `<div class="card"><div class="outcome"><span class="num">1</span><span>Ship AI workflows used weekly by <input class="blank-in ${S().jd.outcomeBlank ? 'filled' : ''}" data-i="outcomeBlank" value="${esc(S().jd.outcomeBlank)}" inputmode="numeric" maxlength="3" placeholder="__">% of customers</span></div></div>`,
    foot: `<button class="btn btn-primary" data-a="closeSheet">Done</button>`
  });

  function pickVariant(cur, prompt) {
    if (/short|brief|concise|cut|tight/i.test(prompt)) return 'shorter';
    if (/warm|friend|personal|human|kind/i.test(prompt)) return 'warmer';
    if (/formal|original|reset|base/i.test(prompt)) return 'base';
    return VARIANTS[(VARIANTS.indexOf(cur) + 1) % VARIANTS.length];
  }
  A.reviseEmail = d => {
    const i = Number(d.idx), v = ver();
    const input = document.getElementById('rev-' + i);
    const prompt = d.v || (input ? input.value.trim() : '');
    if (!prompt) { if (input) input.focus(); return; }
    if (v.kind !== 'base') { PL.toast('In this prototype, per-email revisions work on v1 Balanced'); return; }
    S().seq.revising = i;
    setTimeout(() => {
      const st = ver().emails[i];
      const next = d.v === 'regen' ? VARIANTS[(VARIANTS.indexOf(st.variant) + 1) % VARIANTS.length] : pickVariant(st.variant, prompt);
      st.hist.push({ variant: st.variant, edits: st.edits, applied: st.applied });
      st.variant = next === st.variant ? VARIANTS[(VARIANTS.indexOf(next) + 1) % VARIANTS.length] : next;
      st.edits = {};
      st.applied = { shorter: 'Shorter', warmer: 'Warmer', regen: 'Regenerate' }[d.v] || prompt;
      PL.S.seq.revising = null;
      PL.save(); PL.render();
    }, 900);
  };
  A.undoEmail = d => {
    const st = ver().emails[Number(d.idx)], h = st.hist.pop();
    if (h) { st.variant = h.variant; st.edits = h.edits; st.applied = h.applied; }
  };
  A.compareRev = d => PL.openSheet('compare', { mode: 'rev', idx: Number(d.idx) });
  A.compareVersions = () => PL.openSheet('compare', { mode: 'ver', idx: Math.max(0, S().ui.openEmail) });
  A.cmpIdx = d => { S().sheet.idx = Number(d.idx); };
  SHEETS.compare = sh => {
    const q = S().seq, cand = PL.previewCand(), i = sh.idx;
    let a, b, la, lb;
    if (sh.mode === 'rev') {
      const st = ver().emails[i], h = st.hist[st.hist.length - 1] || { variant: st.variant, edits: st.edits };
      const saved = { variant: st.variant, edits: st.edits };
      st.variant = h.variant; st.edits = h.edits; a = PL.renderEmail(q.active, i, cand, false).html;
      st.variant = saved.variant; st.edits = saved.edits; b = PL.renderEmail(q.active, i, cand, false).html;
      la = 'Before'; lb = 'After';
    } else {
      const k1 = q.order[0], k2 = q.order[q.order.length - 1];
      a = PL.renderEmail(k1, i, cand, false).html; b = PL.renderEmail(k2, i, cand, false).html;
      la = q.versions[k1].name; lb = q.versions[k2].name;
    }
    return {
      title: `Compare email ${i + 1}`, tall: true,
      body: `${sh.mode === 'ver' ? `<div class="chips" style="margin-bottom:12px">${[0, 1, 2, 3, 4].map(k => PL.chip(`Email ${k + 1}`, k === i, 'cmpIdx', `data-idx="${k}"`, 'sm')).join('')}</div>` : ''}
        <div class="cmp"><h5>${esc(la)}</h5>${a}</div><div class="cmp after" style="margin-top:10px"><h5>${esc(lb)}</h5>${b}</div>`,
      foot: `<button class="btn btn-primary" data-a="closeSheet">Done</button>`
    };
  };

  A.reviseAll = d => {
    const input = document.getElementById('rev-all');
    const prompt = d.v || (input ? input.value.trim() : '');
    if (!prompt) { if (input) input.focus(); return; }
    if (/grow/i.test(prompt)) { S().ui.planEdit = false; PL.openSheet('plan'); return; }
    const variant = /short|brief|concise|cut/i.test(prompt) ? 'shorter' : /warm|friend|personal|human|less salesy|kind/i.test(prompt) ? 'warmer' : null;
    if (!variant) { PL.toast('In this prototype, try Growth, Shorter, Warmer or “less salesy”'); return; }
    if (ver().kind !== 'base') { PL.toast('In this prototype, tone changes apply to v1 Balanced'); return; }
    S().seq.revisingAll = true;
    setTimeout(() => {
      const before = ver().emails.map(st => JSON.parse(JSON.stringify(st)));
      ver().emails.forEach(st => { st.hist.push({ variant: st.variant, edits: st.edits, applied: st.applied }); st.variant = variant; st.edits = {}; st.applied = prompt; });
      PL.S.seq.revisingAll = false;
      PL.toast(`All 5 emails: ${variant}`, 'all', before);
      PL.save(); PL.render();
    }, 1100);
  };
  PL.UNDO.all = before => { ver().emails = before; };

  SHEETS.plan = () => {
    const s = S(), lines = s.seq.plan || D.GROWTH_PLAN;
    return {
      title: 'Growth plan (v2)', sub: 'One line per email. Check the angle before anything is rewritten.',
      body: s.ui.planEdit
        ? `<textarea class="field" id="plan-edit" rows="9">${esc(lines.join('\n'))}</textarea><p class="small muted" style="margin:6px 2px">One line per email.</p>`
        : `<div class="group">${lines.map((l, i) => `<div class="plan-line"><b>${i + 1}</b><span>${esc(l)}</span></div>`).join('')}</div>
          <div class="note" style="margin-top:12px">${ic('info')}<div>Your 12–18 month outcome, why now, comp and process carry over from v1.</div></div>`,
      foot: s.ui.planEdit
        ? `<button class="btn btn-primary" data-a="planSave">Save plan</button>`
        : `<div class="row"><button class="btn btn-secondary" data-a="planEditToggle">Edit plan</button><button class="btn btn-primary" data-a="openFacts">Write it ${ic('arrowR')}</button></div>`
    };
  };
  A.planEditToggle = () => { S().ui.planEdit = true; };
  A.planSave = () => { const el = document.getElementById('plan-edit'); if (el) S().seq.plan = el.value.split('\n').map(x => x.trim()).filter(Boolean); S().ui.planEdit = false; };
  A.openFacts = () => PL.openSheet('facts');
  const share = (key, cur) => `<div class="chips" style="margin-top:8px">${[['exact', 'Exact'], ['approx', 'Approximate'], ['internal', 'Keep internal']].map(([v, l]) => PL.chip(l, cur === v, 'factShare', `data-k="${key}" data-v="${v}"`, 'sm')).join('')}</div>`;
  SHEETS.facts = () => {
    const f = S().seq.facts;
    const inp = (k, ph, w) => `<input class="field" style="width:${w || 110}px;display:inline-block;padding:8px 10px" data-i="fact" data-k="${k}" value="${esc(f[k])}" placeholder="${ph}">`;
    return {
      title: 'A growth story needs a few numbers', sub: 'They’re not in your fact bank, so we ask instead of inventing them.',
      body: `<div class="card"><div style="font-weight:600;font-size:14px">Revenue growth, last 12 months</div><div style="margin-top:8px">${inp('rev', 'e.g. 3x')}</div>${share('revShare', f.revShare)}</div>
        <div class="card"><div style="font-weight:600;font-size:14px">Customers now vs. a year ago</div><div class="row" style="margin-top:8px">${inp('custNow', 'now', 90)}<span class="muted">vs</span>${inp('custThen', 'a year ago', 110)}</div>${share('custShare', f.custShare)}</div>
        <div class="card"><div style="font-weight:600;font-size:14px">Team size now → in 12 months</div><div class="row" style="margin-top:8px">${inp('teamNow', 'now', 90)}<span class="muted">→</span>${inp('teamNext', 'in 12 mo', 110)}</div>${share('teamShare', f.teamShare)}</div>
        <p class="small muted" style="margin:10px 2px 0">Skip any; we’ll write around it. “Keep internal” shapes the tone without appearing in the emails.</p>`,
      foot: `<button class="btn btn-primary" data-a="genGrowth">Generate v2 ${ic('spark', 'sm')}</button>`
    };
  };
  I.fact = (v, d) => { S().seq.facts[d.k] = v.trim(); };
  A.factShare = d => { S().seq.facts[d.k] = d.v; };
  A.genGrowth = () => {
    const q = S().seq;
    if (!q.versions.v2) {
      q.versions.v2 = { name: 'v2 Growth', kind: 'growth', emails: [0, 1, 2, 3, 4].map(() => ({ variant: 'base', hist: [], edits: {}, applied: null })) };
      q.order.push('v2');
    }
    q.active = 'v2';
    S().ui.openEmail = 0;
    PL.S.sheet = null;
    PL.toast('v2 Growth written. Compare with v1 anytime.');
  };

  /* ---------- start outreach ---------- */
  A.approveSeq = () => { PL.openSheet('startOut'); };
  function projCard(active, remaining) {
    const p = PL.projection(active, remaining), cls = p.status === 'On track' ? 'acc' : p.status === 'Tight' ? 'warn' : 'danger';
    return `<div class="card" style="margin-top:12px"><div class="row"><span style="font-size:14px">At ${active}: all ${remaining} contacted by <b>~${p.date}</b></span><span class="spacer"></span><span class="pill ${cls}">${p.status}</span></div>
      <div class="small muted" style="margin-top:6px">Expect ${p.replies} replies a week to answer within your ${S().see.commitment}h commitment.</div></div>`;
  }
  SHEETS.startOut = () => {
    const s = S(), n = PL.approved().length;
    return {
      title: 'Start outreach', sub: `Sequence ${esc(ver().name)} approved · ${n} pre-candidates`,
      body: `<div style="text-align:center;padding:6px 0 2px"><div class="small muted">Actively reaching out to</div><div style="margin-top:8px">${PL.stepper(s.out.active, 'activeStep')}</div>
          <div class="small muted" style="margin-top:8px">When someone replies or finishes the sequence, the next person starts.</div></div>
        ${projCard(s.out.active, n)}
        <div class="group" style="margin-top:12px">
          <div class="fld-row"><span class="k">From</span><div class="v">farah@nectarsocial.com <span class="pill acc">${ic('check', 'sm')}Connected</span></div></div>
          <div class="fld-row"><span class="k">Sends</span><div class="v">${s.out.timingApplied ? 'Tue–Thu, 8–10am, their time zone' : 'Weekday mornings, their time zone'}</div></div>
          <div class="fld-row"><span class="k">Order</span><div class="v">Warm intros first, then by rank</div></div>
        </div>`,
      foot: `<button class="btn btn-primary" data-a="startOutreach">Start outreach to ${s.out.active} ${ic('arrowR')}</button>`
    };
  };
  A.activeStep = d => { const o = S().out; o.active = Math.max(2, Math.min(15, o.active + Number(d.d))); };
  A.startOutreach = () => { const s = S(); s.seq.approved = true; s.out.started = true; PL.go('started'); };

  PL.outreachLists = () => {
    const s = S(), order = PL.orderedPre();
    const held = order.find((c, i) => i >= 2 && !c.warm);
    const rest = order.filter(c => c !== held);
    const contacted = rest.slice(0, s.out.active);
    const queue = rest.slice(s.out.active);
    return { held, contacted, queue };
  };
  SCREENS.started = () => {
    const s = S(), L = PL.outreachLists();
    const row = (c, i) => `<div class="li tap" data-a="openThread" data-id="${c.id}">${PL.avatar(c, 36)}<div class="b"><div class="t1">${esc(c.name)} · ${esc(c.title)}</div><div class="t2">${c.warm ? `${ic('users', 'sm')} Intro requested: ${esc(c.warm.toLowerCase())}` : `Email 1 sent 9:0${Math.min(9, i + 2)}am · next Sep 28`}</div></div>${ic('chev', 'sm')}</div>`;
    return {
      title: 'Outreach', back: 'sequence',
      body: `<div class="big-ok"><div class="ring">${ic('check')}</div><h2>Outreach started</h2><p>${L.contacted.length} contacted · ${L.queue.length} in queue${L.held ? ' · 1 held' : ''}</p></div>
        <div class="sec">Just contacted</div><div class="group">${L.contacted.map(row).join('')}</div>
        ${L.held ? `<div class="sec">Held (1)</div><div class="group"><div class="li">${PL.avatar(L.held, 36)}<div class="b"><div class="t1">${esc(L.held.name)} · ${esc(L.held.title)}</div><div class="t2">Contacted by another company on Pathline this week. Starts Oct 1.</div></div></div></div>` : ''}
        <div class="sec">Queue (${L.queue.length})</div>
        <div class="card"><div class="small muted">Next up</div><div style="font-size:14px;margin-top:4px">${L.queue.slice(0, 3).map(c => esc(c.name)).join(', ')}${L.queue.length > 3 ? ` and ${L.queue.length - 3} more` : ''}</div></div>
        <div class="card" style="margin-top:10px"><div class="row"><span style="font-size:14px">Active at a time: <b>${s.out.active}</b></span><span class="spacer"></span><button class="btn btn-xs btn-secondary" data-a="openActive">Change</button></div></div>`,
      footer: `<button class="btn btn-primary" data-a="go" data-r="monitor">Skip ahead 10 days ${ic('arrowR')}</button><div class="hint">Simulated time, so you can see replies come in</div>`
    };
  };
  A.openActive = () => PL.openSheet('active');
  SHEETS.active = () => {
    const s = S(), n = Math.max(1, PL.approved().length);
    return { title: 'Active at a time', body: `<div style="text-align:center">${PL.stepper(s.out.active, 'activeStep')}</div>${projCard(s.out.active, n)}`, foot: `<button class="btn btn-primary" data-a="closeSheet">Done</button>` };
  };
  A.openThread = d => PL.openSheet('thread', { id: d.id });
  SHEETS.thread = sh => {
    const c = PL.cand(sh.id), q = S().seq;
    return {
      title: esc(c.name), sub: c.warm ? `Warm intro · ${esc(c.warm)}` : `Email 1 of 5 · sent today`, tall: true,
      body: c.warm ? `<div class="note">${ic('users')}<div>Before any email, Pathline asked the person who knows ${esc(c.name.split(' ')[0])} for an intro, with a forwardable blurb. Email 1 follows if there’s no intro in 3 days.</div></div>` :
        `<div class="cmp"><h5>${esc(D.EMAILS[q.versions[q.active].kind][0].subject)}</h5>${PL.renderEmail(q.active, 0, c, false).html}</div>`,
      foot: `<div class="row"><button class="btn btn-secondary" data-a="threadAct" data-v="Paused">${ic('pause', 'sm')}Pause</button><button class="btn btn-secondary btn-danger-ghost" data-a="threadAct" data-v="Removed">Remove</button></div>`
    };
  };
  A.threadAct = d => { PL.S.sheet = null; PL.toast(`${d.v}. The next person in the queue starts instead.`); };

  PL.FILL.sequence = () => { S().seq.approved = true; };
  PL.FILL.started = () => { const s = S(); s.out.started = true; s.network = Math.max(s.network, 16); s.fromYou = Math.max(s.fromYou, 5); };
})(window.PL);
