/* Pathline prototype — Milestones 3–5: monitoring → replies, chat, take-home → review → onsite */
(function (PL) {
  const D = PL.D, A = PL.A, I = PL.I, C = PL.C, SCREENS = PL.SCREENS, SHEETS = PL.SHEETS, esc = PL.esc, ic = PL.ic;
  const S = () => PL.S;
  const first = c => c.name.split(' ')[0];

  /* =========================================================
     Milestone 3 · Monitoring
     ========================================================= */
  SCREENS.monitor = () => {
    const s = S(), o = s.out;
    const remaining = Math.max(0, PL.approved().length - 14);
    const p = PL.projection(o.active, Math.max(1, PL.approved().length));
    const newLeft = D.NEW_MATCHES.filter(n => !o.newAdded[n.id] && !o.newPassed[n.id]).length;
    const stat = (l, n, max, dim, approx) => `<div class="stat-row"><span>${l}</span><span class="bar"><i class="${dim ? 'dim' : ''}" style="width:${n / max * 100}%"></i></span><span class="n">${approx ? '~' : ''}${n}</span></div>`;
    const sugg = [];
    if (!o.timingApplied && !o.timingDismissed) sugg.push(`<div class="sugg-card"><div class="h">Send Tue–Thu, 8–10am their time</div>
      <p>4 of your 5 replies came in that window. That’s a small sample, so this also leans on Pathline benchmarks for senior PMs.</p>
      <div class="acts"><button class="btn btn-xs btn-secondary" data-a="dismissTiming">Dismiss</button><button class="btn btn-xs btn-primary" data-a="applyTiming">Apply</button></div></div>`);
    if (!o.activeDismissed && o.active < 8) {
      const p8 = PL.projection(8, Math.max(1, PL.approved().length));
      sugg.push(`<div class="sugg-card"><div class="h">Go from ${o.active} to 8 at a time</div>
        <p>Replies are below forecast. At 8, everyone is contacted by ${p8.date} instead of ${p.date}, with ${p8.replies} replies a week to answer within your ${s.see.commitment}h commitment.</p>
        <div class="acts"><button class="btn btn-xs btn-secondary" data-a="dismissActive">Dismiss</button><button class="btn btn-xs btn-primary" data-a="applyActive">Apply</button></div></div>`);
    }
    return {
      title: 'Outreach', back: 'started', task: 'Monitoring',
      body: `<div class="sim">Simulated: Oct 3, 10 days after outreach started</div>
        <div class="card"><div class="row"><span class="pill ${p.status === 'On track' ? 'acc' : 'warn'}">${p.status}</span><span style="font-size:14px;font-weight:600">for a ${esc(s.see.start.split(' ')[0])} start</span></div>
          <div style="margin-top:10px">${stat('Contacted', 14, 14)}${stat('Opened', 11, 14, true, true)}${stat('Replied', 5, 14)}${stat('Interested', 3, 14)}</div>
          <div class="small muted" style="margin-top:4px">Opens are approximate: some mail apps pre-load emails. Replies are the headline.</div></div>
        <div class="group" style="margin-top:10px">${PL.row('Replies', '<span class="need-t">2 need you · 31h left</span>', 'go', 'data-r="replies"')}</div>
        <div class="sec">By email</div>
        <div class="card" style="padding:4px 14px"><table class="table"><tr><th>Email</th><th style="text-align:right">Sent</th><th style="text-align:right">Replies</th></tr>
          <tr><td>1 Hook</td><td class="n">14</td><td class="n">2</td></tr><tr><td>2 The role</td><td class="n">9</td><td class="n">2</td></tr><tr><td>3 Why now</td><td class="n">5</td><td class="n">1</td></tr><tr><td>4–5</td><td class="n">–</td><td class="n">–</td></tr></table></div>
        ${sugg.length ? `<div class="sec">Suggestions</div>${sugg.join('')}` : ''}
        ${newLeft ? `<div class="banner" style="margin-top:14px"><div><b>${newLeft} new people match your criteria</b> since Sep 23.<div class="acts"><button class="btn btn-xs" data-a="openNew">Review</button></div></div></div>` : ''}
        <label class="check" style="margin-top:14px;font-size:13px"><input type="checkbox" data-c="perCand" ${o.perCand ? 'checked' : ''}>Adapt send time per candidate once we learn when they engage</label>`,
      footer: `<div class="hint">${o.active} at a time · ${remaining} in queue${o.timingApplied ? ' · sends Tue–Thu mornings' : ''}</div><button class="btn btn-primary" data-a="go" data-r="replies">Open replies</button>`
    };
  };
  A.applyTiming = () => { S().out.timingApplied = true; PL.toast('Send window: Tue–Thu, 8–10am, their time zone', 'timing'); };
  PL.UNDO.timing = () => { S().out.timingApplied = false; };
  A.dismissTiming = () => { S().out.timingDismissed = true; };
  A.applyActive = () => { const o = S().out, prev = o.active; o.active = 8; PL.toast('Now 8 at a time', 'active', prev); };
  PL.UNDO.active = prev => { S().out.active = prev; };
  A.dismissActive = () => { S().out.activeDismissed = true; };
  C.perCand = v => { S().out.perCand = v; };
  A.openNew = () => PL.openSheet('newMatches');
  SHEETS.newMatches = () => {
    const o = S().out;
    const list = D.NEW_MATCHES.filter(n => !o.newAdded[n.id] && !o.newPassed[n.id]);
    return {
      title: `${list.length} new matches`, sub: 'Since Sep 23', tall: true,
      body: list.map(c => `<div class="cand">
          <div class="cand-top">${PL.avatar(c)}<div style="flex:1"><div class="cand-name">${esc(c.name)} · ${esc(c.title)}</div><div class="cand-sub">${esc(c.co)} · ${esc(c.loc)}</div></div></div>
          <div class="exc">Exceptional at <b>${esc((PL.attr(c.exc) || {}).name || c.exc)}</b></div>
          <div class="why"><b>Why a great fit:</b> ${esc(c.why)}</div>
          <div class="cline"><span class="k">Must-haves</span>${esc(PL.mustLine(c))}</div>
          <div class="cline"><span class="k">Rank if added</span>#${c.rankIfAdded} in the queue</div>
          <div class="cand-acts"><button class="btn btn-sm btn-secondary" data-a="newPass" data-id="${c.id}">Pass</button></div></div>`).join('') || '<p class="muted">All reviewed.</p>',
      foot: list.length ? `<button class="btn btn-primary" data-a="newAddAll">Add ${list.length} to the queue</button>` : ''
    };
  };
  A.newPass = d => { S().out.newPassed[d.id] = true; PL.toast(`Passed on ${esc(PL.cand(d.id).name)}`, 'newPass', d.id); };
  PL.UNDO.newPass = id => { delete S().out.newPassed[id]; };
  A.newAddAll = () => {
    const o = S().out, list = D.NEW_MATCHES.filter(n => !o.newAdded[n.id] && !o.newPassed[n.id]);
    list.forEach(n => { o.newAdded[n.id] = true; });
    PL.S.sheet = null;
    PL.toast(`${list.length} added to the queue by rank`);
  };

  /* =========================================================
     Milestone 4 · Replies → chat → take-home
     ========================================================= */
  const STATUS_TXT = {
    waiting: 'Waiting for chat · scheduling link sent', declined: 'Declined · invited to match other roles', takehome: 'Take-home being prepared', sent: 'Take-home sent', another: 'Second chat · link sent'
  };
  SCREENS.replies = () => {
    const m = S().m4;
    const cards = D.REPLIES.map(r => {
      const c = PL.cand(r.id), st = m.status[r.id];
      let act = '';
      if (st === 'new') act = `<button class="btn btn-sm btn-primary" style="width:100%;margin-top:12px" data-a="openNext" data-id="${r.id}">What’s next?</button>`;
      else if (st === 'waiting' || st === 'another') act = `<div class="status-line muted-t">${STATUS_TXT[st]}</div><button class="btn btn-sm btn-secondary" style="width:100%;margin-top:10px" data-a="chatDone" data-id="${r.id}">Chat happened: add notes</button>`;
      else if (st === 'takehome') act = `<button class="btn btn-sm btn-secondary" style="width:100%;margin-top:12px" data-a="openTH" data-id="${r.id}">Continue the take-home</button>`;
      else act = `<div class="status-line ${st === 'declined' ? 'muted-t' : ''}">${STATUS_TXT[st] || ''}</div>`;
      return `<div class="reply"><div class="row">${PL.avatar(c, 38)}<div style="flex:1;min-width:0"><div style="font-weight:600;font-size:14.5px">${esc(c.name)}</div><div class="small muted">${esc(c.title)} · ${esc(c.co)}</div></div><span class="pill acc">${esc(r.kind)}</span></div>
        <div class="msg">“${esc(r.msg)}”<div class="small muted" style="margin-top:6px">${esc(r.when)} · reply to email ${r.id === 'c2' ? 1 : 2}</div></div>${act}</div>`;
    }).join('');
    return {
      title: 'Replies', back: 'monitor', task: 'Replies',
      body: `<div class="card" style="background:var(--accent-soft);border-color:var(--accent-soft-2);font-size:13.5px;line-height:1.5;color:var(--accent-ink)"><b>3 interested replies.</b> Replying made them candidates: they’ve joined the Pathline network, open to new roles.</div>
        <div style="margin-top:12px">${cards}</div>`,
      footer: `<button class="btn btn-secondary" data-a="go" data-r="reviewq">Skip to take-home reviews</button>`
    };
  };
  A.openNext = d => { const r = D.REPLIES.find(x => x.id === d.id); S().ui.nextChoice = r.rec; PL.openSheet('next', { id: d.id }); };
  SHEETS.next = sh => {
    const r = D.REPLIES.find(x => x.id === sh.id), c = PL.cand(sh.id), ch = S().ui.nextChoice;
    return {
      title: `${esc(first(c))} replied: “${esc(r.kind)}”`, sub: `${esc(c.title)} · ${esc(c.co)}`,
      body: `<div class="sec" style="margin-top:0">What’s next?</div>
        <div class="chips">${PL.chip('Chat first', ch === 'chat', 'nextChoice', 'data-v="chat"')}${PL.chip('Straight to take-home', ch === 'takehome', 'nextChoice', 'data-v="takehome"')}</div>
        <div class="card" style="margin-top:12px"><div class="small" style="font-weight:600;margin-bottom:6px">We suggest ${r.rec === 'chat' ? 'a chat first' : 'going straight to the take-home'}:</div><ul style="margin:0;padding-left:18px;font-size:13.5px;line-height:1.55">${r.reasons.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
        ${ch === 'chat' ? `<label class="field-label" style="margin-top:14px">Your scheduling link</label><input class="field" data-i="bookingLink" value="${esc(S().m4.bookingLink)}"><p class="small muted" style="margin:6px 2px 0">The chat is booked on your own calendar, outside Pathline. We’ll ask for notes afterwards.</p>`
          : `<p class="small muted" style="margin:14px 2px 0">We’ll generate a take-home that tests your ranked attributes and skills, for you to review before it’s sent.</p>`}`,
      foot: `<button class="btn btn-primary" data-a="nextGo" data-id="${sh.id}">${ch === 'chat' ? 'Send scheduling link' : 'Prepare take-home'}</button>`
    };
  };
  A.nextChoice = d => { S().ui.nextChoice = d.v; };
  I.bookingLink = v => { S().m4.bookingLink = v; };
  A.nextGo = d => {
    const m = S().m4, c = PL.cand(d.id);
    if (S().ui.nextChoice === 'chat') { m.status[d.id] = 'waiting'; PL.S.sheet = null; PL.toast(`Scheduling link sent to ${esc(first(c))}`); }
    else { m.status[d.id] = 'takehome'; m.thCand = d.id; PL.go('takehome'); }
  };
  A.chatDone = d => { const m = S().m4; m.chatCand = d.id; m.chat = { overall: null, want: null, note: '', transcript: '', consent: false }; PL.go('postchat'); };
  A.openTH = d => { S().m4.thCand = d.id; PL.go('takehome'); };

  SCREENS.postchat = () => {
    const m = S().m4, c = PL.cand(m.chatCand || 'c1'), ch = m.chat;
    const ok = ch.overall && (!ch.transcript.trim() || ch.consent);
    return {
      title: 'After the chat', back: 'replies', task: 'After the chat',
      body: `<div class="row" style="margin-top:4px">${PL.avatar(c, 42)}<div><div style="font-weight:600;font-size:16px">How did the chat with ${esc(first(c))} go?</div><div class="small muted">Before you see anything else.</div></div></div>
        <div class="sec">Overall</div><div class="chips">${['Strong yes', 'Yes', 'Unsure', 'No'].map(x => PL.chip(x, ch.overall === x, 'chatSet', `data-k="overall" data-v="${x}"`)).join('')}</div>
        <div class="sec">Would you want to work with them?</div><div class="chips">${['Yes', 'Not sure', 'No'].map(x => PL.chip(x, ch.want === x, 'chatSet', `data-k="want" data-v="${x}"`)).join('')}</div>
        <div class="sec">Anything else?</div><textarea class="field" rows="2" data-i="chatNote" placeholder="Optional">${esc(ch.note)}</textarea>
        <div class="sec">Transcript</div>
        <div class="row" style="margin-bottom:8px"><button class="btn btn-xs btn-secondary" data-a="pasteTranscript">Paste sample transcript</button><button class="btn btn-xs btn-secondary" data-a="uploadTranscript">Upload</button></div>
        <textarea class="field transcript" data-i="chatTranscript" placeholder="Paste from any notetaker">${esc(ch.transcript)}</textarea>
        <label class="check" style="margin-top:10px"><input type="checkbox" data-c="chatConsent" ${ch.consent ? 'checked' : ''}>The candidate agreed to the recording. California requires every party’s consent.</label>
        <p class="small muted" style="margin:12px 2px 0">Pathline reads the transcript to focus the take-home. That read stays internal.</p>`,
      footer: `<div class="row"><button class="btn btn-secondary" data-a="openPassChat">Pass</button><button class="btn btn-secondary" data-a="anotherChat">Another chat</button></div>
        <button class="btn btn-primary" data-a="chatToTH" ${ok ? '' : 'disabled'}>${ch.overall ? (ok ? 'Send take-home' : 'Confirm recording consent') : 'Give your gut check first'}</button>`
    };
  };
  A.chatSet = d => { S().m4.chat[d.k] = d.v; };
  I.chatNote = v => { S().m4.chat.note = v; };
  I.chatTranscript = v => { S().m4.chat.transcript = v; PL.liveFooter(); };
  C.chatConsent = v => { S().m4.chat.consent = v; };
  A.pasteTranscript = () => { S().m4.chat.transcript = D.TRANSCRIPT; };
  A.uploadTranscript = () => { PL.toast('In this prototype, use the sample transcript'); };
  A.anotherChat = () => { const m = S().m4; m.status[m.chatCand || 'c1'] = 'another'; PL.go('replies'); PL.toast('Scheduling link sent for a second chat'); };
  A.chatToTH = () => { const m = S().m4, id = m.chatCand || 'c1'; m.status[id] = 'takehome'; m.thCand = id; PL.go('takehome'); };

  const NOTE_BY_REASON = {
    tech: 'For this role, the team is prioritizing hands-on experience running evaluations for LLM features in production.',
    own: 'For this role, the team is prioritizing experience owning a product end to end as the only PM.',
    emp: 'For this role, the team is prioritizing deep, recent work with social and brand teams.',
    rig: 'For this role, the team is prioritizing experience owning quality metrics for AI features.',
    adapt: 'For this role, the team is prioritizing experience in fast-changing, early-stage environments.'
  };
  A.openPassChat = () => { S().ui.passReasons = []; S().ui.declineNote = true; S().ui.sendWhen = 'now'; PL.openSheet('passChat', { id: S().m4.chatCand || 'c1' }); };
  PL.declineHTML = (c, extra, mode) => {
    const u = S().ui, m = S().m4;
    const aid = (S().attrs.find(a => u.passReasons.includes(a.name)) || {}).id;
    const note = u.declineNote ? (NOTE_BY_REASON[aid] || 'For this role, the team is prioritizing a slightly different mix of experience.') : '';
    const warm = m.chat.overall !== 'No' ? 'She enjoyed the conversation, and she’s' : 'She’s';
    const opening = mode === 'th'
      ? `Thank you for the time you put into the take-home for the ${esc(PL.titleText())} role. Farah and the team have decided not to move forward this time.`
      : `Thank you for taking the time to talk with Farah about the ${esc(PL.titleText())} role. ${warm} decided not to move forward this time.`;
    return `<div class="small muted">From: Pathline, on behalf of Farah Uraizee (Nectar Social)<br>Subject: ${mode === 'th' ? 'Your take-home for' : 'Your conversation with'} Nectar Social</div>
      <p>Hi ${esc(first(c))},</p><p>${opening}</p>
      ${note ? `<p><span class="slot">${esc(note)}</span></p>` : ''}${extra || ''}
      <p>This doesn’t close any doors on Pathline. Based on what you’ve told us about what you’re looking for, we think you’d be a strong match for other roles on the platform, and we’d like to introduce you to them as they come up.</p>
      <div class="onetap"><span>Yes, match me to other roles</span><span>Not right now</span></div>
      <p>Thanks again for your time,<br>The Pathline team</p>`;
  };
  SHEETS.passChat = sh => {
    const c = PL.cand(sh.id), u = S().ui;
    const reasons = S().attrs.map(a => a.name).concat(['Interest', 'Must-have', 'Other']);
    return {
      title: `Pass on ${esc(c.name)}?`, tall: true,
      body: `<div class="sec" style="margin-top:0">Why? Only Pathline sees this.</div>
        <div class="chips">${reasons.map(r => PL.chip(esc(r), u.passReasons.includes(r), 'passReason', `data-v="${esc(r)}"`)).join('')}</div>
        <div class="sec">We’ll send a note on your behalf</div>
        <div class="card"><div class="email-body" style="border:0;padding:0">${PL.declineHTML(c)}</div></div>
        <label class="check" style="margin-top:12px"><input type="checkbox" data-c="declineNote" ${u.declineNote ? 'checked' : ''}>Include a short, job-related note on the decision</label>
        <div class="sec">Send</div><div class="chips">${PL.chip('Now', u.sendWhen === 'now', 'sendWhen', 'data-v="now"')}${PL.chip('Within 48h', u.sendWhen === 'later', 'sendWhen', 'data-v="later"')}</div>`,
      foot: `<div class="row"><button class="btn btn-secondary" data-a="closeSheet">Cancel</button><button class="btn btn-primary" data-a="passSend" data-id="${c.id}">Pass and send</button></div>`
    };
  };
  C.declineNote = v => { S().ui.declineNote = v; };
  A.sendWhen = d => { S().ui.sendWhen = d.v; };
  A.passSend = d => { S().m4.status[d.id] = 'declined'; PL.go('replies'); PL.toast(`Note ${S().ui.sendWhen === 'now' ? 'sent' : 'scheduled'} on Farah’s behalf. ${esc(first(PL.cand(d.id)))} is invited to match other roles.`); };

  /* Take-home */
  const SKILL_NAMES = { 'skill-ai': 'Gen AI (skill)', 'skill-metrics': 'Metrics (skill)' };
  PL.coverage = () => {
    const s = S(), cov = {};
    const extra = s.m4.extraCover || {};
    D.TAKEHOME.sections.forEach(sec => sec.tests.forEach(t => { cov[t] = (cov[t] || 0) + 1; }));
    Object.keys(extra).forEach(k => { cov[k] = (cov[k] || 0) + 1; });
    return s.attrs.map(a => ({ id: a.id, name: a.name, n: cov[a.id] || 0 })).concat(Object.keys(SKILL_NAMES).map(k => ({ id: k, name: SKILL_NAMES[k], n: cov[k] || 0 })));
  };
  SCREENS.takehome = () => {
    const s = S(), m = s.m4, c = PL.cand(m.thCand || 'c1'), rows = PL.coverage();
    const gap = m.thCand === 'c1' || m.thCand === 'c3' ? 'adapt' : null;
    const uncovered = rows.filter(r => !r.n);
    const nameOf = t => (SKILL_NAMES[t] || (PL.attr(t) || {}).name || null);
    const secs = D.TAKEHOME.sections.map(sec => {
      const open = s.ui.secOpen[sec.id];
      const extraIds = sec.id === 'decisions' ? Object.keys(m.extraCover || {}) : [];
      let html = sec.html.replace('[[timebox]]', esc(m.timebox.replace('h', ' hours')));
      if (extraIds.length) html = html.replace('</ul>', extraIds.map(k => `<li>${esc(m.extraCover[k])}</li>`).join('') + '</ul>');
      const tests = sec.tests.concat(extraIds).map(nameOf).filter(Boolean);
      const gapNote = gap && sec.tests.includes(gap) && PL.attr(gap) ? `<div class="gapnote">${esc(PL.attr(gap).name)}: weighted up, not seen in the chat</div>` : '';
      return `<div class="sec-card ${open ? 'open' : ''}" data-a="toggleSec" data-k="${sec.id}"><div class="h">${esc(sec.title)}</div>
        ${tests.length ? `<div class="tests-line">Tests: ${tests.map(esc).join(', ')}</div>` : ''}${gapNote}
        ${open ? `<div class="b">${html}</div>` : ''}</div>`;
    }).join('');
    return {
      title: 'Take-home', back: 'replies', task: 'Take-home',
      body: `<div class="row" style="margin-top:4px">${PL.avatar(c, 38)}<div><div style="font-weight:600;font-size:15px">For ${esc(c.name)}</div><div class="small muted">${esc(PL.titleText())} · generated from your role and fact bank</div></div></div>
        <div class="group" style="margin-top:12px"><div class="fld-row"><span class="k">Time box</span><div class="v"><select class="field inline" data-c="timebox">${PL.options(['2h', '3h', '4h'], m.timebox)}</select></div></div>
          <div class="fld-row"><span class="k">AI tools</span><div class="v">Encouraged, and part of the review</div></div>
          <div class="fld-row"><span class="k">Paid</span><div class="v"><span class="small muted">No. Effort signals interest; a strong result boosts them across Pathline.</span></div></div></div>
        ${uncovered.length ? `<div class="flag" style="margin-top:12px"><div><b>${uncovered.map(u => esc(u.name)).join(', ')} ${uncovered.length > 1 ? 'aren’t' : 'isn’t'} tested yet.</b> You can still send it, but we won’t get signal there.<div class="row" style="margin-top:8px;flex-wrap:wrap">${uncovered.map(u => `<button class="btn btn-xs btn-secondary" data-a="coverAttr" data-id="${u.id}">Add a question for ${esc(u.name)}</button>`).join('')}</div></div></div>` : ''}
        <div class="sec">Assignment</div>${secs}
        <p class="small muted" style="margin:12px 2px 0">${esc(D.TAKEHOME.note)}</p>
        <div class="change-all"><div class="t">Change the assignment</div><div class="row"><input class="field" id="th-all" value="${esc(s.ui.voice['th-all'] || '')}" placeholder="e.g. make it a mobile flow" data-enter="reviseTH"><button class="btn btn-sm btn-primary" data-a="reviseTH">Apply</button></div>${PL.talkLink('th-all')}</div>`,
      footer: `<button class="btn btn-primary" data-a="sendTH">Approve and send</button>`
    };
  };
  PL.VOICE['th-all'] = 'Make it a mobile flow instead of a web prototype';
  A.toggleSec = d => { const o = S().ui.secOpen; o[d.k] = !o[d.k]; };
  C.timebox = v => { S().m4.timebox = v; };
  A.coverAttr = d => {
    const m = S().m4, a = PL.attr(d.id);
    m.extraCover = m.extraCover || {};
    m.extraCover[d.id] = `Tell us about a moment in this project where ${a ? a.name.toLowerCase() : 'this'} mattered, and what you did.`;
    S().ui.secOpen.decisions = true;
    PL.toast(`Added a question for ${esc(a ? a.name : d.id)} to “Decisions”`);
  };
  A.reviseTH = () => { const el = document.getElementById('th-all'); if (!el || !el.value.trim()) { if (el) el.focus(); return; } delete S().ui.voice['th-all']; PL.toast('In this prototype, the assignment text is fixed. Prompt revisions work like the emails.'); };
  A.sendTH = () => { const m = S().m4; m.thSent = true; m.status[m.thCand || 'c1'] = 'sent'; PL.go('thsent'); };
  PL.FILL.postchat = () => { const m = S().m4; if (!m.chatCand) m.chatCand = 'c1'; };
  PL.FILL.takehome = () => { const m = S().m4; if (!m.thCand) m.thCand = 'c1'; if (m.status[m.thCand] === 'new' || m.status[m.thCand] === 'waiting') m.status[m.thCand] = 'takehome'; };
  PL.FILL.thsent = () => { const m = S().m4; m.thSent = true; m.status[m.thCand || 'c1'] = 'sent'; };

  SCREENS.thsent = () => {
    const s = S(), m = s.m4, c = PL.cand(m.thCand || 'c1');
    const rev = { 24: 'Oct 14', 48: 'Oct 15', 72: 'Oct 16' }[s.see.commitment] || 'Oct 15';
    return {
      title: 'Take-home sent', back: 'takehome', task: 'Take-home sent',
      body: `<div class="big-ok"><div class="ring">${ic('check')}</div><h2>Take-home sent</h2><p>to ${esc(c.name)}</p></div>
        <div class="group">
          <div class="fld-row"><span class="k">Due</span><div class="v">8pm, Oct 13 <span class="small muted">(they picked, within 7 days)</span></div></div>
          <div class="fld-row"><span class="k">We review</span><div class="v"><b>by ${rev}</b> · tracked</div></div>
          <div class="fld-row"><span class="k">Decision</span><div class="v"><b>by ${rev}</b> · tracked</div></div>
          <div class="fld-row"><span class="k">Time box</span><div class="v">${esc(m.timebox.replace('h', ' hours'))} · AI tools encouraged</div></div>
        </div>
        <div class="sec">They’ll know we evaluate</div>
        <div class="chips">${s.attrs.map(a => `<span class="pill">${esc(a.name)}</span>`).join('')}</div>
        <p style="font-size:13.5px;line-height:1.5;color:var(--ink-2);margin:14px 2px 0">Graded by Pathline’s AI, attribute by attribute. ${esc(first(c))} can request a human review, and a strong take-home counts toward other roles on Pathline if they opt in.</p>
        <div class="sec">Status</div>
        <div class="card"><div class="tracker"><div class="st on"><i></i>Sent</div><div class="ln"></div><div class="st"><i></i>Opened</div><div class="ln"></div><div class="st"><i></i>Submitted</div></div></div>`,
      footer: `<button class="btn btn-primary" data-a="go" data-r="reviewq">Skip ahead: submissions arrive</button><div class="hint">Simulated time</div>`
    };
  };

  /* =========================================================
     Milestone 5 · Review → onsite
     ========================================================= */
  const gradeCls = g => g === 'Strong' || g === 'Exceeds' ? 'S' : g === 'Medium' || g === 'Meets' ? 'M' : 'U';
  SCREENS.reviewq = () => {
    const s = S(), m5 = s.m5;
    const pending = D.SUBMISSIONS.filter(x => !m5.final[x.id]), done = D.SUBMISSIONS.filter(x => m5.final[x.id]);
    const card = x => {
      const c = PL.cand(x.id), mine = m5.mine[x.id];
      const strong = s.attrs.filter(a => x.grades[a.id] === 'Strong').map(a => a.name), med = s.attrs.filter(a => x.grades[a.id] === 'Medium').map(a => a.name);
      return `<div class="cand tapcard" data-a="openSub" data-id="${x.id}"><div class="cand-top">${PL.avatar(c)}<div style="flex:1"><div class="cand-name">${esc(c.name)} · ${esc(c.title)}</div><div class="cand-sub">Submitted ${esc(x.submitted)}</div></div></div>
        <div class="cline" style="margin-top:10px"><span class="k">Due</span><span class="${x.left <= 12 ? 'hot-t' : ''}">${esc(x.due)} · ${x.left}h left</span></div>
        <div class="cline"><span class="k">Strong</span>${esc(strong.join(', ') || 'None')}</div>
        ${med.length ? `<div class="cline"><span class="k">Medium</span>${esc(med.join(', '))}</div>` : ''}
        <div class="cline"><span class="k">Reviewers</span>Farah ${mine ? 'done' : 'to do'} · Kaan ${x.reviewers.kaan ? 'done' : 'to do'}</div>
        <div class="cand-acts"><button class="btn btn-sm btn-primary" data-a="openDecide" data-id="${x.id}">Decide</button></div></div>`;
    };
    return {
      title: 'Take-home reviews', back: 'thsent', task: 'Take-home reviews',
      body: `<div class="sim">Simulated: Oct 14, 7am</div>
        <div class="card"><div style="font-weight:600;font-size:15px">${pending.length} to review${pending.some(x => x.left <= 12) ? ' · 1 due today' : ''}</div><div class="small muted" style="margin-top:3px">Deadlines are ${s.see.commitment}h from submission. Candidates were told these dates.</div></div>
        <div style="margin-top:10px">${pending.map(card).join('') || '<p class="muted small">All caught up.</p>'}</div>
        ${done.length ? `<div class="sec">Decided</div><div class="group">${done.map(x => { const c = PL.cand(x.id); return `<div class="li">${PL.avatar(c, 34)}<div class="b"><div class="t1">${esc(c.name)}</div><div class="t2">${m5.final[x.id] === 'advance' ? 'Advanced to onsite' : 'Declined · invited to match other roles'}</div></div></div>`; }).join('')}</div>` : ''}`,
      footer: `<button class="btn btn-primary" data-a="go" data-r="onsite">Onsite list</button>`
    };
  };
  A.openSub = d => PL.openSheet('sub', { id: d.id });
  SHEETS.sub = sh => {
    const s = S(), x = D.SUBMISSIONS.find(y => y.id === sh.id), c = PL.cand(sh.id);
    const rows = s.attrs.map(a => { const g = x.grades[a.id] || 'Unknown'; return `<div class="grade-row"><span class="nm">${esc(a.name)}</span><span class="lv ${gradeCls(g)}">${esc(g)}</span></div>${x.excerpt[a.id] ? `<div class="small muted" style="margin:-2px 0 8px;line-height:1.45">${esc(x.excerpt[a.id])}</div>` : ''}`; }).join('');
    return {
      title: esc(c.name), sub: `Take-home · submitted ${esc(x.submitted)}`, tall: true,
      body: `<div class="card" style="font-size:14px"><div style="font-weight:600">Relay prototype and quality plan</div><div class="small muted" style="margin-top:2px">Clickable prototype link and a 1-page plan (demo)</div></div>
        <div class="sec">Grades by attribute</div><div class="card" style="padding:4px 14px">${rows}
          <div class="grade-row"><span class="nm">Gen AI (skill)</span><span class="lv ${gradeCls(x.ai)}">${esc(x.ai)}</span></div>
          <div class="grade-row"><span class="nm">Metrics (skill)</span><span class="lv ${gradeCls(x.metrics)}">${esc(x.metrics)}</span></div></div>
        <p class="small muted" style="margin:12px 2px 0">Graded by Pathline’s AI, per attribute, never as a single score. You make the decision. ${esc(first(c))} can request a human review.</p>`,
      foot: `<button class="btn btn-primary" data-a="openDecide" data-id="${x.id}">Decide</button>`
    };
  };
  A.openDecide = d => { S().ui.myDec = null; S().ui.myNote = ''; PL.openSheet('decide', { id: d.id }); };
  SHEETS.decide = sh => {
    const s = S(), m5 = s.m5, x = D.SUBMISSIONS.find(y => y.id === sh.id), c = PL.cand(sh.id), mine = m5.mine[x.id];
    if (!mine) {
      return {
        title: `${esc(c.name)}: your decision`,
        body: `<div class="chips">${PL.chip('Advance to onsite', s.ui.myDec === 'advance', 'myDec', 'data-v="advance"')}${PL.chip('Reject', s.ui.myDec === 'reject', 'myDec', 'data-v="reject"')}</div>
          <label class="field-label" style="margin-top:14px">Note (optional)</label><textarea class="field" rows="2" data-i="myNote" placeholder="Visible to the hiring team">${esc(s.ui.myNote)}</textarea>
          <p class="small muted" style="margin:12px 2px 0">Other reviewers’ decisions appear after you submit.</p>`,
        foot: `<button class="btn btn-primary" data-a="submitDec" data-id="${x.id}" ${s.ui.myDec ? '' : 'disabled'}>Submit</button>`
      };
    }
    const k = x.reviewers.kaan, agree = k === mine.v;
    return {
      title: `${esc(c.name)}: decisions`, sub: 'Revealed after you submitted',
      body: `<div class="reveal"><div class="li"><div class="b"><div class="t1">You</div>${mine.note ? `<div class="t2">“${esc(mine.note)}”</div>` : ''}</div><span class="pill ${mine.v === 'advance' ? 'acc' : ''}">${mine.v === 'advance' ? 'Advance' : 'Reject'}</span></div>
        <div class="li"><div class="b"><div class="t1">Kaan</div><div class="t2">${k ? `“${esc(x.kaanNote)}”` : 'Hasn’t decided yet'}</div></div>${k ? `<span class="pill ${k === 'advance' ? 'acc' : ''}">${k === 'advance' ? 'Advance' : 'Reject'}</span>` : '<span class="pill">Pending</span>'}</div></div>
        ${k ? (agree ? `<div class="flag ok" style="margin-top:12px"><div>You agree.</div></div>` : `<div class="flag" style="margin-top:12px"><div><b>You disagree.</b> Worth a quick word before the final call.</div></div>`) : ''}
        <div class="sec">Final call: you’re the hiring manager</div>`,
      foot: `<div class="row"><button class="btn btn-secondary" data-a="finalReject" data-id="${x.id}">Reject</button><button class="btn btn-primary" data-a="finalAdvance" data-id="${x.id}">Advance to onsite</button></div>`
    };
  };
  A.myDec = d => { S().ui.myDec = d.v; };
  I.myNote = v => { S().ui.myNote = v; };
  A.submitDec = d => { const s = S(); s.m5.mine[d.id] = { v: s.ui.myDec, note: s.ui.myNote }; };
  A.finalAdvance = d => {
    const m5 = S().m5;
    m5.final[d.id] = 'advance';
    if (!m5.onsite.some(o => o.id === d.id)) m5.onsite.unshift({ id: d.id, state: 'toschedule', sent: null, adv: 'today' });
    PL.S.sheet = null;
    PL.toast(`${esc(first(PL.cand(d.id)))} advances to onsite. They’ll hear within ${S().see.commitment}h.`);
  };
  A.finalReject = d => { S().ui.passReasons = []; S().ui.declineNote = true; PL.openSheet('declineTH', { id: d.id }); };
  SHEETS.declineTH = sh => {
    const c = PL.cand(sh.id), x = D.SUBMISSIONS.find(y => y.id === sh.id);
    const strong = S().attrs.filter(a => x.grades[a.id] === 'Strong').map(a => a.name.toLowerCase());
    const boost = strong.length >= 2 ? `<p><span class="slot">Your take-home was strong on ${esc(strong.slice(0, 2).join(' and '))}. If you opt in, those results count toward other roles on Pathline, so you won’t need to prove the same things twice.</span></p>` : '';
    return {
      title: `Decline ${esc(c.name)}?`, tall: true,
      body: `<div class="sec" style="margin-top:0">Note sent on your behalf</div><div class="card"><div class="email-body" style="border:0;padding:0">${PL.declineHTML(c, boost, 'th')}</div></div>`,
      foot: `<div class="row"><button class="btn btn-secondary" data-a="closeSheet">Cancel</button><button class="btn btn-primary" data-a="sendDeclineTH" data-id="${c.id}">Send decline</button></div>`
    };
  };
  A.sendDeclineTH = d => { S().m5.final[d.id] = 'reject'; PL.S.sheet = null; PL.toast(`Declined. ${esc(first(PL.cand(d.id)))} is invited to match other roles.`); };

  SCREENS.onsite = () => {
    const s = S(), list = s.m5.onsite;
    const onsiteStage = s.see.stages.find(st => /onsite/i.test(st.name)) || s.see.stages[1] || s.see.stages[0];
    const g = st => list.filter(o => o.state === st);
    const row = o => {
      const c = PL.cand(o.id);
      if (o.state === 'toschedule') {
        const sub = o.sent ? `Advanced ${o.adv || 'Oct 10'} · link sent ${esc(o.sent)}` : `Advanced ${o.adv || 'today'}`;
        return `<div class="li" style="align-items:flex-start">${PL.avatar(c, 36)}<div class="b"><div class="t1">${esc(c.name)}</div><div class="t2">${sub}</div>
          ${o.nudge ? `<div class="flagline">Not booked after 3 days</div>` : ''}
          <div class="row" style="margin-top:8px">${o.sent ? `<button class="btn btn-xs btn-secondary" data-a="sendLink" data-id="${o.id}">Resend link</button>` : `<button class="btn btn-xs btn-primary" data-a="sendLink" data-id="${o.id}">Send scheduling link</button>`}<button class="btn btn-xs btn-secondary" data-a="openSchedule" data-id="${o.id}">Mark scheduled</button></div></div></div>`;
      }
      return `<div class="li">${PL.avatar(c, 36)}<div class="b"><div class="t1">${esc(c.name)}</div><div class="t2">Onsite ${esc(o.date)} · ${onsiteStage.h}h · ${esc(s.reqs.office)}</div></div></div>`;
    };
    return {
      title: 'Onsite', back: 'reviewq', task: 'Onsite',
      body: `<div class="sec" style="margin-top:4px">To schedule</div><div class="group">${g('toschedule').map(row).join('') || '<div class="li"><div class="b t2">Nobody waiting</div></div>'}</div>
        <div class="sec">Scheduled</div><div class="group">${g('scheduled').map(row).join('') || '<div class="li"><div class="b t2">None yet</div></div>'}</div>
        <div class="sec">Done</div><div class="group"><div class="li"><div class="b"><div class="t2">Onsite and final interview tools are out of scope for this prototype.</div></div></div></div>
        <div class="verdict ${list.length >= 3 ? 'healthy' : 'tight'}" style="margin-top:14px"><div><b>${list.length >= 3 ? 'On pace' : 'Building'}</b><div style="margin-top:3px">${list.length} onsite${list.length === 1 ? '' : 's'} for a ${esc(s.see.start.split(' ')[0])} start${list.length >= 3 ? '.' : '. More replies are coming from the queue.'}</div></div></div>`,
      footer: `<div class="hint">That’s the end of the employer flow in this prototype.</div><button class="btn btn-secondary" data-a="reset">Restart the demo</button>`
    };
  };
  A.sendLink = d => { const o = S().m5.onsite.find(x => x.id === d.id); o.sent = 'today'; o.nudge = false; PL.toast(`Scheduling link sent to ${esc(first(PL.cand(d.id)))}, with what to expect`); };
  A.openSchedule = d => { S().ui.schedDate = 'Oct 22'; PL.openSheet('schedule', { id: d.id }); };
  SHEETS.schedule = sh => ({
    title: `Mark ${esc(PL.cand(sh.id).name)} scheduled`,
    body: `<label class="field-label">Onsite date</label><select class="field" data-c="schedDate">${PL.options(['Oct 20', 'Oct 21', 'Oct 22', 'Oct 23', 'Oct 24'], S().ui.schedDate)}</select>`,
    foot: `<button class="btn btn-primary" data-a="markScheduled" data-id="${sh.id}">Mark scheduled</button>`
  });
  C.schedDate = v => { S().ui.schedDate = v; };
  A.markScheduled = d => { const o = S().m5.onsite.find(x => x.id === d.id); o.state = 'scheduled'; o.date = S().ui.schedDate; o.nudge = false; PL.S.sheet = null; PL.toast('Scheduled'); };

  /* =========================================================
     Menu data: what needs you, and milestone summaries
     ========================================================= */
  const reached = id => (S().maxIdx || 0) >= PL.routeIdx(id) || PL.routeIdx(S().route) >= PL.routeIdx(id);
  PL.needsYou = () => {
    const s = S(), t = [];
    if (s.jd.imported && (!s.see.title || !s.jd.work)) t.push({ label: 'Answer questions about your posting', r: 'import' });
    if (reached('see') && !s.seq.approved) {
      const m = PL.seeMissing ? PL.seeMissing() : [];
      if (m.length) t.push({ label: `${m.length} detail${m.length > 1 ? 's' : ''} needed before the emails: ${m.join(', ')}`, r: 'see' });
    }
    if (reached('monitor')) {
      const newReplies = D.REPLIES.filter(r => s.m4.status[r.id] === 'new').length;
      if (newReplies) t.push({ label: `${newReplies} repl${newReplies > 1 ? 'ies' : 'y'} to answer`, due: '31h left', r: 'replies' });
      const waiting = D.REPLIES.filter(r => s.m4.status[r.id] === 'waiting' || s.m4.status[r.id] === 'another');
      waiting.forEach(r => t.push({ label: `Add notes from your chat with ${first(PL.cand(r.id))}`, r: 'replies' }));
      const nm = D.NEW_MATCHES.filter(n => !s.out.newAdded[n.id] && !s.out.newPassed[n.id]).length;
      if (nm) t.push({ label: `${nm} new people match your criteria`, r: 'monitor', open: 'openNew' });
      const p = PL.projection(s.out.active, Math.max(1, PL.approved().length));
      if (p.status !== 'On track') t.push({ label: `${p.status} for a ${s.see.start.split(' ')[0]} start`, r: 'monitor' });
    }
    if (reached('reviewq')) {
      const pend = D.SUBMISSIONS.filter(x => !s.m5.final[x.id]);
      if (pend.length) t.push({ label: `${pend.length} take-home${pend.length > 1 ? 's' : ''} to review`, due: pend.some(x => x.left <= 12) ? '1 due today' : '', r: 'reviewq' });
      s.m5.onsite.filter(o => o.state === 'toschedule' && o.nudge).forEach(o => t.push({ label: `${first(PL.cand(o.id))} hasn’t booked an onsite`, due: '3 days', r: 'onsite' }));
      s.m5.onsite.filter(o => o.state === 'toschedule' && !o.sent).forEach(o => t.push({ label: `Send ${first(PL.cand(o.id))} a scheduling link`, r: 'onsite' }));
    }
    return t;
  };
  /* Chat & take-home opens as soon as replies exist; review opens once a take-home is out. */
  PL.milestoneReady = m => (m === 4 && reached('monitor')) || (m === 5 && (S().m4.thSent || reached('reviewq')));
  PL.milestoneSummary = m => {
    const s = S();
    if (m === 1) return s.sl.final ? `${s.sl.final.length} pre-candidates` : '';
    if (m === 2) return s.out.started ? `${PL.approved().length} pre-candidates · ${s.out.active} at a time` : '';
    if (m === 3) return reached('monitor') ? '14 contacted · 5 replies' : '';
    if (m === 4) return reached('replies') ? `3 replies${s.m4.thSent ? ' · take-home sent' : ''}` : '';
    if (m === 5) return reached('reviewq') ? `${D.SUBMISSIONS.length} take-homes · ${s.m5.onsite.length} onsites` : '';
    return '';
  };
})(window.PL);
