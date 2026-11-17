# Buttr website

The public website for Buttr: a conversation with Buttr instead of a long page, with visual answers, a calculator, sample plans and meeting booking. Typed questions are answered by Claude.

## Go live (one time)

1. **Vercel.** Sign in at vercel.com with GitHub, choose Add New, Project, and import `buttr-website`. Leave every setting as it is and deploy. You get a working address ending in `vercel.app`.
2. **API key.** At platform.claude.com, create an API key and set a monthly spend limit. In Vercel, open the project, Settings, Environment Variables, and add:
   * `ANTHROPIC_API_KEY` = your key
   * `LEAD_WEBHOOK_URL` = where meeting requests should go (optional; see below)
   * `BUTTR_MODEL` = the Claude model for answers (optional; default `claude-sonnet-5-5`)

   Then redeploy, from the Deployments tab.
3. **Domain.** In Vercel, Settings, Domains, add your domain. Vercel shows the DNS records to add at your registrar. HTTPS is set up for you.

After this, every change pushed to GitHub goes live by itself.

## Where leads go

Meeting requests and Pocket Buttr sign ups are always written to the Vercel logs (Project, Logs, search `LEAD`). Set `LEAD_WEBHOOK_URL` to also send each one to a Google Sheet (through Apps Script), Zapier, Make, Slack or a CRM.

## How it is built

| Path | What it is |
| --- | --- |
| `index.html` | The website, exported from the "Buttr Website" design canvas |
| `ButtrApp.dc.html` | Buttr App 2.0, shown inside the Experience answer |
| `support.js` | The runtime that draws the canvas export in the browser |
| `assets/` | Logos, photos, icons, React, and `site.js` (connects the page to the server) |
| `design-system/` | Butter Cream tokens and fonts |
| `api/ask.js` | Answers typed questions with Claude, in the format the page draws |
| `api/lead.js` | Receives meeting and Pocket Buttr requests |
| `api/_prompt.js` | Buttr's voice and rules, generated from the canvas |
| `content/buttr_knowledge.md` | Facts the AI may use. Keep it current |

The design canvas is the source of truth: https://claude.ai/artifact/F8fEt8Kc4w3iQT7V5cxJba
Design changes are made on the canvas and synced into this repository.

## Preview on your computer

```
npm install
npm run dev
```

Then open http://localhost:3000. Add `ANTHROPIC_API_KEY` to your shell to try typed questions.
