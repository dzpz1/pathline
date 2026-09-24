/* Pathline prototype — Milestone 1: import → attributes → requirements → what candidates see → review & pool → shortlist */
(function (PL) {
  const D = PL.D, A = PL.A, I = PL.I, C = PL.C, SCREENS = PL.SCREENS, SHEETS = PL.SHEETS, esc = PL.esc, ic = PL.ic;
  const S = () => PL.S;
  PL.BODY = PL.BODY || {};

  /* =========================================================
     Start
     ========================================================= */
  SCREENS.start = () => ({
    noBar: true,
    body: `<div class="start">
      <div class="brand"><i></i>Pathline</div>
      <h1>Grow your team <em>without</em> lowering the bar.</h1>
      <p>For tech companies in their scaling phase. Pathline finds experienced people with real evidence of what your role needs, reaches out on your behalf, and tests them rigorously without losing their interest.</p>
      <div class="fly">
        <div class="fly-h">How Pathline gets better with every hire</div>
        ${['Find pre-candidates with strong evidence on your ideal attributes', 'Reach out with the facts up front', 'Those who reply join Pathline, open to new roles', 'Take-homes add strong, reusable signal', 'Better matches on both sides', 'More candidates and companies join']
          .map((t, i) => `<div class="fly-i ${i === 5 ? 'loop' : ''}"><b>${i === 5 ? '↻' : i + 1}</b><span>${t}</span></div>`).join('')}
      </div>
      <div class="you">You’re <b>Farah, CTO at Nectar Social</b>, hiring a Senior PM, AI. The job description is Nectar’s public posting; candidates, numbers and replies are fictional.</div>
    </div>`,
    footer: `<button class="btn btn-primary" data-a="go" data-r="import">Start the demo ${ic('arrowR')}</button>`
  });

  /* =========================================================
     1 · Import & structure
     ========================================================= */
  const PARSE_STEPS = ['Reading the posting', 'Finding requirements and comp', 'Drafting 12–18 month outcomes', 'Checking for conflicts'];
  SCREENS.import = () => {
    const j = S().jd;
    if (j.parsing) {
      return { title: 'New role', back: 'start', body: `<div class="parse"><div class="spin"></div><div class="parse-steps">${PARSE_STEPS.map((t, i) =>
        `<div class="${i <= j.parseStep ? 'on' : ''}">${i < j.parseStep ? ic('check') : ic('clock')}${t}</div>`).join('')}</div></div>` };
    }
    if (!j.imported) {
      const src = j.source;
      const seg = [['paste', 'clip', 'Paste'], ['upload', 'upload', 'Upload'], ['link', 'link', 'Link'], ['talk', 'mic', 'Talk']]
        .map(([k, i, l]) => `<button class="${src === k ? 'on' : ''}" data-a="jdSource" data-k="${k}">${ic(i, 'sm')}${l}</button>`).join('');
      let panel = '';
      if (src === 'paste') panel = `<textarea class="field jd-text" data-i="jdText" aria-label="Job description">${esc(j.text)}</textarea>`;
      if (src === 'link') panel = `<input class="field" data-i="jdLink" value="${esc(j.link)}" aria-label="Job posting link"><p class="small muted" style="margin:8px 2px 0">Ashby, Greenhouse, Lever and Workable postings import directly through their job-board APIs.</p>`;
      if (src === 'upload') panel = `<div class="card" style="text-align:center;padding:36px 16px;border-style:dashed">${ic('upload', 'lg')}<p class="small muted" style="margin:10px 0 0">Drop a PDF or DOCX.<br>In this prototype, use Paste or Link.</p></div>`;
      if (src === 'talk') panel = `<div class="card" style="text-align:center;padding:30px 16px"><div style="width:56px;height:56px;border-radius:50%;background:var(--accent-soft);color:var(--accent-ink);display:grid;place-items:center;margin:0 auto">${ic('mic', 'lg')}</div><p class="small muted" style="margin:12px 0 0">Talk me through the role in about 2 minutes.<br>In this prototype, use Paste or Link.</p></div>`;
      const ok = src === 'paste' || src === 'link';
      return {
        title: 'New role', back: 'start',
        body: `<div class="h1">Start from what you have</div>
          <p class="lede">Paste your existing job description, upload it, drop a link, or talk it through. Everything after this is drafted from it.</p>
          <div class="seg">${seg}</div><div style="margin-top:12px">${panel}</div>`,
        footer: `<button class="btn btn-primary" data-a="importJD" ${ok ? '' : 'disabled'}>${ic('spark')}Import & structure</button>`
      };
    }
    const title = S().see.title;
    const flags = [];
    if (!title) flags.push(`<div class="flag">${ic('alert')}<div><b>Your JD says both “Product Manager” and “Senior Product Manager”.</b> Which level is it?<div class="chips" style="margin-top:8px">${PL.chip('PM, AI', false, 'setTitle', 'data-v="PM, AI"')}${PL.chip('Senior PM, AI', false, 'setTitle', 'data-v="Senior PM, AI"')}</div></div></div>`);
    if (!j.work) flags.push(`<div class="flag">${ic('alert')}<div><b>Listed as remote, but the text says 4 days in the office.</b> Which is right?<div class="chips" style="margin-top:8px">${PL.chip('Remote', false, 'setWork', 'data-v="remote"')}${PL.chip('Hybrid, 4 days', false, 'setWork', 'data-v="hybrid"')}</div></div></div>`);
    const resolved = [];
    if (title) resolved.push(`Level: ${esc(title)}`);
    if (j.work) resolved.push(j.work === 'remote' ? 'Work model: remote' : 'Work model: hybrid, 4 days in office');
    const blank = j.outcomeBlank;
    const summary = j.editSummary
      ? `<textarea class="field" id="ed-summary" rows="4">${esc(j.summary)}</textarea><div class="row" style="margin-top:8px;justify-content:flex-end"><button class="btn btn-sm btn-ghost" data-a="summaryEdit">Cancel</button><button class="btn btn-sm btn-primary" data-a="summarySave">Save</button></div>`
      : `<div style="font-size:14.5px;line-height:1.5">${esc(j.summary)}</div>`;
    return {
      title: 'New role', back: 'start',
      body: `<div class="src-row">${ic('check')}<span>Imported from jobs.ashbyhq.com</span><span class="spacer"></span><button class="text-btn" data-a="jdChange">Change</button></div>
        <div class="role-title">${esc(title || 'Product Manager, AI')}</div>
        <div class="small muted">Nectar Social · Palo Alto, CA · Full time</div>
        ${flags.length ? `<div class="sec">${flags.length} to confirm</div>${flags.join('')}` : ''}
        ${resolved.length ? `<div class="flag ok" style="margin-top:${flags.length ? 8 : 14}px">${ic('check')}<div>${resolved.join(' · ')}</div></div>` : ''}
        <div class="sec">Summary <button class="icon-btn" style="margin-left:auto" data-a="summaryEdit" aria-label="Edit summary">${ic('edit', 'sm')}</button></div>
        <div class="card">${summary}</div>
        <div class="sec">12–18 month outcomes <span class="tag">${ic('spark')}Drafted</span></div>
        <div class="card">
          <div class="outcome"><span class="num">1</span><span>Ship AI workflows used weekly by <input class="blank-in ${blank ? 'filled' : ''}" id="blank1" data-i="outcomeBlank" value="${esc(blank)}" inputmode="numeric" maxlength="3" placeholder="__" aria-label="Percent of customers">% of customers</span></div>
          <div class="outcome"><span class="num">2</span><span>Stand up AI quality metrics (accuracy, automation rate) that engineering trusts</span></div>
          <div class="outcome"><span class="num">3</span><span>Run a steady research loop with brand teams that shapes the roadmap</span></div>
          <div class="divider"></div>
          <button class="text-btn" data-a="toggleOrig">Drafted from your ${D.RESPONSIBILITIES.length} responsibilities · ${j.showOrig ? 'Hide' : 'Show'} original ${ic(j.showOrig ? 'up' : 'chevDown', 'sm')}</button>
          ${j.showOrig ? `<ul class="orig">${D.RESPONSIBILITIES.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
        </div>
        ${!blank ? `<p class="small muted" style="margin:8px 2px 0">Blanks don’t block you. They show up as prompts in outreach until filled.</p>` : ''}`,
      footer: `<button class="btn btn-primary" data-a="go" data-r="attributes" ${flags.length ? 'disabled' : ''}>${flags.length ? `Confirm ${flags.length} item${flags.length > 1 ? 's' : ''} above` : `Looks right ${ic('arrowR')}`}</button>`
    };
  };
  A.jdSource = d => { S().jd.source = d.k; };
  I.jdText = v => { S().jd.text = v; };
  I.jdLink = v => { S().jd.link = v; };
  A.importJD = () => {
    const j = S().jd;
    j.parsing = true; j.parseStep = 0;
    const tick = () => {
      if (!PL.S.jd.parsing) return;
      if (PL.S.jd.parseStep < PARSE_STEPS.length - 1) { PL.S.jd.parseStep++; PL.render(); setTimeout(tick, 480); }
      else { PL.S.jd.parsing = false; PL.S.jd.imported = true; PL.save(); PL.render(); }
    };
    setTimeout(tick, 480);
  };
  A.jdChange = () => { const j = S().jd; j.imported = false; };
  A.setTitle = d => { S().see.title = d.v; };
  A.setWork = d => { S().jd.work = d.v; };
  A.toggleOrig = () => { S().jd.showOrig = !S().jd.showOrig; };
  A.summaryEdit = () => { S().jd.editSummary = !S().jd.editSummary; };
  A.summarySave = () => { const el = document.getElementById('ed-summary'); if (el) S().jd.summary = el.value.trim() || S().jd.summary; S().jd.editSummary = false; };
  I.outcomeBlank = (v, d, el) => { const n = v.replace(/[^0-9]/g, ''); if (n !== v) el.value = n; S().jd.outcomeBlank = n; el.classList.toggle('filled', !!n); };

  PL.FILL.import = () => {
    const s = S();
    s.jd.imported = true; s.jd.parsing = false;
    if (!s.see.title) s.see.title = 'Senior PM, AI';
    if (!s.jd.work) s.jd.work = 'hybrid';
    if (!s.jd.outcomeBlank) s.jd.outcomeBlank = '50';
  };

  /* =========================================================
     2 · Attributes
     ========================================================= */
  function attrRow(a, i, mode) {
    const s = S(), n = s.attrs.length, editing = s.ui.editAttr === a.id;
    const below = i >= 5;
    const mark = a.suggested ? '<span class="sugg" title="Suggested by Pathline">✦ </span>' : '';
    const words = a.yourWords ? ' <span class="pill" style="margin-left:4px">Your words</span>' : '';
    let inner;
    if (editing) {
      inner = `<div class="edit-box" data-a="noop">
        <label class="field-label" style="margin:0">Definition</label><textarea class="field" id="ed-def" rows="3">${esc(a.def)}</textarea>
        <label class="field-label" style="margin:0">Why it matters</label><textarea class="field" id="ed-why" rows="3">${esc(a.why)}</textarea>
        <div class="row" style="justify-content:flex-end"><button class="btn btn-sm btn-ghost" data-a="attrEdit" data-id="">Cancel</button><button class="btn btn-sm btn-primary" data-a="attrSave" data-id="${a.id}">Save</button></div></div>`;
    } else {
      inner = `<div class="attr-def">${mark}${esc(a.def)}${words}</div><div class="attr-why"><b>Why:</b> ${mark}${esc(a.why)}</div>
        <div class="attr-foot">Evidence we’ll look for ${ic('chev', 'sm')}</div>
        <button class="icon-btn attr-edit" data-a="attrEdit" data-id="${a.id}" aria-label="Edit definition and why">${ic('edit', 'sm')}</button>`;
    }
    return `<div class="attr ${below ? 'below' : ''} ${s.newAttrId === a.id ? 'new' : ''}" ${editing ? '' : `data-a="openAttr" data-id="${a.id}"`}>
      <div class="attr-top"><span class="attr-rank">${i + 1}</span><span class="attr-name">${esc(a.name)}${s.newAttrId === a.id ? ' <span class="pill acc">New</span>' : ''}</span>
      ${mode === 'sheet-min' ? '' : `<span class="attr-arrows"><button class="icon-btn" data-a="moveAttr" data-id="${a.id}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="Move up">${ic('up', 'sm')}</button><button class="icon-btn" data-a="moveAttr" data-id="${a.id}" data-d="1" ${i === n - 1 ? 'disabled' : ''} aria-label="Move down">${ic('down', 'sm')}</button></span>`}
      ${editing ? '' : `<span style="color:var(--faint)">${ic('chev', 'sm')}</span>`}</div>${inner}</div>`;
  }
  PL.BODY.attributes = (mode) => {
    const s = S();
    const list = s.attrs.map((a, i) => (i === 5 ? `<div class="also-div">Also assessed · not in shortlist ranking</div>` : '') + attrRow(a, i, mode)).join('');
    const recAdded = s.attrs.some(a => a.id === 'hon');
    const others = D.OTHER_SUGGESTIONS.filter(o => !s.attrs.some(a => a.id === o.id));
    return `${mode === 'screen' ? `<p class="lede" style="margin-top:4px">Drafted from your job description, ranked by impact on your 12–18 month outcomes. Rank is the only priority signal.</p>` : ''}
      ${list}
      <p class="small muted" style="margin:10px 2px 0">The top 5 rank your shortlist, in order.</p>
      ${!recAdded ? `<div class="sec">Recommended</div><div class="rec"><div class="row"><button class="chip" data-a="addRec">${ic('plus', 'sm')}Intellectual honesty</button></div><p>Not in your JD, but AI PMs need to call it when a feature isn’t working, including their own.</p></div>` : ''}
      <div style="margin-top:14px" class="row"><button class="btn btn-sm btn-secondary" data-a="openAddAttr" ${s.attrs.length >= 7 ? 'disabled' : ''}>${ic('plus', 'sm')}Add attribute</button><span class="spacer"></span>${s.attrs.length >= 7 ? '<span class="small muted">Max 7</span>' : ''}</div>
      ${others.length ? `<div class="sec" style="cursor:pointer" data-a="toggleOthers">Other suggestions (${others.length}) ${ic(s.ui.otherOpen ? 'up' : 'chevDown', 'sm')}</div>
      ${s.ui.otherOpen ? `<div class="group">${others.map(o => `<div class="li"><div class="b"><div class="t1">${esc(o.name)}</div><div class="t2">${esc(o.why)}</div></div><button class="btn btn-xs btn-secondary" data-a="openSwap" data-id="${o.id}">Swap in</button></div>`).join('')}</div>` : ''}` : ''}`;
  };
  SCREENS.attributes = () => ({
    title: 'What this role needs', back: 'import',
    body: PL.BODY.attributes('screen'),
    footer: `<button class="btn btn-primary" data-a="go" data-r="requirements">Looks right ${ic('arrowR')}</button>`
  });
  A.moveAttr = d => {
    const a = S().attrs, i = a.findIndex(x => x.id === d.id), j = i + Number(d.d);
    if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]];
  };
  A.attrEdit = d => { S().ui.editAttr = d.id || null; };
  A.attrSave = d => {
    const a = PL.attr(d.id), def = document.getElementById('ed-def'), why = document.getElementById('ed-why');
    if (a && def && why) {
      if (def.value.trim() !== a.def || why.value.trim() !== a.why) a.yourWords = true;
      a.def = def.value.trim() || a.def; a.why = why.value.trim() || a.why; a.suggested = false;
    }
    S().ui.editAttr = null;
  };
  A.toggleOthers = () => { S().ui.otherOpen = !S().ui.otherOpen; };
  A.openAttr = d => { S().ui.evEdit = null; PL.openSheet('attr', { id: d.id }); };
  A.attrNav = d => { S().ui.evEdit = null; S().sheet.id = d.id; };

  SHEETS.attr = sh => {
    const s = S(), a = PL.attr(sh.id);
    if (!a) return { title: 'Attribute', body: '' };
    const i = s.attrs.indexOf(a), n = s.attrs.length;
    const prev = s.attrs[i - 1], next = s.attrs[i + 1];
    const ev = key => {
      if (s.ui.evEdit === key) {
        return `<textarea class="field" id="ev-edit" rows="5">${esc(a[key].join('\n'))}</textarea>
          <p class="small muted" style="margin:6px 2px">One item per line.</p>
          <div class="row" style="justify-content:flex-end"><button class="btn btn-sm btn-ghost" data-a="evEdit" data-k="">Cancel</button><button class="btn btn-sm btn-primary" data-a="evSave" data-k="${key}">Save</button></div>`;
      }
      return `<ul class="ev-list ${key === 'weak' ? 'weak' : ''}">${a[key].map(x => `<li>${a.suggested ? '<span class="sugg">✦</span>' : ''}${esc(x)}</li>`).join('')}</ul>`;
    };
    return {
      title: esc(a.name), sub: i < 5 ? `Ranked #${i + 1} of ${Math.min(5, n)}` : 'Also assessed',
      swipePrev: prev ? `attrNav:${prev.id}` : '', swipeNext: next ? `attrNav:${next.id}` : '',
      body: `<div class="sec" style="margin-top:0">Evidence we’ll look for</div>
        ${s.ui.evWorking ? '<div class="working" style="margin:10px 0">Regenerating…</div>' : ''}
        <div class="ev-h">Strong <span class="spacer"></span><button class="icon-btn" data-a="evEdit" data-k="strong" aria-label="Edit strong evidence">${ic('edit', 'sm')}</button><button class="icon-btn" data-a="evRegen" data-k="strong" aria-label="Regenerate">${ic('refresh', 'sm')}</button></div>
        ${ev('strong')}
        <div class="ev-h">Weak <span class="spacer"></span><button class="icon-btn" data-a="evEdit" data-k="weak" aria-label="Edit weak evidence">${ic('edit', 'sm')}</button><button class="icon-btn" data-a="evRegen" data-k="weak" aria-label="Regenerate">${ic('refresh', 'sm')}</button></div>
        ${ev('weak')}
        <div class="row" style="margin-top:14px"><input class="field" id="ev-add" placeholder="Add evidence we should look for" data-enter="evAdd" style="padding:9px 11px;font-size:13.5px"><button class="btn btn-sm btn-secondary" data-a="evAdd">${ic('plus', 'sm')}Add</button></div>`,
      foot: `<div class="sheet-nav"><button data-a="attrNav" data-id="${prev ? prev.id : ''}" ${prev ? '' : 'disabled'}>${ic('back', 'sm')}${prev ? esc(prev.name) : 'Prev'}</button><span>swipe</span><button data-a="attrNav" data-id="${next ? next.id : ''}" ${next ? '' : 'disabled'}>${next ? esc(next.name) : 'Next'}${ic('chev', 'sm')}</button></div>
        <div class="row"><button class="btn btn-secondary btn-sm" style="flex:1" data-a="openSwapOut" data-id="${a.id}">Swap out</button><button class="btn btn-primary btn-sm" style="flex:1" data-a="closeSheet">Done</button></div>`
    };
  };
  A.evEdit = d => { S().ui.evEdit = d.k || null; };
  A.evSave = d => {
    const a = PL.attr(S().sheet.id), el = document.getElementById('ev-edit');
    if (a && el) { a[d.k] = el.value.split('\n').map(x => x.trim()).filter(Boolean); a.suggested = false; }
    S().ui.evEdit = null;
  };
  A.evAdd = () => {
    const a = PL.attr(S().sheet.id), el = document.getElementById('ev-add');
    if (a && el && el.value.trim()) { a.strong.push(el.value.trim()); }
  };
  A.evRegen = d => {
    const id = S().sheet.id;
    S().ui.evWorking = true;
    setTimeout(() => {
      const a = PL.attr(id);
      if (a) {
        const pool = D.EVIDENCE_POOLS[a.id];
        if (pool && d.k === 'strong') {
          const merged = pool.S.concat(a.strong).filter((x, i, arr) => arr.indexOf(x) === i);
          a.strong = merged.slice(0, 3);
          if (a.strong.join() === merged.slice(0, 3).join()) a.strong = merged.slice(1).concat(merged[0]).slice(0, 3);
        } else {
          a[d.k] = a[d.k].slice(1).concat(a[d.k][0]);
        }
      }
      PL.S.ui.evWorking = false;
      PL.toast('Regenerated from your JD and outcomes');
      PL.save(); PL.render();
    }, 700);
  };

  /* Swap in / swap out */
  A.openSwap = d => PL.openSheet('swap', { id: d.id, dir: 'in' });
  A.openSwapOut = d => PL.openSheet('swap', { id: d.id, dir: 'out' });
  SHEETS.swap = sh => {
    const s = S();
    if (sh.dir === 'in') {
      const o = D.OTHER_SUGGESTIONS.find(x => x.id === sh.id);
      return { title: `Swap in ${esc(o.name)}`, sub: 'Replace which attribute?',
        body: `<div class="group">${s.attrs.slice(0, 5).map((a, i) => `<div class="li tap" data-a="doSwap" data-out="${a.id}" data-in="${o.id}"><span class="attr-rank">${i + 1}</span><div class="b"><div class="t1">${esc(a.name)}</div></div>${ic('chev', 'sm')}</div>`).join('')}</div>` };
    }
    const a = PL.attr(sh.id);
    const others = D.OTHER_SUGGESTIONS.filter(o => !s.attrs.some(x => x.id === o.id));
    return { title: `Swap out ${esc(a.name)}`, sub: 'Replace it with',
      body: `<div class="group">${others.map(o => `<div class="li tap" data-a="doSwap" data-out="${a.id}" data-in="${o.id}"><div class="b"><div class="t1">${esc(o.name)}</div><div class="t2">${esc(o.def)}</div></div>${ic('chev', 'sm')}</div>`).join('')}</div>
        <button class="btn btn-sm btn-ghost btn-danger-ghost" style="margin-top:10px" data-a="removeAttr" data-id="${a.id}">Remove without replacing</button>` };
  };
  function libAttr(id) {
    const lib = D.LIBRARY.find(x => x.id === id) || D.OTHER_SUGGESTIONS.find(x => x.id === id);
    const pool = D.EVIDENCE_POOLS[id];
    return { id: lib.id, name: lib.name, def: lib.def, why: lib.why, strong: (lib.strong || (pool ? pool.S : ['Evidence drafted from your JD'])).slice(), weak: (lib.weak || ['Claims it without examples']).slice(), suggested: true };
  }
  A.doSwap = d => {
    const s = S(), i = s.attrs.findIndex(a => a.id === d.out), out = s.attrs[i];
    s.attrs[i] = libAttr(d.in);
    s.newAttrId = d.in;
    PL.S.sheet = null;
    PL.toast(`${esc(s.attrs[i].name)} swapped in for ${esc(out.name)}`, 'swap', { i, out });
  };
  PL.UNDO.swap = data => { S().attrs[data.i] = data.out; S().newAttrId = null; };
  A.removeAttr = d => { const s = S(); s.attrs = s.attrs.filter(a => a.id !== d.id); PL.S.sheet = null; PL.toast('Attribute removed'); };

  /* Add attribute */
  A.addRec = () => { PL.startPlace('hon'); };
  A.openAddAttr = () => { S().ui.addQuery = ''; S().ui.addWarn = false; PL.openSheet('addAttr'); };
  I.addQuery = v => {
    S().ui.addQuery = v; S().ui.addWarn = false;
    PL.renderSheetOnly();
    const el = document.getElementById('add-q');
    if (el) { el.focus(); el.setSelectionRange(v.length, v.length); }
  };
  SHEETS.addAttr = () => {
    const s = S(), q = s.ui.addQuery.trim(), ql = q.toLowerCase();
    const items = D.LIBRARY.filter(l => !s.attrs.some(a => a.id === l.id)).filter(l => !ql || l.name.toLowerCase().includes(ql));
    const exact = D.LIBRARY.some(l => l.name.toLowerCase() === ql);
    return {
      title: 'Add an attribute', tall: true,
      body: `<input class="field" id="add-q" data-i="addQuery" value="${esc(q)}" placeholder="e.g. intellectual honesty" autocomplete="off" data-enter="addCustom">
        ${s.ui.addWarn ? `<div class="flag" style="margin-top:12px">${ic('alert')}<div><b>“${esc(q)}” reads like an experience, not an attribute.</b> Attributes are properties of the person. Add it as a must-have instead?<div class="chips" style="margin-top:8px"><button class="chip on" data-a="customToReq">Add as must-have</button><button class="chip" data-a="addCustomForce">Keep as attribute</button></div></div></div>` : ''}
        <div class="sec">${q ? 'Matches' : 'From the library'}</div>
        ${items.map(l => `<button class="lib-item" data-a="pickLib" data-id="${l.id}"><div style="flex:1">${esc(l.name)}<small>${esc(l.def)}</small></div>${ic('plus', 'sm')}</button>`).join('') || '<p class="small muted">No library matches.</p>'}
        ${q && !exact ? `<button class="lib-item" data-a="addCustom"><div style="flex:1">Add “${esc(q)}” as your own<small>Pathline drafts the definition, why and evidence for you to edit.</small></div>${ic('arrowR', 'sm')}</button>` : ''}`
    };
  };
  A.pickLib = d => PL.startPlace(d.id);
  A.addCustom = () => {
    const q = S().ui.addQuery.trim();
    if (!q) return;
    if (D.EXPERIENCE_WORDS.test(q)) { S().ui.addWarn = true; return; }
    A.addCustomForce();
  };
  A.addCustomForce = () => {
    const q = S().ui.addQuery.trim();
    const id = 'x' + PL.hash(q);
    PL.customAttrs = PL.customAttrs || {};
    const name = q.charAt(0).toUpperCase() + q.slice(1);
    PL.startPlace(id, { id, name, def: `Draft: shows ${q.toLowerCase()} consistently, in how they work and in what they’ve shipped.`, why: `You added this. Pathline will look for evidence of ${q.toLowerCase()} in their work history.`, strong: [`Concrete examples of ${q.toLowerCase()} in past roles`, 'References mention it unprompted'], weak: ['Claims it without examples'], suggested: true });
  };
  A.customToReq = () => {
    const q = S().ui.addQuery.trim();
    S().reqs.custom.push({ id: 'r' + Date.now(), type: 'Experience', label: q, why: '', key: /b2b/i.test(q) ? 'b2b' : '' });
    PL.S.sheet = null;
    PL.toast(`Added “${esc(q)}” to must-haves`);
  };
  PL.startPlace = (id, custom) => {
    const s = S();
    const obj = custom || libAttr(id);
    const rec = id === 'hon';
    s.ui.placeRank = rec ? D.RECOMMENDED.suggestRank : Math.min(s.attrs.length + 1, 6);
    s.ui.pending = obj;
    PL.openSheet('place', { id });
  };
  SHEETS.place = () => {
    const s = S(), obj = s.ui.pending, rec = obj.id === 'hon';
    const list = s.attrs.slice();
    const r = Math.max(1, Math.min(s.ui.placeRank, list.length + 1));
    list.splice(r - 1, 0, Object.assign({}, obj, { _new: true }));
    const sugg = rec ? D.RECOMMENDED.suggestRank : Math.min(s.attrs.length + 1, 6);
    const why = rec ? D.RECOMMENDED.suggestWhy : 'Added by you, so it starts below the attributes drafted from your JD. Move it up if it matters more.';
    const ov = rec && s.attrs.some(a => a.id === 'rig');
    return {
      title: `Add ${esc(obj.name)}`, sub: 'Where does it rank?',
      body: `<div class="card" style="background:var(--accent-soft);border-color:var(--accent-soft-2)"><div class="row" style="align-items:flex-start">${ic('spark')}<div style="font-size:13.5px;line-height:1.45"><b>Suggested: #${sugg}</b>${rec ? ', above Empirical rigor' : ''}.<br>${esc(why)}</div></div></div>
        <div class="card" style="margin-top:10px"><div class="small muted" style="margin-bottom:6px">Drafted for you <span class="sugg">✦</span></div><div style="font-size:14px;line-height:1.45">${esc(obj.def)}</div><div class="small muted" style="margin-top:6px"><b>Why:</b> ${esc(obj.why)}</div><div class="small muted" style="margin-top:6px">Edit anytime from the list with ✎.</div></div>
        <div class="sec">Preview</div>
        <div class="group">${list.map((a, i) => (i === 5 ? `<div class="also-div" style="margin:8px 0">Also assessed</div>` : '') + `<div class="li" style="${a._new ? 'background:var(--accent-soft);margin:0 -14px;padding-left:14px;padding-right:14px' : ''}"><span class="attr-rank" style="${i >= 5 ? 'background:var(--paper);color:var(--muted);border:1px solid var(--line)' : ''}">${i + 1}</span><div class="b"><div class="t1">${esc(a.name)}</div></div>${a._new ? `<span class="attr-arrows"><button class="icon-btn" data-a="placeMove" data-d="-1" ${r === 1 ? 'disabled' : ''}>${ic('up', 'sm')}</button><button class="icon-btn" data-a="placeMove" data-d="1" ${r === list.length ? 'disabled' : ''}>${ic('down', 'sm')}</button></span>` : ''}</div>`).join('')}</div>
        ${ov ? `<div class="flag" style="margin-top:12px">${ic('alert')}<div><b>Overlaps with Empirical rigor.</b> ${esc(D.RECOMMENDED.overlapWhy)} Two attributes measuring the same thing get double weight.<div class="chips" style="margin-top:8px"><button class="chip on" data-a="noop">Keep both</button><button class="chip" data-a="mergeHon">Merge into Empirical rigor</button></div></div></div>` : ''}`,
      foot: `<button class="btn btn-primary" data-a="placeConfirm">Place at #${r}${r > 5 ? ' (also assessed)' : ''}</button>`
    };
  };
  A.placeMove = d => { const s = S(); s.ui.placeRank = Math.max(1, Math.min(s.attrs.length + 1, s.ui.placeRank + Number(d.d))); };
  A.placeConfirm = () => {
    const s = S(), obj = s.ui.pending;
    const r = Math.max(1, Math.min(s.ui.placeRank, s.attrs.length + 1));
    s.attrs.splice(r - 1, 0, obj);
    s.newAttrId = obj.id;
    PL.S.sheet = null;
    const dropped = r <= 5 && s.attrs.length > 5 ? s.attrs[5] : null;
    PL.toast(`${esc(obj.name)} added at #${r}${dropped ? `. ${esc(dropped.name)} is now “also assessed”` : ''}`);
  };
  A.mergeHon = () => {
    const rig = PL.attr('rig');
    if (rig) { rig.name = 'Empirical rigor & honesty'; rig.def = 'Judges ideas, including their own, by whether they measurably work, and says so when they don’t.'; rig.strong = rig.strong.concat(D.RECOMMENDED.strong.slice(0, 1)); rig.yourWords = true; }
    PL.S.sheet = null;
    PL.toast('Merged into Empirical rigor');
  };

  /* =========================================================
     3 · Requirements
     ========================================================= */
  PL.BODY.requirements = (mode, hl) => {
    const s = S(), r = s.reqs, remote = s.jd.work === 'remote';
    const row = (k, v, small, src) => `<div class="req" data-a="openReq" data-id="${k}"><div class="v">${v}${small ? `<small>${small}</small>` : ''}</div>${src ? `<span class="pill">${src}</span>` : ''}<span class="chev">${ic('chev', 'sm')}</span></div>`;
    const custom = type => r.custom.filter(c => c.type === type).map(c => row(c.id, esc(c.label), c.why ? esc(c.why) : 'Added by you', 'Yours')).join('');
    const g = (key, title, rows) => rows ? `<div class="sec">${title}</div><div class="group ${hl === key ? 'hl' : ''}">${rows}</div>` : '';
    return `${mode === 'screen' ? `<p class="lede" style="margin-top:4px">Must-haves from your JD, as written. Tap to see the original wording or adjust.</p>` : ''}
      ${g('exp', 'Experience', row('exp', `${esc(r.role)}, ${r.minYears}+ years`, 'Shipping software products') + custom('Experience'))}
      ${g('skills', 'Skills', row('metrics', 'Defining metrics / data analysis', `Level: ${esc(r.metricsLevel.toLowerCase())}`) + row('ai', 'Generative AI / prompting', r.aiEither ? 'Experience or strong interest' : 'Experience required') + custom('Skill'))}
      ${g('loc', 'Location', row('loc', remote ? 'Remote (US)' : `${esc(r.office)}, in office ${r.days} days/wk`, remote ? 'From your answer on the import screen' : 'From “What we offer”') + custom('Location'))}
      ${custom('Work auth') || custom('Other') ? g('other', 'Other', custom('Work auth') + custom('Other')) : ''}
      <div class="sec">Not in your JD</div>
      <div class="group ${hl === 'loc' ? 'hl' : ''}">
        <div class="nij"><div class="q">Will you sponsor visas?</div><div class="chips">${[['yes', 'Yes'], ['no', 'No'], ['case', 'Case by case']].map(([v, l]) => PL.chip(l, r.visa === v, 'setVisa', `data-v="${v}"`)).join('')}</div></div>
        ${remote ? '' : `<div class="nij"><div class="q">Open to relocation?</div><div class="chips">${[['yes', 'Yes'], ['no', 'No']].map(([v, l]) => PL.chip(l, r.relocation === v, 'setReloc', `data-v="${v}"`)).join('')}</div>${r.relocation === 'yes' ? '<div class="small muted">You offer a $1,000/month housing stipend, so we’ll say so.</div>' : ''}</div>`}
      </div>
      <button class="btn btn-sm btn-secondary" style="margin-top:14px" data-a="openAddReq">${ic('plus', 'sm')}Add requirement</button>`;
  };
  SCREENS.requirements = () => ({
    title: 'Requirements', back: 'attributes',
    body: PL.BODY.requirements('screen'),
    footer: `<button class="btn btn-primary" data-a="go" data-r="see">Looks right ${ic('arrowR')}</button>`
  });
  A.setVisa = d => { S().reqs.visa = d.v; };
  A.setReloc = d => { S().reqs.relocation = d.v; };
  A.openReq = d => PL.openSheet('req', { id: d.id });
  SHEETS.req = sh => {
    const s = S(), r = s.reqs, k = sh.id;
    const quote = (q, src) => `<div class="quote">“${esc(q)}”</div><div class="q-src">${ic('lock', 'sm')}${src || 'From your JD'} · wording kept as written</div>`;
    let title = '', body = '';
    if (k === 'exp') {
      title = 'Experience';
      body = quote(D.REQ_QUOTES.exp) + `<div class="sec">How we’ll check it</div><div class="group">
        <div class="fld-row"><span class="k">Role</span><div class="v"><select class="field inline" data-c="reqRole">${PL.options(['Product manager', 'Product manager or APM'], r.role)}</select></div></div>
        <div class="fld-row"><span class="k">Minimum</span><div class="v">${PL.stepper(r.minYears + ' yrs', 'reqYears')}</div></div>
        <div class="fld-row"><span class="k">Counts if</span><div class="v">Shipped software products</div></div></div>
        <p class="small muted" style="margin:10px 2px">Checked against titles and dates, launched products and company profiles.</p>`;
    } else if (k === 'metrics') {
      title = 'Skill';
      body = quote(D.REQ_QUOTES.metrics) + `<div class="sec">How we’ll check it</div><div class="card"><div class="small muted" style="margin-bottom:8px">Level</div><div class="chips">${['Familiar', 'Uses daily', 'Expert'].map(l => PL.chip(l, r.metricsLevel === l, 'reqMetrics', `data-v="${l}"`)).join('')}</div></div>`;
    } else if (k === 'ai') {
      title = 'Skill';
      body = quote(D.REQ_QUOTES.ai) + `<div class="sec">How we’ll check it</div><div class="card"><div class="chips">${PL.chip('Experience or strong interest', r.aiEither, 'reqAi', 'data-v="1"')}${PL.chip('Experience required', !r.aiEither, 'reqAi', 'data-v="0"')}</div><p class="small muted" style="margin:10px 0 0">Your JD says “or strong interest”, so we keep it that flexible by default. Interest rarely shows on a profile, so we’ll usually ask.</p></div>`;
    } else if (k === 'loc') {
      title = 'Location';
      body = (s.jd.work === 'remote' ? `<div class="note">${ic('info')}<div>You chose remote on the import screen. <button class="text-btn" data-a="setWork" data-v="hybrid">Switch to hybrid</button></div></div>` : quote(D.REQ_QUOTES.loc, 'From “What we offer”') + `<div class="sec">How we’ll check it</div><div class="group">
        <div class="fld-row"><span class="k">Office</span><div class="v"><select class="field inline" data-c="reqOffice">${PL.options(['Palo Alto'], r.office)}</select></div></div>
        <div class="fld-row"><span class="k">In office</span><div class="v">${PL.stepper(r.days + ' days', 'reqDays')}</div></div>
        <div class="fld-row"><span class="k">Relocation</span><div class="v chips">${[['yes', 'OK'], ['no', 'Local only']].map(([v, l]) => PL.chip(l, r.relocation === v, 'setReloc', `data-v="${v}"`)).join('')}</div></div></div>`);
    } else {
      const c = r.custom.find(x => x.id === k);
      title = c ? esc(c.type) : 'Requirement';
      body = c ? `<div class="card"><div style="font-weight:600">${esc(c.label)}</div><div class="small muted" style="margin-top:4px">${c.why ? esc(c.why) : 'Added by you'}</div></div><button class="btn btn-sm btn-ghost btn-danger-ghost" style="margin-top:12px" data-a="removeReq" data-id="${c.id}">Remove requirement</button>` : '';
    }
    return { title, sub: 'Must-have', body, foot: `<button class="btn btn-primary" data-a="closeSheet">Done</button>` };
  };
  C.reqRole = v => { S().reqs.role = v; };
  A.reqYears = d => { const r = S().reqs; r.minYears = Math.max(2, Math.min(10, r.minYears + Number(d.d))); };
  A.reqDays = d => { const r = S().reqs; r.days = Math.max(1, Math.min(5, r.days + Number(d.d))); };
  A.reqMetrics = d => { S().reqs.metricsLevel = d.v; };
  A.reqAi = d => { S().reqs.aiEither = d.v === '1'; };
  C.reqOffice = v => { S().reqs.office = v; };
  A.removeReq = d => { const r = S().reqs; r.custom = r.custom.filter(x => x.id !== d.id); PL.S.sheet = null; PL.toast('Requirement removed'); };
  A.openAddReq = () => { S().ui.reqType = 'Skill'; PL.openSheet('addReq'); };
  SHEETS.addReq = () => {
    const s = S(), t = s.ui.reqType;
    const ph = { Experience: 'e.g. B2B SaaS product experience', Skill: 'e.g. SQL', Location: 'e.g. US Pacific time zone', 'Work auth': 'e.g. US work authorization', Other: 'e.g. Spanish, professional level' }[t];
    return {
      title: 'Add a requirement', sub: 'Must-have',
      body: `<div class="chips">${['Experience', 'Skill', 'Location', 'Work auth', 'Other'].map(x => PL.chip(x, t === x, 'reqType', `data-v="${x}"`)).join('')}</div>
        <label class="field-label" style="margin-top:14px">${t}</label><input class="field" id="rq-label" placeholder="${ph}">
        ${t === 'Skill' ? `<label class="field-label" style="margin-top:12px">Level</label><div class="chips">${['Familiar', 'Uses daily', 'Expert'].map(l => PL.chip(l, s.ui.reqLevel === l, 'reqLevel', `data-v="${l}"`)).join('')}</div>` : ''}
        <label class="field-label" style="margin-top:12px">Why must they have it on day 1?</label><textarea class="field" id="rq-why" rows="3" placeholder="Shown to candidates in the role room"></textarea>
        <div class="note" style="margin-top:12px">${ic('info')}<div>Each must-have narrows your pool. You’ll see the impact on the Review & pool screen.</div></div>`,
      foot: `<div class="row"><button class="btn btn-secondary" data-a="closeSheet">Cancel</button><button class="btn btn-primary" data-a="addReq">Add</button></div>`
    };
  };
  A.reqType = d => { S().ui.reqType = d.v; };
  A.reqLevel = d => { S().ui.reqLevel = d.v; };
  A.addReq = () => {
    const l = document.getElementById('rq-label'), w = document.getElementById('rq-why');
    if (!l || !l.value.trim()) { if (l) { l.classList.add('need'); l.focus(); } return; }
    const label = l.value.trim() + (S().ui.reqType === 'Skill' ? ` (${S().ui.reqLevel.toLowerCase()})` : '');
    S().reqs.custom.push({ id: 'r' + Date.now(), type: S().ui.reqType, label, why: w ? w.value.trim() : '', key: /b2b/i.test(label) ? 'b2b' : '' });
    PL.S.sheet = null;
    PL.toast(`Added “${esc(label)}”`);
  };
  PL.FILL.requirements = () => { const r = S().reqs; if (!r.visa) r.visa = 'case'; if (!r.relocation) r.relocation = 'yes'; };

  /* =========================================================
     4 · What candidates will see
     ========================================================= */
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
  const W = (mail) => `<span class="when ${mail ? 'mail' : ''}" title="${mail ? 'In outreach emails' : 'After they reply'}">${ic(mail ? 'mail' : 'reply')}</span>`;
  const need = on => on ? `<span class="need">${ic('alert', 'sm')}needed</span>` : '';
  PL.BODY.see = (mode, hl) => {
    const s = S().see;
    const total = PL.totalHours();
    return `${mode === 'screen' ? `<p class="lede" style="margin-top:4px">Needed before we build your shortlist. Prefilled from your JD where possible.</p>` : ''}
      <div class="sec">Role</div>
      <div class="group"><div class="fld-row"><span class="k">Title</span><div class="v"><select class="field inline ${s.title ? '' : 'need'}" data-c="seeTitle">${PL.options(['PM, AI', 'Senior PM, AI'], s.title, 'Choose')}</select></div>${W(true)}</div></div>

      <div class="sec">Why now ${need(!s.whyType || !s.whyLine.trim())}<span class="tag">${W(true)}</span></div>
      <div class="card ${hl === 'why' ? 'hl' : ''}"><div class="chips">${['New role', 'Backfill', 'Team growing'].map(t => PL.chip(t, s.whyType === t, 'seeWhyType', `data-v="${t}"`)).join('')}</div>
        <textarea class="field ${s.whyLine.trim() ? '' : 'need'}" style="margin-top:10px" rows="2" data-i="seeWhyLine" placeholder="In a line: e.g. our first dedicated AI PM; the founders have owned AI until now">${esc(s.whyLine)}</textarea></div>

      <div class="sec">Team & scope ${need(!s.engineers)}<span class="tag">${W(false)}</span></div>
      <div class="group ${hl === 'team' ? 'hl' : ''}">
        <div class="fld-row"><span class="k">Reports to</span><div class="v"><input class="field" style="padding:8px 10px;font-size:14px" data-i="seeReportsTo" value="${esc(s.reportsTo)}" placeholder="e.g. Farah (CTO)"></div></div>
        <div class="fld-row"><span class="k">Engineers</span><div class="v"><select class="field inline ${s.engineers ? '' : 'need'}" data-c="seeEngineers">${PL.options(Array.from({ length: 40 }, (_, i) => String(i + 1)), s.engineers, '—')}</select></div></div>
        <div class="fld-row"><span class="k">Other PMs</span><div class="v"><select class="field inline" data-c="seeOtherPMs">${PL.options(['0', '1', '2', '3', '4', '5'], s.otherPMs, '—')}</select></div></div>
        <div class="fld-row"><span class="k">Direct reports</span><div class="v"><select class="field inline" data-c="seeReports">${PL.options(['0', '1', '2', '3', '4', '5'], s.directReports)}</select></div></div>
      </div>

      <div class="sec">Comp</div>
      <div class="group ${hl === 'comp' ? 'hl' : ''}">
        <div class="fld-row"><span class="k">Base</span><div class="v" style="flex-wrap:nowrap"><select class="field inline" data-c="seeBaseMin" aria-label="Base minimum">${PL.options(baseOpts(100, s.baseMax - 5), s.baseMin)}</select><span class="muted">–</span><select class="field inline" data-c="seeBaseMax" aria-label="Base maximum">${PL.options(baseOpts(s.baseMin + 5, 350), s.baseMax)}</select></div>${W(true)}</div>
        <div class="fld-row"><span class="k">Equity</span><div class="v"><select class="field inline ${s.equity ? '' : 'need'}" data-c="seeEquity">${PL.options(['0.05–0.1%', '0.1–0.2%', '0.2–0.35%', '0.35–0.5%'], s.equity, 'Range needed')}</select></div>${W(false)}</div>
        <div class="fld-row"><span class="k">Vesting</span><div class="v"><select class="field inline" data-c="seeVesting">${PL.options(['4 yr, 1 yr cliff', '4 yr, no cliff', '3 yr, 1 yr cliff'], s.vesting)}</select></div>${W(false)}</div>
        <div class="fld-row"><span class="k">Bonus</span><div class="v"><select class="field inline ${s.bonus ? '' : 'need'}" data-c="seeBonus">${PL.options(['None', '5% target', '10% target', '15% target'], s.bonus, 'Target needed')}</select></div>${W(false)}</div>
      </div>
      <p class="small muted" style="margin:6px 2px 0">Base range from your JD. “Equity: yes” isn’t enough for senior candidates, so we ask for a range.</p>

      <div class="sec">Timing</div>
      <div class="group ${hl === 'timing' ? 'hl' : ''}"><div class="fld-row"><span class="k">Target start</span><div class="v"><select class="field inline" data-c="seeStart">${PL.options(['Nov 2026', 'Dec 2026', 'Jan 2027', 'Feb 2027'], s.start)}</select></div>${W(false)}</div></div>

      <div class="sec">Hiring process<span class="tag">${W(true)}</span></div>
      <div class="group">
        ${s.stages.map((st, i) => `<div class="stage-row"><span class="idx">${i + 1}</span><input class="field" data-i="stageName" data-idx="${i}" value="${esc(st.name)}" aria-label="Stage name"><select class="field" data-c="stageH" data-idx="${i}">${PL.options([1, 2, 3, 4, 5, 6].map(h => ({ v: h, l: h + 'h' })), st.h)}</select><span class="attr-arrows"><button class="icon-btn" data-a="stageMove" data-idx="${i}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="Move up">${ic('up', 'sm')}</button><button class="icon-btn" data-a="stageMove" data-idx="${i}" data-d="1" ${i === s.stages.length - 1 ? 'disabled' : ''} aria-label="Move down">${ic('down', 'sm')}</button></span><button class="icon-btn" data-a="stageRemove" data-idx="${i}" ${s.stages.length <= 1 ? 'disabled' : ''} aria-label="Remove stage">${ic('x', 'sm')}</button></div>`).join('')}
        <div class="row" style="padding:10px 0"><button class="text-btn" data-a="stageAdd">${ic('plus', 'sm')}Add stage</button><span class="spacer"></span><span class="small muted">Total: ~${total}h of their time</span></div>
      </div>

      <div class="sec">Our commitment<span class="tag">${W(true)}</span></div>
      <div class="card ${hl === 'commit' ? 'hl' : ''}"><div style="font-size:14px;margin-bottom:8px">We reply within</div><div class="chips">${[24, 48, 72].map(h => PL.chip(h + 'h', s.commitment === h, 'seeCommit', `data-v="${h}"`)).join('')}</div><div class="small muted" style="margin-top:8px">at every stage. Tracked, and shown on your record with candidates.</div></div>

      <div class="sec">People</div>
      <div class="group"><div class="fld-row"><span class="k">Hiring manager</span><div class="v"><select class="field inline ${s.hm ? '' : 'need'}" data-c="seeHm">${PL.options(D.HMS, s.hm, 'Select')}</select></div>${W(true)}</div><div class="small muted" style="padding:0 0 10px">Sends the outreach emails.</div></div>

      <div class="sec">Company <span class="tag">from JD & your emails</span><span class="tag" style="margin-left:6px">${W(false)}</span></div>
      <div class="group">${D.FACTS.slice(0, 3).map(f => `<div class="li"><div class="b" style="font-size:13.5px">${esc(f)}</div></div>`).join('')}</div>

      <div class="legend"><span>${W(true)} In outreach emails</span><span>${W(false)} After they reply</span></div>
      ${mode === 'screen' && PL.seeMissing().length ? `<button class="linkbtn" style="margin-top:14px" data-a="demoSee">Fill remaining with demo values</button>` : ''}`;
  };
  SCREENS.see = () => {
    const m = PL.seeMissing();
    return {
      title: 'What candidates will see', back: 'requirements',
      body: PL.BODY.see('screen'),
      footer: `<button class="btn btn-primary" data-a="go" data-r="review" ${m.length ? 'disabled' : ''}>${m.length ? `${m.length} needed: ${m.join(', ')}` : `Review & pool ${ic('arrowR')}`}</button>`
    };
  };
  C.seeTitle = v => { S().see.title = v; };
  A.seeWhyType = d => { S().see.whyType = d.v; };
  I.seeWhyLine = (v, d, el) => { S().see.whyLine = v; el.classList.toggle('need', !v.trim()); PL.liveFooter(); };
  I.seeReportsTo = v => { S().see.reportsTo = v; };
  C.seeEngineers = v => { S().see.engineers = v; };
  C.seeOtherPMs = v => { S().see.otherPMs = v; };
  C.seeReports = v => { S().see.directReports = v; };
  function baseOpts(lo, hi) { const o = []; for (let v = lo; v <= hi; v += 5) o.push({ v, l: `$${v}k` }); return o; }
  C.seeBaseMin = v => { S().see.baseMin = Number(v); };
  C.seeBaseMax = v => { S().see.baseMax = Number(v); };
  C.seeEquity = v => { S().see.equity = v; };
  C.seeVesting = v => { S().see.vesting = v; };
  C.seeBonus = v => { S().see.bonus = v; };
  C.seeStart = v => { S().see.start = v; };
  C.seeHm = v => { S().see.hm = v; };
  A.seeCommit = d => { S().see.commitment = Number(d.v); };
  I.stageName = (v, d) => { S().see.stages[Number(d.idx)].name = v; };
  C.stageH = (v, d) => { S().see.stages[Number(d.idx)].h = Number(v); };
  A.stageMove = d => { const st = S().see.stages, i = Number(d.idx), j = i + Number(d.d); if (j < 0 || j >= st.length) return; [st[i], st[j]] = [st[j], st[i]]; };
  A.stageRemove = d => { const st = S().see.stages; if (st.length > 1) st.splice(Number(d.idx), 1); };
  A.stageAdd = () => { S().see.stages.push({ name: 'New stage', h: 1 }); };
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
     5 · Review & pool
     ========================================================= */
  const LAYERS = [
    { k: 'exp', lbl: () => `PM, ${S().reqs.minYears}+ yrs`, screen: 'requirements', hl: 'exp' },
    { k: 'skills', lbl: () => '+ skills', screen: 'requirements', hl: 'skills' },
    { k: 'loc', lbl: () => '+ location', screen: 'requirements', hl: 'loc' },
    { k: 'attr', lbl: () => 'Strong on your top attributes', screen: 'attributes' },
    { k: 'move', lbl: () => 'Likely to move', screen: null },
    { k: 'base', lbl: () => 'Base range fits', screen: 'see', hl: 'comp' }
  ];
  PL.LAYERS = LAYERS;
  const barW = n => Math.max(3, Math.min(100, (Math.log10(Math.max(n, 1)) - .8) / (Math.log10(60000) - .8) * 100));
  PL.funnelHTML = () => {
    const p = PL.pool();
    return LAYERS.map(L => `<div class="funnel-row" data-a="openLayer" data-k="${L.k}"><span class="lbl">${esc(L.lbl())}</span><span class="bar"><i style="width:${barW(p[L.k])}%"></i></span><span class="n">${PL.fmtN(p[L.k])}</span><span style="color:var(--faint)">${ic('chev', 'sm')}</span></div>`).join('') +
      `<div class="funnel-row final"><span class="lbl"><b>Shortlist</b></span><span class="bar"><i style="width:${barW(PL.target())}%"></i></span><span class="n">top ${PL.target()}</span><span></span></div>`;
  };
  PL.verdictHTML = () => {
    const v = PL.verdict(), p = PL.pool(), t = PL.target(), start = S().see.start.split(' ')[0];
    const txt = { healthy: `${PL.fmtN(p.base)} people are likely to fit and be reachable: plenty for ${t} outreaches.`, tight: `${PL.fmtN(p.base)} likely fits for ${t} recommended outreaches. Workable, with little slack.`, thin: `Only ${PL.fmtN(p.base)} likely fits for ${t} recommended outreaches. Consider loosening a layer.` }[v];
    return `<div class="verdict ${v}"><div><b>${v} for a ${start} start</b><div style="margin-top:3px">${txt}</div></div></div>`;
  };
  SCREENS.review = () => {
    const s = S(), r = s.reqs, see = s.see;
    const musts = [`PM ${r.minYears}+ yrs`, 'Metrics', 'Gen AI', s.jd.work === 'remote' ? 'Remote (US)' : `${r.office} ${r.days}d/wk`, s.jd.work !== 'remote' && r.relocation ? (r.relocation === 'yes' ? 'relocation OK' : 'local only') : '', r.visa ? `visa: ${{ yes: 'sponsor', no: 'no sponsorship', case: 'case by case' }[r.visa]}` : ''].concat(r.custom.map(c => c.label)).filter(Boolean);
    const p = PL.pool();
    const ratios = [['skills', p.skills / p.exp], ['loc', p.loc / p.skills], ['attr', p.attr / p.loc], ['move', p.move / p.attr], ['base', p.base / p.move]].sort((a, b) => a[1] - b[1]);
    const big = LAYERS.find(L => L.k === ratios[0][0]);
    return {
      title: 'Review & pool', back: 'see',
      body: `<div class="card" style="padding:4px 14px">
          <div class="sum"><div class="b"><div class="t">Attributes (ranked)</div>${s.attrs.slice(0, 5).map((a, i) => `${i + 1} ${esc(a.name)}`).join(' · ')}</div><button class="text-btn" data-a="openScreenSheet" data-s="attributes">Edit ${ic('chev', 'sm')}</button></div>
          <div class="sum"><div class="b"><div class="t">Must-haves</div>${musts.map(esc).join(' · ')}</div><button class="text-btn" data-a="openScreenSheet" data-s="requirements">Edit ${ic('chev', 'sm')}</button></div>
          <div class="sum"><div class="b"><div class="t">Candidates see</div>$${see.baseMin}–${see.baseMax}k · ${esc(see.equity || '—')} · start ${esc(see.start.split(' ')[0])} · ${see.commitment}h replies</div><button class="text-btn" data-a="openScreenSheet" data-s="see">Edit ${ic('chev', 'sm')}</button></div>
        </div>
        <div class="sec">Your talent pool <span class="tag">approx.</span></div>
        <div class="card" style="padding:4px 14px">${PL.funnelHTML()}</div>
        ${PL.verdictHTML()}
        <p class="small muted" style="margin:10px 2px 0">Biggest cut: <b>${esc(big.lbl())}</b>${big.k === 'attr' ? ` (#1 ${esc(s.attrs[0].name)})` : ''}. Tap any layer to adjust what’s behind it.</p>`,
      footer: `<button class="btn btn-primary" data-a="buildShortlist">Build shortlist of ${PL.target()} ${ic('arrowR')}</button>`
    };
  };
  A.buildShortlist = () => PL.go('shortlist');

  /* Screen-as-sheet (funnel layers, summary edits, criteria chips) */
  const SCREEN_TITLES = { attributes: 'Attributes', requirements: 'Must-haves', see: 'What candidates will see' };
  A.openLayer = d => {
    const L = LAYERS.find(x => x.k === d.k);
    PL.openSheet('screenSheet', { screen: L.screen || 'move', layer: L.k, hl: L.hl, snap: PL.pool()[L.k] });
  };
  A.openScreenSheet = d => {
    const snap = { vis: PL.visible().map(c => c.id), attrs: JSON.parse(JSON.stringify(S().attrs)), reqs: JSON.parse(JSON.stringify(S().reqs)), see: JSON.parse(JSON.stringify(S().see)) };
    PL.openSheet('screenSheet', { screen: d.s, from: S().route, crit: snap, hl: d.hl });
  };
  SHEETS.screenSheet = sh => {
    const L = sh.layer ? LAYERS.find(x => x.k === sh.layer) : null;
    let delta = '';
    if (L) {
      const now = PL.pool()[L.k], was = sh.snap;
      const dir = Math.round(now) === Math.round(was) ? '' : (now > was ? `<span class="up">▲</span>` : `<span class="down">▼</span>`);
      delta = `<div class="delta"><span>${esc(L.lbl())}</span><b>${PL.fmtN(was)} → ${PL.fmtN(now)}</b>${dir}<span class="live">live</span></div>`;
    }
    if (sh.screen === 'move') {
      return {
        title: 'Likely to move', sub: 'An estimate, not a control',
        body: delta + `<div class="note">${ic('info')}<div>Estimated from public signals like tenure, career stage and recent job changes. The specific signals are never shown or used in outreach.</div></div>
          <p style="font-size:14px;line-height:1.5;margin:14px 2px">You can’t change who wants to move, but a later start date gives more people time to become reachable, and gives Pathline’s network time to grow.</p>
          <div class="group ${'hl'}"><div class="fld-row"><span class="k">Target start</span><div class="v"><select class="field inline" data-c="seeStart">${PL.options(['Nov 2026', 'Dec 2026', 'Jan 2027', 'Feb 2027'], S().see.start)}</select></div></div></div>
          <p class="small muted" style="margin:8px 2px">Changing the start date also changes the recommended number of outreaches (${PL.target()} now).</p>`,
        foot: `<button class="btn btn-primary" data-a="closeSheet">Done</button>`
      };
    }
    const title = L ? esc(L.lbl()) : SCREEN_TITLES[sh.screen];
    return { title, sub: L ? `Controlled by ${SCREEN_TITLES[sh.screen]}` : '', tall: true, body: delta + PL.BODY[sh.screen]('sheet', sh.hl), foot: `<button class="btn btn-primary" data-a="closeSheet">Done</button>` };
  };
  PL.SHEET_CLOSE.screenSheet = sh => {
    if (sh.from !== 'shortlist' || !sh.crit) return;
    const before = sh.crit.vis, after = PL.visible().map(c => c.id);
    const added = after.filter(x => !before.includes(x)).length, dropped = before.filter(x => !after.includes(x)).length;
    if (added || dropped) setTimeout(() => { PL.toast(`Criteria updated · ${added} new · ${dropped} dropped · approved kept`, 'criteria', sh.crit); PL.render(); }, 0);
  };
  PL.UNDO.criteria = snap => { const s = S(); s.attrs = snap.attrs; s.reqs = snap.reqs; s.see = snap.see; };

  /* =========================================================
     6 · Shortlist
     ========================================================= */
  function candCard(c) {
    const s = S(), dec = s.sl.dec[c.id], exc = PL.attr(c.exc) || D.ATTRS.find(a => a.id === c.exc);
    const fails = PL.fails(c);
    const musts = PL.musts(c).map(m => `<span class="must"><span class="dot ${m.d}"></span>${esc(m.t)}</span>`).join('');
    let acts;
    if (dec === 'approved') acts = `<div class="status-line">${ic('check')}Pre-candidate<span class="spacer"></span><button class="text-btn" data-a="undoDec" data-id="${c.id}">Undo</button></div>`;
    else if (dec === 'later') acts = `<div class="status-line" style="color:var(--muted)">${ic('clock')}Later<span class="spacer"></span><button class="text-btn" data-a="undoDec" data-id="${c.id}">Undo</button></div>`;
    else acts = `<div class="cand-acts"><button class="btn btn-secondary" data-a="openPass" data-id="${c.id}">Pass</button><button class="btn btn-secondary" data-a="later" data-id="${c.id}">Later</button><button class="btn btn-primary" data-a="approve" data-id="${c.id}">Approve</button></div>`;
    return `<div class="cand ${dec || ''}">
      <div class="cand-top" data-a="openCand" data-id="${c.id}">${PL.avatar(c)}<div style="flex:1;min-width:0"><div class="cand-name">${esc(c.name)} · ${esc(c.title)}</div><div class="cand-sub">${esc(c.co)} · ${esc(c.loc)}</div></div><span style="color:var(--faint)">${ic('chev', 'sm')}</span></div>
      <div class="exc">${ic('star')}Exceptional at ${esc(exc ? exc.name : c.exc)}</div>
      <div class="why"><b>Why a great fit:</b> ${esc(c.why)}</div>
      <div class="musts">${musts}</div>
      <div class="cand-meta"><span>Likely to move: <b>${c.move}</b></span>${c.warm ? `<span class="warm">${ic('users', 'sm')}${esc(c.warm)}</span>` : ''}</div>
      ${dec === 'approved' && fails.length ? `<div class="flagline">${ic('alert', 'sm')}No longer matches: ${esc(fails.join(', '))}</div>` : ''}
      ${acts}</div>`;
  }
  function disagreements() {
    const dec = S().sl.dec, ids = Object.keys(dec);
    const ap = ids.filter(i => dec[i] === 'approved'), pa = ids.filter(i => dec[i] === 'passed');
    const out = [];
    if (ap[1]) out.push({ id: ap[1], you: 'Approved', sam: 'Passed', why: 'Technical depth: prototypes only' });
    if (pa[0]) out.push({ id: pa[0], you: 'Passed', sam: 'Approved', why: 'Strong ownership; worth a chat' });
    else if (ap[3]) out.push({ id: ap[3], you: 'Approved', sam: 'Passed', why: 'Relocation seems unlikely' });
    return out;
  }
  SCREENS.shortlist = () => {
    const s = S(), vis = PL.visible(), dec = s.sl.dec, t = PL.target();
    const approvedN = PL.approved().length;
    const undecided = vis.filter(c => !dec[c.id]);
    const passedIds = Object.keys(dec).filter(i => dec[i] === 'passed');
    const noB2B = passedIds.filter(i => !PL.cand(i).b2b).length;
    const hasB2B = s.reqs.custom.some(c => c.key === 'b2b');
    const decidedN = Object.keys(dec).filter(i => dec[i] !== 'later').length;
    let banners = '';
    if (noB2B >= 3 && !hasB2B && !s.sl.suggDismissed) {
      banners += `<div class="banner">${ic('spark')}<div>You passed ${noB2B} of ${passedIds.length} candidates with no B2B SaaS experience. Make it a must-have? <span style="opacity:.7">Pool −30%</span>
        <div class="acts"><button class="btn-xs btn" data-a="addB2B">Add as must-have</button><button class="btn-xs btn ghost" data-a="openScreenSheet" data-s="requirements">Review requirements</button><button class="btn-xs btn ghost" data-a="dismissSugg">Not now</button></div></div></div>`;
    }
    if (decidedN >= 6 && !s.sl.disDismissed && disagreements().length) {
      banners += `<div class="banner" style="background:#26303A">${ic('users')}<div>Sam (recruiter) reviewed independently. <b>${disagreements().length} disagreements</b> to look at.<div class="acts"><button class="btn-xs btn" data-a="openDis">Review</button><button class="btn-xs btn ghost" data-a="dismissDis">Later</button></div></div></div>`;
    }
    return {
      title: 'Shortlist', back: 'review',
      body: `<div class="crit">
          <button class="chip sm" data-a="openScreenSheet" data-s="attributes">Attributes ${ic('chev')}</button>
          <button class="chip sm" data-a="openScreenSheet" data-s="requirements">Must-haves ${ic('chev')}</button>
          <button class="chip sm" data-a="openScreenSheet" data-s="see" data-hl="comp">Comp & timing ${ic('chev')}</button>
        </div>
        <div class="sl-head">
          <div class="big">Reach out to ~${t} for a ${esc(s.see.start.split(' ')[0])} start</div>
          <div class="small muted" style="margin-top:3px">Outreach this week → first rounds mid-Oct → offer by early Nov · <button class="text-btn" data-a="openWhy">Why ${t}?</button></div>
          ${vis.length < t ? `<div class="flagline">${ic('alert', 'sm')}Only ${vis.length} match your criteria right now. Loosen a must-have to reach ${t}.</div>` : ''}
          <div class="row" style="margin-top:12px"><span class="small" style="font-weight:600">Pre-candidates ${approvedN} of ${t}</span><span class="meter"><i style="width:${Math.min(100, approvedN / t * 100)}%"></i></span></div>
          ${undecided.length ? `<button class="btn btn-sm btn-secondary" style="width:100%;margin-top:10px" data-a="openApproveAll">${ic('check', 'sm')}Approve all ${undecided.length} remaining</button>` : ''}
          <div class="small muted" style="margin-top:10px">Reviewing as Farah · Sam (recruiter) reviews separately</div>
        </div>
        ${banners}
        <div style="margin-top:12px">${vis.map(candCard).join('')}</div>
        <p class="small muted" style="text-align:center;margin:14px 0 0"><span class="dot" style="display:inline-block;vertical-align:middle"></span> Likely &nbsp; <span class="dot half" style="display:inline-block;vertical-align:middle"></span> Unknown, asked after they reply</p>`,
      footer: `<button class="btn btn-primary" data-a="startOutreachFlow" ${approvedN ? '' : 'disabled'}>Start outreach (${approvedN}) ${ic('arrowR')}</button>${approvedN >= t ? '<div class="hint">Milestone 1 complete: shortlist approved</div>' : ''}`
    };
  };
  A.approve = d => { S().sl.dec[d.id] = 'approved'; };
  A.later = d => { S().sl.dec[d.id] = 'later'; };
  A.undoDec = d => { delete S().sl.dec[d.id]; };
  A.openPass = d => { S().ui.passReasons = []; PL.openSheet('pass', { id: d.id }); };
  SHEETS.pass = sh => {
    const c = PL.cand(sh.id), sel = S().ui.passReasons;
    const reasons = S().attrs.slice(0, 5).map(a => a.name).concat(['Must-have', 'Wrong domain', 'Too senior', 'Other']);
    return {
      title: `Pass on ${esc(c.name)}?`, sub: 'Only Pathline sees why. It helps tune your shortlist.',
      body: `<div class="chips">${reasons.map(r => PL.chip(esc(r), sel.includes(r), 'passReason', `data-v="${esc(r)}"`)).join('')}</div>`,
      foot: `<div class="row"><button class="btn btn-secondary" data-a="closeSheet">Cancel</button><button class="btn btn-primary" data-a="doPass" data-id="${c.id}">Pass</button></div>`
    };
  };
  A.passReason = d => { const r = S().ui.passReasons, i = r.indexOf(d.v); if (i >= 0) r.splice(i, 1); else r.push(d.v); };
  A.doPass = d => { S().sl.dec[d.id] = 'passed'; PL.S.sheet = null; PL.toast(`Passed on ${esc(PL.cand(d.id).name)}. Next best added.`, 'pass', d.id); };
  PL.UNDO.pass = id => { delete S().sl.dec[id]; };
  A.addB2B = () => { S().reqs.custom.push({ id: 'rb2b', type: 'Experience', label: 'B2B SaaS product experience', why: 'Suggested from your passes', key: 'b2b' }); PL.toast('Added “B2B SaaS product experience”. Shortlist re-ranked, approved kept.'); };
  A.dismissSugg = () => { S().sl.suggDismissed = true; };
  A.dismissDis = () => { S().sl.disDismissed = true; };
  A.openDis = () => PL.openSheet('dis');
  SHEETS.dis = () => ({
    title: 'Disagreements with Sam', sub: 'You each reviewed independently',
    body: disagreements().map(x => { const c = PL.cand(x.id); return `<div class="card"><div class="row">${PL.avatar(c, 34)}<div style="flex:1"><div style="font-weight:600">${esc(c.name)}</div><div class="small muted">${esc(c.title)} · ${esc(c.co)}</div></div></div>
      <div class="row" style="margin-top:10px;font-size:13px"><span class="pill ${x.you === 'Approved' ? 'acc' : ''}">You: ${x.you}</span><span class="pill ${x.sam === 'Approved' ? 'acc' : ''}">Sam: ${x.sam}</span></div><div class="small muted" style="margin-top:8px">Sam’s note: “${esc(x.why)}”</div>
      <div class="row" style="margin-top:10px"><button class="btn btn-xs btn-secondary" data-a="keepMine">Keep mine</button><button class="btn btn-xs btn-secondary" data-a="takeSam" data-id="${x.id}" data-v="${x.sam}">Go with Sam</button></div></div>`; }).join(''),
    foot: `<button class="btn btn-primary" data-a="disDone">Done</button>`
  });
  A.keepMine = () => { PL.toast('Kept your decision'); };
  A.takeSam = d => { S().sl.dec[d.id] = d.v === 'Approved' ? 'approved' : 'passed'; PL.toast('Updated to Sam’s decision'); };
  A.disDone = () => { S().sl.disDismissed = true; PL.S.sheet = null; };
  A.openCand = d => PL.openSheet('cand', { id: d.id });
  A.candNav = d => { S().sheet.id = d.id; };
  SHEETS.cand = sh => {
    const s = S(), c = PL.cand(sh.id), vis = PL.visible(), i = vis.findIndex(x => x.id === c.id);
    const prev = vis[i - 1], next = vis[i + 1], dec = s.sl.dec[c.id];
    const blocks = s.attrs.map((a, k) => { const lv = PL.level(c, a.id); return `${k === 5 ? '<div class="also-div" style="margin:10px 0 0">Also assessed</div>' : ''}<div class="ev-block"><div class="hd"><span class="r" style="${k >= 5 ? 'background:var(--paper);color:var(--muted);border:1px solid var(--line)' : ''}">${k + 1}</span>${esc(a.name)}<span class="spacer" style="flex:1"></span><span class="lv ${lv}">${PL.LV_TEXT[lv]}</span></div><ul>${PL.evidence(c, a.id).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`; }).join('');
    return {
      title: esc(c.name), sub: `${esc(c.title)} · ${esc(c.co)} · ${esc(c.loc)}`, tall: true,
      swipePrev: prev ? `candNav:${prev.id}` : '', swipeNext: next ? `candNav:${next.id}` : '',
      body: `<div class="sec" style="margin-top:0">Evidence by attribute</div>${blocks}
        <div class="sec">Must-haves</div><div class="musts">${PL.musts(c).map(m => `<span class="must"><span class="dot ${m.d}"></span>${esc(m.t)}</span>`).join('')}</div>`,
      foot: `<div class="sheet-nav"><button data-a="candNav" data-id="${prev ? prev.id : ''}" ${prev ? '' : 'disabled'}>${ic('back', 'sm')}Prev</button><span>${i + 1} of ${vis.length}</span><button data-a="candNav" data-id="${next ? next.id : ''}" ${next ? '' : 'disabled'}>Next${ic('chev', 'sm')}</button></div>
        ${dec ? `<div class="status-line" style="margin:0">${dec === 'approved' ? ic('check') + 'Pre-candidate' : dec === 'later' ? 'Later' : 'Passed'}<span class="spacer"></span><button class="text-btn" data-a="undoDec" data-id="${c.id}">Undo</button></div>` :
          `<div class="row"><button class="btn btn-secondary btn-sm" style="flex:1" data-a="openPass" data-id="${c.id}">Pass</button><button class="btn btn-secondary btn-sm" style="flex:1" data-a="later" data-id="${c.id}">Later</button><button class="btn btn-primary btn-sm" style="flex:1" data-a="approve" data-id="${c.id}">Approve</button></div>`}`
    };
  };
  A.openWhy = () => PL.openSheet('why');
  SHEETS.why = () => {
    const t = PL.target();
    const steps = [['Reply', '40%', 'typical for hiring-manager outreach to senior PMs'], ['Interested', '60%', 'of replies'], ['Complete take-home', '70%', ''], ['Advance to onsite', '60%', ''], ['Offer', '50%', ''], ['Accept', '80%', '']];
    return {
      title: `Why ${t}?`, sub: `Worked back from a ${S().see.start} start`,
      body: `<div class="card"><div class="small" style="line-height:1.7">Offer accepted by <b>early Nov</b> (plus notice period)<br>← onsites <b>late Oct</b><br>← take-homes <b>mid Oct</b><br>← replies <b>early Oct</b><br>← outreach <b>this week</b></div></div>
        <div class="sec">Conversion assumptions</div>
        <div class="group">${steps.map(([a, b, c]) => `<div class="fld-row"><span class="k" style="width:130px">${a}</span><div class="v"><b>${b}</b><span class="small muted">${c}</span></div><span class="pill warn">assumption</span></div>`).join('')}</div>
        <p class="small muted" style="margin:10px 2px">${t} × 40% × 60% × 70% × 60% × 50% × 80% ≈ 1 hire. Assumptions become “your data” as real conversions come in.</p>`,
      foot: `<button class="btn btn-primary" data-a="closeSheet">Got it</button>`
    };
  };
  A.openApproveAll = () => PL.openSheet('approveAll');
  SHEETS.approveAll = () => {
    const vis = PL.visible(), dec = S().sl.dec, und = vis.filter(c => !dec[c.id]);
    const unk = und.filter(c => PL.unknownCount(c) > 0).length;
    return {
      title: `Approve all ${und.length} remaining?`,
      body: `<p style="font-size:14px;line-height:1.5;margin:0 2px 12px">They join your ${PL.approved().length} pre-candidates.</p>
        <div class="note">${ic('info')}<div>${unk} have unknown must-haves (like relocation or work authorization). These get asked after they reply.</div></div>
        <p class="small muted" style="margin:12px 2px 0">You can still pass on anyone before outreach starts. Candidates you passed or marked Later aren’t affected.</p>`,
      foot: `<div class="row"><button class="btn btn-secondary" data-a="closeSheet">Cancel</button><button class="btn btn-primary" data-a="approveAll">Approve ${und.length}</button></div>`
    };
  };
  A.approveAll = () => {
    const dec = S().sl.dec, und = PL.visible().filter(c => !dec[c.id]);
    und.forEach(c => { dec[c.id] = 'approved'; });
    PL.S.sheet = null;
    PL.toast(`${und.length} approved as pre-candidates`, 'approveAll', und.map(c => c.id));
  };
  PL.UNDO.approveAll = ids => { ids.forEach(id => { delete S().sl.dec[id]; }); };
  A.startOutreachFlow = () => PL.go('sequence');
  PL.FILL.shortlist = () => {
    const dec = S().sl.dec;
    if (PL.approved().length === 0) PL.visible().forEach(c => { if (!dec[c.id]) dec[c.id] = 'approved'; });
  };
})(window.PL);
