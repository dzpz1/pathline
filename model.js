/* Pathline prototype — derived data: pool sizing, ranking, evidence, projections, email context. */
(function (PL) {
  const D = PL.D;
  const ORDER = ['tech', 'own', 'emp', 'rig', 'adapt'];
  const LVV = { S: 1, M: .55, U: .2 };
  PL.LV_TEXT = { S: 'Strong', M: 'Medium', U: 'Unknown' };

  PL.titleText = () => PL.S.see.title || 'Senior PM, AI';
  PL.cand = id => D.CANDS.find(c => c.id === id) || D.NEW_MATCHES.find(c => c.id === id);
  PL.allCands = () => D.CANDS.concat(D.NEW_MATCHES.filter(n => PL.S.out.newAdded[n.id]));
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
    const pool = (D.EVIDENCE_POOLS[aid] || { U: ['Not visible in profile; tested in the chat and take-home'] })[lv] || ['Not visible in profile; tested in the chat and take-home'];
    const k = PL.hash(c.id + aid) % pool.length;
    const out = [pool[k]];
    if (lv === 'S' && pool.length > 1) out.push(pool[(k + 1) % pool.length]);
    return out;
  };
  PL.score = c => {
    let s = 0;
    PL.S.attrs.slice(0, 5).forEach((a, i) => { s += (5 - i) * LVV[PL.level(c, a.id)]; });
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
  PL.ranked = () => {
    const dec = PL.S.sl.dec;
    return PL.allCands()
      .filter(c => dec[c.id] !== 'passed')
      .filter(c => dec[c.id] === 'approved' || PL.fails(c).length === 0)
      .sort((a, b) => PL.score(b) - PL.score(a));
  };
  PL.target = () => ({ 'Nov 2026': 30, 'Dec 2026': 25, 'Jan 2027': 20, 'Feb 2027': 18 })[PL.S.see.start] || 25;
  PL.visible = () => {
    const r = PL.ranked(), dec = PL.S.sl.dec;
    const approvedN = r.filter(c => dec[c.id] === 'approved').length;
    return r.slice(0, Math.max(PL.target(), approvedN));
  };
  PL.approved = () => PL.allCands().filter(c => PL.S.sl.dec[c.id] === 'approved').sort((a, b) => PL.score(b) - PL.score(a));

  PL.musts = c => {
    const r = PL.S.reqs, m = [];
    if (PL.S.jd.work === 'remote') m.push({ d: '', t: 'Remote (US)' });
    else if (c.bay) m.push({ d: '', t: `${r.office} ${r.days}d · lives in ${c.loc}` });
    else m.push({ d: 'half', t: `Relocation from ${c.loc} · ask` });
    m.push({ d: c.yrs >= r.minYears ? '' : 'no', t: `PM ${c.yrs} yrs` });
    m.push({ d: '', t: 'Metrics' });
    m.push({ d: '', t: 'Gen AI' });
    if (r.visa !== 'yes') m.push({ d: 'half', t: 'Work auth · ask' });
    r.custom.forEach(x => {
      if (x.key === 'b2b') m.push({ d: c.b2b ? '' : 'no', t: 'B2B SaaS' });
      else m.push({ d: 'half', t: `${x.label} · ask` });
    });
    return m;
  };
  PL.unknownCount = c => PL.musts(c).filter(m => m.d === 'half').length;

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
    const attr = loc * 0.083 * (PL.S.attrs.length > 5 ? 0.97 : 1);
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
    return { date: PL.fmtDate(d), status, replies: rpw < 1.5 ? '~1' : rpw < 2.5 ? '~2' : rpw < 3.5 ? '~3' : `~${Math.round(rpw)}` };
  };

  /* ---------- email context ---------- */
  const article = s => (/^[aeiou]/i.test(s) ? 'an ' : 'a ') + s.toLowerCase();
  const joinAnd = arr => arr.length <= 1 ? arr.join('') : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
  PL.stagesLine = () => joinAnd(PL.S.see.stages.map(s => article(s.name)));
  PL.stagesDetail = () => joinAnd(PL.S.see.stages.map(s => `${article(s.name)} (about ${s.h} hour${s.h === 1 ? '' : 's'})`));
  PL.totalHours = () => PL.S.see.stages.reduce((a, s) => a + Number(s.h || 0), 0);

  PL.SLOT_SRC = {
    whyYou: 'Why you · from their public work', title: 'Role', base: 'Comp · base range', stagesLine: 'Hiring process', stagesDetail: 'Hiring process',
    totalHours: 'Hiring process', commitment: 'Our commitment', outcome1: 'Outcome 1 · Import & structure', whyNow: 'Why now', reportsTo: 'Team & scope',
    engineers: 'Team & scope', gRevenue: 'Growth facts', gCustomers: 'Growth facts', gTeam: 'Growth facts', first: 'Candidate'
  };
  PL.BLANK_LABEL = { outcome1: '12-month outcome', whyNow: 'why now', reportsTo: 'reports to', engineers: '# engineers' };
  PL.OPTIONAL = ['gRevenue', 'gCustomers', 'gTeam'];

  PL.emailCtx = cand => {
    const s = PL.S.see, j = PL.S.jd, f = PL.S.seq.facts;
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
    return {
      first: cand.name.split(' ')[0],
      whyYou: cand.whyYou,
      title: PL.titleText(),
      base: `$${s.baseMin}–${s.baseMax}k`,
      stagesLine: PL.stagesLine(),
      stagesDetail: PL.stagesDetail(),
      totalHours: String(PL.totalHours()),
      commitment: `${s.commitment} hours`,
      outcome1: j.outcomeBlank ? `AI workflows used weekly by ${j.outcomeBlank}% of our customers` : '',
      whyNow: s.whyLine || '',
      reportsTo: s.reportsTo || '',
      engineers: s.engineers || '',
      gRevenue: f.rev && f.revShare !== 'internal' ? (f.revShare === 'approx' ? `Revenue has grown more than ${f.rev} in the last 12 months.` : `Revenue has grown ${f.rev} in the last 12 months.`) : '',
      gCustomers,
      gTeam
    };
  };
})(window.PL);
