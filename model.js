/* Pathline prototype — derived data: pool sizing, ranking, evidence, projections, email context. */
(function (PL) {
  const D = PL.D;
  const ORDER = ['tech', 'own', 'emp', 'rig', 'adapt'];
  const LVV = { S: 1, M: .55, U: .2 };
  PL.LV_TEXT = { S: 'Strong', M: 'Medium', U: 'Unknown' };

  PL.titleText = () => PL.S.see.title || 'PM, AI';
  PL.subj = t => t.subject.replace('[[title]]', PL.titleText());
  PL.cand = id => D.CANDS.find(c => c.id === id) || D.NEW_MATCHES.find(c => c.id === id);
  PL.attr = id => PL.S.attrs.find(a => a.id === id);

  PL.level = (c, aid) => {
    const i = ORDER.indexOf(aid);
    if (i >= 0) return c.lv[i];
    if (aid === 'hon') return c.hon || (PL.hash(c.id) % 3 === 0 ? 'M' : 'U');
    return 'U';
  };
  PL.evidence = (c, aid) => {
    const lv = PL.level(c, aid);
    if (aid === c.exc) return [c.why];
    const pool = (D.EVIDENCE_POOLS[aid] || { U: ['Not visible in profile; tested in the chat and practical assessment'] })[lv] || ['Not visible in profile; tested in the chat and practical assessment'];
    const k = PL.hash(c.id + aid) % pool.length;
    const out = [pool[k]];
    if (lv === 'S' && pool.length > 1) out.push(pool[(k + 1) % pool.length]);
    return out;
  };
  /* Every attribute counts, weighted by rank. */
  PL.score = c => {
    const n = PL.S.attrs.length;
    let s = 0;
    PL.S.attrs.forEach((a, i) => { s += (n - i) / n * 5 * LVV[PL.level(c, a.id)]; });
    if (c.move === 'High') s += .5;
    if (c.warm) s += .3;
    return s;
  };
  PL.fails = c => {
    const r = PL.S.reqs, f = [];
    if (c.yrs < r.minYears) f.push(`PM ${c.yrs} yrs`);
    if (PL.S.jd.work !== 'remote' && r.relocation === 'no' && !c.bay) f.push(`Lives in ${c.loc}`);
    r.custom.forEach(x => { if (x.key === 'b2b' && !c.b2b) f.push('No B2B SaaS'); });
    return f;
  };
  PL.target = () => ({ 'Nov 2026': 30, 'Dec 2026': 25, 'Jan 2027': 20, 'Feb 2027': 18 })[PL.S.see.start] || 25;
  /* The shortlist: everyone who matches, not passed on, top N by score. Included by default. */
  PL.visible = () => D.CANDS
    .filter(c => PL.S.sl.dec[c.id] !== 'passed' && PL.fails(c).length === 0)
    .sort((a, b) => PL.score(b) - PL.score(a))
    .slice(0, PL.target());
  /* Pre-candidates: the shortlist as confirmed at "Continue to outreach", plus new matches added later. */
  PL.approved = () => {
    const base = PL.S.sl.final ? PL.S.sl.final.map(PL.cand).filter(Boolean) : PL.visible();
    return base.concat(D.NEW_MATCHES.filter(n => PL.S.out.newAdded[n.id]));
  };

  /* Must-haves, in words: "Meets must-haves" or "Ask: relocation, work authorization". */
  PL.unknowns = c => {
    const r = PL.S.reqs, u = [];
    if (PL.S.jd.work !== 'remote' && !c.bay) u.push('relocation');
    if (r.visa !== 'yes') u.push('work authorization');
    r.custom.forEach(x => { if (x.key !== 'b2b') u.push(x.label); });
    return u;
  };
  PL.mustLine = c => { const u = PL.unknowns(c); return u.length ? `Ask: ${u.join(', ')}` : 'Meets must-haves'; };

  /* ---------- talent pool ---------- */
  PL.pool = () => {
    const r = PL.S.reqs, s = PL.S.see;
    const yrsMap = { 2: 90000, 3: 70000, 4: 56000, 5: 45000, 6: 36000, 7: 29000, 8: 23000, 9: 18000, 10: 14000 };
    const exp = yrsMap[r.minYears] || 45000;
    const skills = exp * 0.2 * Math.pow(0.8, r.custom.length) * (r.aiEither ? 1 : 0.6);
    let loc;
    if (PL.S.jd.work === 'remote') loc = skills * 0.9;
    else {
      loc = skills * (r.relocation === 'no' ? 0.12 : 0.33);
      if (r.days >= 5) loc *= 0.9;
      if (r.days <= 3) loc *= 1.25;
    }
    if (r.visa === 'no') loc *= 0.85;
    const attr = loc * 0.083 * Math.pow(0.97, Math.max(0, PL.S.attrs.length - 5));
    const move = attr * 0.28;
    const fit = Math.max(.2, Math.min(.95, .64 + (s.baseMax - 225) * .0088));
    const base = move * fit;
    return { exp, skills, loc, attr, move, base, fit };
  };
  PL.fmtN = n => {
    if (n >= 1000) return '~' + (Math.round(n / 100) * 100).toLocaleString('en-US');
    if (n >= 100) return '~' + Math.round(n / 10) * 10;
    return '~' + Math.max(0, Math.round(n / 5) * 5);
  };
  PL.verdict = () => {
    const b = PL.pool().base, t = PL.target();
    return b >= t * 2 ? 'healthy' : b >= t ? 'tight' : 'thin';
  };

  /* ---------- dates & projections ---------- */
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  PL.fmtDate = d => `${MON[d.getMonth()]} ${d.getDate()}`;
  PL.projection = (active, remaining) => {
    const perWeek = active * 0.8;
    const weeks = remaining / perWeek;
    const d = new Date(2026, 8, 23);
    d.setDate(d.getDate() + Math.round(weeks * 7));
    const status = d <= new Date(2026, 9, 31) ? 'On track' : d <= new Date(2026, 10, 14) ? 'Tight' : 'Behind';
    const rpw = perWeek * 0.4;
    return { date: PL.fmtDate(d), status, replies: rpw < 1.5 ? 'about 1' : rpw < 2.5 ? 'about 2' : rpw < 3.5 ? 'about 3' : `about ${Math.round(rpw)}` };
  };

  /* ---------- email context ---------- */
  const article = s => (/^[aeiou]/i.test(s) ? 'an ' : 'a ') + s.toLowerCase();
  const joinAnd = arr => arr.length <= 1 ? arr.join('') : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
  PL.stagesLine = () => joinAnd(PL.S.see.stages.map(s => article(s.name)));
  PL.stagesDetail = () => joinAnd(PL.S.see.stages.map(s => `${article(s.name)} (about ${s.h} hour${s.h === 1 ? '' : 's'})`));
  PL.totalHours = () => PL.S.see.stages.reduce((a, s) => a + Number(s.h || 0), 0);
  /* ---------- outreach fact sheet: placement ---------- */
  PL.FIELDS = {
    title: { label: 'Title', place: 'out', fixed: true, keep: true },
    why: { label: 'Why now', place: 'out' },
    base: { label: 'Base range', place: 'out', keep: true },
    hm: { label: 'Hiring manager', place: 'out', fixed: true, keep: true },
    process: { label: 'Hiring process', place: 'out' },
    commit: { label: 'Our commitment', place: 'out' },
    team: { label: 'Team & scope', place: 'after' },
    equity: { label: 'Equity', place: 'after' },
    bonus: { label: 'Bonus', place: 'after' },
    start: { label: 'Target start', place: 'after' },
    company: { label: 'Company', place: 'after' }
  };
  PL.custom = id => (PL.S.see.custom || []).find(c => c.id === id);
  PL.placeOf = k => {
    const f = PL.FIELDS[k];
    if (f && f.fixed) return 'out';
    const c = PL.custom(k);
    if (c) return c.place;
    return PL.S.see.place[k] || (f ? f.place : 'after');
  };
  PL.shown = k => !PL.S.see.hidden[k];
  PL.active = k => PL.shown(k) && PL.placeOf(k) === 'out';
  PL.WHY_DEFAULT = {
    'New role': 'This is a new role on the team.',
    'Backfill': 'We’re hiring for this role after a change on the team.',
    'Team growing': 'The team is growing, and this is one of the new roles.'
  };
  PL.whyText = () => { const s = PL.S.see; return s.whyType ? (s.whyLine.trim() || PL.WHY_DEFAULT[s.whyType]) : ''; };

  PL.SLOT_SRC = {
    whyYou: 'Why you · from their public work', title: 'Role', baseLine: 'Base range', processLine: 'Hiring process and commitment',
    processDetail: 'Hiring process and commitment', whyNow: 'Why now', teamLine: 'Team & scope', extras: 'Extra details you chose to share',
    gRevenue: 'Growth facts', gCustomers: 'Growth facts', gTeam: 'Growth facts', first: 'Candidate'
  };
  PL.BLANK_LABEL = { whyNow: 'why now', teamLine: 'team size' };
  PL.BLANK_FIELD = { whyNow: 'why', teamLine: 'team' };

  /* '' = leave out (field hidden or shown only after reply); null = blank to fill; string = the text */
  PL.emailCtx = cand => {
    const s = PL.S.see, f = PL.S.seq.facts, act = PL.active;
    const ratio = (a, b) => { const x = Number(a) / Number(b); return x >= 1.8 ? `roughly ${Math.round(x)}x` : x > 1 ? 'significantly' : ''; };
    let gCustomers = '';
    if (f.custNow && f.custShare !== 'internal') {
      gCustomers = f.custShare === 'approx' && f.custThen ? `Our customer base has grown ${ratio(f.custNow, f.custThen)} in the last year` :
        `${f.custNow} brands on the platform${f.custThen ? `, up from ${f.custThen} a year ago` : ''}`;
    }
    let gTeam = '';
    if (f.teamNow && f.teamShare !== 'internal') {
      gTeam = f.teamShare === 'approx' && f.teamNext ? `We plan to grow the team ${ratio(f.teamNext, f.teamNow)} this year.` :
        `We’re ${f.teamNow} people today${f.teamNext ? ` and plan to be ${f.teamNext} within a year` : ''}.`;
    }
    const proc = act('process'), com = act('commit');
    const processLine = proc && com ? `The process is ${PL.stagesLine()}, and we reply within ${s.commitment} hours at every step.` :
      proc ? `The process is ${PL.stagesLine()}.` : com ? `We reply within ${s.commitment} hours at every step.` : '';
    const processDetail = proc ? `The process is ${PL.stagesDetail()}. That’s about ${PL.totalHours()} hours of your time in total.${com ? ` We reply within ${s.commitment} hours at every step.` : ''}` :
      com ? `We reply within ${s.commitment} hours at every step.` : '';
    const teamLine = act('team') ? (s.engineers ? `You’d report to ${s.reportsTo || 'the hiring manager'} and work with ${s.engineers} engineers across our four teams${s.otherPMs && s.otherPMs !== '0' ? `, alongside ${s.otherPMs} other PM${s.otherPMs === '1' ? '' : 's'}` : ''}.` : null) : '';
    const extras = [];
    if (act('equity') && s.equity) extras.push(`equity ${s.equity} (${s.vesting})`);
    if (act('bonus') && s.bonus) extras.push(`bonus: ${s.bonus.toLowerCase()}`);
    if (act('start')) extras.push(`target start: ${s.start}`);
    (s.custom || []).forEach(c => { if (act(c.id) && c.value) extras.push(`${c.label.toLowerCase()}: ${c.value}`); });
    return {
      first: cand.name.split(' ')[0],
      whyYou: cand.whyYou,
      title: PL.titleText(),
      baseLine: act('base') ? `Base is $${s.baseMin}–${s.baseMax}k plus early equity, based in Palo Alto.` : '',
      processLine, processDetail,
      whyNow: act('why') ? (PL.whyText() || null) : '',
      teamLine,
      extras: extras.length ? `A few more details: ${extras.join('; ')}.` : '',
      gRevenue: f.rev && f.revShare !== 'internal' ? (f.revShare === 'approx' ? `Revenue has grown more than ${f.rev} in the last 12 months.` : `Revenue has grown ${f.rev} in the last 12 months.`) : '',
      gCustomers,
      gTeam
    };
  };
})(window.PL);
