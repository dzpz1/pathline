/* Pathline prototype — Milestone 2: what candidates will see → email sequence → start outreach */
(function (PL) {
  const D = PL.D, A = PL.A, I = PL.I, C = PL.C, SCREENS = PL.SCREENS, SHEETS = PL.SHEETS, esc = PL.esc, ic = PL.ic;
  const S = () => PL.S;
  const VARIANTS = ['base', 'warmer', 'shorter'];

  /* =========================================================
     1 · What candidates will see
     ========================================================= */
  const FIELDS = {
    title: { label: 'Title', when: 'out' },
    why: { label: 'Why now', when: 'out' },
    success: { label: 'What success looks like', when: 'out' },
    base: { label: 'Base range', when: 'out' },
    hm: { label: 'Hiring manager', when: 'out' },
    process: { label: 'Hiring process', when: 'out' },
    commit: { label: 'Our commitment', when: 'out' },
    team: { label: 'Team & scope', when: 'after' },
    equity: { label: 'Equity', when: 'after' },
    bonus: { label: 'Bonus', when: 'after' },
    start: { label: 'Target start', when: 'after' },
    company: { label: 'Company', when: 'after' }
  };
  const need = '<span class="need-t">Needed</span>';
  function fieldValue(k) {
    const s = S().see;
    switch (k) {
      case 'title': return s.title ? esc(s.title) : need;
      case 'why': return s.whyType && s.whyLine.trim() ? `${esc(s.whyType)} · ${esc(s.whyLine)}` : need;
      case 'success': { const o = s.success.filter(x => x.trim()); const blank = o.some(x => /__/.test(x)); return o.length ? `${esc(o[0])}${o.length > 1 ? ` · +${o.length - 1} more` : ''}${blank ? ' · has a blank' : ''}` : '<span class="muted">None. Email 2 leaves the line out.</span>'; }
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
    const s = S().see, m = [];
    if (!s.title) m.push('title');
    if (!s.whyType || !s.whyLine.trim()) m.push('why now');
    if (!s.engineers) m.push('team size');
    if (!s.equity) m.push('equity');
    if (!s.bonus) m.push('bonus');
    if (!s.hm) m.push('hiring manager');
    return m;
  };
  const inOutreach = k => FIELDS[k].when === 'out' || S().see.promoted[k];
  SCREENS.see = () => {
    const keys = Object.keys(FIELDS), m = PL.seeMissing();
    const rows = list => list.map(k => PL.row(FIELDS[k].label, fieldValue(k), 'openField', `data-k="${k}"`)).join('');
    return {
      title: 'What candidates will see', back: 'shortlist',
      body: `<p class="lede">Filled in before any outreach, so candidates get the facts up front. Prefilled from your job description where possible.</p>
        <div class="sec">Shown in outreach emails</div><div class="group">${rows(keys.filter(inOutreach))}</div>
        <div class="sec">Shown after they reply</div><div class="group">${rows(keys.filter(k => !inOutreach(k)))}</div>
        ${m.length ? `<button class="textlink" style="margin-top:16px" data-a="demoSee">Fill remaining with demo values</button>` : ''}`,
      footer: `<button class="btn btn-primary" data-a="go" data-r="sequence" ${m.length ? 'disabled' : ''}>${m.length ? `${m.length} needed: ${m.join(', ')}` : 'Continue to emails'}</button>`
    };
  };
  A.openField = d => PL.openSheet('field', { key: d.k });
  const opts = PL.options;
  SHEETS.field = sh => {
    const s = S().see, k = sh.key, f = FIELDS[k];
    let body = '';
    switch (k) {
      case 'title': body = `<select class="field" data-c="seeTitle">${opts(['PM, AI', 'Senior PM, AI'], s.title, 'Choose')}</select>`; break;
      case 'why': body = `<div class="chips">${['New role', 'Backfill', 'Team growing'].map(t => PL.chip(t, s.whyType === t, 'seeWhyType', `data-v="${t}"`)).join('')}</div>
        <label class="field-label" style="margin-top:14px">In a line</label><textarea class="field" rows="3" data-i="seeWhyLine" placeholder="e.g. Our first dedicated AI PM. The founders have owned AI until now.">${esc(s.whyLine)}</textarea>`; break;
      case 'success': body = `${!s.successEdited ? '<div class="row" style="margin-bottom:10px"><span class="tag-t">Suggested</span><span class="small muted">Drafted from your job description</span></div>' : ''}
        ${s.success.map((o, i) => `<div class="outcome-edit"><span class="num">${i + 1}</span><textarea class="field" rows="2" data-i="seeSuccess" data-idx="${i}">${esc(o)}</textarea></div><button class="textlink danger" style="margin:0 0 12px 32px" data-a="successRemove" data-idx="${i}">Remove</button>`).join('')}
        <button class="btn btn-sm btn-secondary" data-a="successAdd">Add outcome</button>
        <p class="small muted" style="margin:12px 2px 0">Email 2 uses the first outcome. If it still has a blank (__) or is empty, the email leaves that line out.</p>`; break;
      case 'base': body = `<div class="group"><div class="fld-row"><span class="k">Base range</span><div class="v" style="flex-wrap:nowrap"><select class="field inline" data-c="seeBaseMin">${opts(PL.baseOpts(100, s.baseMax - 5), s.baseMin)}</select><span class="muted">to</span><select class="field inline" data-c="seeBaseMax">${opts(PL.baseOpts(s.baseMin + 5, 350), s.baseMax)}</select></div></div></div><p class="small muted" style="margin:8px 2px 0">From your job description. Also set on Review & pool.</p>`; break;
      case 'hm': body = `<select class="field" data-c="seeHm">${opts(D.HMS, s.hm, 'Select')}</select><p class="small muted" style="margin:8px 2px 0">Sends the outreach emails from their own mailbox.</p>`; break;
      case 'process': body = `<p class="sort-hint">Hold and drag to reorder. Tap a stage to edit it.</p>
        <div class="group"><div class="stage-list">${s.stages.map((st, i) => `<div class="stage-row" data-sort="stages" data-a="openStage" data-idx="${i}"><span class="idx">${i + 1}</span><span class="nm">${esc(st.name)}</span><span class="small muted">${st.h}h</span><span class="chev">${ic('chev', 'sm')}</span></div>`).join('')}</div></div>
        <div class="row" style="margin-top:12px"><button class="btn btn-sm btn-secondary" data-a="stageAdd">Add stage</button><span class="spacer"></span><span class="small muted">About ${PL.totalHours()} hours of their time</span></div>`; break;
      case 'commit': body = `<div style="font-size:14px;margin-bottom:10px">We reply within</div><div class="chips">${[24, 48, 72].map(h => PL.chip(`${h} hours`, s.commitment === h, 'seeCommit', `data-v="${h}"`)).join('')}</div><p class="small muted" style="margin:10px 2px 0">At every stage. Tracked, and shown on your record with candidates.</p>`; break;
      case 'team': body = `<div class="group">
        <div class="fld-row"><span class="k">Reports to</span><div class="v"><input class="field" style="padding:8px 10px;font-size:14px" data-i="seeReportsTo" value="${esc(s.reportsTo)}" placeholder="e.g. Farah (CTO)"></div></div>
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
    if (f.when === 'after') body += `<label class="check" style="margin-top:16px"><input type="checkbox" data-c="promote" data-k="${k}" ${s.promoted[k] ? 'checked' : ''}>Show in outreach emails</label>`;
    return { title: f.label, sub: inOutreach(k) ? 'Shown in outreach emails' : 'Shown after they reply', tall: k === 'success', body, foot: `<button class="btn btn-primary" data-a="closeSheet">Done</button>` };
  };
  C.seeTitle = v => { S().see.title = v; };
  A.seeWhyType = d => { S().see.whyType = d.v; };
  I.seeWhyLine = v => { S().see.whyLine = v; };
  I.seeSuccess = (v, d) => { S().see.success[Number(d.idx)] = v; S().see.successEdited = true; };
  A.successRemove = d => { S().see.success.splice(Number(d.idx), 1); S().see.successEdited = true; };
  A.successAdd = () => { S().see.success.push(''); S().see.successEdited = true; };
  C.seeHm = v => { S().see.hm = v; };
  A.seeCommit = d => { S().see.commitment = Number(d.v); };
  I.seeReportsTo = v => { S().see.reportsTo = v; };
  C.seeEngineers = v => { S().see.engineers = v; };
  C.seeOtherPMs = v => { S().see.otherPMs = v; };
  C.seeReports = v => { S().see.directReports = v; };
  C.seeEquity = v => { S().see.equity = v; };
  C.seeVesting = v => { S().see.vesting = v; };
  C.seeBonus = v => { S().see.bonus = v; };
  C.promote = (v, d) => { S().see.promoted[d.k] = v; };
  PL.SORT.stages = (from, to) => PL.move(S().see.stages, from, to);
  A.openStage = d => PL.openSheet('stage', { id: 's' + d.idx, idx: Number(d.idx) });
  SHEETS.stage = sh => {
    const s = S().see, st = s.stages[sh.idx];
    if (!st) return { title: 'Stage', body: '' };
    return {
      title: `Stage ${sh.idx + 1}`, sub: 'Hiring process',
      body: `<label class="field-label">Name</label><input class="field" data-i="stageName" data-idx="${sh.idx}" value="${esc(st.name)}">
        <label class="field-label" style="margin-top:12px">Time it takes the candidate</label><select class="field" data-c="stageH" data-idx="${sh.idx}">${opts([1, 2, 3, 4, 5, 6].map(h => ({ v: h, l: `About ${h} hour${h > 1 ? 's' : ''}` })), st.h)}</select>
        ${s.stages.length > 1 ? `<button class="textlink danger" style="margin-top:18px" data-a="stageRemove" data-idx="${sh.idx}">Remove stage</button>` : ''}`,
      foot: `<button class="btn btn-primary" data-a="openField" data-k="process">Back to hiring process</button>`
    };
  };
  I.stageName = (v, d) => { S().see.stages[Number(d.idx)].name = v; };
  C.stageH = (v, d) => { S().see.stages[Number(d.idx)].h = Number(v); };
  A.stageRemove = d => { const st = S().see.stages; if (st.length > 1) st.splice(Number(d.idx), 1); PL.openSheet('field', { key: 'process' }); };
  A.stageAdd = () => { const st = S().see.stages; st.push({ name: 'New stage', h: 1 }); PL.openSheet('stage', { id: 's' + (st.length - 1), idx: st.length - 1 }); };
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
    if (/__/.test(s.success[0] || '')) { s.success[0] = s.success[0].replace('__', '50'); }
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

  const BLANK_RE = /\[(why now|reports to|# engineers)\]/g;
  function fill(text, ctx, counter) {
    let plain = '', html = '', last = 0, skip = false;
    const re = /\[\[(\w+)\]\]/g; let m;
    while ((m = re.exec(text))) {
      const before = text.slice(last, m.index);
      html += esc(before); plain += before;
      const key = m[1], val = ctx[key];
      if (val) { html += `<span class="slot" title="${esc(PL.SLOT_SRC[key] || '')}">${esc(val)}</span>`; plain += val; }
      else if (PL.OPTIONAL.includes(key)) skip = true;
      else { const lbl = PL.BLANK_LABEL[key] || key; html += `<span class="blank" contenteditable="false" data-a="openBlank" data-f="${key}">[${esc(lbl)}]</span>`; plain += `[${lbl}]`; counter.n++; }
      last = re.lastIndex;
    }
    html += esc(text.slice(last)); plain += text.slice(last);
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
            <div class="row"><input class="field" id="rev-${i}" placeholder="Revise this email, e.g. cut the customer list" data-enter="reviseEmail" data-idx="${i}"><button class="btn btn-sm btn-primary" data-a="reviseEmail" data-idx="${i}">Revise</button></div>
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
      title: 'Outreach sequence', back: 'see',
      body: `<div class="card" style="padding:12px 14px"><div style="font-weight:600;font-size:14.5px">From Farah · to ${ap.length} pre-candidates</div><div class="small muted" style="margin-top:2px">5 emails. Stops when they reply. Emails 2–5 go in the same thread.</div>
          <label class="field-label" style="margin:12px 2px 6px">Preview as</label><select class="field" style="padding:9px 32px 9px 11px;font-size:14px" data-c="seqPreview">${PL.options(ap.map(c => ({ v: c.id, l: `${c.name} · ${c.title}` })), cand.id)}</select>
          <label class="check" style="margin-top:12px;font-size:13px"><input type="checkbox" data-c="oneTap" ${q.oneTap ? 'checked' : ''}>One-tap replies under the signature</label></div>
        <div class="sec">Emails ${q.revisingAll ? '<span class="working" style="margin-left:6px">Rewriting all 5…</span>' : ''}</div>
        ${versions}${cards}
        <div class="change-all"><div class="t">Change all emails</div>
          <div class="row"><input class="field" id="rev-all" placeholder="e.g. focus on growth, or less salesy" data-enter="reviseAll"><button class="btn btn-sm btn-primary" data-a="reviseAll">Apply</button></div>
          <div class="chips" style="margin-top:8px">${PL.chip('Growth', false, 'reviseAll', 'data-v="growth"', 'sm')}${PL.chip('Shorter', false, 'reviseAll', 'data-v="shorter"', 'sm')}${PL.chip('Warmer', false, 'reviseAll', 'data-v="warmer"', 'sm')}</div>
          <p class="small muted" style="margin:8px 2px 0">Tone changes apply directly. A new angle shows you a plan first.</p></div>
        <p class="small muted" style="margin:14px 2px 0">Every fact comes from your company fact bank: your job description, your settings and the sample emails you shared.</p>`,
      footer: `<button class="btn btn-primary" data-a="approveSeq" ${totalBlanks ? 'disabled' : ''}>${totalBlanks ? `${totalBlanks} blank${totalBlanks > 1 ? 's' : ''} to fill before approving` : 'Approve sequence'}</button>`
    };
  };
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
          <p class="small muted" style="margin:12px 2px 0">What success looks like, why now, comp and process carry over from v1.</p>`,
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
  /* Sam's independent review is fixed once, the first time it's needed, so resolving one never surfaces another. */
  PL.disagreements = () => {
    const o = S().out;
    if (!o.disList) {
      const ap = PL.approved();
      o.disList = [];
      if (ap[1]) o.disList.push({ id: ap[1].id, why: 'Technical depth: prototypes only' });
      if (ap[4]) o.disList.push({ id: ap[4].id, why: 'Relocation seems unlikely' });
    }
    return o.disList.filter(x => !o.disResolved[x.id]);
  };
  A.approveSeq = () => PL.openSheet('startOut');
  function projCard(active, remaining) {
    const p = PL.projection(active, remaining), cls = p.status === 'On track' ? 'acc' : p.status === 'Tight' ? 'warn' : 'danger';
    return `<div class="card" style="margin-top:12px"><div class="row"><span style="font-size:14px">At ${active}: all ${remaining} contacted by <b>${p.date}</b></span><span class="spacer"></span><span class="pill ${cls}">${p.status}</span></div>
      <div class="small muted" style="margin-top:6px">Expect ${p.replies} replies a week to answer within your ${S().see.commitment}h commitment.</div></div>`;
  }
  const activeChips = cur => `<div class="chips">${[4, 6, 8, 10].map(n => PL.chip(String(n), cur === n, 'setActive', `data-v="${n}"`)).join('')}</div>`;
  SHEETS.startOut = () => {
    const s = S(), n = PL.approved().length, dis = PL.disagreements();
    return {
      title: 'Start outreach', sub: `${esc(s.seq.versions[s.seq.active].name)} approved · ${n} pre-candidates`,
      body: `${dis.length ? `<div class="group" style="margin-bottom:12px">${PL.row('Sam (recruiter)', `Disagreed on ${dis.length} ${dis.length > 1 ? 'people' : 'person'}`, 'openDis')}</div>` : ''}
        <div style="font-weight:600;font-size:14px;margin:4px 2px 8px">How many to reach out to at a time</div>
        ${activeChips(s.out.active)}
        <div class="small muted" style="margin:8px 2px 0">When someone replies or finishes the sequence, the next person starts.</div>
        ${projCard(s.out.active, n)}
        <div class="group" style="margin-top:12px">
          <div class="fld-row"><span class="k">From</span><div class="v">farah@nectarsocial.com, connected</div></div>
          <div class="fld-row"><span class="k">Sends</span><div class="v">${s.out.timingApplied ? 'Tue–Thu, 8–10am, their time zone' : 'Weekday mornings, their time zone'}</div></div>
          <div class="fld-row"><span class="k">Order</span><div class="v">Warm intros first, then by rank</div></div>
        </div>`,
      foot: `<button class="btn btn-primary" data-a="startOutreach">Start outreach to ${s.out.active}</button>`
    };
  };
  A.setActive = d => { S().out.active = Number(d.v); };
  A.openDis = () => PL.openSheet('dis');
  SHEETS.dis = () => {
    const dis = PL.disagreements();
    return {
      title: 'Where Sam disagreed', sub: 'You each reviewed the shortlist independently',
      body: dis.map(x => { const c = PL.cand(x.id); return `<div class="card"><div class="row">${PL.avatar(c, 34)}<div style="flex:1"><div style="font-weight:600">${esc(c.name)}</div><div class="small muted">${esc(c.title)} · ${esc(c.co)}</div></div></div>
        <div class="small" style="margin-top:10px">You kept them. Sam would pass: “${esc(x.why)}”</div>
        <div class="row" style="margin-top:10px"><button class="btn btn-xs btn-secondary" data-a="disKeep" data-id="${x.id}">Keep</button><button class="btn btn-xs btn-secondary" data-a="disRemove" data-id="${x.id}">Remove from outreach</button></div></div>`; }).join('') || '<p class="muted small">All resolved.</p>',
      foot: `<button class="btn btn-primary" data-a="openStartOut">Back to start outreach</button>`
    };
  };
  A.openStartOut = () => PL.openSheet('startOut');
  A.disKeep = d => { S().out.disResolved[d.id] = 'keep'; if (!PL.disagreements().length) PL.openSheet('startOut'); };
  A.disRemove = d => { const s = S(); s.out.disResolved[d.id] = 'removed'; s.sl.final = (s.sl.final || PL.visible().map(c => c.id)).filter(x => x !== d.id); PL.toast(`${esc(PL.cand(d.id).name)} removed from outreach`); if (!PL.disagreements().length) PL.openSheet('startOut'); };
  A.startOutreach = () => { const s = S(); s.seq.approved = true; s.out.started = true; PL.go('started'); };

  PL.outreachLists = () => {
    const s = S(), order = PL.orderedPre();
    const held = order.find((c, i) => i >= 2 && !c.warm);
    const rest = order.filter(c => c !== held);
    return { held, contacted: rest.slice(0, s.out.active), queue: rest.slice(s.out.active) };
  };
  SCREENS.started = () => {
    const s = S(), L = PL.outreachLists();
    const row = (c, i) => `<div class="li tap" data-a="openThread" data-id="${c.id}">${PL.avatar(c, 36)}<div class="b"><div class="t1">${esc(c.name)} · ${esc(c.title)}</div><div class="t2">${c.warm ? `Intro requested: ${esc(c.warm.charAt(0).toLowerCase() + c.warm.slice(1))}` : `Email 1 sent 9:0${Math.min(9, i + 2)}am · next Sep 28`}</div></div><span class="chev">${ic('chev', 'sm')}</span></div>`;
    return {
      title: 'Outreach', back: 'sequence',
      body: `<div class="big-ok"><div class="ring">${ic('check')}</div><h2>Outreach started</h2><p>${L.contacted.length} contacted · ${L.queue.length} in queue${L.held ? ' · 1 held' : ''}</p></div>
        <div class="sec">Just contacted</div><div class="group">${L.contacted.map(row).join('')}</div>
        ${L.held ? `<div class="sec">Held</div><div class="group"><div class="li">${PL.avatar(L.held, 36)}<div class="b"><div class="t1">${esc(L.held.name)} · ${esc(L.held.title)}</div><div class="t2">Contacted by another company on Pathline this week. Starts Oct 1.</div></div></div></div>` : ''}
        <div class="sec">Queue</div>
        <div class="group">${PL.row('Next up', `${L.queue.slice(0, 3).map(c => esc(c.name)).join(', ')}${L.queue.length > 3 ? ` and ${L.queue.length - 3} more` : ''}`, 'noop')}${PL.row('At a time', `${s.out.active} active`, 'openActive')}</div>`,
      footer: `<button class="btn btn-primary" data-a="go" data-r="monitor">Skip ahead 10 days</button><div class="hint">Simulated time, so you can see replies come in</div>`
    };
  };
  A.openActive = () => PL.openSheet('active');
  SHEETS.active = () => {
    const s = S(), n = Math.max(1, PL.approved().length);
    return { title: 'How many at a time', body: activeChips(s.out.active) + projCard(s.out.active, n), foot: `<button class="btn btn-primary" data-a="closeSheet">Done</button>` };
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
