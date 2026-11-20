// IntimaSense rules: classify product descriptions into categories and attributes (low-confidence results go to
// a merchandiser), recommend from anonymous, voluntary preferences with stated reasons, pick educational
// resources, and report aggregates with small counts suppressed. No personal data is used or stored.
const LABEL = {'self-care': 'Self-care', relaxation: 'Relaxation', partner: 'Partner time', 'pelvic-health': 'Pelvic health', learning: 'Learning'};
export const can = (roles, roleId, perm) => !!roles.find((r) => r.id === roleId)?.can.includes(perm);

// Category rules in priority order: [category, keywords]
const CATS = [['Sexual health', ['condom']], ['Pelvic health', ['pelvic floor', 'pelvic health']], ['Personal massagers', ['personal massager']], ['Lubricants', ['lubricant']], ['Massage', ['massage oil', 'massage candle']], ['Couples & games', ['card game', 'for couples']], ['Education', ['guidebook', 'guide book']], ['Self-care', ['bath soak', 'blindfold', 'self-care']]];
const ATTRS = [['water-based', /water-based/i], ['silicone-based', /silicone-based/i], ['fragrance-free', /fragrance-free|unscented/i], ['vegan', /\bvegan\b/i], ['latex-free', /latex-free/i], ['sensitive-skin', /sensitive skin|latex allergy/i], ['body-safe silicone', /body-safe silicone/i], ['rechargeable', /rechargeable/i], ['waterproof', /waterproof/i], ['quiet', /\bquiet\b/i], ['beginner-friendly', /beginner-friendly/i], ['travel-size', /travel-size/i], ['discreet packaging', /discreet packaging/i]];
// Which interests each category serves
const SERVES = {Lubricants: ['self-care', 'partner'], Massage: ['relaxation', 'partner'], 'Personal massagers': ['self-care', 'partner'], 'Pelvic health': ['pelvic-health', 'self-care'], 'Couples & games': ['partner', 'learning'], 'Sexual health': ['partner'], 'Self-care': ['self-care', 'relaxation'], Education: ['learning', 'partner']};

export function classify(p) {
  const t = p.text.toLowerCase();
  // The category whose keyword appears earliest names the product ("lubricant … compatible with condoms" is a lubricant).
  let category = null; let hits = 0; let at = Infinity;
  for (const [c, keys] of CATS) for (const k of keys) { const i = t.indexOf(k); if (i >= 0 && i < at) { at = i; category = c; hits = keys.filter((x) => t.includes(x)).length; } }
  const attributes = ATTRS.filter(([, re]) => re.test(p.text)).map(([a]) => a);
  if (attributes.includes('latex-free') && !attributes.includes('sensitive-skin') && /allergy/i.test(p.text)) attributes.push('sensitive-skin');
  const band = p.price < 20 ? 'Under $20' : p.price < 50 ? '$20–$49' : '$50+';
  const confidence = category ? Math.min(0.97, 0.7 + 0.12 * hits + 0.02 * attributes.length) : 0.3;
  return {id: p.id, category: category || 'Unclassified', attributes, band, confidence: Number(confidence.toFixed(2)), review: confidence < 0.75};
}

/** Recommend products for an anonymous preference set; every result says why. */
export function recommend(catalogue, pref, n = 4) {
  const out = [];
  for (const {p, c} of catalogue) {
    if (c.category === 'Unclassified') continue;
    if (p.price >= pref.budget) continue;
    const missing = pref.needs.filter((x) => !c.attributes.includes(x));
    // latex-free need also excludes products that mention latex without being latex-free
    if (missing.length) continue;
    const why = []; let score = 0;
    const served = (SERVES[c.category] || []).filter((x) => pref.interests.includes(x));
    if (served.length) { score += 3 * served.length; why.push(`suits ${served.map((x) => LABEL[x]).join(' and ').toLowerCase()}`); }
    pref.needs.forEach((x) => why.push(x));
    if (pref.experience === 'new' && c.attributes.includes('beginner-friendly')) { score += 2; why.push('beginner-friendly'); }
    if (c.attributes.includes('discreet packaging')) score += 0.3;
    if (!pref.interests.length) score += 1;
    if (score <= 0.3 && pref.interests.length) continue;
    out.push({p, c, score, why: [...why, pref.budget < 999 ? `under $${pref.budget}` : null].filter(Boolean)});
  }
  out.sort((a, b) => b.score - a.score || a.p.price - b.p.price);
  const picked = []; const perCat = {};
  for (const r of out) { if ((perCat[r.c.category] || 0) >= 2) continue; perCat[r.c.category] = (perCat[r.c.category] || 0) + 1; picked.push(r); if (picked.length === n) break; }
  return picked;
}

export function education(resources, pref, n = 3) {
  const tags = [...pref.interests, ...pref.needs, pref.experience];
  return resources.map((r) => ({r, s: r.tags.filter((t) => tags.includes(t)).length})).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, n).map((x) => x.r);
}

export const K = 5;
/** Replace any count below K with null so small groups can't be singled out. */
export function suppress(obj) { return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v < K ? null : v])); }

export function initial(products, roles) { return {cls: Object.fromEntries(products.map((p) => [p.id, classify(p)])), approved: {}, log: [], role: roles[0].id}; }
const now = () => new Date().toISOString();

export function act(state, a, {roles, actor, categories}) {
  const fail = (error) => ({state, ok: false, error});
  if (a.type === 'role') return {state: {...state, role: a.role}, ok: true};
  if (!can(roles, state.role, 'classify')) return fail('Only merchandisers review the catalogue.');
  const c = state.cls[a.id]; if (!c) return fail('Product not found.');
  const log = (summary, patch) => ({ok: true, state: {...state, ...patch, log: [{at: now(), actor, id: a.id, summary}, ...state.log]}});
  if (a.type === 'approve') {
    if (c.category === 'Unclassified') return fail('Choose a category before approving.');
    return log(`Approved as ${c.category}`, {approved: {...state.approved, [a.id]: true}});
  }
  if (a.type === 'category') {
    if (!categories.includes(a.value)) return fail('Unknown category.');
    return log(`Category set to ${a.value}`, {cls: {...state.cls, [a.id]: {...c, category: a.value, confidence: 1, review: false}}, approved: {...state.approved, [a.id]: false}});
  }
  return fail('Unknown action.');
}
export const CATEGORIES = CATS.map(([c]) => c);
