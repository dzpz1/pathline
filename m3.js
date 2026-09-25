/* Pathline prototype — Milestones 3–5: monitoring → replies, chat, practical assessment → review → onsite */
(function (PL) {
  const D = PL.D, A = PL.A, I = PL.I, C = PL.C, SCREENS = PL.SCREENS, SHEETS = PL.SHEETS, esc = PL.esc, ic = PL.ic;
  const S = () => PL.S;
  const first = c => c.name.split(' ')[0];

  /* =========================================================
     Milestone 3 · Monitoring
     ========================================================= */
  /* The demo skips ahead in time; say so plainly at the top of the screen. */
  PL.timeJump = (big, sub) => `<div class="timejump"><div class="tj-k">Simulated time</div><div class="tj-big">${big}</div><div class="tj-sub">${sub}</div></div>`;
  SCREENS.monitor = () => {
    const s = S(), o = s.out;
    const remaining = Math.max(0, PL.approved().length - 14);
    const p = PL.projection(o.active, Math.max(1, PL.approved().length));
    const stat = (l, n, max, dim, approx) => `<div class="stat-row"><span>${l}</span><span class="bar"><i class="${dim ? 'dim' : ''}" style="width:${n / max * 100}%"></i></span><span class="n">${approx ? '~' : ''}${n}</span></div>`;
    const sugg = [];
    if (!o.timingDismissed && o.window !== 'Tue–Thu, 8–10am') sugg.push(`<div class="sugg-card"><div class="h">Send Tue–Thu, 8–10am their time</div>
      <p>4 of your 5 replies came in that window. That’s a small sample, so this also leans on Pathline benchmarks for senior PMs.</p>
      <div class="acts"><button class="btn btn-xs btn-secondary" data-a="dismissTiming">Dismiss</button><button class="btn btn-xs btn-primary" data-a="applyTiming">Apply</button></div></div>`);
    if (!o.activeDismissed && o.active < 8) {
      const p8 = PL.projection(8, Math.max(1, PL.approved().length));
      sugg.push(`<div class="sugg-card"><div class="h">Go from ${o.active} to 8 at a time</div>
        <p>Replies are below forecast. At 8, everyone is contacted by ${p8.date} instead of ${p.date}, with ${p8.replies} replies a week to answer within your ${s.see.commitment}h commitment.</p>
        <div class="acts"><button class="btn btn-xs btn-secondary" data-a="dismissActive">Dismiss</button><button class="btn btn-xs btn-primary" data-a="applyActive">Apply</button></div></div>`);
    }
    return {
      title: 'Optimize outreach', back: 'sequence', task: 'Optimize outreach',
      body: `${PL.timeJump('10 days later', 'Oct 3 · outreach started Sep 23')}
        <div class="card"><div class="row"><span class="pill ${p.status === 'On track' ? 'acc' : 'warn'}">${p.status}</span><span style="font-size:14px;font-weight:600">for a ${esc(s.see.start.split(' ')[0])} start</span></div>
          <div style="margin-top:10px">${stat('Contacted', 14, 14)}${stat('Opened', 11, 14, true, true)}${stat('Replied', 5, 14)}${stat('Interested', 3, 14)}</div>
          <div class="small muted" style="margin-top:4px">Opens are approximate: some mail apps pre-load emails. Replies are the headline.</div></div>
        <div class="sec">By email</div>
        <div class="card" style="padding:4px 14px"><table class="table"><tr><th>Email</th><th style="text-align:right">Sent</th><th style="text-align:right">Replies</th></tr>
          <tr><td>1 Hook</td><td class="n">14</td><td class="n">2</td></tr><tr><td>2 The role</td><td class="n">9</td><td class="n">2</td></tr><tr><td>3 Why now</td><td class="n">5</td><td class="n">1</td></tr><tr><td>4–5</td><td class="n">–</td><td class="n">–</td></tr></table></div>
        ${sugg.length ? `<div class="sec">Suggestions</div>${sugg.join('')}` : ''}
       `,
      footer: `<div class="hint">${o.active} at a time · ${remaining} in queue${o.window !== 'Weekday mornings' ? ` · sends ${esc(o.window)}` : ''}</div><button class="btn btn-primary" data-a="openHub" data-k="needs">Open shortlist</button><div class="hint">Simulated: skips ahead to Oct 15</div>`
    };
  };
  A.applyTiming = () => { const o = S().out, prev = o.window; o.window = 'Tue–Thu, 8–10am'; PL.toast('Send window: Tue–Thu, 8–10am, their time zone', 'timing', prev); };
  PL.UNDO.timing = prev => { S().out.window = prev; };
  A.dismissTiming = () => { S().out.timingDismissed = true; };
  A.applyActive = () => { const o = S().out, prev = o.active; o.active = 8; PL.toast('Now 8 at a time', 'active', prev); };
  PL.UNDO.active = prev => { S().out.active = prev; };
  A.dismissActive = () => { S().out.activeDismissed = true; };
  A.newPass = d => { S().out.newPassed[d.id] = true; PL.toast(`Passed on ${esc(PL.cand(d.id).name)}`, 'newPass', d.id); };
  PL.UNDO.newPass = id => { delete S().out.newPassed[id]; };
  A.newAdd = d => { const c = PL.cand(d.id); S().out.newAdded[d.id] = true; PL.toast(`${esc(c.name)} added: #${c.rankIfAdded} in the queue`, 'newAdd', d.id); };
  PL.UNDO.newAdd = id => { delete S().out.newAdded[id]; };

  /* =========================================================
     Milestones 4–5 · on the shortlist
     Once outreach starts, the shortlist shows where everyone is. Each card has
     one next step, and each step opens as a sheet over the list.
     ========================================================= */
  const REPLY = id => D.REPLIES.find(r => r.id === id);
  const SUB = id => D.SUBMISSIONS.find(x => x.id === id);
  const CONTACTED = 20;
  const onsiteStage = () => { const st = S().see.stages; return st.find(x => /onsite/i.test(x.name)) || st[1] || st[0]; };
  const btn = (label, a, id, primary) => `<button class="btn btn-sm ${primary ? 'btn-primary' : 'btn-secondary'}" data-a="${a}" data-id="${id}">${label}</button>`;
  /* Where someone is, and their one next step. Sections say whose move it is:
     needs (yours), waiting (theirs), contacted (no reply yet), queue (not emailed yet), closed. */
  PL.stageOf = (c, i) => {
    const s = S(), m4 = s.m4, m5 = s.m5, st = m4.status[c.id], sub = SUB(c.id), fin = m5.final[c.id], on = m5.onsite.find(o => o.id === c.id);
    if (on && on.state === 'scheduled') return { sec: 'waiting', order: 30, line: `Onsite booked for ${esc(on.date)} · ${onsiteStage().h}h · ${esc(s.reqs.office)}` };
    if (on && on.sent && !on.nudge) return { sec: 'waiting', order: 20, line: `Onsite invite sent ${esc(on.sent)} · not booked yet`, acts: btn('Mark onsite booked', 'openSchedule', c.id) };
    if (on) return {
      sec: 'needs', order: 40, line: on.sent ? `Advanced to onsite · invite sent ${esc(on.sent)}` : `Advanced to onsite ${esc(on.adv || 'today')}`,
      flag: on.nudge ? 'Not booked after 3 days' : '',
      acts: on.sent ? btn('Resend onsite invite', 'sendLink', c.id, true) + btn('Mark onsite booked', 'openSchedule', c.id) : btn('Send onsite invite', 'sendLink', c.id, true) + btn('Mark onsite booked', 'openSchedule', c.id)
    };
    if (fin === 'reject') return { sec: 'closed', line: 'Declined after the practical assessment · invited to other roles' };
    if (sub) {
      const strong = s.attrs.filter(a => sub.grades[a.id] === 'Strong').map(a => a.name);
      return { sec: 'needs', order: sub.left, line: `Submitted their practical assessment ${esc(sub.submitted)}`, line2: `Decide by ${esc(sub.due)} · ${sub.left}h left`, hot: sub.left <= 12,
        detail: `<div class="cline"><span class="k">Strong</span>${esc(strong.join(', ') || 'None')}</div>`, acts: btn('Review submission', 'openSub', c.id, true) };
    }
    if (st === 'declined') return { sec: 'closed', line: 'Passed after the chat · note sent' };
    if (st === 'new') { const r = REPLY(c.id); return { sec: 'needs', order: r.left, line: `Replied ${esc(r.when)}: “${esc(r.kind)}”`, line2: `Answer by ${esc(r.by)}`, hot: r.left <= 12, quote: r.msg, acts: btn('Choose chat or practical assessment', 'openNext', c.id, true) }; }
    if (st === 'chatted') return { sec: 'needs', order: 34, line: 'You chatted Oct 14 · notes not added yet', acts: btn('Add chat notes', 'chatDone', c.id, true) };
    if (st === 'takehome') return { sec: 'needs', order: 35, line: 'Practical assessment ready to send', acts: btn('Send practical assessment', 'openTH', c.id, true) };
    if (st === 'waiting' || st === 'another') return { sec: 'waiting', order: 10, line: st === 'another' ? 'Second chat · invite sent, not held yet' : 'Chat invite sent · not held yet', acts: btn('Add chat notes', 'chatDone', c.id) };
    if (st === 'sent') return { sec: 'waiting', order: 15, line: `Practical assessment sent${(m4.tweaks || {})[c.id] ? ' (tweaked for them)' : ''} · due ${esc(m4.due[c.id] || 'Oct 22')}`, line2: `You decide within ${s.see.commitment}h of their submission` };
    if (c.rankIfAdded) return { sec: 'queue', order: c.rankIfAdded / 100 - 1, line: `New match, added · #${c.rankIfAdded} in the queue` };
    if (i < CONTACTED) return { sec: 'contacted', line: c.warm ? 'Intro requested · no reply yet' : `Email ${3 + (i % 3)} of 5 sent · no reply yet` };
    return { sec: 'queue', line: 'Emailed when a spot opens' };
  };
  PL.newMatches = () => { const o = S().out; return D.NEW_MATCHES.filter(n => !o.newAdded[n.id] && !o.newPassed[n.id]); };
  /* Everyone on the list, plus new matches waiting for a decision */
  PL.hubItems = () => PL.orderedPre().map((c, i) => ({ c, st: PL.stageOf(c, i) })).concat(PL.newMatches().map(c => ({ c, st: {
    sec: 'needs', order: 100 + c.rankIfAdded, line: `New match since Sep 23 · would be #${c.rankIfAdded} in the queue`,
    detail: `<div class="exc">Exceptional at <b>${esc((PL.attr(c.exc) || {}).name || c.exc)}</b></div><div class="why"><b>Why a great fit:</b> ${esc(c.why)}</div><div class="cline"><span class="k">Must-haves</span>${esc(PL.mustLine(c))}</div>`,
    acts: btn('Pass', 'newPass', c.id) + btn('Add to queue', 'newAdd', c.id, true) } })));
  /* To-dos by menu place: once outreach starts, everything in the shortlist's "Needs you" */
  PL.todos = () => { const t = {}; if (S().out.started) { const n = PL.hubItems().filter(x => x.st.sec === 'needs').length; if (n) t.shortlist = n; } return t; };
  PL.hubScreen = () => {
    const items = PL.hubItems();
    const by = k => items.filter(x => x.st.sec === k).sort((a, b) => (a.st.order || 0) - (b.st.order || 0));
    const need = by('needs').length;
    const card = ({ c, st }) => `<div class="cand hub-card tapcard ${st.sec === 'needs' ? 'needs' : ''}" data-a="openCand" data-id="${c.id}">
      <div class="cand-top">${PL.avatar(c)}<div style="flex:1;min-width:0"><div class="cand-name">${esc(c.name)} · ${esc(c.title)}</div><div class="cand-sub">${esc(c.co)} · ${esc(c.loc)}</div></div></div>
      <div class="hstage"><div class="st1">${st.line}</div>${st.line2 ? `<div class="st2 ${st.hot ? 'hot-t' : ''}">${st.line2}</div>` : ''}</div>
      ${st.quote ? `<div class="hquote">“${esc(st.quote)}”</div>` : ''}${st.detail || ''}${st.flag ? `<div class="flagline">${esc(st.flag)}</div>` : ''}
      ${st.acts ? `<div class="cand-acts">${st.acts}</div>` : ''}</div>`;
    const row = ({ c, st }) => `<div class="li tap" data-a="openCand" data-id="${c.id}">${PL.avatar(c, 34)}<div class="b"><div class="t1">${esc(c.name)} · ${esc(c.title)}</div><div class="t2">${st.line}</div></div></div>`;
    const sec = (id, title, list, render, empty) => `<div class="sec hub-sec" id="sec-${id}">${title}<span class="n">${list.length}</span></div>` +
      (list.length ? (render === card ? list.map(card).join('') : `<div class="group">${list.map(row).join('')}</div>`) : `<p class="small muted" style="margin:0 2px">${empty}</p>`);
    const closed = by('closed');
    return {
      title: 'Shortlist', head: 'Shortlist', sub: need ? `${need} need you` : 'All caught up', back: 'monitor', task: 'Shortlist',
      body: `${PL.timeJump('3 weeks later', 'Oct 15 · outreach started Sep 23')}
        <div class="sl-title" style="margin-top:12px">${PL.orderedPre().length} people for your ${esc(PL.titleText())} role</div>
        ${sec('needs', 'Needs you', by('needs'), card, 'Nothing needs you right now.')}
        ${sec('waiting', 'Waiting on them', by('waiting'), card, 'Nobody to wait on.')}
        ${sec('contacted', 'Emailed, no reply yet', by('contacted'), row, 'Everyone emailed has replied.')}
        ${sec('queue', 'Not emailed yet', by('queue'), row, 'Everyone has been emailed.')}
        ${closed.length ? sec('closed', 'Closed', closed, row) : ''}
        <p class="small muted" style="margin:18px 2px 0">Onsite and final interview tools are out of scope for this prototype.</p>
        <button class="textlink" style="margin-top:10px" data-a="reset">Restart the demo</button>`
    };
  };
  const refreshFoot = () => { const sh = S().sheet, f = document.getElementById('sheet-foot'); if (sh && f && SHEETS[sh.type]) f.innerHTML = SHEETS[sh.type](sh).foot || ''; };
  const tell = () => S().see.commitment;

  /* Reply → what's next */
  A.openNext = d => { S().ui.nextChoice = REPLY(d.id).rec; PL.openSheet('next', { id: d.id }); };
  SHEETS.next = sh => {
    const r = REPLY(sh.id), c = PL.cand(sh.id), ch = S().ui.nextChoice;
    return {
      title: `${esc(first(c))} replied: “${esc(r.kind)}”`, sub: `${esc(c.title)} · ${esc(c.co)}`,
      body: `<div class="hquote" style="margin-top:0">“${esc(r.msg)}”<div class="small muted" style="margin-top:6px">${esc(r.when)} · answer by ${esc(r.by)}</div></div>
        <div class="sec">What’s next?</div>
        <div class="chips">${PL.chip('Chat first', ch === 'chat', 'nextChoice', 'data-v="chat"')}${PL.chip('Straight to practical assessment', ch === 'takehome', 'nextChoice', 'data-v="takehome"')}</div>
        <div class="card" style="margin-top:12px"><div class="small" style="font-weight:600;margin-bottom:6px">We suggest ${r.rec === 'chat' ? 'a chat first' : 'going straight to the practical assessment'}:</div><ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.55">${r.reasons.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
        ${ch === 'chat' ? `<label class="field-label" style="margin-top:14px">Your scheduling link</label><input class="field" data-i="bookingLink" value="${esc(S().m4.bookingLink)}"><p class="small muted" style="margin:6px 2px 0">The chat is booked on your own calendar, outside Pathline. We’ll ask for notes afterwards.</p>`
          : `<p class="small muted" style="margin:14px 2px 0">We’ll generate a practical assessment that tests your ranked attributes and skills, for you to review before it’s sent.</p>`}`,
      foot: `<button class="btn btn-primary" data-a="nextGo" data-id="${sh.id}">${ch === 'chat' ? 'Send chat invite' : 'Set up practical assessment'}</button>`
    };
  };
  A.nextChoice = d => { S().ui.nextChoice = d.v; };
  I.bookingLink = v => { S().m4.bookingLink = v; };
  A.nextGo = d => {
    const m = S().m4, c = PL.cand(d.id);
    if (S().ui.nextChoice === 'chat') { m.status[d.id] = 'waiting'; PL.S.sheet = null; PL.toast(`Chat invite sent to ${esc(first(c))}`); }
    else { m.status[d.id] = 'takehome'; openTH(d.id); }
  };

  /* After the chat: gut check first */
  A.chatDone = d => {
    const m = S().m4;
    if (m.chatCand !== d.id) m.chat = { overall: null, want: null, note: '', transcript: '', consent: false };
    m.chatCand = d.id; PL.openSheet('postchat', { id: d.id });
  };
  SHEETS.postchat = sh => {
    const ch = S().m4.chat, c = PL.cand(sh.id);
    const ok = ch.overall && (!ch.transcript.trim() || ch.consent);
    return {
      title: `How did the chat with ${esc(first(c))} go?`, sub: 'Your gut check comes before anything else', tall: true,
      body: `<div class="sec" style="margin-top:0">Overall</div><div class="chips">${['Strong yes', 'Yes', 'Unsure', 'No'].map(x => PL.chip(x, ch.overall === x, 'chatSet', `data-k="overall" data-v="${x}"`)).join('')}</div>
        <div class="sec">Would you want to work with them?</div><div class="chips">${['Yes', 'Not sure', 'No'].map(x => PL.chip(x, ch.want === x, 'chatSet', `data-k="want" data-v="${x}"`)).join('')}</div>
        <div class="sec">Anything else?</div><textarea class="field" rows="2" data-i="chatNote" placeholder="Optional">${esc(ch.note)}</textarea>
        <div class="sec">Transcript</div>
        <div class="row" style="margin-bottom:8px"><button class="btn btn-xs btn-secondary" data-a="pasteTranscript">Paste sample transcript</button><button class="btn btn-xs btn-secondary" data-a="uploadTranscript">Upload</button></div>
        <textarea class="field transcript" data-i="chatTranscript" placeholder="Paste from any notetaker">${esc(ch.transcript)}</textarea>
        <label class="check" style="margin-top:10px"><input type="checkbox" data-c="chatConsent" ${ch.consent ? 'checked' : ''}>The candidate agreed to the recording. California requires every party’s consent.</label>
        <p class="small muted" style="margin:12px 2px 0">Pathline reads the transcript to focus the practical assessment. That read stays internal.</p>`,
      foot: `<div class="row"><button class="btn btn-secondary" data-a="openPassChat">Pass</button><button class="btn btn-secondary" data-a="anotherChat">Another chat</button></div>
        <button class="btn btn-primary" data-a="chatToTH" ${ok ? '' : 'disabled'}>${ch.overall ? (ok ? 'Set up practical assessment' : 'Confirm recording consent') : 'Give your gut check first'}</button>`
    };
  };
  A.chatSet = d => { S().m4.chat[d.k] = d.v; };
  I.chatNote = v => { S().m4.chat.note = v; };
  I.chatTranscript = v => { S().m4.chat.transcript = v; refreshFoot(); };
  C.chatConsent = v => { S().m4.chat.consent = v; };
  A.pasteTranscript = () => { S().m4.chat.transcript = D.TRANSCRIPT; };
  A.uploadTranscript = () => { PL.toast('In this prototype, use the sample transcript'); };
  A.anotherChat = () => { const m = S().m4; m.status[m.chatCand] = 'another'; PL.S.sheet = null; PL.toast('Invite sent for a second chat'); };
  A.chatToTH = () => { const m = S().m4; m.status[m.chatCand] = 'takehome'; openTH(m.chatCand); };

  const NOTE_BY_REASON = {
    tech: 'For this role, the team is prioritizing hands-on experience running evaluations for LLM features in production.',
    own: 'For this role, the team is prioritizing experience owning a product end to end as the only PM.',
    emp: 'For this role, the team is prioritizing deep, recent work with social and brand teams.',
    rig: 'For this role, the team is prioritizing experience owning quality metrics for AI features.',
    adapt: 'For this role, the team is prioritizing experience in fast-changing, early-stage environments.'
  };
  A.openPassChat = () => { S().ui.passReasons = []; S().ui.declineNote = true; S().ui.sendWhen = 'now'; PL.openSheet('passChat', { id: S().m4.chatCand }); };
  PL.declineHTML = (c, extra, mode) => {
    const u = S().ui, m = S().m4;
    const aid = (S().attrs.find(a => u.passReasons.includes(a.name)) || {}).id;
    const note = u.declineNote ? (NOTE_BY_REASON[aid] || 'For this role, the team is prioritizing a slightly different mix of experience.') : '';
    const opening = mode === 'th'
      ? `Thank you for the time you put into the practical assessment for the ${esc(PL.titleText())} role. Misbah and the team have decided not to move forward this time.`
      : `Thank you for taking the time to talk with Misbah about the ${esc(PL.titleText())} role. ${m.chat.overall !== 'No' ? 'Misbah enjoyed the conversation, but the team has' : 'The team has'} decided not to move forward this time.`;
    return `<div class="small muted">From: Pathline, on behalf of Misbah (Nectar Social)<br>Subject: ${mode === 'th' ? 'Your practical assessment for' : 'Your conversation with'} Nectar Social</div>
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
  A.passSend = d => { S().m4.status[d.id] = 'declined'; PL.S.sheet = null; PL.toast(`Note ${S().ui.sendWhen === 'now' ? 'sent' : 'scheduled'} on Misbah’s behalf. ${esc(first(PL.cand(d.id)))} is invited to match other roles.`); };

  /* Practical assessment */
  const SKILL_NAMES = { 'skill-ai': 'Gen AI (skill)', 'skill-metrics': 'Metrics (skill)' };
  PL.coverage = () => {
    const s = S(), cov = {};
    const extra = s.m4.extraCover || {};
    D.TAKEHOME.sections.forEach(sec => sec.tests.forEach(t => { cov[t] = (cov[t] || 0) + 1; }));
    Object.keys(extra).forEach(k => { cov[k] = (cov[k] || 0) + 1; });
    return s.attrs.map(a => ({ id: a.id, name: a.name, n: cov[a.id] || 0 })).concat(Object.keys(SKILL_NAMES).map(k => ({ id: k, name: SKILL_NAMES[k], n: cov[k] || 0 })));
  };
  const nameOf = t => (SKILL_NAMES[t] || (PL.attr(t) || {}).name || null);
  const tweakOf = id => (S().m4.tweaks || {})[id];
  /* Assignment sections, with what each tests. For one person, weighted-up attributes are marked on their sections. */
  function secCards(forId) {
    const s = S(), m = s.m4, tw = forId ? tweakOf(forId) : null, box = (tw && tw.timebox) || m.timebox;
    return D.TAKEHOME.sections.map(sec => {
      const open = s.ui.secOpen[sec.id];
      const extraIds = sec.id === 'decisions' ? Object.keys(m.extraCover || {}) : [];
      let html = sec.html.replace('[[timebox]]', esc(box.replace('h', ' hours')));
      if (extraIds.length) html = html.replace('</ul>', extraIds.map(k => `<li>${esc(m.extraCover[k])}</li>`).join('') + '</ul>');
      const tests = sec.tests.concat(extraIds).map(nameOf).filter(Boolean);
      const up = tw ? tw.focus.filter(f => sec.tests.includes(f) && PL.attr(f)) : [];
      const notes = up.map(f => `<div class="gapnote">${esc(PL.attr(f).name)}: weighted up for ${esc(first(PL.cand(forId)))}</div>`).join('');
      return `<div class="sec-card ${open ? 'open' : ''}" data-a="toggleSec" data-k="${sec.id}"><div class="h">${esc(sec.title)}</div>
        ${tests.length ? `<div class="tests-line">Tests: ${tests.map(esc).join(', ')}</div>` : ''}${notes}
        ${open ? `<div class="b">${html}</div>` : ''}</div>`;
    }).join('');
  }
  const tweakSummary = id => {
    const m = S().m4, tw = tweakOf(id); if (!tw) return 'Standard';
    const parts = tw.focus.map(f => (PL.attr(f) || {}).name).filter(Boolean).map(n => `${n} weighted up`);
    if (tw.timebox !== m.timebox) parts.push(`${tw.timebox} time box`);
    if (tw.note) parts.push('changes requested');
    return parts.join(' · ') || 'Tweaked, no changes yet';
  };

  /* Practical assessment: the one practical assessment everyone gets by default */
  SCREENS.assess = () => {
    const s = S(), m = s.m4, uncovered = PL.coverage().filter(r => !r.n), tweaked = Object.keys(m.tweaks || {});
    return {
      title: 'Practical assessment', back: 'monitor', task: 'Practical assessment',
      body: `<div class="intro">Everyone who reaches this stage gets this practical assessment. To tweak it for one person, use the practical assessment on their shortlist card.</div>
        <div class="group"><div class="fld-row"><span class="k">Time box</span><div class="v"><select class="field inline" data-c="timebox">${PL.options(['2h', '3h', '4h'], m.timebox)}</select></div></div>
          <div class="fld-row"><span class="k">AI tools</span><div class="v">Encouraged, and part of the review</div></div>
          <div class="fld-row"><span class="k">Paid</span><div class="v"><span class="small muted">No. Effort signals interest; a strong result boosts them across Pathline.</span></div></div>
          <div class="fld-row"><span class="k">Timing</span><div class="v"><span class="small muted">They pick a due date within 7 days. You decide within ${tell()}h of their submission.</span></div></div></div>
        ${uncovered.length ? `<div class="flag" style="margin-top:12px"><div><b>${uncovered.map(u => esc(u.name)).join(', ')} ${uncovered.length > 1 ? 'aren’t' : 'isn’t'} tested yet.</b> You can still send it, but we won’t get signal there.<div class="row" style="margin-top:8px;flex-wrap:wrap">${uncovered.map(u => `<button class="btn btn-xs btn-secondary" data-a="coverAttr" data-id="${u.id}">Add a question for ${esc(u.name)}</button>`).join('')}</div></div></div>` : ''}
        <div class="sec">What they’ll do</div>${secCards(null)}
        <p class="small muted" style="margin:12px 2px 0">${esc(D.TAKEHOME.note)} Candidates see that it’s graded by Pathline’s AI, attribute by attribute, and can request a human review.</p>
        <div class="change-all"><div class="t">Change the practical assessment</div><div class="row">${PL.askBox('th-all', 'e.g. make it a mobile flow', 'reviseTH')}<button class="btn btn-sm btn-primary" data-a="reviseTH">Apply</button></div></div>
        ${tweaked.length ? `<div class="sec">Tweaked for individual candidates</div><div class="group">${tweaked.map(id => PL.row(esc(PL.cand(id).name), esc(tweakSummary(id)), 'openTH', `data-id="${id}"`)).join('')}</div>` : ''}`
    };
  };

  /* One person's practical assessment: the standard assessment, or tweaked for them */
  const openTH = id => { S().m4.thCand = id; PL.openSheet('takehome', { id }); };
  A.openTH = d => openTH(d.id);
  SHEETS.takehome = sh => {
    const s = S(), m = s.m4, c = PL.cand(sh.id), fn = esc(first(c)), tw = tweakOf(sh.id), sent = m.status[sh.id] === 'sent';
    const gap = (sh.id === 'c1' || sh.id === 'c3') && !(tw && tw.focus.includes('adapt')) && PL.attr('adapt');
    const suggest = gap && !sent ? `<div class="flag" style="margin-bottom:12px"><div><b>Adaptability wasn’t seen in the chat.</b> Weight it up in ${fn}’s practical assessment?<div class="row" style="margin-top:8px"><button class="btn btn-xs btn-primary" data-a="twFocus" data-id="${sh.id}" data-k="adapt" data-on="1">Weight it up</button></div></div></div>` : '';
    const choice = `<div class="chips">${PL.chip('Standard assessment', !tw, 'twOff', `data-id="${sh.id}"`)}${PL.chip(`Tweaked for ${fn}`, !!tw, 'twOn', `data-id="${sh.id}"`)}</div>`;
    const detail = tw
      ? `<div class="group" style="margin-top:12px"><div class="fld-row"><span class="k">Time box</span><div class="v"><select class="field inline" data-c="twTimebox" data-id="${sh.id}">${PL.options(['2h', '3h', '4h'], tw.timebox)}</select></div></div></div>
        <div class="sec">Weight up for ${fn}</div><div class="chips">${s.attrs.map(a => PL.chip(esc(a.name), tw.focus.includes(a.id), 'twFocus', `data-id="${sh.id}" data-k="${a.id}"`, 'sm')).join('')}</div>
        <div class="sec">Anything else to change for ${fn}</div><div class="row">${PL.askBox('tw', 'e.g. make the prototype mobile-first', 'twApply', `data-id="${sh.id}"`)}<button class="btn btn-sm btn-primary" data-a="twApply" data-id="${sh.id}">Apply</button></div>`
      : `<div class="group" style="margin-top:12px"><div class="fld-row"><span class="k">Time box</span><div class="v">${esc(m.timebox.replace('h', ' hours'))} · AI tools encouraged</div></div></div>
        <button class="textlink" style="margin-top:10px" data-a="go" data-r="assess">Edit the standard assessment</button>`;
    return {
      title: `Practical assessment for ${fn}`, sub: sent ? `Sent · due ${esc(m.due[sh.id] || 'Oct 22')}` : (tw ? `Tweaked for ${fn}` : 'Standard assessment'), tall: true,
      body: suggest + choice + detail + `<div class="sec">What they’ll do</div>${secCards(sh.id)}`,
      foot: sent ? '' : `<button class="btn btn-primary" data-a="sendTH" data-id="${sh.id}">Send practical assessment</button>`
    };
  };
  const ensureTweak = id => { const m = S().m4; m.tweaks = m.tweaks || {}; if (!m.tweaks[id]) m.tweaks[id] = { timebox: m.timebox, focus: [], note: '' }; return m.tweaks[id]; };
  A.twOn = d => { ensureTweak(d.id); };
  A.twOff = d => { delete S().m4.tweaks[d.id]; };
  A.twFocus = d => { const tw = ensureTweak(d.id), i = tw.focus.indexOf(d.k); if (i >= 0 && !d.on) tw.focus.splice(i, 1); else if (i < 0) tw.focus.push(d.k); };
  C.twTimebox = (v, d) => { ensureTweak(d.id).timebox = v; };
  A.twApply = d => { const el = document.getElementById('tw'); if (!el || !el.value.trim()) { if (el) el.focus(); return; } ensureTweak(d.id).note = el.value.trim(); delete S().ui.voice.tw; PL.toast(`Noted for ${esc(first(PL.cand(d.id)))}. In this prototype, the assignment text stays the same.`); };
  PL.VOICE.tw = 'Make the prototype part mobile-first';
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
  A.reviseTH = () => { const el = document.getElementById('th-all'); if (!el || !el.value.trim()) { if (el) el.focus(); return; } delete S().ui.voice['th-all']; PL.toast('In this prototype, the practical assessment text is fixed. Prompt revisions work like the emails.'); };
  A.sendTH = d => { const m = S().m4; m.status[d.id] = 'sent'; m.due[d.id] = 'Oct 22'; PL.S.sheet = null; PL.toast(`${tweakOf(d.id) ? 'Tweaked practical assessment' : 'Practical assessment'} sent to ${esc(first(PL.cand(d.id)))}. Due Oct 22; you decide within ${tell()}h of their submission.`); };

  /* Review a submission, then decide */
  const gradeCls = g => g === 'Strong' || g === 'Exceeds' ? 'S' : g === 'Medium' || g === 'Meets' ? 'M' : 'U';
  A.openSub = d => PL.openSheet('sub', { id: d.id });
  SHEETS.sub = sh => {
    const s = S(), x = SUB(sh.id), c = PL.cand(sh.id);
    const rows = s.attrs.map(a => { const g = x.grades[a.id] || 'Unknown'; return `<div class="grade-row"><span class="nm">${esc(a.name)}</span><span class="lv ${gradeCls(g)}">${esc(g)}</span></div>${x.excerpt[a.id] ? `<div class="small muted" style="margin:-2px 0 8px;line-height:1.45">${esc(x.excerpt[a.id])}</div>` : ''}`; }).join('');
    return {
      title: esc(c.name), sub: `Practical assessment · submitted ${esc(x.submitted)} · review by ${esc(x.due)}`, tall: true,
      body: `<div class="card" style="font-size:14px"><div style="font-weight:600">Relay prototype and quality plan</div><div class="small muted" style="margin-top:2px">Clickable prototype link and a 1-page plan (demo)</div></div>
        <div class="sec">Grades by attribute</div><div class="card" style="padding:4px 14px">${rows}
          <div class="grade-row"><span class="nm">Gen AI (skill)</span><span class="lv ${gradeCls(x.ai)}">${esc(x.ai)}</span></div>
          <div class="grade-row"><span class="nm">Metrics (skill)</span><span class="lv ${gradeCls(x.metrics)}">${esc(x.metrics)}</span></div></div>
        <div class="cline" style="margin-top:12px"><span class="k">Reviewers</span>You ${s.m5.mine[x.id] ? 'done' : 'to do'} · Kaan ${x.reviewers.kaan ? 'done' : 'to do'}</div>
        <p class="small muted" style="margin:12px 2px 0">Graded by Pathline’s AI, per attribute, never as a single score. You make the decision. ${esc(first(c))} can request a human review.</p>`,
      foot: `<button class="btn btn-primary" data-a="openDecide" data-id="${x.id}">Decide</button>`
    };
  };
  A.openDecide = d => { S().ui.myDec = null; S().ui.myNote = ''; PL.openSheet('decide', { id: d.id }); };
  SHEETS.decide = sh => {
    const s = S(), m5 = s.m5, x = SUB(sh.id), c = PL.cand(sh.id), mine = m5.mine[x.id];
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
    PL.toast(`${esc(first(PL.cand(d.id)))} advances to onsite. They’ll hear within ${tell()}h.`);
  };
  A.finalReject = d => { S().ui.passReasons = []; S().ui.declineNote = true; PL.openSheet('declineTH', { id: d.id }); };
  SHEETS.declineTH = sh => {
    const c = PL.cand(sh.id), x = SUB(sh.id);
    const strong = S().attrs.filter(a => x.grades[a.id] === 'Strong').map(a => a.name.toLowerCase());
    const boost = strong.length >= 2 ? `<p><span class="slot">Your practical assessment was strong on ${esc(strong.slice(0, 2).join(' and '))}. If you opt in, those results count toward other roles on Pathline, so you won’t need to prove the same things twice.</span></p>` : '';
    return {
      title: `Decline ${esc(c.name)}?`, tall: true,
      body: `<div class="sec" style="margin-top:0">Note sent on your behalf</div><div class="card"><div class="email-body" style="border:0;padding:0">${PL.declineHTML(c, boost, 'th')}</div></div>`,
      foot: `<div class="row"><button class="btn btn-secondary" data-a="closeSheet">Cancel</button><button class="btn btn-primary" data-a="sendDeclineTH" data-id="${c.id}">Send decline</button></div>`
    };
  };
  A.sendDeclineTH = d => { S().m5.final[d.id] = 'reject'; PL.S.sheet = null; PL.toast(`Declined. ${esc(first(PL.cand(d.id)))} is invited to match other roles.`); };

  /* Onsite scheduling */
  A.sendLink = d => { const o = S().m5.onsite.find(x => x.id === d.id); o.sent = 'today'; o.nudge = false; PL.toast(`Onsite invite sent to ${esc(first(PL.cand(d.id)))}, with what to expect`); };
  A.openSchedule = d => { S().ui.schedDate = 'Oct 22'; PL.openSheet('schedule', { id: d.id }); };
  SHEETS.schedule = sh => ({
    title: `${esc(PL.cand(sh.id).name)}: onsite booked`,
    body: `<label class="field-label">Onsite date</label><select class="field" data-c="schedDate">${PL.options(['Oct 20', 'Oct 21', 'Oct 22', 'Oct 23', 'Oct 24'], S().ui.schedDate)}</select>`,
    foot: `<button class="btn btn-primary" data-a="markScheduled" data-id="${sh.id}">Mark onsite booked</button>`
  });
  C.schedDate = v => { S().ui.schedDate = v; };
  A.markScheduled = d => { const o = S().m5.onsite.find(x => x.id === d.id); o.state = 'scheduled'; o.date = S().ui.schedDate; o.nudge = false; PL.S.sheet = null; PL.toast(`Onsite scheduled for ${esc(o.date)}`); };

})(window.PL);
