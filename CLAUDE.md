# Buttr website

Project brief for anyone working on this repository with Claude.

## Purpose

Buttr is a wealth partner service for families in India's largest metros with roughly ₹5 Cr to ₹30 Cr. Mission: Wealthelp. Making financial guidance free, simple and always available. The website's one job is the first yes: a visitor agrees to meet a wealth partner. Principle: show value before asking for anything.

## Architecture

* `index.html` and `ButtrApp.dc.html` are exports of the "Buttr Website" design canvas (https://claude.ai/artifact/F8fEt8Kc4w3iQT7V5cxJba), drawn in the browser by `support.js` with React 18 from `assets/vendor`.
* The canvas is the source of truth. Prefer making design changes there and syncing, so the two never drift. If a change must be made here, make the same change on the canvas.
* `api/ask.js` answers typed questions with the Anthropic SDK and structured outputs, in the `{reply, open, visual, nudge, calc}` shape the page expects. `api/_prompt.js` is generated from the page; do not edit it by hand.
* `api/lead.js` logs leads and forwards them to `LEAD_WEBHOOK_URL`.
* Hosted on Vercel as static files plus serverless functions. No build step.

## Rules

* Desktop and phone change together. Check every change at 1440 and 390 pixels wide, in both themes.
* The API key stays on the server. Never call the model from the browser.
* Buttr is a mutual fund distributor registered with AMFI and regulated by SEBI, working within suitability guidelines. Never call it an adviser.
* Never promise or imply returns. Stories and the sample plan are illustrative.
* Voice: calm, plain, warm; Buttr talks like a person. ₹, lakh, crore. House style avoids hyphens in copy.

## Open items

* Canela Deck is a trial licence; a commercial webfont licence is needed.
* No WhatsApp number yet, so the WhatsApp icon is left out of the live site.
* Footer disclosures (ARN and the mutual fund disclaimer), privacy policy and terms still to be written and approved.
