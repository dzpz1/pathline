# Pathline: employer outbound flow

**Milestones and requirements, v1.60**

Captured 2026-09-23, last updated 2026-09-25. This covers only the current decisions. The live prototype is at https://dzpz1.github.io/pathline/.

Worked example throughout: Nectar Social, Senior PM, AI.

---

## What Pathline is

**Pathline is a recruiting tool for tech companies in their scaling phase.** It helps them grow their team while **improving talent density.**

**Pathline's alpha:** our ability to curate ambitious companies, pool them effectively, and get talented individuals to engage.

**Core mission:** curate the demand and supply sides well, so that onsite rates are high and Pathline keeps a hire rate above the industry average.

**Three core signals:** aptitude, motivation / interest, and trust. **Pathline delivers high-aptitude, highly interested people to employers, who then gauge trust.**

**The platform's two hypotheses:**
- **Demand side:** there's a group of elite companies with similar, high-caliber talent needs that will benefit from contributing to and maintaining a shared, vetted talent pool.
- **Supply side:** top-tier supply is often latent, but willing to explore new opportunities and invest effort if companies are upfront about four things:
  - their time commitment
  - their hiring mechanics
  - their expectations
  - themselves

- **Who it's for:** tech companies that have found product-market fit and are hiring quickly, typically Series A to D. Their hiring volume is outgrowing their recruiting capacity, and the bar is at risk of slipping.
- **Why this is the wedge:** scaling teams have to be the most intentional about how they spend time.
  - If they spend all their time hiring, product growth takes a hit in the meantime.
  - Yet to uphold the talent bar, they have to be the ones vetting new hires. Many successful startups had a founder personally vet hundreds of early hires.
  - Pathline lets the people who hold the bar keep vetting, without hiring eating the time they need for the product.
- **Who they're hiring:** top-tier talent who raise the average of the team they join. We don't prescribe an experience level; the role's attributes and must-haves decide that.
- **What replaces the resume as the unit of signal:** units of work.
  - **Past work:** GitHub repos, Hugging Face artifacts and similar.
  - **Most importantly, a fresh unit of work: the practical assessment.** It lets each hiring company inject some of its “secret sauce” and find candidates who fit its tailored needs.
  - **The limit:** the practical assessment mostly tests aptitude. Whether a candidate is trustworthy and able to build trust is hard to assess asynchronously. That's the next opportunity for Pathline (see Future iterations: signal trustworthiness).
- **Who initiates, and how that solves the cold start:** the employer initiates.
  - **A very wide talent pool from day one** (see DA-1 and DA-2 for details):
    - licensed profile data from API providers such as **People Data Labs** and **Coresignal**
    - public work: **GitHub** and **Hugging Face**
  - **LinkedIn supplements signals for candidates in the hiring flow.** Pathline will start out behaving more like an applicant tracking system, and LinkedIn has shown willingness to extend API access to ATS partners. The ATS integration adds signals for every candidate who has responded and is now part of an employer's hiring flow. It enriches the people already engaged, not the initial pool.
  - **The employer vets pre-candidates before outreach.** That gives Pathline a signal for which attributes and other signals stand out most to them, and improves its matching.
- **Attributes, not keywords:**
  - The employer enumerates the attributes they're looking for in a hire, like ownership and adaptability.
  - Pathline looks for signals of them in each pre-candidate's profile, like signs they've done end-to-end launches, or pivoted the team and product.
  - Pathline infers from the job role which attributes will help, and infers from the pre-candidate's profile what signals their experience shows.
- **The problem we solve:** as companies scale, the hiring bar tends to drift down under time pressure. Pathline counters that by:
  - defining roles by the attributes that matter over the next 12–18 months
  - finding candidates with strong evidence on those attributes
  - testing them rigorously, without losing their interest
  - holding both sides to explicit commitments
- **How we measure success for each hire:** new hires perform at or above the existing team's level, and hiring keeps pace with the company's plan.

### What success means for Pathline: the flywheel

Pathline succeeds as a business when this loop keeps turning:

```
  ┌─► 1. Recruiters and hiring managers identify pre-candidates
  │      with high signal on the ideal attributes
  │                        │
  │                        ▼
  │   2. Outreach
  │                        │
  │                        ▼
  │   3. Candidates who respond join Pathline.
  │      Responding shows interest in new roles.
  │                        │
  │                        ▼
  │   4. Some complete practical assessments, adding strong, reusable signal
  │                        │
  │                        ▼
  │   5. Better signal → better outcomes for candidates
  │      and hiring teams
  │                        │
  │                        ▼
  │   6. A high success rate on both sides
  │                        │
  │                        ▼
  └── 7. More candidates and more companies join
         (the network grows, so step 1 gets faster and sharper)
```

What each turn of the loop adds:
- **Every outreach reply** adds an interested, reachable candidate to the network.
- **Every practical assessment** adds graded, reusable evidence on attributes, so the next match needs less effort from the candidate.
- **Every hire and every pass** adds a label that makes matching and grading more accurate.
- **A higher success rate** is the pitch to both sides: companies hire better people faster, and candidates get roles where they're a real fit, with less repeated screening.

**North star: onsites scheduled.**
- The number of onsite interviews scheduled through Pathline, tracked weekly and cumulatively, and for each role against the pace its start date needs.
- It's the point where Pathline's work turns into real interviews. It needs every earlier step to work: sourcing, outreach, replies, practical assessments and fast decisions.

**Guardrail: offer rate.**
- Offers ÷ onsites completed, for the same role family and company stage.
- **Target: 35% or higher.** Pathline alerts if the rate drops below 35% over a rolling window of the last 20 onsites.
- Reference points (anecdotal, from practitioner sources):
  - big tech: roughly 15–20%
  - mid-sized companies and startups: roughly 30–50%
- The guardrail stops the north star from being gamed. Pushing more, weaker candidates into onsites would raise the count but waste hiring managers' time and dilute talent density. A high offer rate is the proof that Pathline's filtering and practical assessments send the right people.

**Flywheel health metrics:**

| Step | Metric |
|---|---|
| 1 | Share of shortlist candidates who are approved |
| 2 → 3 | Positive reply rate; candidates who join per role |
| 4 | Practical assessment completion rate; share of grades reused for another role |
| 5 | **Onsites scheduled (north star)** |
| 5–6 | **Offer rate from onsites (guardrail, 35%+)**; hire quality at 90 days and 12 months, on both sides |
| 7 | New companies and candidates joining; share of shortlists drawn from the existing network |

The last metric in the table, the share of shortlists drawn from the network, shows whether the loop is compounding.

Every requirement below serves this goal. When a trade-off comes up, protect talent density over hiring volume, and protect candidate experience over employer convenience.

---

## Scope

**In scope:** the employer and recruiter side of the **outbound** flow. It runs from importing a job description through to scheduling onsite interviews.

**Set aside for now:**
- Inbound flow: applications, screening, the authenticity gate
- Async fit check: motivation and must-have cards, and the green/amber/red fit check
- Candidate-side UI, except where the employer's actions produce candidate touchpoints (emails, practical assessment, decline notes, network opt-in)
- Onsite and final interview stages. The flow ends at scheduling.

## Terms

| Term | Meaning |
|---|---|
| **Attribute** | A property of the person, e.g. technical depth or ownership. Never an experience. Experiences are *evidence* of attributes. |
| **Must-have** | A hard parameter a candidate can't easily change: years of experience, a skill, location, or work authorization. |
| **Pre-candidate** | Someone on the shortlist who wasn't passed on when outreach started, and who hasn't replied yet. |
| **Candidate** | A pre-candidate who has replied with interest. |
| **Network** | Candidates who came through any company's process on Pathline and opted in to being matched to other roles. |
| **Fact bank** | Company facts from the job description, the employer's configuration and sample emails. These are the only facts Pathline may use in generated content. |

## Platform principles

1. **Give first.** Candidates see comp, the process and the response commitment before being asked for effort.
2. **Evidence over proxies.** Attributes are scored from evidence of what people actually did. Priority comes only from how attributes are ranked.
3. **Independent judgment before discussion.** Reviewers decide without seeing each other's decisions.
4. **Humans decide.** AI drafts, grades and recommends. It never rejects anyone automatically.
5. **Nothing crosses between companies without consent.** No company's gut checks, notes or decisions are ever shared with another.

UI requirements are stated inside each milestone. UI requirements that apply to every milestone are under “Cross-cutting UI requirements”.

---

## Milestone 1: Shortlist of pre-candidates

**Goal:** a ranked shortlist with strong evidence on each key attribute and a high likelihood of meeting each must-have. It's sized to the target start date, approved by the hiring team, and ready for outreach.

**Steps (4 screens):** Job description → Candidate attributes → Role requirements → Shortlist. (Requirements and the talent pool were one screen from v1.37.)

### UI requirements
- **M1-UI1** Every screen works on a phone, one screen per step. The whole milestone takes about 10 minutes.
- **M1-UI6** The milestone goal is visible in the product itself.
  - The first screen says what the employer is working toward: “In about 10 minutes, you’ll have a shortlist of people to reach out to.”
  - The app bar's **headline is the milestone**, e.g. “Shortlist for outreach”. Beneath it, the step count is grouped with the task name, e.g. “Step 2 of 6 · Candidate attributes”. Steps count across the whole flow, not per milestone (X-UI7).
  - Reaching the goal is confirmed without an extra step: tapping “Continue to outreach with N” goes straight to milestone 2, with a brief notice, “Shortlist ready: N pre-candidates”.
- **M1-UI2** Structured inputs (chips, toggles, steppers, sliders) instead of free text. Free text is used only where the employer's own words carry meaning, e.g. why now or definitions.
- **M1-UI3** Details open as **bottom sheets** over the current screen: swipe down to close, swipe left or right between items. This applies to attributes, requirements, hiring process stages and candidate evidence. Inside a details sheet, tapping any line edits it in place, and changes save automatically (X-UI2).
- **M1-UI4** ~~A tap on a funnel layer opens the controls behind it as a sheet.~~ Superseded in v1.39: the funnel is view-only.
- **M1-UI5** AI-drafted content carries a plain-text “Suggested” label until the employer edits or accepts it. No symbols. Every change can be undone.

### 1.1 Import & what the role needs (one screen)

The focus of this screen is what the role needs. The import step only has to show that Pathline understood the role.

**Import**
- **M1-1** One field: “Paste a job description or a link”, with one **Next** button.
  - *Prototype only:* the field starts empty. **Tapping it**, or typing or pasting anything, fills in Nectar's posting link (jobs.ashbyhq.com/nectar-social/…), so every demo imports the same role. Once the link is in, the role name shows beneath the field (“Product Manager, AI · Nectar Social · Palo Alto, CA · Full time”). Deleting characters works normally; voice input is unchanged.
  - Pathline detects which it is. A URL is fetched from the posting, including ATS job-board APIs such as Ashby's, whose rendered pages are JavaScript-only. Anything else is parsed as job description text.
  - No tabs, segmented controls or icons.
- **M1-2** Directly beneath the field there are two clear symbol buttons: a **microphone** (talk it through) and an **upload** icon (add a file). Each has an accessible label and a 44pt tap target. There's no “Other ways to add it” link or sheet.
- **M1-3** After import, the field collapses to one line (“From jobs.ashbyhq.com · Change”). Below it, a role header is the evidence that Pathline understood the role:
  - title · company · location · employment type (e.g. “Senior PM, AI · Nectar Social · Palo Alto, CA · Full time”)
  - “Level: Senior PM, AI · Work model: hybrid, 4 days in office”

  There's no summary, no drafted outcomes, and no view of the original responsibilities.
- **M1-4** Conflicts in the posting appear inside the role header as a one-tap question, and only when they exist **in what the posting actually says**. Example: the title says “Product Manager” but the body says “Senior Product Manager”. Once answered, the question becomes the Level line.
  - *Prototype only:* for demo simplicity, the level question is skipped. The role is set to **PM, AI**, and the title is used everywhere (app menu, email subjects, emails). It can still be changed in Outreach fact sheet.
  - Hidden listing metadata doesn't create questions. Example: an ATS “remote” flag that the posting text never mentions. Pathline goes with the posting text: for Nectar, hybrid, 4 days in office.

**What the role needs**
- **M1-5** Generate attributes from the JD and show them **ranked**. Pathline typically drafts 5, but there's no minimum or maximum. Each attribute shows:
  - a one-line definition
  - a "Why" that cites the JD or an outcome

  Every attribute counts toward the shortlist, weighted by its rank. There's no “also assessed” tier.
- **M1-6** Every attribute must pass the naming test: "They are / They have ___" makes sense before the person holds the job. Experience-style wording gets routed to evidence or must-haves.
- **M1-7** Re-rank with **up and down arrows beneath each rank number**. The top attribute has no up arrow and the last has no down arrow. **Rank is the only priority signal:** no spikes, no signal meter.
- **M1-8** The attribute card shows:
  - the rank number, with the re-rank arrows beneath it
  - the name, definition and why
  - a **“What we’ll look for”** link at the bottom

  Tapping anywhere else on the card opens its details. There's no trailing arrow, edit icon or other button. Employer-written text is labeled "Your words."
- **M1-9** The attribute details sheet shows the name, definition, why, and **"What we'll look for"** (strong and weak evidence).
  - Tapping any line edits it in place, and changes save automatically. There's no Edit or Done button.
  - The “What we’ll look for” link opens the same sheet, scrolled to the evidence.
  - **Remove** is a text link on the same line as the attribute's name, at the top of the sheet (not at the bottom). Removing shows a notice with Undo.
  - Swipe to move between attributes.
- **M1-10** Adding an attribute:
  - **One entry point:** an **Add attribute** row at the end of the list. Suggestions and adding are the same kind of action, so they live together.
  - It opens one sheet, in this order:
    1. **Suggested for this role:** e.g. intellectual honesty first, then the lower-ranked suggestions, each with its reason and a single Add
    2. search over the attribute library
    3. write your own
  - Pathline drafts the definition, "why" and evidence, marked as suggestions. Each can be edited, regenerated or reset.
  - Checks: the naming test, and overlap with existing attributes (with an offer to merge).
  - Pathline suggests a rank, which the employer can accept, then adjust with the arrows.
  - No cap on the number of attributes, and adding one never forces another out. With 8 or more, a one-line note explains that each extra attribute lowers the weight of the others. The note is informational and never blocks.
- **M1-11** There's no separate recommended chip or “Other suggestions” toggle on the screen. Both live in the Add attribute sheet (M1-10). Adding never requires swapping one out.
- **M1-12** Every attribute maps to a shared library entry, so the model learns across roles.
- **M1-12a** Internally, Pathline still ranks attributes by their impact over the next 12–18 months, using outcomes it drafts from the JD. The drafted outcomes are Pathline's inferences, not facts from the JD, so they're **never shown to candidates or used in emails**.

### 1.2 Role requirements (one screen, v1.37): must-haves
- **M1-13** Show **hard parameters only**, one line each: experience (role + years), skills, location / work model.
- **M1-14** Take them from the JD without rewording or removing any. Tapping a row shows the original JD quote and the editable structured fields.
- **M1-15** Pull in requirements stated elsewhere in the JD (e.g. office days in the benefits section), with the source cited.
- **M1-16** A **"Not in your JD"** check asks about missing standard parameters, e.g. visa sponsorship, relocation, time zone.
- **M1-17** "Add requirement" opens a sheet with a type picker (Experience, Skill, Location, Work auth, Other) and that type's structured fields (e.g. skill + level, experience + years).
  - **No “why” field.** The employer isn't asked to justify a requirement.
  - Anything already entered is kept when the type or level changes.
  - **Add** is enabled as soon as the requirement has a name. It closes the sheet, shows the new requirement in its group straight away, and updates the talent pool.
  - No cap on the number of requirements. Removing one happens in its sheet.
  - *Prototype bug, 2026-09-24:* tapping a type or level chip redraws the sheet and clears the typed text, so Add silently does nothing. The rules above fix it.
- **M1-18** Nice-to-haves aren't part of this screen.

### 1.3 Role requirements (same screen): the pool
- **M1-24** One screen, top to bottom:
  - **Must-haves:** one row per must-have (experience, each skill, location, visa, and any you added). Requirements you add come last, and their label starts with “+” (“+Skill”, “+Experience”, “+Location”, “+Work auth”, “+Other”). That way they read as additions, not as out-of-order entries. Tapping one opens **just that requirement's sheet**. Questions the JD doesn't answer (relocation, visa) show inline with a “Not in your JD” tag.
  - **Add requirement.**
  - **Your talent pool:** the start-date question, then the funnel, Why N and the verdict.
  - **Footer:** Build shortlist of N.

  There's no separate summary: attributes live on Candidate attributes, and base range is behind the funnel's “Base range fits” layer.
- **M1-24a** **Target start date** is asked here: “When do you need them to start?”. It drives the verdict and the shortlist size. **Base range** is prefilled from the JD and editable here. Everything else candidates see is set in milestone 2.
- **M1-25** A funnel with approximate ranges:
  1. experience
  2. skills
  3. location
  4. strong on the top attributes (weighted by rank)
  5. likely to move
  6. base range fits
  7. shortlist of the top N
- **M1-26** The funnel is **view-only** (v1.39). Its rows aren't tappable, and there are no “+” signs on the labels. Changes happen in the must-haves above it (each opens its own sheet), and in the start date. “Why N?” still opens its explanation.
- **M1-27** A verdict (healthy / tight / thin), judged against the target start date.
- **M1-27a** The funnel's last row, “Shortlist · top N”, shows the recommended outreach count. “Why N?” lives here now, not on the shortlist.

### 1.3a Where the talent pool comes from (data access)
- **DA-1 Sources, combined and deduplicated into one pool.** Each profile keeps its source, so evidence on a card can show where it came from.
  1. **Licensed profile data:** API providers such as **People Data Labs** and **Coresignal**. This is the core pool: work history, titles, companies, skills and locations at scale. Paid per record or per query, under the provider's licence terms.
  2. **Public sources:** GitHub, publications, patents and conference talks. These are the strongest evidence for attributes (e.g. technical depth, empirical rigor), not just keywords.
  3. **Pathline's own opted-in candidates:** people who replied to outreach, or opted in after a decline (“Match me to other roles”). Small at first, but they want to move, so show them separately as the best leads. This grows with the flywheel.
  4. **Recruiter-run counts:** the employer's recruiter runs the same search in their own LinkedIn Recruiter seat, and Pathline records the counts. Manual, but compliant; it's used for sizing, not for pulling profiles.
  5. **LinkedIn, through a partnership:**
     - **Talent Insights** does pool sizing directly and is a possible partner.
     - **Pathline could qualify as an ATS** (see DA-2). That could open LinkedIn's partner APIs to supplement signals for candidates already in the hiring flow.
- **DA-2 Pathline as an ATS.**
  - **Why it could qualify:** Pathline already does what an applicant tracking system does. It holds the role, the pipeline of candidates by stage, outreach, chat notes, practical assessments, reviewer decisions and onsite scheduling (milestones 2–5).
  - **What that could unlock:** LinkedIn's ATS partner programs:
    - **Recruiter System Connect:** syncs candidates, notes and InMail history between LinkedIn Recruiter and the ATS, for customers who hold Recruiter seats.
    - **Apply Connect**, and job posting.
  - **How we use it:** to supplement signals for all candidates who've responded and are now part of each employer's hiring flow (v1.53). It isn't used to widen the initial pool, which comes from the licensed providers and public work.
  - **Needs confirming:** partner approval criteria, cost, and exactly what data comes through. As far as we know, these integrations sync the customer's own Recruiter data. They don't open general search of LinkedIn members. Automating a recruiter's seat (scraping, browser extensions) stays off the table: it breaks LinkedIn's user agreement.
- **DA-3 Guardrails:**
  - **Deduplicate** the same person across sources before counting, or the pool inflates.
  - **Counting is low risk; storing is higher risk.** Store only what the shortlist needs, and meet GDPR for EU candidates.
  - **Label the funnel as approximate,** and say which sources fed it.

### 1.4 Shortlist (capstone)
- **M1-28** The shortlist screen opens straight onto the candidates. The reward of this milestone is seeing the people Pathline sourced.
  - Below the criteria bar there's one heading line, e.g. “25 people for your Senior PM, AI role”. No summary card, progress meter or banners above the list.
  - **The order is explained:** a line under the heading reads “Ranked by fit, best match first”, and each card shows its position (1, 2, 3…). Fit is evidence on your attributes, weighted by their rank.
  - The top candidates are visible without scrolling. Cards appear in rank order.
  - The recommended count is worked back from the start date. Its explanation (“Why N?”, with the timeline and conversion assumptions) is on Review & pool (M1-27a).
  - If fewer people match than recommended, the heading says so in one line: “18 people match; loosen a must-have to reach 25”.
- **M1-29** Each candidate card shows, in words rather than symbols:
  - **Exceptional at:** one attribute
  - **Why a great fit:** one or two lines of evidence on the top-ranked attributes
  - **Must-haves:** either “Meets must-haves”, or “Ask: relocation, work authorization” listing only the unknowns. No dots or per-requirement chips. Unlikely candidates are excluded.
  - likely to move: High / Medium, with no underlying detail
  - warm path, if one exists
- **M1-30** Tapping a card opens that candidate's evidence per attribute, in the same sheet pattern.
- **M1-31** **Everyone on the shortlist is included by default.** The only card action is **Pass** (reason chips in a sheet, and Undo in the confirmation notice). Tapping anywhere else on the card opens the candidate's evidence sheet, which also has Pass. When someone is passed, the next-best candidate takes their place to keep the count.
- **M1-32** No Approve or Approve all. The footer has one button, **“Continue to outreach with N”**. Everyone not passed on becomes a pre-candidate. **No confirmation sheet:** the button goes straight to outreach. Unknown must-haves are already shown on each card, and are asked after the candidate replies.
- ~~**M1-33** A sticky **criteria bar** with three word-only chips: Attributes, Must-haves, and Base & start date. Each opens its screen as a sheet. On close, the list re-ranks, with a notice ("3 new · 2 dropped · approved kept") and Undo.~~ Removed in v1.21: no breadcrumbs on any screen. To change criteria, open the step from the menu (X-UI9); the shortlist re-ranks when you come back.
- **M1-35** *Moved to Future iterations.* Independent recruiter and hiring manager review of the shortlist, and surfacing their disagreements, isn't part of this phase.
- **M1-36** “Continue to outreach with N” leads straight to milestone 2's first step, with no confirmation sheet. The milestone is complete at that point, and a brief notice says “Shortlist ready: N pre-candidates”.

---

## Milestone 2: Outreach launched

**Goal:** an approved, sourced, progressively revealing email sequence is sending to pre-candidates at a controlled pace.

**Steps (2 screens):** Outreach fact sheet → Email sequence. Start outreach is a bottom sheet opened by “Approve sequence”, not a screen.

### UI requirements
- **M2-UI1** Emails are reviewed as collapsed cards (day, theme, what it reveals) that expand for editing. A collapsed card is one tap target with no other controls. They're readable and editable on a phone.
- **M2-UI2** Personalized text and blanks are visually highlighted. Tapping a blank opens its source field as a bottom sheet.
- **M2-UI3** Revisions and versions can be compared side by side or swiped, and undone.
- **M2-UI4** Start outreach is a single bottom sheet. The list of who hears from you first updates as the active count changes.
- **M2-UI5** The goal and progress are visible in the product: headline “Outreach”, with “Step 5 of 6 · Outreach fact sheet” beneath it (X-UI7).

### 2.0 Outreach fact sheet (first step of outreach)

This sits right before the emails because it's exactly what the emails disclose. Base range and target start date come across from milestone 1.

A one-line reminder sits at the top of the section: **“The more you share up front, the better your hiring outcomes: candidates reply more and drop out less.”**
- **M2-S1** Fields, prefilled from the JD where possible, and **otherwise with inferred values** (v1.33), so nothing starts blank:
  - Inferred values: why now (New role), hiring manager (who posted the role), team & scope, equity range (benchmarks; the posting says it offers equity) and bonus (benchmarks; the posting says it offers a bonus).
  - Each inferred value carries a small **“Inferred”** tag in the list. Its sheet opens with a note on where it came from, plus **Looks right**.
  - Changing the value, or tapping Looks right, removes the tag. Every value can be revised at any time.
  - title / level
  - **why now:** a type (New role / Backfill / Team growing), plus an optional line in the employer's own words.
    - **Choosing a type is enough.** The row shows the choice straight away (e.g. “New role”) and counts as filled.
    - The optional line adds detail (e.g. “New role · Our first dedicated AI PM”).
    - Emails use the line if there is one. Otherwise they use a default sentence for the type, e.g. “This is a new role on the team.”
    - *Prototype bug, 2026-09-24:* choosing a type alone left the row showing “Needed”.
  - **team & scope:** reports to, engineers, other PMs, direct reports
  - equity range + vesting
  - bonus target
  - base range and target start date, carried over from milestone 1 and editable here too
  - hiring manager, who is the outreach sender
  - **company facts:** the fact bank, drafted from the job description and sample emails. Each fact is a line the employer can tap to edit, remove, or add to (“Add a fact”). Changes save automatically. Removing a fact can be undone. Emails can only use facts from this list.
  - **hiring process:** a list of stages, one line each (e.g. “Practical assessment · 3h”), with the total shown. Tap a stage's name or time to edit it in place; changes save automatically. Re-rank with up and down arrows beneath each stage number, the same as attributes. “Add stage” adds one. Remove is a text link in the stage's details.
  - **response commitment:** 24h / 48h (default) / 72h
- **M2-S2** Group the fields into two sections by when candidates see them, instead of tagging each field with a symbol. **The employer chooses which section each field goes in.** Pathline sets these defaults:
  - **What could be shared in initial emails:** title, why now, base, hiring manager, hiring process, response commitment
  - **What could be shared after they respond:** team & scope, equity, bonus, target start date, company facts

  How moving works:
  - Every field's details have a two-option choice: **“Show: in initial emails / after they respond”**. Moving works in both directions.
  - **Title and hiring manager always stay in outreach,** because every email is from someone about a role.
  - Moving a field out of outreach shows the same gentle, non-blocking reminder as removing, e.g. “Candidates who see the base range in the first email are more likely to reply.”
  - Emails adapt automatically. Lines that depend on a field shown after reply are left out of the emails, and the field appears in the role room once the candidate replies.
- **M2-S3** Employers can **remove or add** information. Upfront is encouraged, not forced.
  - **Remove:** any field except title, base range and hiring manager. Base range can still be moved to after they reply (M2-S2); it just can't be hidden entirely.
    - Those three stay: emails can't be sent without a sender and a role, and many states' pay transparency laws expect a pay range.
    - Removing a field shows a gentle, non-blocking reminder, e.g. “Candidates who know the equity range up front are more likely to reply. Remove anyway?”
    - Removed fields go to a “Hidden” list at the bottom of the section, with one tap to bring them back.
    - Emails leave out any line that depends on a removed field.
  - **Add:** an “Add information” row at the end of each section.
    - It suggests facts Pathline already knows. Examples: relocation support from the JD ($1,000/month housing stipend), visa sponsorship from the Requirements answer, remote flex days, benefits highlights.
    - If the employer wants candidates to see what success looks like, they add it here in their own words. It's shown in the role room, never written into the email copy.
    - Or the employer writes their own: a label and a value.
    - Added fields go in the section they were added to, and can be moved between sections like any other.
- **M2-S3a** Until removed, these block approving the email sequence until filled in:
  - why now (a type is enough)
  - team size
  - equity range
  - bonus target (if the JD mentions a bonus)
  - hiring manager
- **M2-S4** Vague values such as "equity: yes" count as missing.
- **M2-S5** The response commitment is tracked as an SLA: reminders before deadlines, and the result shown on the employer's track record.

### 2.1 Sequence generation
- **M2-1** Generate **5 emails per posting**, sent from the hiring manager's mailbox. Emails 2–5 are replies in the same thread. The sequence stops when the candidate replies.

  | # | Day | Theme | Reveals |
  |---|---|---|---|
  | 1 | 0 | Hook | Sender, company credibility, why you, the role, base + location, a one-line process outline, response commitment |
  | 2 | 3 | The role day to day | Teams, product surface, what they'd own (from the JD) |
  | 3 | 7 | Why now | Market timing, traction, why the role is open, early equity |
  | 4 | 12 | People + process | Reports to, team, stages with time commitments, response commitment, offer to meet a peer |
  | 5 | 18 | Graceful close | A "later" option, referral ask |

- **M2-2** Every claim comes from the **fact bank** or from a value the employer has seen and approved. Inferred values in Outreach fact sheet are marked, and approving the sequence confirms them (v1.33). Pathline's own inferences, such as drafted outcomes, are never part of it. Unsourced claims are flagged, and blanks block approval; tapping a blank opens its field as a sheet.
- **M2-3** Personalized slots (e.g. "why you") are highlighted and show their source. "Preview as" steps through pre-candidates.
- **M2-4** Learn the employer's voice from the sample emails they provide.
- **M2-5** Defaults, each of which can be turned off:
  - a sourced "why you" line in email 1
  - base range in email 1
  - ~~one-tap reply options under the signature~~ Removed in v1.22: the option was unclear, and candidates reply by email like any other message.

### 2.2 Refinement (3 levels)
- **M2-6** **Revise inline:** tap the text and type.
- **M2-7** **Revise one email:** a plain prompt box that takes typing or voice (X-UI10), with a text **Revise** button (no send icon). No chips beneath it. After a revision, one line of text shows what changed, with Compare and Undo.
- **M2-8** **Change all emails:** one plain prompt box, which takes typing or voice (X-UI10). No quick-start chips; the placeholder suggests an example (“e.g. focus on growth”).
  - Changes to tone apply directly.
  - Changes to what the emails are about show a **5-line plan** first.
  - Missing facts are asked for, each with a share level: exact / approximate / internal only.
  - Each change produces a named **version**. Versions can be compared email by email and restored.
- **M2-9** **Pinned** paragraphs and manual edits survive regeneration.

### 2.3 Start outreach
- **M2-10** A "Start outreach" sheet with:
  - **How many at a time:** a number field the employer types into, default 6, with a numeric keypad on phones. Any whole number from 1 up to the number of pre-candidates is accepted.
  - ~~a live projection (finish date, on-track status, weekly reply load)~~ Removed in v1.40. Pace lives on Optimize outreach.
  - **the first people to hear from you, by name** (avatar, name, title; “intro first” on warm intros), updating live with the number typed, plus “Then N more, one at a time as people reply or finish the sequence”
  - **From:** the sender mailbox, a dropdown the employer sets (default: the hiring manager's). Email previews follow it.
  - **Sends:** the send window, a dropdown (Weekday mornings, Tue–Thu 8–10am, Weekdays 9am–5pm, Any time). Times are in the candidate's time zone. The send-timing suggestion on Optimize outreach sets the same value.
  - No status text such as “connected”.

  Nothing else: no recruiter disagreements and no ordering explanation. Pathline still contacts warm intros first, then by rank, but the sheet doesn't explain it.

  **Begin outreach** (no number on the button) goes straight to Optimize outreach (milestone 3). There's no toast. Instead, the top of the screen shows a clear simulated-time header: “10 days later · Oct 3 · outreach started Sep 23” (v1.34). The shortlist after outreach uses the same header (“3 weeks later”).
- **M2-11** Queue behavior: when an active person replies, finishes the sequence or opts out, the next pre-candidate starts.
- ~~**M2-12** A confirmation screen showing:~~ Removed in v1.23. The names moved into the Start outreach sheet (M2-10); monitoring covers the rest.
  - ~~who was just contacted, with send time and next email date~~
  - ~~warm-intro requests, labeled as such~~
  - ~~anyone **held** by a contact limit across Pathline customers, with the date they'll be contacted instead~~
  - ~~the queue, with next up~~
  - ~~pause or remove for each person~~
  - ~~the active count, changeable~~

---

## Milestone 3: Outreach monitoring

**Goal:** keep pace with the start date and improve response rates.

### UI requirements
- **M3-UI1** The dashboard can be read at a glance on a phone: pace status first, then the funnel, then items needing action.
- **M3-UI2** Suggestions are cards with exactly two actions, Apply and Dismiss. The reason is written into the card, not behind a “Why?” link. At most 2–3 are shown.
- **M3-UI3** Push notifications only for items with a deadline: replies near the commitment deadline, pace turning "behind."
- **M3-UI4** New matches open in the same card-and-sheet pattern as the shortlist.

- **M3-1** **Optimize outreach** (the screen's name in the menu and app bar):
  - pace vs. start date
  - funnel: contacted → opened (approximate) → replied → interested
  - replies broken down by email
  - ~~replies awaiting a response~~ Removed in v1.35: replies are handled on the shortlist. The menu's badge points there.
- **M3-2** Opens are labeled approximate (Apple Mail Privacy Protection inflates them). Open tracking can be turned off. Replies are the headline metric.
- **M3-3** A **send timing** suggestion based on when replies arrive, with a confidence label (the employer's own data vs. Pathline benchmarks). Apply / Dismiss. ~~Plus an optional per-candidate timing setting.~~ Removed in v1.36.
- **M3-4** An **active count** suggestion when pace slips, showing the new finish date and reply load. Apply with a stepper, or Dismiss.
- **M3-5** At most 2–3 suggestions at a time. A dismissed suggestion stays quiet until the data changes. Push notifications for items with deadlines.
- **M3-6** **New matches** show on the **shortlist**, not on Optimize outreach (v1.42). A “New matches since Sep 23” section sits after Review & onsite. Each card shows exceptional-at, why a fit, must-haves and rank if added, with **Pass** and **Add to queue**. Added people join “Not contacted yet” at their rank; both actions have Undo. Nobody new joins without the employer's say-so.

---

## Milestone 4: Employer decisions before onsite

**Goal:** turn interested candidates into practical assessment submissions, and handle passes gracefully.

**Where it happens:** on the shortlist's “Needs you” and “Waiting on them” sections, not on separate screens (X-UI12). The menu's “Shortlist” opens it.

### UI requirements
- **M4-UI0** Every step opens as a bottom sheet from the person's card on the shortlist: the reply (with what's next), the gut check and transcript after a chat, the pass note, and the practical assessment. Closing the sheet returns to the list, where the card shows the new stage.
- **M4-UI1** Every decision (chat or practical assessment, gut check, pass or send) takes one tap on a phone. The gut check comes before anything else in the post-chat sheet.
- **M4-UI2** Transcripts can be pasted or uploaded from a phone.
- **M4-UI3** Decline emails and practical assessments are previewed and edited in the same card pattern as the outreach emails.
- **M4-UI4** Each assignment section is a card that shows **what it tests** (e.g. “Tests: Ownership, Technical depth”), visible even when collapsed. No counts (“Tests 1”, “2 sections”). Tapping a card opens its content. There's no separate coverage list with numbers.

### 4.0 The decision tree (v1.60)
After outreach, some candidates respond with interest. Assume their quick questions (e.g. relocation, work authorization) have been answered by email. From there, the employer faces three junctions. Each one serves a core signal: aptitude, interest or trust.

```
Interested reply (quick questions answered async)
   │
   ▼
① Aptitude requirements likely met?            ← aptitude, from units of work
   ├─ yes ─► 15-minute chat: gauge trust and mutual fit
   │           │
   │           ▼
   │     ② Chat verdict: high trust?            ← trust
   │           ├─ yes ─► practical assessment: verify aptitude and level of interest
   │           │            │
   │           │            ▼
   │           │      ③ High signal on all the attributes and skills we're looking for?
   │           │            ├─ yes ─► onsite with the team: fully verify trustworthiness
   │           │            └─ no  ─► open
   │           └─ no  ─► open
   └─ no  ─► open
```

- **M4-0a Junction ① (aptitude likely met?)** is judged from the candidate's units of work and profile signals against the role's attributes and must-haves. If yes, the next step is a **15-minute chat**.
- **M4-0b The 15-minute chat** gauges **trust and mutual fit**, right away. It's the employer's first live contact with the candidate.
- **M4-0c Junction ② (high trust?)** is the chat verdict, captured in the gut check (M4-3). If yes, the candidate is pointed to the **practical assessment**.
- **M4-0d The practical assessment** verifies **aptitude and level of interest**. It's a tall ask for candidates, so the candidate experience makes the odds clear: what % of candidates proceed from this stage to the next, or at least how many candidates are in this stage right now. Risks to resolve before choosing:
  - The best candidates, who have options, may drop out when the odds look low.
  - Showing the odds can undercut the personal pitch (“you're 1 of 12”).
  - Small per-role counts reveal the employer's pipeline.
  - Live counts go stale as more people arrive.
  - New roles have no history, so rates are missing or noisy until benchmarks exist.
  - Employers may game their own rates.
  - A published rate is a promise that the process has to keep.
  - Options include a cap (“sent to at most 5 people”), ranges instead of exact numbers, and pairing the odds with what the candidate keeps either way.
- **M4-0e Junction ③ (high signal on all attributes and skills?)** is judged from the practical assessment's per-attribute grades. If yes: **an onsite with the team**, to fully verify trustworthiness (milestone 5).
- **M4-0f Open:** what happens on each “no” branch.
  - At ①: pass, ask for the practical assessment first, or something else?
  - At ②: pass, or another chat?
  - At ③: pass, or a follow-up?

### 4.1 Reply → next step
- ~~**M4-1** On an interested reply: **Chat first** or **Straight to practical assessment**. Pathline recommends one, with a reason (unknown must-haves or thin evidence point to a chat).~~ Superseded by the decision tree (4.0): if aptitude is likely met, the next step is a chat. The old recommendation logic pointed the other way.
- **M4-2** Chats are scheduled out of band. Pathline sends the employer's booking link, and the status shows "Waiting for chat."

### 4.2 After the chat
- **M4-3** The post-chat screen has:
  - **Gut check:** overall (strong yes / yes / unsure / no), "want to work with them?", and a note
  - **Transcript:** paste or upload from any notetaker
  - a required recording-consent checkbox (California requires every party's consent)
  - decision: Send practical assessment / Pass / Another chat
- **M4-4** Pathline's read of the transcript is **internal only.** It's used to calibrate against the gut check and to decide what the practical assessment should focus on.

### 4.3 Passing after a chat
- **M4-5** Pass reasons are chips, internal only.
- **M4-6** Pathline drafts a **graceful decline** on the hiring manager's behalf. It contains:
  - thanks
  - a clear decision
  - an optional one-line note (job-related only, removable)
  - an invitation to be matched to other roles

  The employer previews it, then sends now or within the commitment window.
- **M4-7** Candidate opt-in is one tap. On opt-in, the candidate's profile evidence and preferences carry over. **The gut check, pass reasons, transcript and Pathline's read never carry over.**

### 4.4 Practical assessment
- **M4-8a Practical assessment page (step 7, v1.43).** The role's standard practical assessment, which **everyone gets by default**.
  - It holds the time box, AI-tools policy, unpaid, timing, coverage warnings (add a question for an untested attribute), the sections with what each tests, and “Change the assignment” (typing or voice).
  - A “Tweaked for individual candidates” list shows who has a tweak. Each row opens that person's practical assessment.
- **M4-8b Tweak for one person (v1.43).** The practical assessment sheet opened from a person's card offers **Standard assessment / Tweaked for {name}**.
  - Standard shows the time box and sections, with a link to edit the standard assessment.
  - Tweaked adds three controls: a per-person time box, **Weight up** chips for attributes, and “Anything else to change” (typing or voice).
  - Weighted-up attributes are marked on their sections.
  - When the chat left an attribute unseen, the sheet suggests weighting it up (“Adaptability wasn't seen in the chat”).
  - The footer is **Send practical assessment**. A sent practical assessment is labeled “(tweaked for them)” on the shortlist.
- **M4-8** Generate the practical assessment from the fact bank, in this structure:
  - deliverables and time box
  - scenario
  - task
  - "at minimum, a reviewer should be able to"
  - decisions to make
  - "evaluating reasoning"
  - review session agenda
- **M4-9** **Coverage:** every ranked attribute and skill must-have is mapped to the sections that test it. Each section card shows what it tests. Gaps from the chat are weighted more heavily, noted on the section that covers them (e.g. “Adaptability: weighted up, not seen in the chat”). Only untested attributes are called out, with a one-tap “Add a question”, and they don't block sending.
- **M4-10** Revision uses the same 3 levels as the emails. The “Change the assignment” field takes typing or voice, the same way as job description intake (X-UI10).
- **M4-11** **Unpaid.** The assignment states that the employer won't use the candidate's work product.
- **M4-12** Send confirmation includes:
  - due date (relative to the review date the candidate picks)
  - **review-by date and onsite decision date**, both tracked as SLAs
  - time box
  - AI policy
  - which attributes are evaluated (not the rubric)
  - that the practical assessment is AI-graded, with the right to request a human review
  - the platform boost, if they opt in
- **M4-13** Status tracking: Sent → Opened → Submitted.

### 4.5 Grading
- **M4-14** Pathline's AI grades **each attribute and skill separately, with evidence excerpts.** There's no single overall score.
- **M4-15** Grades are reused for fit on other roles through the attribute library, with context (role family, date) and roughly 12-month expiry. Reuse requires the candidate's opt-in, and the candidate can see their own grades.
- **M4-16** Integrity:
  - sanitize submissions for prompt injection
  - detect near-duplicates
  - rotate assignment variants
  - grade reasoning over polish; AI use is allowed
- **M4-17** Reliability and fairness:
  - agreement with a gold set graded by people
  - adverse-impact monitoring
  - decisions and outcomes used as labels

---

## Milestone 5: Practical assessment review → onsite

**Goal:** decisions made within the committed dates, and advanced candidates scheduled for onsites.

**Where it happens:** on the shortlist's “Review & onsite” section (X-UI12). The menu's “Shortlist” opens it.

### UI requirements
- **M5-UI1** Within the section, cards are sorted by urgency: submissions by review deadline, then onsites to schedule, then scheduled onsites. Countdowns show on each card.
- **M5-UI2** A submitted practical assessment's card has one button, **Review**, which opens the submission sheet (grades by attribute, reviewers). The sheet's **Decide** opens the decision sheet: one tap plus an optional note, with other reviewers revealed after you submit.
- **M5-UI3** ~~Status groups are stacked sections on one screen.~~ Superseded in v1.24: statuses are the card's stage line on the shortlist. Onsite cards offer Send (or Resend) scheduling link and Mark scheduled. Declined people move to “Closed”.

- **M5-1** A **review queue** sorted by deadline (48h from submission). Each card shows:
  - submitted time
  - countdown to the deadline
  - attribute grades
  - reviewer status
  - link to the submission

  Overdue items are flagged. Push reminders go out 12h before a deadline.
- **M5-2** The hiring manager assigns reviewers per role, or per candidate. Each reviewer decides **Advance / Reject** independently, with an optional note. Other decisions show only after they submit. The hiring manager makes the final call, with disagreements highlighted.
- **M5-3** **Advance:** the candidate is notified within the commitment and moves to the Onsite list.
- **M5-4** **Reject:** reason chips, then a graceful decline. If the grades justify it, the decline mentions that the practical assessment results count toward other roles on Pathline if the candidate opts in.
- **M5-5** An **Onsite list** grouped To schedule / Scheduled / Done.
  - "Send scheduling link" sends the employer's booking link plus what to expect for the stage.
  - The hiring manager marks each candidate scheduled, with a date.
  - A nudge after 3 days unscheduled.
  - A pace line against the start date.

---

## The shortlist after outreach starts (X-UI12)

- **X-UI12** Once outreach starts, the shortlist becomes the place where milestones 4 and 5 happen.
  - **Header:** “Shortlist”, with “N need you” beneath it. A note shows the simulated date.
  - **Sections say whose move it is (v1.43):**
    - **Needs you:** replies to answer, chats to write up, practical assessments to send, submissions to decide on, onsite invites to send or resend, and new matches to add or pass. Sorted by deadline.
    - **Waiting on them:** chat and onsite invites not yet booked, practical assessments out, and booked onsites.
    - **Emailed, no reply yet**
    - **Not emailed yet**
    - **Closed**
  - **Cards:** in the first two sections, every card shows the person, a **stage line** (e.g. “Submitted their practical assessment Oct 13 · Decide by today, 7:42pm”) and its next step.
  - **Buttons name the exact action** (v1.43). No bare “Review”:
    - Choose chat or practical assessment
    - Add chat notes
    - Send practical assessment
    - Review submission
    - Send onsite invite, Resend onsite invite, Mark onsite booked
    - Pass, Add to queue
  - **Compact rows:** the last three sections use rows with the stage line and no buttons.
  - **Tapping a person:** opens their evidence sheet, with their stage and next step at the top. Pass isn't offered once outreach has started.
  - **Menu:** “Shortlist” opens it. Optimize outreach's “Open shortlist” opens it at “Needs you”.
  - **No separate screens** for replies, after the chat, practical assessment, practical assessment sent, review queue or onsite.

## Cross-cutting requirements

- **X-1 Commitments.** Response-time commitments drive every deadline shown to candidates. Pathline sends reminders and tracks the employer's record.
- **X-2 Consent and privacy.**
  - Candidates opt in to being matched across the network, and can pause it.
  - A company's gut checks, notes, decisions and transcripts are never visible to another company.
  - GDPR notice for sourced EU candidates.
- **X-3 Compliance built in:**
  - CAN-SPAM, GDPR and CASL in the email templates
  - human decision-making and bias audits for AI grading (NYC Local Law 144, EU AI Act, Colorado, California)
  - recording consent for transcripts
- **X-4 Contact limits across customers**, and do-not-contact lists.
- **X-5 Calibration labels.** Gut checks, pass reasons, reviewer decisions and outcomes are stored as labels to improve matching and grading.
- **X-6 Mock data.** Pool sizes, conversion rates, grades and candidate records are illustrative until real data sources are connected.

## Cross-cutting UI requirements

These apply to every milestone.

- **X-UI1 Phone frame (prototype presentation).**
  - A thin bezel, about 3–4px, like a current iPhone. Not a thick case.
  - A real phone aspect ratio, about 19.5:9 (e.g. 393 × 852). The whole frame scales proportionally to fit the viewport height and never gets wider or squashed.
  - On an actual phone there's no frame; the app fills the screen.
  - **Nothing beside the phone except Reset demo** (v1.30): no side panels, notes or annotations. On a laptop, “Reset demo” is a small link in the bottom-left corner. On a phone, where there's no room beside the app, it's at the bottom of the menu.
- **X-UI2 One obvious way to act.**
  - **Tapping a card or row opens its details.** There are no trailing arrows (›) on cards or rows; the whole card is the tap target, with a pressed state.
  - **Tapping any line in the details edits it in place.** No Edit buttons or edit CTAs.
  - **Changes save automatically.** No Done or Save buttons on editing sheets. Sheets close by swiping down, tapping outside, or tapping ×.
  - Buttons remain only for real decisions, e.g. Pass, Continue to outreach, Send practical assessment, Start outreach.
  - Navigation is back (‹) in the app bar.
- **X-UI13 One type system (v1.43).** A single sans-serif family (Inter), with sizes and weights set by UI element type:
  - page titles 22px bold
  - sheet titles 18px
  - card titles and main buttons 16px semibold
  - body text, rows, fields and small buttons 14px
  - secondary text 13px
  - section labels and tags 11px uppercase
  - splash name 30px
  No serif display font, and no one-off sizes.
- **X-UI3 Fewer symbols.**
  - No trailing arrows (›) on cards or rows.
  - Actions are labeled with words, not icon-only buttons. The only icon-only controls are universally understood symbols: back (‹), close (×), menu (≡), the re-rank arrows (↑ ↓), the microphone for voice, and the upload icon. Each has an accessible label.
  - Status is written out (“Likely”, “Ask: relocation”, “Suggested”) rather than shown with dots, half-dots, ✦, ✉ or ↩.
- **X-UI4 At most two actions on a card:** one primary and one secondary, both labeled. Anything else lives in the card's sheet.
- **X-UI5 Re-rank with arrows beneath the rank number.** Wherever order matters (attributes, hiring process stages), small up and down arrows sit beneath each item's number. This replaces hold-and-drag.
- **X-UI7 Goals are visible in the product.** The milestone is the app bar headline (e.g. “Shortlist for outreach”). Beneath it, “Step X of Y” is grouped with the task name (e.g. “Step 3 of 6 · Role requirements”). **The count covers the six initial-outreach steps** (Job description through Email sequence), in menu order, and doesn't restart per milestone. Optimize outreach and Practical assessment (the 6th and 7th places) show no step count or progress bar. Their app bar reads just the milestone and the page name (e.g. “Monitoring / Optimize outreach”) (v1.45). The shortlist after outreach shows “N need you” instead of a step. The prototype's side panel is presentation chrome only; nothing should depend on it.
- **X-UI8 Lead with the upside.** The tagline and product copy describe the gain (a stronger team with every hire), not avoiding a loss.
  - Recommended tagline: **“Every hire raises the bar.”**
  - Alternatives: “Grow a stronger team with every hire.” / “Hire people who make your whole team better.”
  - The previous “Grow your team without lowering the bar” is retired.
- **X-UI9 Menu: a flat list of places. It holds no state.** The product's own navigation.
  - **The button:** the standard menu icon (three horizontal lines) at the top right of the app bar. Icon only, with an accessible label (“Menu”) and a tap target of at least 44 × 44pt. A red **to-do badge** with the total count sits on it when anything needs you (v1.35).
  - **What it opens:** a narrow panel (at most about 290pt, or three quarters of the screen) that slides in from the right. It closes with ×, by tapping outside, or by swiping it away.
  - **What's in it:** the role at the top (“Senior PM, AI · Nectar Social”), then one white list with dividers and 46pt rows:
    - Job description
    - Candidate attributes
    - Role requirements
    - Shortlist
    - Outreach fact sheet
    - Email sequence
    - Optimize outreach
    - Practical assessment
  - **No milestones, and no progress state:** no milestone names, step numbers or checks. The current page is highlighted.
  - **To-do badges only (v1.35):** a place with things waiting on the employer shows a red count. Today that's the Shortlist once outreach has started: the cards that need you plus new matches to review. Completion is never badged.
  - **The app keeps state:** each screen shows its own. For example:
    - the shortlist's “N need you” and its cards waiting on you
    - “N needed” on Outreach fact sheet
    - blanks on Email sequence
    - the new matches on the shortlist
  - **Navigate anywhere, anytime:** every place can be opened at any time; nothing is locked.
  - **Shortlist:** before outreach, it's the ranked list. After outreach starts, it's where milestones 4 and 5 happen (X-UI12).
  - *Superseded (v1.25):* milestone groups, step numbers, completion checks and red badges in the menu, and the badge on the menu icon.
- **X-UI11 Start screen.** Like a real app's launch screen: the app name, **what it is (“Outbound candidate sourcing”)**, the tagline (“Every hire raises the bar.”), and one **Get started** button.
  - No explanation, flywheel or demo notes on it.
  - There's no demo context on screen (v1.30). Who you're playing and that the data is fictional are in the README and the share note.
- **X-UI10 Voice works the same everywhere.** Every place the employer describes something in their own words offers voice as well as typing, presented the same way.
  - Applies to: job description intake, revising an email, changing all emails, changing the practical assessment.
  - At intake, voice is a **microphone icon directly beneath the field**, next to the upload icon.
  - In prompt boxes (revising an email, changing all emails, changing the practical assessment), the **microphone sits inside the field, on the right**, next to the Apply or Revise button.
  - While listening, the icon turns red and pulses, and the field shows “Listening…”. The spoken words are transcribed into the field so they can be checked before anything is applied.
- **X-UI6 Don't constrain unnecessarily.**
  - Limits exist only where they protect candidates or accuracy. Examples: blanks block sending an email; disclosures the employer hasn't removed must be filled before the emails are approved.
  - No caps on counts (attributes, requirements, stages), and no forced swaps.
  - Where more items have a cost, explain it in one line instead of blocking.

## Deliberately not building (this phase)

**What Pathline is not:**
- **A job application platform with open, browsable postings.**
- **A database of all employers and employees.**

Those tools are precisely what causes the frustration today, on both the demand and the supply side, and they already exist.

**UX cuts: simplify so employers can act on the go.** We acknowledge the employer does more work here than on a job board: defining attributes, vetting pre-candidates and deciding at each stage. So the experience has to be simple enough to take action on the go.
