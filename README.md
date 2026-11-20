# IntimaSense

**Personalized discovery. Private by design.**

IntimaSense is a proposed personalisation platform for adult sexual wellness retailers, personal wellness manufacturers and specialised ecommerce marketplaces. It would help businesses organise product information and recommend relevant products and educational resources to consenting adult customers, using product attributes and voluntarily provided preferences with minimal sensitive data collection. The site and prototype are tasteful and non-explicit.

> IntimaSense is a proposed product. Features, integrations and AWS services are planned until implemented and verified. Pricing is illustrative, and the prototype uses fictional data. Founder: **Nathaniel Okoro**. Website: `intimasense.space` · contact: `nathaniel@intimasense.space`.

## Design

The look is soft and editorial: blush paper, plum ink, a slow aurora of coral, rose and lilac, rounded glass cards, Instrument Serif for display type (with gradient italics), Manrope for text and IBM Plex Mono for labels.

- **Hero:** centred serif headline that unveils line by line over a drifting aurora, with an adults-only (18+) notice.
- **Live preview:** tap anonymous preferences and the recommendations, with their reasons, re-order with view transitions; it runs the real recommendation engine.
- **Privacy model (the differentiator):** what IntimaSense uses beside what it never collects, struck through on scroll.
- **Core features:** all six as sticky cards that stack as you scroll, settling with scroll-driven animation where supported.
- **Catalogue classification:** pick a product to see its description highlighted into attributes, category and confidence.
- **Aggregate analytics:** region counts with small counts suppressed and hatched.
- **Who it's for:** target customers and decision-makers.
- **Pricing:** a monthly plan plus an API-usage slider.
- **Technology:** the planned AWS architecture (SageMaker AI, Bedrock, S3, DynamoDB, API Gateway, Cognito) with each service's role and the AWS Activate description.
- **Closing sections:** founder, progress and the demo-request form, FAQ, contact form with a topic picker, and a gradient italic wordmark footer.
- **Interactions:** a soft aura cursor that blooms over links, magnetic buttons, gentle tilt and a gradient scroll-progress bar.

## Prototype (`/app`)

The discovery studio uses a fictional, non-explicit catalogue of 15 products from a fictional store.

- **Shopper preview:** an adults-only notice, then optional anonymous preferences (interests, requirements, experience, budget). Recommendations never break a requirement or the budget, stay varied (at most two per category) and say why; matching educational resources appear beneath. Preferences are not stored.
- **Catalogue:** descriptions classified into category and attributes with a confidence score. Items under 75% are held from shoppers until a merchandiser sets a category and approves them; changes are logged.
- **Education:** approved resources and the tags they match.
- **Analytics:** aggregate sessions by interest, requirement and region, and recommendation-to-view rates. Counts below five are suppressed.
- **API:** the request and response for the current preferences, for developers.
- **Roles:** Merchandiser, Ecommerce Analyst, Developer and Viewer.

Every decision in the prototype is made by a person and written to a log. Changes persist in the browser's `localStorage`, and motion is skipped for visitors who prefer reduced motion. All pages are server-rendered and readable without JavaScript.

## Structure

```
src/content.js      site facts and founder
src/data.js         fictional data and roles
src/engine.js       the prototype's rules (pure functions, tested)
src/aws.js          the planned AWS architecture shown on the home page
src/forms.js        demo-request and contact form rules and HubSpot payloads (tested)
src/fx.js           interaction layer: reveals, cursor, magnetic and tilt effects, progress bar
src/App.jsx         marketing pages · src/Studio.jsx the prototype
docs/architecture.md  planned AWS architecture and design rules
docs/crm-plan.md      HubSpot forms, properties and pipeline
```

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build   # Vite build, server render, static prerender of /, /app, /privacy, /terms and 404.html
npm test        # node --test
```

The output in `dist/` is fully static. Configs are included for Netlify/Cloudflare (`public/_headers`, `public/_redirects`) and Vercel (`vercel.json`).

Until HubSpot is configured, the forms keep requests in the browser and open a pre-filled email. To connect it, set `VITE_HUBSPOT_PORTAL_ID`, `VITE_HUBSPOT_FORM_GUID` and `VITE_HUBSPOT_CONTACT_FORM_GUID` (see `.env.example`), and update the privacy notice first.
