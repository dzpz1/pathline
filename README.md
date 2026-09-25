# Pathline: employer prototype

Pathline is a recruiting tool for tech companies in their scaling phase. It helps them grow the team while improving, or at least maintaining, talent density.

This is a clickable prototype of the **employer side of the outbound flow**, built to requirements v1.17 (see `../pathline-employer-outbound-requirements.md`). It runs from importing a job description to scheduling onsite interviews. It's static HTML, CSS and JavaScript, with no backend, no build step and no API keys.

## Run it

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000.

To host it for free, push the repo to GitHub and turn on **GitHub Pages** (Settings → Pages → deploy from the `main` branch, root folder).

## What's in the demo

You play Misbah, CEO & co-founder at Nectar Social, hiring a PM, AI. Inside the app, **Menu** (top right) lists every place you can go: Job description, Candidate attributes, Role requirements, Shortlist, Outreach fact sheet, Email sequence, Optimize outreach and Practical assessment. Each screen shows what needs you. "Reset demo" (bottom-left on a laptop, bottom of the menu on a phone) starts over. Progress is saved in your browser only.

| Milestone | Screens |
|---|---|
| 1 · Shortlist | Job description → Candidate attributes → Role requirements → Shortlist |
| 2 · Outreach | Outreach fact sheet → Email sequence (edit, revise, change all, growth rewrite) → Start outreach sheet |
| 3 · Optimize outreach | Pace, replies by email, send-timing and active-count suggestions |
| 4 · Chat & practical assessment | Practical assessment (the standard practical assessment). On the shortlist: reply → chat or practical assessment → gut check + transcript → graceful decline or practical assessment sent |
| 5 · Review → onsite | On the shortlist: practical assessment review with independent decisions → onsite scheduling |

After outreach starts, the shortlist shows where every person is, with one next step on each card. Milestones 4 and 5 open as sheets over it.

## Demo data

The job description is Nectar Social's public posting. Everything else is fictional: candidates, companies, pool sizes, conversion rates, replies, transcripts and grades. "AI" steps (parsing, drafting, revising, grading) are simulated with prepared content.

## Files

| File | Contents |
|---|---|
| `index.html` | Page shell: phone frame and a Reset demo link |
| `styles.css` | All styles |
| `data.js` | The JD, attributes, candidates, emails, practical assessment and submissions |
| `core.js` | State, rendering, bottom sheets, navigation, events |
| `model.js` | Pool sizing, ranking, evidence, projections, email context |
| `m1.js` | Milestone 1 screens |
| `m2.js` | Milestone 2 screens |
| `m3.js` | Milestones 3–5 screens |

## Not built yet (deliberately)

- Inbound flow and the async fit check
- Pinning paragraphs in emails
- Criteria suggestions from pass patterns (future iteration: improve match rate)
- Candidate-side screens, except where the employer's actions create them (emails, decline notes, practical assessment)
- Onsite and final interview tooling beyond scheduling
- Real AI calls, a real backend, and authentication
