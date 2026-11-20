import test from 'node:test';
import assert from 'node:assert/strict';
import site from '../src/content.js';
import {aggregates, people, products, resources, roles} from '../src/data.js';
import {CATEGORIES, K, act, classify, education, initial, recommend, suppress} from '../src/engine.js';

const cat = products.map((p) => ({p, c: classify(p)}));

test('classification picks the product’s own category and holds uncertain items for review', () => {
  const by = Object.fromEntries(cat.map(({p, c}) => [p.id, c]));
  assert.equal(by.P01.category, 'Lubricants', 'a lubricant that mentions condoms is still a lubricant');
  assert.equal(by.P09.category, 'Sexual health');
  assert.ok(by.P05.attributes.includes('beginner-friendly') && by.P05.attributes.includes('rechargeable'));
  assert.ok(by.P15.review && by.P15.category === 'Unclassified');
});

test('hard requirements and budget are never broken; every result explains itself', () => {
  const pref = {interests: ['partner'], needs: ['latex-free'], experience: 'new', budget: 20};
  const r = recommend(cat, pref);
  assert.ok(r.length >= 1);
  for (const x of r) { assert.ok(x.c.attributes.includes('latex-free')); assert.ok(x.p.price < 20); assert.ok(x.why.length > 0); }
  const vegan = recommend(cat, {interests: [], needs: ['vegan', 'fragrance-free'], experience: 'new', budget: 999});
  for (const x of vegan) assert.ok(x.c.attributes.includes('vegan') && x.c.attributes.includes('fragrance-free'));
});

test('recommendations stay varied and education follows the same preferences', () => {
  const r = recommend(cat, {interests: ['partner', 'relaxation', 'self-care'], needs: [], experience: 'familiar', budget: 999});
  const counts = {}; r.forEach((x) => { counts[x.c.category] = (counts[x.c.category] || 0) + 1; });
  assert.ok(Object.values(counts).every((n) => n <= 2));
  assert.ok(education(resources, {interests: ['pelvic-health'], needs: [], experience: 'new'}).some((x) => x.id === 'R4'));
});

test('aggregate reports suppress counts below five', () => {
  const s = suppress(aggregates.byRegion);
  assert.equal(s.Enugu, null); assert.equal(s.Kano, null); assert.equal(s.Lagos, 640);
  assert.equal(K, 5);
});

test('only merchandisers change the catalogue; unclassified items need a category before approval', () => {
  const ctx = (s) => ({roles, actor: people[s.role], categories: CATEGORIES});
  let s = initial(products, roles);
  assert.match(act(s, {type: 'approve', id: 'P15'}, ctx(s)).error, /category/);
  s = act(s, {type: 'category', id: 'P15', value: 'Self-care'}, ctx(s)).state;
  s = act(s, {type: 'approve', id: 'P15'}, ctx(s)).state;
  assert.equal(s.approved.P15, true);
  const an = act(s, {type: 'role', role: 'analyst'}, ctx(s)).state;
  assert.equal(act(an, {type: 'approve', id: 'P01'}, ctx(an)).ok, false);
});

test('founder and contact', () => {
  assert.equal(site.team[0].name, 'Nathaniel Okoro');
  assert.equal(site.email, 'nathaniel@intimasense.space');
});
