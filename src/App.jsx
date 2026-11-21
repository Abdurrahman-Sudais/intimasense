import React, {useState} from 'react';
import {flushSync} from 'react-dom';
import site from './content.js';
import {Count, Cycle, Marquee, Stats, Words} from './Flow.jsx';
import {BUDGETS, INTERESTS, NEEDS, aggregates, products} from './data.js';
import {K, classify, recommend, suppress} from './engine.js';
import {ACROSS, SERVICES, STAGES, WHY} from './aws.js';
import {PROGRESS} from './forms.js';
import {vt} from './fx.js';
import Studio from './Studio.jsx';
import PilotForm from './PilotForm.jsx';
import ContactForm from './ContactForm.jsx';

export function Logo({size = 30}) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs><linearGradient id="isg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f08a6c" /><stop offset=".55" stopColor="#d9486f" /><stop offset="1" stopColor="#8d5cc4" /></linearGradient></defs>
      <rect width="40" height="40" rx="20" fill="url(#isg)" />
      <path d="M20 11c4.5 3 7 6.2 7 9.6A7 7 0 0 1 20 28a7 7 0 0 1-7-7.4C13 17.2 15.5 14 20 11z" fill="#fff8f4" opacity=".95" />
      <circle cx="20" cy="21" r="2.4" fill="#d9486f" />
    </svg>
  );
}

const CATALOGUE = products.map((p) => ({p, c: classify(p)}));

function Header() {
  const [open, setOpen] = useState(false);
  const links = [['Discovery', '/#discovery'], ['Privacy', '/#privacy-model'], ['Features', '/#features'], ['Pricing', '/#pricing'], ['Technology', '/#technology'], ['Contact', '/#contact']];
  return (
    <header className="hd">
      <a href="/" className="brand" aria-label="IntimaSense home"><Logo /><span>IntimaSense</span></a>
      <nav id="nav" className={open ? 'nav open' : 'nav'} aria-label="Main">
        {links.map(([t, h]) => <a key={t} href={h} onClick={() => setOpen(false)}>{t}</a>)}
        <a className="nav-app" href="/app" onClick={() => setOpen(false)}>Open the discovery studio</a>
      </nav>
      <a className="hd-cta" href="#demo" data-magnetic data-cursor="Book">Request a demo</a>
      <button className="menu" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
    </header>
  );
}

function Chip({on, onClick, children}) { return <button type="button" className={on ? 'chip on' : 'chip'} aria-pressed={on} onClick={onClick}>{children}</button>; }

function Discover({compact}) {
  const [pref, setPref] = useState({interests: ['self-care'], needs: ['fragrance-free'], experience: 'new', budget: 50});
  const toggle = (k, v) => vt(() => flushSync(() => setPref((p) => ({...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v]}))));
  const set = (k, v) => vt(() => flushSync(() => setPref((p) => ({...p, [k]: v}))));
  const recs = recommend(CATALOGUE, pref, 3);
  return (
    <div className={compact ? 'disc compact' : 'disc'}>
      <div className="disc-q">
        <p className="q">I’m interested in</p><div className="chips">{INTERESTS.map(([v, l]) => <Chip key={v} on={pref.interests.includes(v)} onClick={() => toggle('interests', v)}>{l}</Chip>)}</div>
        <p className="q">Please only show</p><div className="chips">{NEEDS.map(([v, l]) => <Chip key={v} on={pref.needs.includes(v)} onClick={() => toggle('needs', v)}>{l}</Chip>)}</div>
        <p className="q">Budget</p><div className="chips">{BUDGETS.map(([v, l]) => <Chip key={v} on={pref.budget === v} onClick={() => set('budget', v)}>{l}</Chip>)}</div>
        <p className="anon"><span aria-hidden="true">◌</span> Anonymous · no account · nothing leaves this page</p>
      </div>
      <ul className="recs" aria-live="polite">
        {recs.map((r) => <li key={r.p.id} style={{viewTransitionName: `r-${r.p.id}`}}><span className={`swatch c-${r.c.category.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')}`} aria-hidden="true" /><div><small>{r.c.category}</small><b>{r.p.name}</b><p className="why">Why: {r.why.join(' · ')}</p></div><span className="price">${r.p.price}</span></li>)}
        {!recs.length && <li className="none">Nothing matches every requirement — we’d rather show nothing than something you asked us not to.</li>}
      </ul>
    </div>
  );
}

const CYCLE = ["wellness retailers", "wellness brands", "specialised marketplaces"];
const MQ = ["Wellness retailers", "Wellness brands", "Specialised marketplaces", "Anonymous preferences", "Explained recommendations", "Catalogue classification", "Education first", "Aggregate analytics", "Small-count suppression", "Adults only", "Ecommerce APIs", "Minimal data"];
const STATS = [[15, "products in the fictional catalogue"], [13, "attributes read from each description"], [0, "personal fields stored per shopper"], [5, "smallest count ever shown in a report"]];

function Hero() {
  return (
    <section className="hero">
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <div className="hero-in">
        <p className="eyebrow" data-r>Personalisation for adult wellness retail</p>
        <h1 data-r><span className="l1">Personalized discovery.</span>{' '}<em className="l2">Private by design.</em></h1>
        <p className="lede" data-r style={{'--d': '160ms'}}>IntimaSense is a proposed platform that helps sexual wellness retailers and brands organise their catalogues and recommend the right products and educational resources — from product attributes and preferences shoppers choose to share, and nothing more.</p>
        <p className="fcy" data-r style={{'--d': '200ms'}}><Cycle lead="Built for" items={CYCLE} /></p>
        <div className="cta" data-r style={{'--d': '240ms'}}><a className="btn" href="#demo" data-magnetic data-cursor="Book">Request a demo</a><a className="btn ghost" href="#discovery">Try it below</a></div>
      </div>
      <p className="adult" data-r style={{'--d': '320ms'}}>For businesses serving consenting adults, 18+. Non-explicit by design.</p>
    </section>
  );
}

function Discovery() {
  return (
    <section className="sec" id="discovery" aria-labelledby="disc-title">
      <div className="sec-head center"><p className="eyebrow">Live preview</p><h2 id="disc-title">Three taps, <em>zero</em> personal data.</h2><p className="intro">This is what a shopper sees. Choose a few preferences and the recommendations — with their reasons — update instantly. Products are fictional.</p></div>
      <div className="glass" data-r><Discover /></div>
    </section>
  );
}

function PrivacyModel() {
  const use = ['Product attributes from the catalogue', 'Preferences a shopper chooses to share, for this visit', 'Aggregate counts, with groups under five hidden'];
  const never = ['Names, emails or phone numbers', 'Browsing or purchase histories', 'Persistent profiles or cross-site tracking', 'Sensitive data sold or shared'];
  return (
    <section className="sec" id="privacy-model" aria-labelledby="pm-title">
      <div className="pm">
        <div><p className="eyebrow">The differentiator</p><h2 id="pm-title">Recommendation intelligence that <em>asks for less</em>.</h2><p className="intro">Privacy-conscious recommendations built on product attributes and voluntarily provided preferences, with minimal sensitive data collection. Shoppers stay anonymous; retailers still get relevance.</p></div>
        <div className="pm-cols">
          <div className="pm-card yes" data-r data-tilt><h3>What IntimaSense uses</h3><ul>{use.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div className="pm-card no" data-r data-tilt style={{'--d': '120ms'}}><h3>What it never collects</h3><ul>{never.map((x, i) => <li key={x} style={{'--i': i}}><s>{x}</s></li>)}</ul></div>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  ['Privacy-conscious product recommendations', 'Ranked from product attributes and session preferences. Hard requirements — vegan, latex-free, fragrance-free — are never broken to fill a slot.', 'rec'],
  ['Intelligent catalogue classification', 'Descriptions become categories and attributes: material, base, fragrance, rechargeable, beginner-friendly. Low-confidence items go to a merchandiser.', 'cls'],
  ['Preference-based product discovery', 'A short, optional, anonymous selection on the storefront — no sign-up, nothing remembered after the visit.', 'disc'],
  ['Educational content recommendations', 'Approved guides matched to the same preferences, so shoppers learn about materials, care and communication alongside products.', 'edu'],
  ['Aggregate recommendation analytics', 'Which categories and needs drive discovery, reported only in aggregate with small counts suppressed.', 'ana'],
  ['Ecommerce integration APIs', 'A recommendation API and catalogue sync for your storefront, with keys scoped per retailer.', 'api'],
];

function Features() {
  return (
    <section className="sec" id="features" aria-labelledby="feat-title">
      <div className="sec-head"><p className="eyebrow">Core features</p><h2 id="feat-title">Six pieces, one quiet experience.</h2></div>
      <div className="stack">{FEATURES.map(([t, d, k], i) => <article key={t} className={`stack-card k-${k}`} style={{'--i': i}}><span className="num">{String(i + 1).padStart(2, '0')}</span><div><h3>{t}</h3><p>{d}</p></div><span className="art" aria-hidden="true" /></article>)}</div>
    </section>
  );
}

function Classify() {
  const ids = ['P01', 'P05', 'P07', 'P15'];
  const [id, setId] = useState('P05');
  const {p, c} = CATALOGUE.find((x) => x.p.id === id);
  const marks = c.attributes.length ? new RegExp(`(${['water-based', 'silicone-based', 'fragrance-free', 'unscented', 'vegan', 'latex-free', 'sensitive skin', 'body-safe silicone', 'rechargeable', 'waterproof', 'quiet', 'beginner-friendly', 'travel-size', 'discreet packaging', 'pelvic floor', 'personal massager', 'lubricant'].join('|')})`, 'gi') : null;
  const parts = marks ? p.text.split(marks) : [p.text];
  return (
    <section className="sec" aria-labelledby="cls-title">
      <div className="cls">
        <div><p className="eyebrow">Catalogue classification</p><h2 id="cls-title">From a product description to <em>structured, searchable</em> attributes.</h2><p className="intro">In the planned product, Amazon Bedrock classifies each description; merchandisers approve the result. Anything uncertain is held for review rather than guessed.</p>
          <div className="chips">{ids.map((x) => <Chip key={x} on={x === id} onClick={() => vt(() => flushSync(() => setId(x)))}>{CATALOGUE.find((y) => y.p.id === x).p.name}</Chip>)}</div></div>
        <div className="glass cls-card" data-r style={{viewTransitionName: 'cls'}}>
          <p className="desc">{parts.map((t, i) => (i % 2 ? <mark key={i}>{t}</mark> : <React.Fragment key={i}>{t}</React.Fragment>))}</p>
          <div className="cls-out"><span className={c.review ? 'cat review' : 'cat'}>{c.category}</span><span className="conf">{Math.round(c.confidence * 100)}% confidence{c.review ? ' · held for merchandiser review' : ''}</span></div>
          <ul className="attrs">{c.attributes.map((a) => <li key={a}>{a}</li>)}<li className="band">{c.band}</li></ul>
        </div>
      </div>
    </section>
  );
}

function Analytics() {
  const reg = suppress(aggregates.byRegion);
  const max = Math.max(...Object.values(aggregates.byRegion));
  return (
    <section className="sec" aria-labelledby="an-title">
      <div className="cls rev">
        <div className="glass an-card" data-r>
          <p className="mono">Sessions by region · fictional month</p>
          <ul className="an">{Object.entries(reg).map(([k, v]) => <li key={k}><span>{k}</span><i className={v === null ? 'hidden' : ''} style={{'--w': v === null ? '100%' : `${(v / max) * 100}%`}} /><b>{v === null ? `< ${K}` : v.toLocaleString()}</b></li>)}</ul>
          <p className="fine">Counts below {K} are never shown, so small groups can’t be singled out.</p>
        </div>
        <div><p className="eyebrow">Aggregate analytics</p><h2 id="an-title">Insight for the business, <em>anonymity</em> for the shopper.</h2><p className="intro">See which categories, needs and guides drive discovery — always in aggregate, never per person. Small counts are suppressed automatically.</p></div>
      </div>
    </section>
  );
}

function Who() {
  return (
    <section className="sec" aria-labelledby="who-title">
      <div className="sec-head center"><p className="eyebrow">Who it’s for</p><h2 id="who-title">Made for wellness retail.</h2></div>
      <div className="who">{[['Sexual wellness retailers', 'Online stores that want relevance without asking shoppers for more than they’re comfortable sharing.'], ['Personal wellness manufacturers', 'Brands that want their catalogues described consistently and their products recommended accurately.'], ['Specialised marketplaces', 'Many sellers, inconsistent listings — one structured catalogue and one quiet discovery experience.']].map(([t, d], i) => <article key={t} className="glass" data-r data-tilt style={{'--d': `${i * 90}ms`}}><h3>{t}</h3><p>{d}</p></article>)}</div>
      <p className="decision">Decision-makers: ecommerce directors · product managers · brand founders</p>
    </section>
  );
}

function Pricing() {
  const [calls, setCalls] = useState(120);
  const plan = calls <= 50 ? ['Boutique', 149, 50] : ['Growth', 449, 250];
  const over = Math.max(0, calls - plan[2]); const total = plan[1] + Math.round(over * 1.2);
  return (
    <section className="sec" id="pricing" aria-labelledby="pr-title">
      <div className="cls">
        <div><p className="eyebrow">Business model</p><h2 id="pr-title">A monthly plan, plus <em>API usage</em>.</h2><p className="intro">Monthly B2B subscriptions with an included volume of recommendation API calls, and usage-based fees beyond it. Illustrative pricing for a proposed product.</p></div>
        <div className="glass price-card" data-r>
          <label className="rng"><span>Recommendation API calls a month <b>{calls}k</b></span><input type="range" min="10" max="1000" step="10" value={calls} onChange={(e) => setCalls(Number(e.target.value))} /></label>
          <p className="price-big"><b>${total.toLocaleString()}</b><span>/ month</span></p>
          <p className="fine">{plan[0]} plan · ${plan[1]} including {plan[2]}k calls{over ? ` · ${over}k extra calls at $1.20 per thousand` : ''}</p>
          <a className="btn" href="#demo" data-magnetic>Request a demo</a>
        </div>
      </div>
    </section>
  );
}

function Technology() {
  return (
    <section className="sec" id="technology" aria-labelledby="tech-title">
      <div className="sec-head"><p className="eyebrow">Planned AWS infrastructure</p><h2 id="tech-title">How we use Amazon Web Services.</h2><p className="intro">{WHY}</p></div>
      <ol className="flow">{STAGES.map(([t, svcs, d], i) => <li key={t} className="glass" data-r style={{'--d': `${i * 80}ms`}}><span className="n">{i + 1}</span><h3>{t}</h3><p className="svcs">{svcs.map((s) => <span key={s}>{s}</span>)}</p><p>{d}</p></li>)}</ol>
      <div className="across" data-r><p className="eyebrow">Across every stage</p><ul>{ACROSS.map(([a, b]) => <li key={a}><b>{a}</b> {b}</li>)}</ul></div>
      <h3 className="sub">Services and their role in IntimaSense</h3>
      <dl className="svc">{SERVICES.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl>
      <blockquote className="activate" data-r><p className="eyebrow">AWS Activate · company description</p><p>IntimaSense is a proposed AI personalisation platform for adult sexual wellness retailers and specialised ecommerce businesses. The planned product will help organisations structure product catalogues, recommend relevant products based on voluntarily supplied preferences, and provide access to approved educational resources. We plan to use Amazon SageMaker AI for recommendations, Amazon Bedrock for catalogue classification, Amazon S3 for product datasets, and Amazon DynamoDB for product information. Amazon API Gateway will support ecommerce integrations. The platform will prioritise minimal data collection, consent, secure processing and adult-only customer experiences.</p></blockquote>
      <p className="fine">Planned, not yet deployed. This website and the discovery studio run in your browser on fictional data.</p>
    </section>
  );
}

function Team() {
  return <section className="sec" id="team" aria-labelledby="team-title"><div className="team-head"><p className="eyebrow">Founding team</p><h2 id="team-title">The people building {site.name}.</h2></div><div className="team-list">{site.team.map((p, i) => (<div key={p.name} style={{'--d': `${i * 90}ms`}} className="team glass" data-r><span className="av" aria-hidden="true">{p.initials}</span><div><p className="eyebrow">{p.role}</p><h3 className="tname">{p.name}</h3><p>{p.bio}</p><ul className="tags">{p.focus.map((f) => <li key={f}>{f}</li>)}</ul></div></div>))}</div></section>;
}

function Demo() {
  return (
    <section className="sec" id="demo" aria-labelledby="demo-title">
      <div className="cls top">
        <div><p className="eyebrow">Progress & demos</p><h2 id="demo-title">See your catalogue, <em>gently personalised</em>.</h2><p className="intro">IntimaSense is a proposed product in its building stage. A demo walks through catalogue upload, classification review, anonymous preference selection and recommendation previews. The MVP covers product catalogue uploads, anonymous preference selection, recommendation previews and aggregate analytics.</p>
          <ol className="progress">{PROGRESS.map(([st, t, d]) => <li key={t} className={st === 'Next' ? 'next' : ''}><span>{st}</span><div><b>{t}</b><p>{d}</p></div></li>)}</ol></div>
        <div className="glass card-form" data-r><PilotForm submitLabel="Request a demo" /></div>
      </div>
    </section>
  );
}

const FAQ = [['Who is IntimaSense for?', 'Businesses that sell sexual wellness and personal wellness products to consenting adults (18+). Retailers keep responsibility for their own age checks and storefront policies.'], ['What does a shopper have to share?', 'Nothing, unless they choose to. Preferences are optional, anonymous and used only for that visit. No account, name or contact details are needed.'], ['Is the content explicit?', 'No. IntimaSense works with product attributes and approved educational resources and is designed to be tasteful and non-explicit.'], ['Is IntimaSense live?', 'Not yet. It is a proposed product; the discovery studio is a prototype running in your browser on a fictional catalogue.']];
function Faq() { return <section className="sec" aria-labelledby="faq-title"><div className="sec-head center"><p className="eyebrow">FAQ</p><h2 id="faq-title">Good questions.</h2></div><div className="faq">{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>; }

function Contact() {
  return (
    <section className="sec" id="contact" aria-labelledby="contact-title">
      <div className="cls top"><div><p className="eyebrow">Contact</p><h2 id="contact-title">Talk to <em>IntimaSense</em>.</h2><p className="intro">Questions about the product, ecommerce integrations, privacy and data handling, or partnerships. Messages go directly to the founder.</p><p className="mail"><a href={`mailto:${site.email}`}>{site.email}</a></p></div><div className="glass card-form" data-r><ContactForm /></div></div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="ft">
      <p className="ft-word" aria-hidden="true">Private by design.</p>
      <div className="ft-row"><a href="/" className="brand" aria-label="IntimaSense home"><Logo /><span>IntimaSense</span></a><nav aria-label="Footer"><a href="/app">Discovery studio</a><a href="/#technology">Technology (AWS)</a><a href="/#pricing">Pricing</a><a href="/#contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav></div>
      <p className="fine">© 2026 IntimaSense · {site.email} · Founded by {site.team[0].name}. For businesses serving adults 18+. A proposed product: features, integrations and AWS services are planned, pricing is illustrative and the discovery studio uses a fictional catalogue.</p>
    </footer>
  );
}

function Home() { return (<><Hero /><Marquee items={MQ} label="Who and what it is built for" /><Stats items={STATS} /><Discovery /><PrivacyModel /><Features /><Classify /><Analytics /><Who /><Pricing /><Technology /><Team /><Demo /><Faq /><Contact /></>); }

const LEGAL = {
  privacy: ['Privacy notice', [['This website', 'IntimaSense is a proposed product. This website and the discovery studio run in your browser on fictional data.'], ['Preferences', 'Preferences you choose in the previews are held in memory for the page and are never sent anywhere. The studio keeps only catalogue review changes in your browser’s local storage (key intimasense-studio-v1).'], ['Forms', `Until a form service is connected, the demo and contact forms open a pre-filled email to ${site.email}; nothing is sent until you send it.`], ['Cookies & analytics', 'None.']]],
  terms: ['Terms of use', [['A proposed product', 'Nothing here is an offer of service. Pricing is illustrative.'], ['Adults only', 'IntimaSense is designed for businesses serving consenting adults (18+).'], ['Demonstration only', 'The discovery studio uses a fictional catalogue and fictional aggregate figures.']]],
};
function Legal({kind}) { const [title, items] = LEGAL[kind]; return <section className="sec legal"><p className="eyebrow">Review draft</p><h1>{title}</h1>{items.map(([t, d]) => <div key={t}><h2>{t}</h2><p>{d}</p></div>)}</section>; }
function NotFound() { return <section className="sec legal"><p className="eyebrow">404</p><h1>Nothing here — <em>discreetly</em>.</h1><p>We couldn’t find that page.</p><p><a className="btn" href="/">Back to IntimaSense</a></p></section>; }

export {Discover};
export default function App({path = '/'}) {
  if (path.startsWith('/app')) return <Studio />;
  const page = path === '/' ? <Home /> : path === '/privacy' ? <Legal kind="privacy" /> : path === '/terms' ? <Legal kind="terms" /> : <NotFound />;
  return (<><a className="skip" href="#main">Skip to content</a><Header /><main id="main">{page}</main><Footer /></>);
}
