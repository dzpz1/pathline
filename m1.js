/* Pathline prototype — Milestone 1: import & what the role needs → requirements → review & pool → shortlist */
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
      <h1>Every hire <em>raises</em> the bar.</h1>
      <p>For tech companies in their scaling phase. Pathline finds experienced people with real evidence of what your role needs, reaches out on your behalf, and tests them rigorously without losing their interest.</p>
      <div class="fly">
        <div class="fly-h">How Pathline gets better with every hire</div>
        ${['Find pre-candidates with strong evidence on your ideal attributes', 'Reach out with the facts up front', 'Those who reply join Pathline, open to new roles', 'Take-homes add strong, reusable signal', 'Better matches on both sides', 'More candidates and companies join']
          .map((t, i) => `<div class="fly-i ${i === 5 ? 'loop' : ''}"><b>${i === 5 ? '↻' : i + 1}</b><span>${t}</span></div>`).join('')}
      </div>
      <div class="you">You’re <b>Farah, CTO at Nectar Social</b>, hiring a Senior PM, AI. The job description is Nectar’s public posting; candidates, numbers and replies are fictional.</div>
    </div>`,
    footer: `<button class="btn btn-primary" data-a="go" data-r="import">Start the demo</button>`
  });

  /* =========================================================
     1 · Import & what the role needs
     ========================================================= */
  const PARSE_STEPS = ['Reading the posting', 'Understanding the role', 'Drafting what the role needs', 'Checking for conflicts'];
  const isUrl = v => /^\s*https?:\/\/\S+\s*$/i.test(v);
  const detectText = v => { if (!v.trim()) return ''; if (isUrl(v)) { try { return `Link · ${new URL(v.trim()).hostname}`; } catch (e) { return 'Link'; } } return v.trim().length > 40 ? 'Job description text' : ''; };

  function roleCard() {
    const s = S(), title = s.see.title, work = s.jd.work;
    const qs = [];
    if (!title) qs.push(`<div class="q"><div class="qt">Your posting says both “Product Manager” and “Senior Product Manager”. Which level?</div><div class="chips">${PL.chip('PM, AI', false, 'setTitle', 'data-v="PM, AI"')}${PL.chip('Senior PM, AI', false, 'setTitle', 'data-v="Senior PM, AI"')}</div></div>`);
    if (!work) qs.push(`<div class="q"><div class="qt">It’s listed as remote, but the text says 4 days in the office. Which is right?</div><div class="chips">${PL.chip('Remote', false, 'setWork', 'data-v="remote"')}${PL.chip('Hybrid, 4 days', false, 'setWork', 'data-v="hybrid"')}</div></div>`);
    const facts = [];
    if (title) facts.push(`Level: ${esc(title)}`);
    if (work) facts.push(`Work model: ${work === 'remote' ? 'remote' : 'hybrid, 4 days in office'}`);
    return { html: `<div class="role-card"><div class="role-title">${esc(title || 'Product Manager, AI')}</div><div class="role-meta">Nectar Social · Palo Alto, CA · Full time</div>
      ${facts.length ? `<div class="role-line">${facts.join(' · ')}</div>` : ''}${qs.join('')}</div>`, open: qs.length };
  }
  SCREENS.import = () => {
    const j = S().jd;
    if (j.parsing) {
      return { title: 'New role', back: 'start', body: `<div class="parse"><div class="spin"></div><div class="parse-steps">${PARSE_STEPS.map((t, i) =>
        `<div class="${i <= j.parseStep ? 'on' : ''}"><span class="tick">${i < j.parseStep ? '✓' : ''}</span>${t}</div>`).join('')}</div></div>` };
    }
    if (!j.imported) {
      return {
        title: 'New role', back: 'start',
        body: `<div class="intro">In about 10 minutes, you’ll have a shortlist of people to reach out to.</div>
          <div class="h1">What’s the role?</div>
          <textarea class="field jd-in" data-i="jdInput" rows="4" placeholder="Paste a job description or a link" aria-label="Job description or link">${esc(j.input)}</textarea>
          <div class="detect" id="jd-detect">${esc(detectText(j.input))}</div>
          <button class="textlink" data-a="openOtherWays">Other ways to add it</button>`,
        footer: `<button class="btn btn-primary" data-a="importJD" ${j.input.trim() ? '' : 'disabled'}>Import</button>`
      };
    }
    const rc = roleCard();
    return {
      title: 'What the role needs', back: 'start',
      body: `<div class="src-line">From ${esc(j.source)} · <button class="textlink" data-a="jdChange">Change</button></div>
        ${rc.html}
        <div class="sec">What the role needs</div>
        ${PL.BODY.attributes('screen')}`,
      footer: `<button class="btn btn-primary" data-a="go" data-r="requirements" ${rc.open ? 'disabled' : ''}>${rc.open ? `Answer the ${rc.open === 1 ? 'question' : `${rc.open} questions`} above` : 'Looks right'}</button>`
    };
  };
  I.jdInput = v => { S().jd.input = v; const d = document.getElementById('jd-detect'); if (d) d.textContent = detectText(v); PL.liveFooter(); };
  A.openOtherWays = () => PL.openSheet('otherWays');
  SHEETS.otherWays = () => ({
    title: 'Other ways to add it',
    body: `<div class="group">
      <div class="frow" data-a="protoOnly"><span class="k" style="width:auto;flex:1;color:var(--ink);font-size:14.5px">Upload a file</span><span class="v small muted" style="flex:none">PDF or DOCX</span><span class="chev">${ic('chev', 'sm')}</span></div>
      <div class="frow" data-a="protoOnly"><span class="k" style="width:auto;flex:1;color:var(--ink);font-size:14.5px">Talk it through</span><span class="v small muted" style="flex:none">about 2 minutes</span><span class="chev">${ic('chev', 'sm')}</span></div></div>`
  });
  A.protoOnly = () => { PL.S.sheet = null; PL.toast('In this prototype, paste a link or the text'); };
  A.importJD = () => {
    const j = S().jd;
    j.source = isUrl(j.input) ? (() => { try { return new URL(j.input.trim()).hostname; } catch (e) { return 'your link'; } })() : 'pasted text';
    j.parsing = true; j.parseStep = 0;
    const tick = () => {
      if (!PL.S.jd.parsing) return;
      if (PL.S.jd.parseStep < PARSE_STEPS.length - 1) { PL.S.jd.parseStep++; PL.render(); setTimeout(tick, 450); }
      else { PL.S.jd.parsing = false; PL.S.jd.imported = true; PL.save(); PL.render(); }
    };
    setTimeout(tick, 450);
  };
  A.jdChange = () => { S().jd.imported = false; };
  A.setTitle = d => { S().see.title = d.v; };
  A.setWork = d => { S().jd.work = d.v; };
  PL.FILL.import = () => {
    const s = S();
    s.jd.imported = true; s.jd.parsing = false;
    if (!s.jd.source) s.jd.source = 'jobs.ashbyhq.com';
    if (!s.see.title) s.see.title = 'Senior PM, AI';
    if (!s.jd.work) s.jd.work = 'hybrid';
  };

  /* ---------- attributes ---------- */
  function attrCard(a, i) {
    const s = S();
    const label = a.suggested ? '<span class="tag-t">Suggested</span>' : a.yourWords ? '<span class="tag-t">Your words</span>' : '';
    return `<div class="attr ${s.newAttrId === a.id ? 'new' : ''}" data-sort="attrs" data-a="openAttr" data-id="${a.id}">
      <div class="attr-top"><span class="attr-rank">${i + 1}</span><span class="attr-name">${esc(a.name)}</span>${label}<span class="chev">${ic('chev', 'sm')}</span></div>
      <div class="attr-def">${esc(a.def)}</div><div class="attr-why"><b>Why:</b> ${esc(a.why)}</div></div>`;
  }
  PL.BODY.attributes = () => {
    const s = S();
    const recAdded = s.attrs.some(a => a.id === 'hon') || s.attrs.some(a => a.merged);
    const others = D.OTHER_SUGGESTIONS.filter(o => !s.attrs.some(a => a.id === o.id));
    return `<p class="sort-hint">Ranked by impact over the next 12–18 months. Hold and drag to reorder.</p>
      <div class="attr-list">${s.attrs.map(attrCard).join('')}</div>
      ${s.attrs.length >= 8 ? `<p class="small muted" style="margin:10px 2px 0">Each extra attribute lowers the weight of the others.</p>` : ''}
      ${!recAdded ? `<div class="rec"><div class="rec-t">Suggested: Intellectual honesty</div><p>Not in your JD, but AI PMs need to call it when a feature isn’t working, including their own.</p><button class="btn btn-sm btn-secondary" data-a="addRec">Add</button></div>` : ''}
      <button class="btn btn-sm btn-secondary" style="margin-top:12px" data-a="openAddAttr">Add attribute</button>
      ${others.length ? `<button class="textlink" style="display:block;margin-top:14px" data-a="toggleOthers">${s.ui.otherOpen ? 'Hide other suggestions' : `Other suggestions (${others.length})`}</button>
      ${s.ui.otherOpen ? `<div class="group" style="margin-top:8px">${others.map(o => `<div class="li"><div class="b"><div class="t1">${esc(o.name)}</div><div class="t2">${esc(o.why)}</div></div><button class="btn btn-xs btn-secondary" data-a="addOther" data-id="${o.id}">Add</button></div>`).join('')}</div>` : ''}` : ''}`;
  };
  PL.SORT.attrs = (from, to) => { PL.move(S().attrs, from, to); S().newAttrId = null; };
  A.toggleOthers = () => { S().ui.otherOpen = !S().ui.otherOpen; };
  A.openAttr = d => { S().ui.attrEdit = null; S().ui.nameWarn = false; PL.openSheet('attr', { id: d.id }); };
  A.attrNav = d => { S().ui.attrEdit = null; S().sheet.id = d.id; };

  SHEETS.attr = sh => {
    const s = S(), a = PL.attr(sh.id);
    if (!a) return { title: 'Attribute', body: '' };
    const i = s.attrs.indexOf(a), n = s.attrs.length;
    const prev = s.attrs[i - 1], next = s.attrs[i + 1];
    if (s.ui.attrEdit === a.id) {
      return {
        title: `Edit ${esc(a.name)}`, tall: true,
        body: `${s.ui.nameWarn ? `<div class="flag" style="margin-bottom:12px"><div><b>That name reads like an experience.</b> Attributes are properties of the person. Add it as a must-have on the Requirements step instead.</div></div>` : ''}
          <label class="field-label">Name</label><input class="field" id="ae-name" value="${esc(a.name)}">
          <label class="field-label" style="margin-top:12px">Definition</label><textarea class="field" id="ae-def" rows="3">${esc(a.def)}</textarea>
          <label class="field-label" style="margin-top:12px">Why it matters</label><textarea class="field" id="ae-why" rows="3">${esc(a.why)}</textarea>
          <label class="field-label" style="margin-top:12px">Strong evidence, one per line</label><textarea class="field" id="ae-strong" rows="4">${esc(a.strong.join('\n'))}</textarea>
          <label class="field-label" style="margin-top:12px">Weak evidence, one per line</label><textarea class="field" id="ae-weak" rows="3">${esc(a.weak.join('\n'))}</textarea>
          <button class="textlink danger" style="margin-top:18px" data-a="removeAttr" data-id="${a.id}">Remove attribute</button>`,
        foot: `<div class="row"><button class="btn btn-secondary" data-a="attrCancel">Cancel</button><button class="btn btn-primary" data-a="attrSave" data-id="${a.id}">Save</button></div>`
      };
    }
    return {
      title: esc(a.name), sub: `Ranked #${i + 1} of ${n}${a.suggested ? ' · Suggested' : ''}`,
      swipePrev: prev ? `attrNav:${prev.id}` : '', swipeNext: next ? `attrNav:${next.id}` : '',
      body: `<div class="sec" style="margin-top:0">Evidence we’ll look for</div>
        <div class="ev-h">Strong</div><ul class="ev-list">${a.strong.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <div class="ev-h">Weak</div><ul class="ev-list weak">${a.weak.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`,
      foot: `<div class="sheet-nav"><button data-a="attrNav" data-id="${prev ? prev.id : ''}" ${prev ? '' : 'disabled'}>${prev ? `Previous: ${esc(prev.name)}` : 'Previous'}</button><button data-a="attrNav" data-id="${next ? next.id : ''}" ${next ? '' : 'disabled'}>${next ? `Next: ${esc(next.name)}` : 'Next'}</button></div>
        <div class="row"><button class="btn btn-secondary" data-a="attrEdit" data-id="${a.id}">Edit</button><button class="btn btn-primary" data-a="closeSheet">Done</button></div>`
    };
  };
  A.attrEdit = d => { S().ui.attrEdit = d.id; S().ui.nameWarn = false; };
  A.attrCancel = () => { S().ui.attrEdit = null; S().ui.nameWarn = false; };
  A.attrSave = d => {
    const a = PL.attr(d.id), v = id => { const el = document.getElementById(id); return el ? el.value : ''; };
    const name = v('ae-name').trim();
    if (D.EXPERIENCE_WORDS.test(name)) { S().ui.nameWarn = true; return; }
    const next = { name: name || a.name, def: v('ae-def').trim() || a.def, why: v('ae-why').trim() || a.why,
      strong: v('ae-strong').split('\n').map(x => x.trim()).filter(Boolean), weak: v('ae-weak').split('\n').map(x => x.trim()).filter(Boolean) };
    const changed = ['name', 'def', 'why'].some(k => next[k] !== a[k]) || next.strong.join() !== a.strong.join() || next.weak.join() !== a.weak.join();
    Object.assign(a, next);
    if (changed) { a.yourWords = true; a.suggested = false; }
    S().ui.attrEdit = null;
    PL.toast(changed ? 'Saved' : 'No changes');
  };
  A.removeAttr = d => {
    const s = S(), i = s.attrs.findIndex(a => a.id === d.id), a = s.attrs[i];
    s.attrs.splice(i, 1); s.ui.attrEdit = null; PL.S.sheet = null;
    PL.toast(`Removed ${esc(a.name)}`, 'attrRemove', { i, a });
  };
  PL.UNDO.attrRemove = x => { S().attrs.splice(x.i, 0, x.a); };

  /* Add attribute */
  function libAttr(id) {
    const lib = D.LIBRARY.find(x => x.id === id) || D.OTHER_SUGGESTIONS.find(x => x.id === id);
    const pool = D.EVIDENCE_POOLS[id];
    return { id: lib.id, name: lib.name, def: lib.def, why: lib.why, strong: (lib.strong || (pool ? pool.S : ['Evidence drafted from your JD'])).slice(), weak: (lib.weak || ['Claims it without examples']).slice(), suggested: true };
  }
  A.addRec = () => PL.startPlace('hon');
  A.addOther = d => PL.startPlace(d.id);
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
      body: `<input class="field" id="add-q" data-i="addQuery" value="${esc(q)}" placeholder="Search, or type your own" autocomplete="off" data-enter="addCustom">
        ${s.ui.addWarn ? `<div class="flag" style="margin-top:12px"><div><b>“${esc(q)}” reads like an experience, not an attribute.</b> Attributes are properties of the person. Add it as a must-have instead?<div class="row" style="margin-top:10px"><button class="btn btn-xs btn-primary" data-a="customToReq">Add as must-have</button><button class="btn btn-xs btn-secondary" data-a="addCustomForce">Keep as attribute</button></div></div></div>` : ''}
        <div class="sec">${q ? 'Matches' : 'From the library'}</div>
        ${items.map(l => `<button class="lib-item" data-a="pickLib" data-id="${l.id}"><div style="flex:1">${esc(l.name)}<small>${esc(l.def)}</small></div><span class="lib-add">Add</span></button>`).join('') || '<p class="small muted">No library matches.</p>'}
        ${q && !exact ? `<button class="lib-item" data-a="addCustom"><div style="flex:1">Add “${esc(q)}” as your own<small>Pathline drafts the definition, why and evidence for you to edit.</small></div><span class="lib-add">Add</span></button>` : ''}`
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
    const name = q.charAt(0).toUpperCase() + q.slice(1);
    PL.startPlace(id, { id, name, def: `Shows ${q.toLowerCase()} consistently, in how they work and in what they’ve shipped.`, why: `You added this. Pathline will look for evidence of ${q.toLowerCase()} in their work history.`, strong: [`Concrete examples of ${q.toLowerCase()} in past roles`, 'References mention it unprompted'], weak: ['Claims it without examples'], suggested: true });
  };
  A.customToReq = () => {
    const q = S().ui.addQuery.trim();
    S().reqs.custom.push({ id: 'r' + Date.now(), type: 'Experience', label: q, key: /b2b/i.test(q) ? 'b2b' : '' });
    PL.S.sheet = null;
    PL.toast(`Added “${esc(q)}” to must-haves`);
  };
  PL.startPlace = (id, custom) => {
    const s = S();
    const obj = custom || libAttr(id);
    s.ui.pending = obj;
    s.ui.placeRank = id === 'hon' ? D.RECOMMENDED.suggestRank : s.attrs.length + 1;
    PL.openSheet('place', { id });
  };
  SHEETS.place = () => {
    const s = S(), obj = s.ui.pending, rec = obj.id === 'hon', end = s.attrs.length + 1;
    const r = Math.min(s.ui.placeRank, end);
    const list = s.attrs.slice(); list.splice(r - 1, 0, Object.assign({}, obj, { _new: true }));
    const ov = rec && s.attrs.some(a => a.id === 'rig');
    return {
      title: `Add ${esc(obj.name)}`,
      body: `<div class="card" style="background:var(--accent-soft);border-color:var(--accent-soft-2);font-size:13.5px;line-height:1.5"><b>Suggested rank: #${r}</b>${rec ? ', above Empirical rigor' : ', at the end'}.<br>${esc(rec ? D.RECOMMENDED.suggestWhy : 'You can drag it anywhere in the list afterwards.')}</div>
        <div class="card" style="margin-top:10px"><div class="row" style="margin-bottom:6px"><span class="tag-t">Suggested</span></div><div style="font-size:14px;line-height:1.45">${esc(obj.def)}</div><div class="small muted" style="margin-top:6px"><b>Why:</b> ${esc(obj.why)}</div></div>
        <div class="sec">Your list with it added</div>
        <div class="group">${list.map((a, i) => `<div class="li" ${a._new ? 'style="background:var(--accent-soft);margin:0 -14px;padding-left:14px;padding-right:14px"' : ''}><span class="attr-rank">${i + 1}</span><div class="b"><div class="t1">${esc(a.name)}</div></div></div>`).join('')}</div>
        ${ov ? `<div class="flag" style="margin-top:12px"><div><b>Overlaps with Empirical rigor.</b> ${esc(D.RECOMMENDED.overlapWhy)} <button class="textlink" data-a="mergeHon">Merge into Empirical rigor instead</button></div></div>` : ''}`,
      foot: r < end ? `<div class="row"><button class="btn btn-secondary" data-a="placeConfirm" data-r="${end}">Add at the end</button><button class="btn btn-primary" data-a="placeConfirm" data-r="${r}">Add at #${r}</button></div>`
        : `<button class="btn btn-primary" data-a="placeConfirm" data-r="${end}">Add</button>`
    };
  };
  A.placeConfirm = d => {
    const s = S(), obj = s.ui.pending, r = Number(d.r);
    s.attrs.splice(r - 1, 0, obj);
    s.newAttrId = obj.id;
    PL.S.sheet = null;
    PL.toast(`${esc(obj.name)} added at #${r}`);
  };
  A.mergeHon = () => {
    const rig = PL.attr('rig');
    if (rig) { rig.name = 'Empirical rigor & honesty'; rig.def = 'Judges ideas, including their own, by whether they measurably work, and says so when they don’t.'; rig.strong = rig.strong.concat(D.RECOMMENDED.strong.slice(0, 1)); rig.yourWords = true; rig.merged = true; }
    PL.S.sheet = null;
    PL.toast('Merged into Empirical rigor');
  };

  /* =========================================================
     2 · Requirements
     ========================================================= */
  PL.BODY.requirements = (mode, hl) => {
    const s = S(), r = s.reqs, remote = s.jd.work === 'remote';
    const row = (k, v, small) => `<div class="req" data-a="openReq" data-id="${k}"><div class="v">${v}${small ? `<small>${small}</small>` : ''}</div><span class="chev">${ic('chev', 'sm')}</span></div>`;
    const custom = types => r.custom.filter(c => types.includes(c.type)).map(c => row(c.id, esc(c.label), 'Added by you')).join('');
    const g = (key, title, rows) => rows ? `<div class="sec">${title}</div><div class="group ${hl === key ? 'hl' : ''}">${rows}</div>` : '';
    return `${mode === 'screen' ? `<p class="lede">Must-haves from your job description, as written. Tap one to see the original wording or adjust it.</p>` : ''}
      ${g('exp', 'Experience', row('exp', `${esc(r.role)}, ${r.minYears}+ years`, 'Shipping software products') + custom(['Experience']))}
      ${g('skills', 'Skills', row('metrics', 'Defining metrics / data analysis', `Level: ${esc(r.metricsLevel.toLowerCase())}`) + row('ai', 'Generative AI / prompting', r.aiEither ? 'Experience or strong interest' : 'Experience required') + custom(['Skill']))}
      ${g('loc', 'Location', row('loc', remote ? 'Remote (US)' : `${esc(r.office)}, in office ${r.days} days a week`, remote ? 'From your answer on step 1' : 'From “What we offer”') + custom(['Location']))}
      ${g('other', 'Other', custom(['Work auth', 'Other']))}
      <div class="sec">Not in your job description</div>
      <div class="group ${hl === 'loc' ? 'hl' : ''}">
        <div class="nij"><div class="q">Will you sponsor visas?</div><div class="chips">${[['yes', 'Yes'], ['no', 'No'], ['case', 'Case by case']].map(([v, l]) => PL.chip(l, r.visa === v, 'setVisa', `data-v="${v}"`)).join('')}</div></div>
        ${remote ? '' : `<div class="nij"><div class="q">Open to relocation?</div><div class="chips">${[['yes', 'Yes'], ['no', 'No']].map(([v, l]) => PL.chip(l, r.relocation === v, 'setReloc', `data-v="${v}"`)).join('')}</div>${r.relocation === 'yes' ? '<div class="small muted">You offer a $1,000/month housing stipend, so we’ll mention it.</div>' : ''}</div>`}
      </div>
      <button class="btn btn-sm btn-secondary" style="margin-top:14px" data-a="openAddReq">Add requirement</button>`;
  };
  SCREENS.requirements = () => ({
    title: 'Requirements', back: 'import',
    body: PL.BODY.requirements('screen'),
    footer: `<button class="btn btn-primary" data-a="go" data-r="review">Looks right</button>`
  });
  A.setVisa = d => { S().reqs.visa = d.v; };
  A.setReloc = d => { S().reqs.relocation = d.v; };
  A.openReq = d => PL.openSheet('req', { id: d.id });
  const yearOpts = () => [2, 3, 4, 5, 6, 7, 8, 9, 10].map(y => ({ v: y, l: `${y}+ years` }));
  SHEETS.req = sh => {
    const s = S(), r = s.reqs, k = sh.id;
    const quote = (q, src) => `<div class="quote">“${esc(q)}”</div><div class="q-src">${src || 'From your job description'}, kept as written</div>`;
    let title = '', body = '';
    if (k === 'exp') {
      title = 'Experience';
      body = quote(D.REQ_QUOTES.exp) + `<div class="sec">How we’ll check it</div><div class="group">
        <div class="fld-row"><span class="k">Role</span><div class="v"><select class="field inline" data-c="reqRole">${PL.options(['Product manager', 'Product manager or APM'], r.role)}</select></div></div>
        <div class="fld-row"><span class="k">Minimum</span><div class="v"><select class="field inline" data-c="reqYears">${PL.options(yearOpts(), r.minYears)}</select></div></div>
        <div class="fld-row"><span class="k">Counts if</span><div class="v">Shipped software products</div></div></div>`;
    } else if (k === 'metrics') {
      title = 'Skill';
      body = quote(D.REQ_QUOTES.metrics) + `<div class="sec">Level we’ll look for</div><div class="chips">${['Familiar', 'Uses daily', 'Expert'].map(l => PL.chip(l, r.metricsLevel === l, 'reqMetrics', `data-v="${l}"`)).join('')}</div>`;
    } else if (k === 'ai') {
      title = 'Skill';
      body = quote(D.REQ_QUOTES.ai) + `<div class="sec">What counts</div><div class="chips">${PL.chip('Experience or strong interest', r.aiEither, 'reqAi', 'data-v="1"')}${PL.chip('Experience only', !r.aiEither, 'reqAi', 'data-v="0"')}</div><p class="small muted" style="margin:10px 2px 0">Your posting says “or strong interest”, so that’s the default. Interest rarely shows on a profile, so we’ll usually ask.</p>`;
    } else if (k === 'loc') {
      title = 'Location';
      body = s.jd.work === 'remote' ? `<p style="font-size:14px">You chose remote on step 1.</p><button class="btn btn-sm btn-secondary" data-a="setWork" data-v="hybrid">Switch to hybrid, 4 days</button>` :
        quote(D.REQ_QUOTES.loc, 'From “What we offer”') + `<div class="sec">How we’ll check it</div><div class="group">
        <div class="fld-row"><span class="k">Office</span><div class="v"><select class="field inline" data-c="reqOffice">${PL.options(['Palo Alto'], r.office)}</select></div></div>
        <div class="fld-row"><span class="k">In office</span><div class="v"><select class="field inline" data-c="reqDays">${PL.options([1, 2, 3, 4, 5].map(d => ({ v: d, l: `${d} day${d > 1 ? 's' : ''} a week` })), r.days)}</select></div></div>
        <div class="fld-row"><span class="k">Relocation</span><div class="v chips">${[['yes', 'OK'], ['no', 'Local only']].map(([v, l]) => PL.chip(l, r.relocation === v, 'setReloc', `data-v="${v}"`)).join('')}</div></div></div>`;
    } else {
      const c = r.custom.find(x => x.id === k);
      title = c ? esc(c.type) : 'Requirement';
      body = c ? `<div class="card"><div style="font-weight:600">${esc(c.label)}</div><div class="small muted" style="margin-top:4px">Added by you</div></div><button class="textlink danger" style="margin-top:16px" data-a="removeReq" data-id="${c.id}">Remove requirement</button>` : '';
    }
    return { title, sub: 'Must-have', body, foot: `<button class="btn btn-primary" data-a="closeSheet">Done</button>` };
  };
  C.reqRole = v => { S().reqs.role = v; };
  C.reqYears = v => { S().reqs.minYears = Number(v); };
  C.reqDays = v => { S().reqs.days = Number(v); };
  A.reqMetrics = d => { S().reqs.metricsLevel = d.v; };
  A.reqAi = d => { S().reqs.aiEither = d.v === '1'; };
  C.reqOffice = v => { S().reqs.office = v; };
  A.removeReq = d => { const r = S().reqs, i = r.custom.findIndex(x => x.id === d.id), c = r.custom[i]; r.custom.splice(i, 1); PL.S.sheet = null; PL.toast(`Removed “${esc(c.label)}”`, 'reqRemove', { i, c }); };
  PL.UNDO.reqRemove = x => { S().reqs.custom.splice(x.i, 0, x.c); };
  A.openAddReq = () => { const u = S().ui; u.reqType = 'Skill'; u.reqLabel = ''; u.reqLevel = 'Uses daily'; u.reqYears = ''; PL.openSheet('addReq'); };
  SHEETS.addReq = () => {
    const u = S().ui, t = u.reqType;
    const ph = { Experience: 'e.g. B2B SaaS product experience', Skill: 'e.g. SQL', Location: 'e.g. US Pacific time zone', 'Work auth': 'e.g. US work authorization', Other: 'e.g. Spanish, professional level' }[t];
    return {
      title: 'Add a requirement', sub: 'Must-have',
      body: `<div class="chips">${['Experience', 'Skill', 'Location', 'Work auth', 'Other'].map(x => PL.chip(x, t === x, 'reqType', `data-v="${x}"`)).join('')}</div>
        <label class="field-label" style="margin-top:14px">${t}</label><input class="field" id="rq-label" data-i="reqLabel" value="${esc(u.reqLabel)}" placeholder="${ph}" data-enter="addReq" autocomplete="off">
        ${t === 'Skill' ? `<label class="field-label" style="margin-top:12px">Level</label><div class="chips">${['Familiar', 'Uses daily', 'Expert'].map(l => PL.chip(l, u.reqLevel === l, 'reqLevel', `data-v="${l}"`)).join('')}</div>` : ''}
        ${t === 'Experience' ? `<label class="field-label" style="margin-top:12px">Minimum (optional)</label><select class="field" data-c="reqNewYears">${PL.options([{ v: '', l: 'Any' }].concat(yearOpts()), u.reqYears)}</select>` : ''}
        <p class="small muted" style="margin:14px 2px 0">Each must-have narrows your pool. You’ll see the effect on Review & pool.</p>`,
      foot: `<div class="row"><button class="btn btn-secondary" data-a="closeSheet">Cancel</button><button class="btn btn-primary" id="add-req-btn" data-a="addReq" ${u.reqLabel.trim() ? '' : 'disabled'}>Add</button></div>`
    };
  };
  I.reqLabel = v => { S().ui.reqLabel = v; const b = document.getElementById('add-req-btn'); if (b) b.disabled = !v.trim(); };
  A.reqType = d => { S().ui.reqType = d.v; };
  A.reqLevel = d => { S().ui.reqLevel = d.v; };
  C.reqNewYears = v => { S().ui.reqYears = v; };
  A.addReq = () => {
    const u = S().ui, name = u.reqLabel.trim();
    if (!name) return;
    const label = name + (u.reqType === 'Skill' ? ` (${u.reqLevel.toLowerCase()})` : '') + (u.reqType === 'Experience' && u.reqYears ? `, ${u.reqYears}+ years` : '');
    S().reqs.custom.push({ id: 'r' + Date.now(), type: u.reqType, label, key: /b2b/i.test(name) ? 'b2b' : '' });
    u.reqLabel = '';
    PL.S.sheet = null;
    PL.toast(`Added “${esc(label)}”. Pool updated.`);
  };
  PL.FILL.requirements = () => { const r = S().reqs; if (!r.visa) r.visa = 'case'; if (!r.relocation) r.relocation = 'yes'; };

  /* =========================================================
     3 · Review & pool
     ========================================================= */
  const LAYERS = [
    { k: 'exp', lbl: () => `PM, ${S().reqs.minYears}+ yrs`, screen: 'requirements', hl: 'exp' },
    { k: 'skills', lbl: () => '+ skills', screen: 'requirements', hl: 'skills' },
    { k: 'loc', lbl: () => '+ location', screen: 'requirements', hl: 'loc' },
    { k: 'attr', lbl: () => 'Strong on your attributes', screen: 'attributes' },
    { k: 'move', lbl: () => 'Likely to move', screen: 'move' },
    { k: 'base', lbl: () => 'Base range fits', screen: 'basestart' }
  ];
  PL.LAYERS = LAYERS;
  const barW = n => Math.max(3, Math.min(100, (Math.log10(Math.max(n, 1)) - .8) / (Math.log10(60000) - .8) * 100));
  const startOpts = ['Nov 2026', 'Dec 2026', 'Jan 2027', 'Feb 2027'];
  function baseOpts(lo, hi) { const o = []; for (let v = lo; v <= hi; v += 5) o.push({ v, l: `$${v}k` }); return o; }
  PL.baseOpts = baseOpts;
  PL.mustsSummary = () => {
    const s = S(), r = s.reqs;
    return [`PM ${r.minYears}+ yrs`, 'Metrics', 'Gen AI', s.jd.work === 'remote' ? 'Remote (US)' : `${r.office} ${r.days} days`,
      s.jd.work !== 'remote' && r.relocation ? (r.relocation === 'yes' ? 'relocation OK' : 'local only') : '',
      r.visa ? `visa: ${{ yes: 'sponsor', no: 'no sponsorship', case: 'case by case' }[r.visa]}` : ''].concat(r.custom.map(c => c.label)).filter(Boolean).join(' · ');
  };
  SCREENS.review = () => {
    const s = S(), p = PL.pool(), t = PL.target(), v = PL.verdict(), start = s.see.start.split(' ')[0];
    const ratios = [['skills', p.skills / p.exp], ['loc', p.loc / p.skills], ['attr', p.attr / p.loc], ['move', p.move / p.attr], ['base', p.base / p.move]].sort((a, b) => a[1] - b[1]);
    const big = LAYERS.find(L => L.k === ratios[0][0]);
    const vt = { healthy: `${PL.fmtN(p.base)} people are likely to fit and be reachable: plenty for ${t}.`, tight: `${PL.fmtN(p.base)} likely fits for ${t} recommended outreaches. Workable, with little slack.`, thin: `Only ${PL.fmtN(p.base)} likely fits for ${t} recommended outreaches. Consider loosening a layer.` }[v];
    return {
      title: 'Review & pool', back: 'requirements',
      body: `<div class="card"><div style="font-weight:600;font-size:15px">When do you need them to start?</div>
          <select class="field" style="margin-top:10px" data-c="seeStart">${PL.options(startOpts, s.see.start)}</select>
          <div class="small muted" style="margin-top:8px">This sets how many people to reach out to.</div></div>
        <div class="sec">Summary</div>
        <div class="group">
          ${PL.row('Attributes', s.attrs.map((a, i) => `${i + 1} ${esc(a.name)}`).join(' · '), 'openScreenSheet', 'data-s="attributes"')}
          ${PL.row('Must-haves', esc(PL.mustsSummary()), 'openScreenSheet', 'data-s="requirements"')}
          ${PL.row('Base range', `$${s.see.baseMin}–${s.see.baseMax}k`, 'openScreenSheet', 'data-s="basestart"')}
        </div>
        <div class="sec">Your talent pool, approximately</div>
        <div class="card" style="padding:4px 14px">
          ${LAYERS.map(L => `<div class="funnel-row" data-a="openLayer" data-k="${L.k}"><span class="lbl">${esc(L.lbl())}</span><span class="bar"><i style="width:${barW(p[L.k])}%"></i></span><span class="n">${PL.fmtN(p[L.k])}</span><span class="chev">${ic('chev', 'sm')}</span></div>`).join('')}
          <div class="funnel-row final"><span class="lbl"><b>Shortlist</b></span><span class="bar"><i style="width:${barW(t)}%"></i></span><span class="n">top ${t}</span><span></span></div>
          <div style="padding:2px 0 10px"><button class="textlink" data-a="openWhy">Why ${t}?</button></div>
        </div>
        <div class="verdict ${v}"><div><b>${v} for a ${esc(start)} start</b><div style="margin-top:3px">${vt}</div></div></div>
        <p class="small muted" style="margin:10px 2px 0">Biggest cut: <b>${esc(big.lbl())}</b>. Tap any layer to adjust what’s behind it.</p>`,
      footer: `<button class="btn btn-primary" data-a="go" data-r="shortlist">Build shortlist of ${t}</button>`
    };
  };
  C.seeStart = v => { S().see.start = v; };
  C.seeBaseMin = v => { S().see.baseMin = Number(v); };
  C.seeBaseMax = v => { S().see.baseMax = Number(v); };
  PL.BODY.basestart = (mode, hl) => {
    const s = S().see;
    return `<div class="group ${hl === 'comp' ? 'hl' : ''}">
        <div class="fld-row"><span class="k">Base range</span><div class="v" style="flex-wrap:nowrap"><select class="field inline" data-c="seeBaseMin" aria-label="Base minimum">${PL.options(baseOpts(100, s.baseMax - 5), s.baseMin)}</select><span class="muted">to</span><select class="field inline" data-c="seeBaseMax" aria-label="Base maximum">${PL.options(baseOpts(s.baseMin + 5, 350), s.baseMax)}</select></div></div>
        <div class="fld-row"><span class="k">Start date</span><div class="v"><select class="field inline" data-c="seeStart">${PL.options(startOpts, s.start)}</select></div></div>
      </div>
      <p class="small muted" style="margin:8px 2px 0">Base range from your job description. Candidates see it in the first email.</p>`;
  };

  /* Screen-as-sheet: funnel layers, summary rows, criteria chips */
  const SCREEN_TITLES = { attributes: 'Attributes', requirements: 'Must-haves', basestart: 'Base range & start date' };
  A.openLayer = d => {
    const L = LAYERS.find(x => x.k === d.k);
    PL.openSheet('screenSheet', { screen: L.screen, layer: L.k, hl: L.hl, snap: PL.pool()[L.k] });
  };
  A.openScreenSheet = d => {
    const snap = { vis: PL.visible().map(c => c.id), attrs: JSON.parse(JSON.stringify(S().attrs)), reqs: JSON.parse(JSON.stringify(S().reqs)), see: JSON.parse(JSON.stringify(S().see)) };
    PL.openSheet('screenSheet', { screen: d.s, from: S().route, crit: snap });
  };
  SHEETS.screenSheet = sh => {
    const L = sh.layer ? LAYERS.find(x => x.k === sh.layer) : null;
    let delta = '';
    if (L) {
      const now = PL.pool()[L.k], was = sh.snap;
      const dir = Math.round(now) === Math.round(was) ? '' : (now > was ? '<span class="up">up</span>' : '<span class="down">down</span>');
      delta = `<div class="delta"><span>${esc(L.lbl())}</span><b>${PL.fmtN(was)} → ${PL.fmtN(now)}</b>${dir}<span class="live">live</span></div>`;
    }
    if (sh.screen === 'move') {
      return {
        title: 'Likely to move', sub: 'An estimate, not a control',
        body: delta + `<p style="font-size:14px;line-height:1.5;margin:0 2px 12px">Estimated from public signals like tenure, career stage and recent job changes. The specific signals are never shown or used in outreach.</p>
          <p style="font-size:14px;line-height:1.5;margin:0 2px 12px">You can’t change who wants to move, but a later start date gives more people time to become reachable.</p>
          <div class="group hl"><div class="fld-row"><span class="k">Start date</span><div class="v"><select class="field inline" data-c="seeStart">${PL.options(startOpts, S().see.start)}</select></div></div></div>`,
        foot: `<button class="btn btn-primary" data-a="closeSheet">Done</button>`
      };
    }
    const title = L ? esc(L.lbl()) : SCREEN_TITLES[sh.screen];
    return { title, sub: L ? `Set in ${SCREEN_TITLES[sh.screen]}` : '', tall: sh.screen !== 'basestart', body: delta + PL.BODY[sh.screen]('sheet', sh.hl), foot: `<button class="btn btn-primary" data-a="closeSheet">Done</button>` };
  };
  PL.SHEET_CLOSE.screenSheet = sh => {
    if (sh.from !== 'shortlist' || !sh.crit) return;
    const before = sh.crit.vis, after = PL.visible().map(c => c.id);
    const added = after.filter(x => !before.includes(x)).length, dropped = before.filter(x => !after.includes(x)).length;
    if (added || dropped) setTimeout(() => { PL.toast(`Shortlist updated: ${added} new, ${dropped} dropped`, 'criteria', sh.crit); PL.render(); }, 0);
  };
  PL.UNDO.criteria = snap => { const s = S(); s.attrs = snap.attrs; s.reqs = snap.reqs; s.see = snap.see; };

  A.openWhy = () => PL.openSheet('why');
  SHEETS.why = () => {
    const t = PL.target();
    const steps = [['Reply', '40%', 'typical for hiring-manager outreach to senior PMs'], ['Interested', '60%', 'of replies'], ['Complete take-home', '70%', ''], ['Advance to onsite', '60%', ''], ['Offer', '50%', ''], ['Accept', '80%', '']];
    return {
      title: `Why ${t}?`, sub: `Worked back from a ${S().see.start} start`,
      body: `<div class="card"><div class="small" style="line-height:1.7">Offer accepted by <b>early Nov</b>, plus notice period<br>Onsites <b>late Oct</b><br>Take-homes <b>mid Oct</b><br>Replies <b>early Oct</b><br>Outreach <b>this week</b></div></div>
        <div class="sec">Conversion assumptions</div>
        <div class="group">${steps.map(([a, b, c]) => `<div class="fld-row"><span class="k" style="width:130px">${a}</span><div class="v"><b>${b}</b><span class="small muted">${c}</span></div></div>`).join('')}</div>
        <p class="small muted" style="margin:10px 2px">${t} × 40% × 60% × 70% × 60% × 50% × 80% ≈ 1 hire. These are assumptions until your own conversions replace them.</p>`,
      foot: `<button class="btn btn-primary" data-a="closeSheet">Got it</button>`
    };
  };

  /* =========================================================
     4 · Shortlist
     ========================================================= */
  function candCard(c) {
    const exc = PL.attr(c.exc) || D.ATTRS.find(a => a.id === c.exc);
    return `<div class="cand tapcard" data-a="openCand" data-id="${c.id}">
      <div class="cand-top">${PL.avatar(c)}<div style="flex:1;min-width:0"><div class="cand-name">${esc(c.name)} · ${esc(c.title)}</div><div class="cand-sub">${esc(c.co)} · ${esc(c.loc)}</div></div><span class="chev">${ic('chev', 'sm')}</span></div>
      <div class="exc">Exceptional at <b>${esc(exc ? exc.name : c.exc)}</b></div>
      <div class="why"><b>Why a great fit:</b> ${esc(c.why)}</div>
      <div class="cline"><span class="k">Must-haves</span>${esc(PL.mustLine(c))}</div>
      <div class="cline"><span class="k">Likely to move</span>${c.move}${c.warm ? ` · Warm path: ${esc(c.warm.charAt(0).toLowerCase() + c.warm.slice(1))}` : ''}</div>
      <div class="cand-acts"><button class="btn btn-sm btn-secondary" data-a="openPass" data-id="${c.id}">Pass</button></div>
    </div>`;
  }
  SCREENS.shortlist = () => {
    const s = S(), vis = PL.visible(), t = PL.target();
    const heading = vis.length < t ? `${vis.length} people match. Loosen a must-have to reach ${t}.` : `${vis.length} people for your ${esc(PL.titleText())} role`;
    return {
      title: 'Shortlist', back: 'review',
      body: `<div class="crit">
          <button class="chip sm" data-a="openScreenSheet" data-s="attributes">Attributes</button>
          <button class="chip sm" data-a="openScreenSheet" data-s="requirements">Must-haves</button>
          <button class="chip sm" data-a="openScreenSheet" data-s="basestart">Base & start date</button>
        </div>
        <div class="sl-title">${heading}</div>
        ${vis.map(candCard).join('')}`,
      footer: `<button class="btn btn-primary" data-a="openContinue" ${vis.length ? '' : 'disabled'}>Continue to outreach with ${vis.length}</button>`
    };
  };
  A.openPass = d => { S().ui.passReasons = []; PL.openSheet('pass', { id: d.id }); };
  SHEETS.pass = sh => {
    const c = PL.cand(sh.id), sel = S().ui.passReasons;
    const reasons = S().attrs.map(a => a.name).concat(['Must-have', 'Wrong domain', 'Too senior', 'Other']);
    return {
      title: `Pass on ${esc(c.name)}?`, sub: 'Only Pathline sees why. It helps tune your shortlist.',
      body: `<div class="chips">${reasons.map(r => PL.chip(esc(r), sel.includes(r), 'passReason', `data-v="${esc(r)}"`)).join('')}</div>`,
      foot: `<div class="row"><button class="btn btn-secondary" data-a="closeSheet">Cancel</button><button class="btn btn-primary" data-a="doPass" data-id="${c.id}">Pass</button></div>`
    };
  };
  A.passReason = d => { const r = S().ui.passReasons, i = r.indexOf(d.v); if (i >= 0) r.splice(i, 1); else r.push(d.v); };
  A.doPass = d => {
    const before = PL.visible().map(c => c.id);
    S().sl.dec[d.id] = 'passed';
    const added = PL.visible().find(c => !before.includes(c.id));
    PL.S.sheet = null;
    PL.toast(`Passed on ${esc(PL.cand(d.id).name)}${added ? `. ${esc(added.name)} takes their place.` : '.'}`, 'pass', d.id);
  };
  PL.UNDO.pass = id => { delete S().sl.dec[id]; };
  A.openCand = d => PL.openSheet('cand', { id: d.id });
  A.candNav = d => { S().sheet.id = d.id; };
  SHEETS.cand = sh => {
    const s = S(), c = PL.cand(sh.id), vis = PL.visible(), i = vis.findIndex(x => x.id === c.id);
    const prev = vis[i - 1], next = vis[i + 1];
    const blocks = s.attrs.map((a, k) => { const lv = PL.level(c, a.id); return `<div class="ev-block"><div class="hd"><span class="r">${k + 1}</span>${esc(a.name)}<span style="flex:1"></span><span class="lv ${lv}">${PL.LV_TEXT[lv]}</span></div><ul>${PL.evidence(c, a.id).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`; }).join('');
    return {
      title: esc(c.name), sub: `${esc(c.title)} · ${esc(c.co)} · ${esc(c.loc)}`, tall: true,
      swipePrev: prev ? `candNav:${prev.id}` : '', swipeNext: next ? `candNav:${next.id}` : '',
      body: `<div class="sec" style="margin-top:0">Evidence by attribute</div>${blocks}
        <div class="sec">Must-haves</div><p style="font-size:14px;margin:0 2px">${esc(PL.mustLine(c))}</p>`,
      foot: `<div class="sheet-nav"><button data-a="candNav" data-id="${prev ? prev.id : ''}" ${prev ? '' : 'disabled'}>Previous</button><span>${i >= 0 ? `${i + 1} of ${vis.length}` : ''}</span><button data-a="candNav" data-id="${next ? next.id : ''}" ${next ? '' : 'disabled'}>Next</button></div>
        ${i >= 0 ? `<div class="row"><button class="btn btn-secondary" data-a="openPass" data-id="${c.id}">Pass</button><button class="btn btn-primary" data-a="closeSheet">Done</button></div>` : `<button class="btn btn-primary" data-a="closeSheet">Done</button>`}`
    };
  };
  A.openContinue = () => PL.openSheet('continueOut');
  SHEETS.continueOut = () => {
    const vis = PL.visible(), counts = {};
    vis.forEach(c => PL.unknowns(c).forEach(u => { counts[u] = (counts[u] || 0) + 1; }));
    const asks = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).map(u => `${counts[u] === vis.length ? 'everyone' : counts[u]} about ${esc(u)}`);
    const askLine = asks.length ? `After they reply, we’ll ask ${asks.length > 1 ? asks.slice(0, -1).join(', ') + ' and ' + asks[asks.length - 1] : asks[0]}.` : 'Everyone meets your must-haves.';
    return {
      title: 'Shortlist ready for outreach',
      body: `<p style="font-size:14.5px;line-height:1.55;margin:0 2px 12px">${vis.length} pre-candidates will be contacted in rank order, a few at a time.</p>
        <p style="font-size:14px;line-height:1.55;margin:0 2px;color:var(--ink-2)">${askLine}</p>`,
      foot: `<button class="btn btn-primary" data-a="confirmOutreach">Continue to outreach</button>`
    };
  };
  A.confirmOutreach = () => { S().sl.final = PL.visible().map(c => c.id); PL.go('see'); };
  PL.FILL.shortlist = () => { if (!S().sl.final) S().sl.final = PL.visible().map(c => c.id); };
})(window.PL);
