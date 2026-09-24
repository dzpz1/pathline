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

You play Farah, CTO at Nectar Social, hiring a Senior PM, AI. Inside the app, **Menu** shows what needs you and every milestone. On a laptop, the steps panel on the left also lets you jump to any step, and "Reset demo" starts over. Progress is saved in your browser only.

| Milestone | Screens |
|---|---|
| 1 · Shortlist | Import & what the role needs → Requirements → Review & pool → Shortlist |
| 2 · Outreach | What candidates will see → Email sequence (edit, revise, change all, Growth rewrite) → Start outreach |
| 3 · Monitoring | Pace, replies, send-timing and active-count suggestions, new matches |
| 4 · Chat & take-home | Replies → chat or take-home → gut check + transcript → graceful decline or take-home → sent |
| 5 · Review → onsite | Take-home reviews with independent decisions → onsite list |

## Demo data

The job description is Nectar Social's public posting. Everything else is fictional: candidates, companies, pool sizes, conversion rates, replies, transcripts and grades. "AI" steps (parsing, drafting, revising, grading) are simulated with prepared content.

## Files

| File | Contents |
|---|---|
| `index.html` | Page shell: phone frame, side panels |
| `styles.css` | All styles |
| `data.js` | The JD, attributes, candidates, emails, take-home and submissions |
| `core.js` | State, rendering, bottom sheets, navigation, events |
| `model.js` | Pool sizing, ranking, evidence, projections, email context |
| `m1.js` | Milestone 1 screens |
| `m2.js` | Milestone 2 screens |
| `m3.js` | Milestones 3–5 screens |

## Not built yet (deliberately)

- Inbound flow and the async fit check
- Pinning paragraphs in emails
- Criteria suggestions from pass patterns (future iteration: improve match rate)
- Candidate-side screens, except where the employer's actions create them (emails, decline notes, take-home)
- Onsite and final interview tooling beyond scheduling
- Real AI calls, a real backend, and authentication
