/* Pathline prototype — Milestone 2: what candidates will see → email sequence → start outreach */
(function (PL) {
  const D = PL.D, A = PL.A, I = PL.I, C = PL.C, SCREENS = PL.SCREENS, SHEETS = PL.SHEETS, esc = PL.esc, ic = PL.ic;
  const S = () => PL.S;
  const VARIANTS = ['base', 'warmer', 'shorter'];

  /* =========================================================
     1 · What candidates will see
     ========================================================= */
  const FIELDS = PL.FIELDS;
  const need = '<span class="need-t">Needed</span>';
  const REMIND = {
    why: 'Candidates who know why a role is open are more likely to reply.',
    base: 'Candidates who see the base range in the first email are more likely to reply.',
    process: 'Knowing the time it takes up front means fewer drop-outs later.',
    commit: 'A response commitment is one of the strongest reasons to reply.',
    team: 'Candidates who know who they’d work with are more likely to reply.',
    equity: 'Candidates who know the equity range up front are more likely to reply.',
    bonus: 'Being clear about bonus avoids surprises at the offer.',
    start: 'A start date helps candidates plan.',
    company: 'Company facts are what make a cold email credible.'
  };
  const remindFor = k => REMIND[k] || 'The more you share up front, the better your hiring outcomes.';
  const labelOf = k => FIELDS[k] ? FIELDS[k].label : (PL.custom(k) || {}).label || k;
  function fieldValue(k) {
    const s = S().see;
    const c = PL.custom(k);
    if (c) return c.value ? esc(c.value) : need;
    switch (k) {
      case 'title': return s.title ? esc(s.title) : need;
      case 'why': return s.whyType ? `${esc(s.whyType)}${s.whyLine.trim() ? ` · ${esc(s.whyLine)}` : ''}` : need;
      case 'base': return `$${s.baseMin}–${s.baseMax}k`;
      case 'hm': return s.hm ? esc(s.hm) : need;
      case 'process': return `${s.stages.length} stages · about ${PL.totalHours()} hours`;
      case 'commit': return `Reply within ${s.commitment}h at every stage`;
      case 'team': return s.engineers ? `${esc(s.engineers)} engineers${s.reportsTo ? ` · reports to ${esc(s.reportsTo)}` : ''}` : need;
      case 'equity': return s.equity ? `${esc(s.equity)} · ${esc(s.vesting)}` : need;
      case 'bonus': return s.bonus ? esc(s.bonus) : need;
      case 'start': return esc(s.start);
      case 'company': return `${D.FACTS.length} facts from your job description and emails`;
    }
    return '';
  }
  PL.seeMissing = () => {
    const s = S().see, m = [], shown = PL.shown;
    if (!s.title) m.push('title');
    if (shown('why') && !s.whyType) m.push('why now');
    if (shown('team') && !s.engineers) m.push('team size');
    if (shown('equity') && !s.equity) m.push('equity');
    if (shown('bonus') && !s.bonus) m.push('bonus');
    if (!s.hm) m.push('hiring manager');
    (s.custom || []).forEach(c => { if (shown(c.id) && !c.value) m.push(c.label.toLowerCase()); });
    return m;
  };
  const allKeys = () => Object.keys(FIELDS).concat((S().see.custom || []).map(c => c.id));
  SCREENS.see = () => {
    const keys = allKeys().filter(PL.shown), hidden = allKeys().filter(k => !PL.shown(k)), m = PL.seeMissing();
    const rows = list => list.map(k => PL.row(esc(labelOf(k)), fieldValue(k), 'openField', `data-k="${k}"`)).join('');
    const addRow = place => `<div class="frow add" data-a="openAddInfo" data-place="${place}"><span class="v">Add information</span></div>`;
    return {
      title: 'What candidates will see', back: 'shortlist', task: 'What candidates will see',
      body: `<div class="intro">The more you share up front, the better your hiring outcomes: candidates reply more and drop out less.</div>
        <div class="sec">Shown in outreach emails</div><div class="group">${rows(keys.filter(k => PL.placeOf(k) === 'out'))}${addRow('out')}</div>
        <div class="sec">Shown after they reply</div><div class="group">${rows(keys.filter(k => PL.placeOf(k) === 'after'))}${addRow('after')}</div>
        ${hidden.length ? `<div class="sec">Hidden from candidates</div><div class="group">${hidden.map(k => `<div class="li"><div class="b"><div class="t1">${esc(labelOf(k))}</div></div><button class="btn btn-xs btn-secondary" data-a="unhide" data-k="${k}">Show again</button></div>`).join('')}</div>` : ''}
        ${m.length ? `<button class="textlink" style="margin-top:16px" data-a="demoSee">Fill remaining with demo values</button>` : ''}`,
      footer: `<button class="btn btn-primary" data-a="go" data-r="sequence" ${m.length ? 'disabled' : ''}>${m.length ? `${m.length} needed: ${m.join(', ')}` : 'Continue to emails'}</button>`
    };
  };
  A.openField = d => { S().ui.confirmRemove = null; S().ui.movedLater = null; PL.openSheet('field', { key: d.k }); };
  const opts = PL.options;
  SHEETS.field = sh => {
    const s = S().see, k = sh.key, f = FIELDS[k], c = PL.custom(k), u = S().ui;
    let body = '';
    if (c) {
      body = `<div class="lbl">Label</div><input class="inl" data-i="customField" data-id="${c.id}" data-f="label" value="${esc(c.label)}">
        <div class="lbl">What candidates see</div><textarea class="inl" rows="${Math.max(1, Math.ceil(c.value.length / 38))}" data-i="customField" data-id="${c.id}" data-f="value" placeholder="Type the detail">${esc(c.value)}</textarea>`;
    } else switch (k) {
      case 'title': body = `<select class="field" data-c="seeTitle">${opts(['PM, AI', 'Senior PM, AI'], s.title, 'Choose')}</select>`; break;
      case 'why': body = `<div class="chips">${['New role', 'Backfill', 'Team growing'].map(t => PL.chip(t, s.whyType === t, 'seeWhyType', `data-v="${t}"`)).join('')}</div>
        <div class="lbl" style="margin-top:14px">In a line (optional)</div><textarea class="inl" rows="2" data-i="seeWhyLine" placeholder="${esc(s.whyType ? PL.WHY_DEFAULT[s.whyType] : 'e.g. Our first dedicated AI PM. The founders have owned AI until now.')}">${esc(s.whyLine)}</textarea>
        <p class="small muted" style="margin:8px 2px 0">Picking a type is enough. Without a line, emails say: “${esc(s.whyType ? PL.WHY_DEFAULT[s.whyType] : PL.WHY_DEFAULT['New role'])}”</p>`; break;
      case 'base': body = `<div class="group"><div class="fld-row"><span class="k">Base range</span><div class="v" style="flex-wrap:nowrap"><select class="field inline" data-c="seeBaseMin">${opts(PL.baseOpts(100, s.baseMax - 5), s.baseMin)}</select><span class="muted">to</span><select class="field inline" data-c="seeBaseMax">${opts(PL.baseOpts(s.baseMin + 5, 350), s.baseMax)}</select></div></div></div><p class="small muted" style="margin:8px 2px 0">From your job description. It can move to after they reply, but not be hidden: many states’ pay transparency laws expect a range.</p>`; break;
      case 'hm': body = `<select class="field" data-c="seeHm">${opts(D.HMS, s.hm, 'Select')}</select><p class="small muted" style="margin:8px 2px 0">Sends the outreach emails from their own mailbox.</p>`; break;
      case 'process': body = `<p class="sort-hint">Tap a name or time to change it. Use the arrows to re-order.</p>
        <div class="group">${s.stages.map((st, i) => `<div class="stage-row">${PL.rankCol(i, s.stages.length, 'stageMove', `data-idx="${i}"`)}<input class="inl stage-nm" data-i="stageName" data-idx="${i}" value="${esc(st.name)}" aria-label="Stage name"><select class="inl-select" data-c="stageH" data-idx="${i}" aria-label="Hours">${opts([1, 2, 3, 4, 5, 6].map(h => ({ v: h, l: `${h}h` })), st.h)}</select>${s.stages.length > 1 ? `<button class="textlink danger" data-a="stageRemove" data-idx="${i}">Remove</button>` : ''}</div>`).join('')}</div>
        <div class="row" style="margin-top:12px"><button class="btn btn-sm btn-secondary" data-a="stageAdd">Add stage</button><span class="spacer"></span><span class="small muted">About ${PL.totalHours()} hours of their time</span></div>`; break;
      case 'commit': body = `<div style="font-size:14px;margin-bottom:10px">We reply within</div><div class="chips">${[24, 48, 72].map(h => PL.chip(`${h} hours`, s.commitment === h, 'seeCommit', `data-v="${h}"`)).join('')}</div><p class="small muted" style="margin:10px 2px 0">At every stage. Tracked, and shown on your record with candidates.</p>`; break;
      case 'team': body = `<div class="group">
        <div class="fld-row"><span class="k">Reports to</span><div class="v"><input class="inl" data-i="seeReportsTo" value="${esc(s.reportsTo)}" placeholder="e.g. Farah (CTO)"></div></div>
        <div class="fld-row"><span class="k">Engineers</span><div class="v"><select class="field inline" data-c="seeEngineers">${opts(Array.from({ length: 40 }, (_, i) => String(i + 1)), s.engineers, 'Choose')}</select></div></div>
        <div class="fld-row"><span class="k">Other PMs</span><div class="v"><select class="field inline" data-c="seeOtherPMs">${opts(['0', '1', '2', '3', '4', '5'], s.otherPMs, 'Choose')}</select></div></div>
        <div class="fld-row"><span class="k">Direct reports</span><div class="v"><select class="field inline" data-c="seeReports">${opts(['0', '1', '2', '3', '4', '5'], s.directReports)}</select></div></div></div>`; break;
      case 'equity': body = `<div class="group"><div class="fld-row"><span class="k">Range</span><div class="v"><select class="field inline" data-c="seeEquity">${opts(['0.05–0.1%', '0.1–0.2%', '0.2–0.35%', '0.35–0.5%'], s.equity, 'Choose a range')}</select></div></div>
        <div class="fld-row"><span class="k">Vesting</span><div class="v"><select class="field inline" data-c="seeVesting">${opts(['4 yr, 1 yr cliff', '4 yr, no cliff', '3 yr, 1 yr cliff'], s.vesting)}</select></div></div></div>
        <p class="small muted" style="margin:8px 2px 0">“Equity: yes” isn’t enough for senior candidates, so we ask for a range.</p>`; break;
      case 'bonus': body = `<select class="field" data-c="seeBonus">${opts(['None', '5% target', '10% target', '15% target'], s.bonus, 'Choose a target')}</select>`; break;
      case 'start': body = `<select class="field" data-c="seeStart">${opts(['Nov 2026', 'Dec 2026', 'Jan 2027', 'Feb 2027'], s.start)}</select><p class="small muted" style="margin:8px 2px 0">Also set on Review & pool. It sizes the shortlist.</p>`; break;
      case 'company': body = `<div class="group">${D.FACTS.map(x => `<div class="li"><div class="b" style="font-size:13.5px">${esc(x)}</div></div>`).join('')}</div><p class="small muted" style="margin:8px 2px 0">This is the fact bank. Emails can only use facts from here.</p>`; break;
    }
    const fixed = f && f.fixed, keep = f && f.keep, place = PL.placeOf(k);
    const placeCtl = fixed ? `<p class="small muted" style="margin:16px 2px 0">Always in outreach emails: every email is from someone, about a role.</p>` :
      `<div class="lbl" style="margin-top:18px">Show</div><div class="chips">${PL.chip('In outreach emails', place === 'out', 'setPlace', `data-k="${k}" data-v="out"`)}${PL.chip('After they reply', place === 'after', 'setPlace', `data-k="${k}" data-v="after"`)}</div>
       ${u.movedLater === k ? `<div class="flag" style="margin-top:10px"><div>${esc(remindFor(k))} Emails will leave it out; candidates see it after they reply.</div></div>` : ''}`;
    const removeCtl = keep ? '' : (u.confirmRemove === k
      ? `<div class="flag" style="margin-top:16px"><div>${esc(remindFor(k))} Remove anyway?<div class="row" style="margin-top:10px"><button class="btn btn-xs btn-secondary" data-a="keepField">Keep it</button><button class="btn btn-xs btn-primary" data-a="hideField" data-k="${k}">Remove</button></div></div></div>`
      : `<button class="textlink danger" style="margin-top:18px" data-a="askRemove" data-k="${k}">Remove from what candidates see</button>`);
    return { title: esc(labelOf(k)), sub: 'Changes save automatically', tall: k === 'process', body: body + placeCtl + removeCtl };
  };
  C.seeTitle = v => { S().see.title = v; };
  A.seeWhyType = d => { S().see.whyType = d.v; };
  I.seeWhyLine = v => { S().see.whyLine = v; };
  C.seeHm = v => { S().see.hm = v; };
  A.seeCommit = d => { S().see.commitment = Number(d.v); };
  I.seeReportsTo = v => { S().see.reportsTo = v; };
  C.seeEngineers = v => { S().see.engineers = v; };
  C.seeOtherPMs = v => { S().see.otherPMs = v; };
  C.seeReports = v => { S().see.directReports = v; };
  C.seeEquity = v => { S().see.equity = v; };
  C.seeVesting = v => { S().see.vesting = v; };
  C.seeBonus = v => { S().see.bonus = v; };
  A.setPlace = d => {
    const s = S().see, c = PL.custom(d.k);
    const was = PL.placeOf(d.k);
    if (c) c.place = d.v; else s.place[d.k] = d.v;
    S().ui.movedLater = (was === 'out' && d.v === 'after') ? d.k : null;
  };
  A.askRemove = d => { S().ui.confirmRemove = d.k; };
  A.keepField = () => { S().ui.confirmRemove = null; };
  A.hideField = d => { S().see.hidden[d.k] = true; S().ui.confirmRemove = null; PL.S.sheet = null; PL.toast(`${esc(labelOf(d.k))} hidden from candidates`, 'unhide', d.k); };
  A.unhide = d => { delete S().see.hidden[d.k]; };
  PL.UNDO.unhide = k => { delete S().see.hidden[k]; };
  I.customField = (v, d) => { const c = PL.custom(d.id); if (c) c[d.f] = v; };
  A.openAddInfo = d => PL.openSheet('addInfo', { key: d.place });
  SHEETS.addInfo = sh => {
    const s = S(), have = (s.see.custom || []).map(c => c.label);
    const visa = { yes: 'We sponsor visas', no: 'We don’t sponsor visas', case: 'Visa sponsorship case by case' }[s.reqs.visa] || '';
    const sugg = D.INFO_SUGGESTIONS.map(x => Object.assign({}, x, { value: x.value === '__VISA__' ? visa : x.value })).filter(x => x.value && !have.includes(x.label));
    return {
      title: 'Add information', sub: sh.key === 'out' ? 'Shown in outreach emails' : 'Shown after they reply',
      body: `${sugg.length ? `<div class="sec" style="margin-top:0">Things we already know</div><div class="group">${sugg.map((x, i) => `<div class="li"><div class="b"><div class="t1">${esc(x.label)}</div><div class="t2">${esc(x.value)} · ${esc(x.src)}</div></div><button class="btn btn-xs btn-secondary" data-a="addInfo" data-i2="${i}" data-place="${sh.key}">Add</button></div>`).join('')}</div>` : ''}
        <div class="sec">Your own</div>
        <input class="field" id="info-label" placeholder="Label, e.g. Interview panel"><textarea class="field" id="info-value" rows="2" style="margin-top:8px" placeholder="What candidates see"></textarea>
        <button class="btn btn-sm btn-secondary" style="margin-top:10px" data-a="addInfoOwn" data-place="${sh.key}">Add</button>`
    };
  };
  A.addInfo = d => {
    const s = S(), visa = { yes: 'We sponsor visas', no: 'We don’t sponsor visas', case: 'Visa sponsorship case by case' }[s.reqs.visa] || '';
    const have = (s.see.custom || []).map(c => c.label);
    const sugg = D.INFO_SUGGESTIONS.map(x => Object.assign({}, x, { value: x.value === '__VISA__' ? visa : x.value })).filter(x => x.value && !have.includes(x.label));
    const x = sugg[Number(d.i2)]; if (!x) return;
    s.see.custom.push({ id: 'f' + Date.now(), label: x.label, value: x.value, place: d.place });
    PL.S.sheet = null; PL.toast(`Added ${esc(x.label)}`);
  };
  A.addInfoOwn = d => {
    const l = document.getElementById('info-label'), v = document.getElementById('info-value');
    if (!l || !l.value.trim()) { if (l) { l.classList.add('need'); l.focus(); } return; }
    S().see.custom.push({ id: 'f' + Date.now(), label: l.value.trim(), value: v ? v.value.trim() : '', place: d.place });
    PL.S.sheet = null; PL.toast(`Added ${esc(l.value.trim())}`);
  };
  A.stageMove = d => { const st = S().see.stages, i = Number(d.idx), j = i + Number(d.d); if (j < 0 || j >= st.length) return; PL.move(st, i, j); };
  I.stageName = (v, d) => { S().see.stages[Number(d.idx)].name = v; };
  C.stageH = (v, d) => { S().see.stages[Number(d.idx)].h = Number(v); };
  A.stageRemove = d => { const st = S().see.stages; if (st.length > 1) st.splice(Number(d.idx), 1); };
  A.stageAdd = () => { S().see.stages.push({ name: 'New stage', h: 1 }); setTimeout(() => { const els = document.querySelectorAll('.stage-nm'); const el = els[els.length - 1]; if (el) { el.focus(); el.select(); } }, 30); };
  A.demoSee = () => {
    const s = S().see;
    if (!s.title) s.title = 'Senior PM, AI';
    if (!s.whyType) s.whyType = 'New role';
    if (!s.whyLine.trim()) s.whyLine = 'This is our first dedicated AI PM role. Until now, the founders have owned it.';
    if (!s.reportsTo) s.reportsTo = 'Farah (CTO)';
    if (!s.engineers) s.engineers = '6';
    if (!s.otherPMs) s.otherPMs = '1';
    if (!s.equity) s.equity = '0.1–0.2%';
    if (!s.bonus) s.bonus = '10% target';
    if (!s.hm) s.hm = D.HMS[0];
  };
  PL.FILL.see = () => A.demoSee();

  /* =========================================================
     2 · Email sequence
     ========================================================= */
  const ver = () => S().seq.versions[S().seq.active];
  PL.previewCand = () => {
    const q = S().seq, ap = PL.approved();
    return ap.find(x => x.id === q.preview) || ap[0] || D.CANDS[0];
  };
  PL.orderedPre = () => { const ap = PL.approved(); return ap.filter(c => c.warm).concat(ap.filter(c => !c.warm)); };

  const BLANK_RE = /\[(why now|team size)\]/g;
  function fill(text, ctx, counter) {
    let plain = '', html = '', last = 0, skip = false;
    const re = /\[\[(\w+)\]\]/g; let m;
    const only = text.trim().replace(/^- /, '');
    while ((m = re.exec(text))) {
      const before = text.slice(last, m.index);
      html += esc(before); plain += before;
      const key = m[1], val = ctx[key];
      if (val) { html += `<span class="slot" title="${esc(PL.SLOT_SRC[key] || '')}">${esc(val)}</span>`; plain += val; }
      else if (val === null) { const lbl = PL.BLANK_LABEL[key] || key; html += `<span class="blank" contenteditable="false" data-a="openBlank" data-f="${key}">[${esc(lbl)}]</span>`; plain += `[${lbl}]`; counter.n++; }
      else if (only === m[0]) skip = true;
      last = re.lastIndex;
    }
    html += esc(text.slice(last)); plain += text.slice(last);
    html = html.replace(/\s{2,}/g, ' ').replace(/^\s+/, ''); plain = plain.replace(/\s{2,}/g, ' ').trim();
    if (!plain) skip = true;
    return { html, plain, skip };
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
  PL.saveEdit = el => {
    const [vKey, i, pi] = el.dataset.edit.split('|');
    const txt = el.innerText.replace(/\s+\n/g, '\n').trim();
    if (txt === (el.dataset.orig || '').trim()) return false;
    S().seq.versions[vKey].emails[Number(i)].edits[Number(pi)] = txt;
    return true;
  };

  SCREENS.sequence = () => {
    const s = S(), q = s.seq, v = ver(), cand = PL.previewCand(), ap = PL.approved();
    const tpls = D.EMAILS[v.kind];
    let totalBlanks = 0;
    const cards = tpls.map((t, i) => {
      const st = v.emails[i], open = s.ui.openEmail === i;
      const r = PL.renderEmail(q.active, i, cand, true);
      totalBlanks += r.blanks;
      const edited = Object.keys(st.edits).length > 0;
      const notes = [r.blanks ? `<span class="need-t">${r.blanks} blank${r.blanks > 1 ? 's' : ''} to fill</span>` : '', edited ? 'Edited' : '', st.variant !== 'base' ? `${st.variant.charAt(0).toUpperCase() + st.variant.slice(1)} version` : ''].filter(Boolean).join(' · ');
      let body = '';
      if (open) {
        const status = q.revising === i ? `<div class="working" style="margin-top:8px">Revising email ${i + 1}…</div>` :
          (st.hist.length ? `<div class="rev-status">${st.applied ? `Applied “${esc(st.applied)}”.` : 'Revised.'} <button class="textlink" data-a="compareRev" data-idx="${i}">Compare</button> <button class="textlink" data-a="undoEmail" data-idx="${i}">Undo</button></div>` : '');
        body = `<div class="email-body">
          <div class="from">From farah@nectarsocial.com · To ${esc(cand.name.split(' ')[0])} · ${i === 0 ? esc(t.subject) : 'Same thread'}</div>
          ${r.html}
          ${q.oneTap ? `<div class="onetap"><span>Interested</span><span>Tell me more</span><span>Not now</span><span>I know someone</span></div>` : ''}
          <div class="revise">
            <div class="row"><input class="field" id="rev-${i}" value="${esc(s.ui.voice['rev-' + i] || '')}" placeholder="Revise this email, e.g. cut the customer list" data-enter="reviseEmail" data-idx="${i}"><button class="btn btn-sm btn-primary" data-a="reviseEmail" data-idx="${i}">Revise</button></div>
            ${PL.talkLink('rev-' + i)}
            <div class="chips">${PL.chip('Shorter', false, 'reviseEmail', `data-idx="${i}" data-v="shorter"`, 'sm')}${PL.chip('Warmer', false, 'reviseEmail', `data-idx="${i}" data-v="warmer"`, 'sm')}${PL.chip('Regenerate', false, 'reviseEmail', `data-idx="${i}" data-v="regen"`, 'sm')}</div>
            ${status}
          </div></div>`;
      }
      return `<div class="email ${open ? 'open' : ''}">
        <div class="email-h" data-a="toggleEmail" data-idx="${i}"><span class="num">${i + 1}</span><div style="flex:1;min-width:0">
          <div class="meta">Day ${t.day} · ${esc(t.theme)}</div><div class="subj">${esc(t.subject)}</div>
          <div class="rev">Reveals: ${esc(t.reveals)}</div>${notes ? `<div class="rev" style="margin-top:4px">${notes}</div>` : ''}
        </div></div>${body}</div>`;
    }).join('');
    const versions = q.order.length > 1 ? `<div class="versions">${q.order.map(k => PL.chip(esc(q.versions[k].name), q.active === k, 'setVersion', `data-v="${k}"`, 'sm')).join('')}<span class="spacer"></span><button class="textlink" data-a="compareVersions">Compare</button></div>` : '';
    return {
      title: 'Outreach sequence', back: 'see', task: 'Email sequence',
      body: `<div class="card" style="padding:12px 14px"><div style="font-weight:600;font-size:14.5px">From Farah · to ${ap.length} pre-candidates</div><div class="small muted" style="margin-top:2px">5 emails. Stops when they reply. Emails 2–5 go in the same thread.</div>
          <label class="field-label" style="margin:12px 2px 6px">Preview as</label><select class="field" style="padding:9px 32px 9px 11px;font-size:14px" data-c="seqPreview">${PL.options(ap.map(c => ({ v: c.id, l: `${c.name} · ${c.title}` })), cand.id)}</select>
          <label class="check" style="margin-top:12px;font-size:13px"><input type="checkbox" data-c="oneTap" ${q.oneTap ? 'checked' : ''}>One-tap replies under the signature</label></div>
        <div class="sec">Emails ${q.revisingAll ? '<span class="working" style="margin-left:6px">Rewriting all 5…</span>' : ''}</div>
        ${versions}${cards}
        <div class="change-all"><div class="t">Change all emails</div>
          <div class="row"><input class="field" id="rev-all" value="${esc(s.ui.voice['rev-all'] || '')}" placeholder="e.g. focus on growth, or less salesy" data-enter="reviseAll"><button class="btn btn-sm btn-primary" data-a="reviseAll">Apply</button></div>
          ${PL.talkLink('rev-all')}
          <div class="chips" style="margin-top:8px">${PL.chip('Growth', false, 'reviseAll', 'data-v="growth"', 'sm')}${PL.chip('Shorter', false, 'reviseAll', 'data-v="shorter"', 'sm')}${PL.chip('Warmer', false, 'reviseAll', 'data-v="warmer"', 'sm')}</div>
          <p class="small muted" style="margin:8px 2px 0">Tone changes apply directly. A new angle shows you a plan first.</p></div>
        <p class="small muted" style="margin:14px 2px 0">Every fact comes from your company fact bank: your job description, your settings and the sample emails you shared.</p>`,
      footer: `<button class="btn btn-primary" data-a="approveSeq" ${totalBlanks ? 'disabled' : ''}>${totalBlanks ? `${totalBlanks} blank${totalBlanks > 1 ? 's' : ''} to fill before approving` : 'Approve sequence'}</button>`
    };
  };
  PL.VOICE['rev-n'] = 'Make this one shorter';
  PL.VOICE['rev-all'] = 'Focus on growth';
  A.toggleEmail = d => { const u = S().ui, i = Number(d.idx); u.openEmail = u.openEmail === i ? -1 : i; };
  C.seqPreview = v => { S().seq.preview = v; };
  C.oneTap = v => { S().seq.oneTap = v; };
  A.setVersion = d => { S().seq.active = d.v; };
  A.openBlank = d => PL.openSheet('field', { key: PL.BLANK_FIELD[d.f] || 'why' });

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
    delete S().ui.voice['rev-' + i];
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
        <div class="cmp"><h5>${esc(la)}</h5>${a}</div><div class="cmp after" style="margin-top:10px"><h5>${esc(lb)}</h5>${b}</div>`
    };
  };

  A.reviseAll = d => {
    const input = document.getElementById('rev-all');
    const prompt = d.v || (input ? input.value.trim() : '');
    if (!prompt) { if (input) input.focus(); return; }
    delete S().ui.voice['rev-all'];
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
          <p class="small muted" style="margin:12px 2px 0">Why now, comp and process carry over from What candidates will see.</p>`,
      foot: s.ui.planEdit
        ? `<button class="btn btn-primary" data-a="planSave">Save plan</button>`
        : `<div class="row"><button class="btn btn-secondary" data-a="planEditToggle">Edit plan</button><button class="btn btn-primary" data-a="openFacts">Write it</button></div>`
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
        <div class="card"><div style="font-weight:600;font-size:14px">Team size now and in 12 months</div><div class="row" style="margin-top:8px">${inp('teamNow', 'now', 90)}<span class="muted">to</span>${inp('teamNext', 'in 12 mo', 110)}</div>${share('teamShare', f.teamShare)}</div>
        <p class="small muted" style="margin:10px 2px 0">Skip any; we’ll write around it. “Keep internal” shapes the tone without appearing in the emails.</p>`,
      foot: `<button class="btn btn-primary" data-a="genGrowth">Generate v2</button>`
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

  /* =========================================================
     3 · Start outreach
     ========================================================= */
  A.approveSeq = () => { S().ui.activeDraft = String(S().out.active); PL.openSheet('startOut'); };
  function projCard(active, remaining) {
    const p = PL.projection(active, remaining), cls = p.status === 'On track' ? 'acc' : p.status === 'Tight' ? 'warn' : 'danger';
    return `<div class="card" id="proj" style="margin-top:12px"><div class="row"><span style="font-size:14px">At ${active}: all ${remaining} contacted by <b>${p.date}</b></span><span class="spacer"></span><span class="pill ${cls}">${p.status}</span></div>
      <div class="small muted" style="margin-top:6px">Expect ${p.replies} replies a week to answer within your ${S().see.commitment}h commitment.</div></div>`;
  }
  const activeInput = n => `<div class="numrow"><input class="field num" id="active-n" type="number" inputmode="numeric" min="1" max="${n}" value="${esc(S().ui.activeDraft || S().out.active)}" data-i="activeN" aria-label="How many to reach out to at a time"><span class="small muted">at a time, of ${n}</span></div>`;
  I.activeN = v => {
    const n = Math.max(1, PL.approved().length), k = Math.round(Number(v));
    S().ui.activeDraft = v;
    if (k >= 1 && k <= n) {
      S().out.active = k;
      const pj = document.getElementById('proj'); if (pj) pj.outerHTML = projCard(k, n);
      const b = document.getElementById('start-btn'); if (b) { b.disabled = false; b.textContent = `Start outreach to ${k}`; }
    } else { const b = document.getElementById('start-btn'); if (b) { b.disabled = true; b.textContent = `Enter a number from 1 to ${n}`; } }
  };
  SHEETS.startOut = () => {
    const s = S(), n = PL.approved().length;
    return {
      title: 'Start outreach', sub: `${esc(s.seq.versions[s.seq.active].name)} approved · ${n} pre-candidates`,
      body: `<div style="font-weight:600;font-size:14px;margin:4px 2px 8px">How many to reach out to at a time</div>
        ${activeInput(n)}
        <div class="small muted" style="margin:8px 2px 0">When someone replies or finishes the sequence, the next person starts.</div>
        ${projCard(s.out.active, n)}
        <div class="group" style="margin-top:12px">
          <div class="fld-row"><span class="k">From</span><div class="v">farah@nectarsocial.com, connected</div></div>
          <div class="fld-row"><span class="k">Sends</span><div class="v">${s.out.timingApplied ? 'Tue–Thu, 8–10am, their time zone' : 'Weekday mornings, their time zone'}</div></div>
        </div>`,
      foot: `<button class="btn btn-primary" id="start-btn" data-a="startOutreach">Start outreach to ${s.out.active}</button>`
    };
  };
  A.startOutreach = () => { const s = S(); s.seq.approved = true; s.out.started = true; PL.go('started'); };

  PL.outreachLists = () => {
    const s = S(), order = PL.orderedPre();
    const held = order.find((c, i) => i >= 2 && !c.warm);
    const rest = order.filter(c => c !== held);
    return { held, contacted: rest.slice(0, s.out.active), queue: rest.slice(s.out.active) };
  };
  SCREENS.started = () => {
    const s = S(), L = PL.outreachLists();
    const row = (c, i) => `<div class="li tap" data-a="openThread" data-id="${c.id}">${PL.avatar(c, 36)}<div class="b"><div class="t1">${esc(c.name)} · ${esc(c.title)}</div><div class="t2">${c.warm ? `Intro requested: ${esc(c.warm.charAt(0).toLowerCase() + c.warm.slice(1))}` : `Email 1 sent 9:0${Math.min(9, i + 2)}am · next Sep 28`}</div></div></div>`;
    return {
      title: 'Outreach', back: 'sequence', task: 'Outreach started',
      body: `<div class="big-ok"><div class="ring">${ic('check')}</div><h2>Outreach started</h2><p>${L.contacted.length} contacted · ${L.queue.length} in queue${L.held ? ' · 1 held' : ''}</p></div>
        <div class="sec">Just contacted</div><div class="group">${L.contacted.map(row).join('')}</div>
        ${L.held ? `<div class="sec">Held</div><div class="group"><div class="li">${PL.avatar(L.held, 36)}<div class="b"><div class="t1">${esc(L.held.name)} · ${esc(L.held.title)}</div><div class="t2">Contacted by another company on Pathline this week. Starts Oct 1.</div></div></div></div>` : ''}
        <div class="sec">Queue</div>
        <div class="group">${PL.row('Next up', `${L.queue.slice(0, 3).map(c => esc(c.name)).join(', ')}${L.queue.length > 3 ? ` and ${L.queue.length - 3} more` : ''}`, 'noop')}${PL.row('At a time', `${s.out.active} active`, 'openActive')}</div>`,
      footer: `<button class="btn btn-primary" data-a="go" data-r="monitor">Skip ahead 10 days</button><div class="hint">Simulated time, so you can see replies come in</div>`
    };
  };
  A.openActive = () => { S().ui.activeDraft = String(S().out.active); PL.openSheet('active'); };
  SHEETS.active = () => {
    const s = S(), n = Math.max(1, PL.approved().length);
    return { title: 'How many at a time', sub: 'Changes save automatically', body: activeInput(n) + projCard(s.out.active, n) };
  };
  A.openThread = d => PL.openSheet('thread', { id: d.id });
  SHEETS.thread = sh => {
    const c = PL.cand(sh.id), q = S().seq;
    return {
      title: esc(c.name), sub: c.warm ? `Warm intro · ${esc(c.warm)}` : 'Email 1 of 5 · sent today', tall: true,
      body: c.warm ? `<p style="font-size:14px;line-height:1.5;margin:0 2px">Before any email, Pathline asked the person who knows ${esc(c.name.split(' ')[0])} for an intro, with a blurb they can forward. Email 1 follows if there’s no intro in 3 days.</p>` :
        `<div class="cmp"><h5>${esc(D.EMAILS[q.versions[q.active].kind][0].subject)}</h5>${PL.renderEmail(q.active, 0, c, false).html}</div>`,
      foot: `<div class="row"><button class="btn btn-secondary" data-a="threadAct" data-v="Paused">Pause</button><button class="btn btn-secondary" data-a="threadAct" data-v="Removed">Remove</button></div>`
    };
  };
  A.threadAct = d => { PL.S.sheet = null; PL.toast(`${d.v}. The next person in the queue starts instead.`); };

  PL.FILL.sequence = () => { S().seq.approved = true; };
  PL.FILL.started = () => { const s = S(); s.out.started = true; s.network = Math.max(s.network, 16); s.fromYou = Math.max(s.fromYou, 5); };
})(window.PL);
