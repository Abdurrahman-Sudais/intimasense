import React, {useEffect, useState} from 'react';
import {flushSync} from 'react-dom';
import site from './content.js';
import {BUDGETS, INTERESTS, NEEDS, STORE, aggregates, people, products, resources, roles} from './data.js';
import {CATEGORIES, K, act, can, education, initial, recommend, suppress} from './engine.js';
import {vt} from './fx.js';
import {Logo} from './App.jsx';

const KEY = 'intimasense-studio-v1';
const pct = (a, b) => `${Math.round((b / a) * 100)}%`;

export default function Studio() {
  const [state, setState] = useState(() => initial(products, roles));
  const [tab, setTab] = useState('shop');
  const [adult, setAdult] = useState(false);
  const [pref, setPref] = useState({interests: [], needs: [], experience: 'new', budget: 999});
  const [msg, setMsg] = useState('');
  useEffect(() => { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s?.cls) setState(s); } catch { /* ignore */ } }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } }, [state]);

  const actor = people[state.role];
  const allow = (p) => can(roles, state.role, p);
  const run = (a) => { const r = act(state, a, {roles, actor, categories: CATEGORIES}); setMsg(r.ok ? '' : r.error); if (r.ok) setState(r.state); };
  const go = (t) => vt(() => flushSync(() => { setTab(t); setMsg(''); }));
  const toggle = (k, v) => vt(() => flushSync(() => setPref((p) => ({...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v]}))));
  // Only approved or confident classifications are served to shoppers.
  const catalogue = products.map((p) => ({p, c: state.cls[p.id]})).filter(({p, c}) => !c.review || state.approved[p.id]);
  const recs = recommend(catalogue, pref, 4);
  const edu = education(resources, pref);
  const queue = products.filter((p) => state.cls[p.id].review && !state.approved[p.id]);
  const req = {store: 'halcyon-demo', session: 'anon-7f3c (rotates each visit)', preferences: {interests: pref.interests, needs: pref.needs, experience: pref.experience, max_price: pref.budget < 999 ? pref.budget : null}, limit: 4};
  const res = {recommendations: recs.map((r) => ({product_id: r.p.id, category: r.c.category, reasons: r.why})), education: edu.map((r) => r.id), stored: 'nothing; preferences are discarded after the response'};

  return (
    <div className="st">
      <header className="st-top">
        <a href="/" className="brand" aria-label="Back to the IntimaSense website"><Logo size={26} /><span>IntimaSense</span></a>
        <span className="mono">{STORE.name}</span>
        <label className="st-role">Signed in as <select value={state.role} onChange={(e) => run({type: 'role', role: e.target.value})}>{roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></label>
        <button className="btn ghost sm" onClick={() => { setState(initial(products, roles)); setMsg(''); }}>Reset</button>
      </header>
      <p className="st-banner">Fictional, non-explicit catalogue · preferences are anonymous and never stored · adults 18+</p>
      <main className="st-main">
        <div className="st-head"><h1>{site.app.title}</h1><div className="st-tabs" role="tablist">{[['shop', 'Shopper preview'], ['cat', `Catalogue${queue.length ? ` · ${queue.length} to review` : ''}`], ['edu', 'Education'], ['ana', 'Analytics'], ['api', 'API']].map(([id, l]) => <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => go(id)}>{l}</button>)}</div></div>
        {msg && <p className="st-err" role="alert">{msg}</p>}

        {tab === 'shop' && (!adult ? (
          <section className="glass gate"><h2>This preview is for adults.</h2><p>Retailers show their own age notice before discovery. IntimaSense does not record this choice.</p><div className="cta"><button className="btn" onClick={() => setAdult(true)}>I’m 18 or over</button><a className="btn ghost" href="/">Leave</a></div></section>
        ) : (
          <div className="shop">
            <aside className="glass prefs"><h2>Your preferences <small>optional</small></h2>
              <p className="q">Interested in</p><div className="chips">{INTERESTS.map(([v, l]) => <button key={v} className={pref.interests.includes(v) ? 'chip on' : 'chip'} aria-pressed={pref.interests.includes(v)} onClick={() => toggle('interests', v)}>{l}</button>)}</div>
              <p className="q">Only show</p><div className="chips">{NEEDS.map(([v, l]) => <button key={v} className={pref.needs.includes(v) ? 'chip on' : 'chip'} aria-pressed={pref.needs.includes(v)} onClick={() => toggle('needs', v)}>{l}</button>)}</div>
              <p className="q">Experience</p><div className="chips">{[['new', 'New to this'], ['familiar', 'Familiar']].map(([v, l]) => <button key={v} className={pref.experience === v ? 'chip on' : 'chip'} aria-pressed={pref.experience === v} onClick={() => vt(() => flushSync(() => setPref({...pref, experience: v})))}>{l}</button>)}</div>
              <p className="q">Budget</p><div className="chips">{BUDGETS.map(([v, l]) => <button key={v} className={pref.budget === v ? 'chip on' : 'chip'} aria-pressed={pref.budget === v} onClick={() => vt(() => flushSync(() => setPref({...pref, budget: v})))}>{l}</button>)}</div>
              <button className="fm-link" onClick={() => setPref({interests: [], needs: [], experience: 'new', budget: 999})}>Clear everything</button>
            </aside>
            <section><h2 className="h-sm">Recommended for this visit</h2>
              <ul className="grid-recs">{recs.map((r) => <li key={r.p.id} className="glass" style={{viewTransitionName: `p-${r.p.id}`}}><span className={`swatch big c-${r.c.category.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')}`} aria-hidden="true" /><small>{r.c.category}</small><b>{r.p.name}</b><span className="price">${r.p.price}</span><p className="why">Why: {r.why.length ? r.why.join(' · ') : 'popular starting point'}</p></li>)}</ul>
              {!recs.length && <p className="glass none">Nothing matches every requirement. We never break a requirement to fill a slot.</p>}
              <h2 className="h-sm">Learn more</h2><ul className="edu">{(edu.length ? edu : resources.slice(0, 3)).map((r) => <li key={r.id}><b>{r.title}</b><small>{r.mins} min read</small></li>)}</ul>
            </section>
          </div>))}

        {tab === 'cat' && (<section className="glass panel"><h2>Catalogue classification</h2><p className="fine">Classified from each description. Items below 75% confidence are held from shoppers until a merchandiser approves them.{allow('classify') ? '' : ' Only merchandisers can change classifications.'}</p>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th scope="col">Product</th><th scope="col">Category</th><th scope="col">Confidence</th><th scope="col">Attributes</th><th scope="col">Status</th></tr></thead>
            <tbody>{[...queue, ...products.filter((p) => !queue.includes(p))].map((p) => { const c = state.cls[p.id]; const held = c.review && !state.approved[p.id]; return <tr key={p.id} className={held ? 'held' : ''}><th scope="row">{p.name}<small>{p.text}</small></th>
              <td><select aria-label={`Category for ${p.name}`} value={CATEGORIES.includes(c.category) ? c.category : ''} disabled={!allow('classify')} onChange={(e) => run({type: 'category', id: p.id, value: e.target.value})}><option value="" disabled>Choose…</option>{CATEGORIES.map((x) => <option key={x}>{x}</option>)}</select></td>
              <td>{Math.round(c.confidence * 100)}%</td><td><ul className="attrs sm">{c.attributes.map((a) => <li key={a}>{a}</li>)}</ul></td>
              <td>{state.approved[p.id] ? <span className="ok">Approved</span> : held ? <button className="btn sm" disabled={!allow('classify')} onClick={() => run({type: 'approve', id: p.id})}>Approve</button> : <span className="muted">Auto · {c.band}</span>}</td></tr>; })}</tbody></table></div>
          <h3 className="h-sm">Review log</h3><ul className="log">{state.log.map((l, i) => <li key={i}><time>{new Date(l.at).toLocaleTimeString()}</time> <b>{l.actor}</b> · {products.find((p) => p.id === l.id)?.name} · {l.summary}</li>)}{!state.log.length && <li className="fine">No changes yet.</li>}</ul></section>)}

        {tab === 'edu' && (<section className="glass panel"><h2>Approved educational resources</h2><ul className="edu wide">{resources.map((r) => <li key={r.id}><b>{r.title}</b><small>{r.mins} min · matched to {r.tags.join(', ')}</small></li>)}</ul><p className="fine">Resources are written or approved by the retailer and matched to the same anonymous preferences as products.</p></section>)}

        {tab === 'ana' && (allow('analytics') ? (<div className="ana-grid">
          <section className="glass panel"><h2>Sessions by interest <small>{aggregates.sessions.toLocaleString()} sessions</small></h2><Bars data={suppress(aggregates.byInterest)} labels={Object.fromEntries(INTERESTS)} /></section>
          <section className="glass panel"><h2>Requirements chosen</h2><Bars data={suppress(aggregates.byNeed)} labels={Object.fromEntries(NEEDS)} /></section>
          <section className="glass panel"><h2>Recommendation → product view</h2><table className="tbl"><thead><tr><th scope="col">Category</th><th scope="col">Shown</th><th scope="col">Viewed</th><th scope="col">Rate</th></tr></thead><tbody>{Object.entries(aggregates.ctr).map(([k, [a, b]]) => <tr key={k}><th scope="row">{k}</th><td>{a}</td><td>{b < K ? `< ${K}` : b}</td><td>{b < K ? '—' : pct(a, b)}</td></tr>)}</tbody></table></section>
          <section className="glass panel"><h2>Sessions by region</h2><Bars data={suppress(aggregates.byRegion)} /><p className="fine">Counts below {K} are suppressed in every report and export.</p></section>
        </div>) : <section className="glass panel"><h2>Analytics</h2><p>Aggregate analytics are available to analysts and developers. Switch role to view.</p></section>)}

        {tab === 'api' && (<section className="glass panel"><h2>Recommendation API <small>POST /v1/recommendations</small></h2>
          {allow('api') ? (<><p className="fine">Built from the current shopper-preview preferences. API key: <code>is_test_••••••••3f9a</code> (scoped to one store).</p>
            <div className="api"><div><h3 className="h-sm">Request</h3><pre>{JSON.stringify(req, null, 2)}</pre></div><div><h3 className="h-sm">Response</h3><pre>{JSON.stringify(res, null, 2)}</pre></div></div></>) : <p>API keys and examples are visible to developers. Switch role to view.</p>}</section>)}
      </main>
    </div>
  );
}

function Bars({data, labels = {}}) {
  const vals = Object.values(data).filter((v) => v !== null); const max = Math.max(...vals);
  return <ul className="an">{Object.entries(data).map(([k, v]) => <li key={k}><span>{labels[k] || k}</span><i className={v === null ? 'hidden' : ''} style={{'--w': v === null ? '100%' : `${(v / max) * 100}%`}} /><b>{v === null ? `< ${K}` : v.toLocaleString()}</b></li>)}</ul>;
}
