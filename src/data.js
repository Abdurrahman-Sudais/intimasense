// Fictional, non-explicit catalogue for the discovery-studio prototype. The store, products and figures are
// invented. Preferences in the prototype are anonymous and stay in the browser session.

export const STORE = {name: 'Halcyon Wellness (fictional store)', currency: '$'};

const P = (id, name, price, text) => ({id, name, price, text});
export const products = [
  P('P01', 'Silk Glide water-based lubricant', 14, 'A water-based lubricant that is fragrance-free and vegan, suitable for sensitive skin. Compatible with silicone products and condoms. Discreet packaging.'),
  P('P02', 'Long-lasting silicone lubricant', 22, 'Silicone-based lubricant, long-lasting and waterproof. Unscented. Not for use with silicone products. Discreet packaging.'),
  P('P03', 'Calm massage oil, unscented', 18, 'A light massage oil with sweet almond and jojoba, fragrance-free and vegan, for relaxation and partner massage.'),
  P('P04', 'Amber massage candle', 26, 'A soy massage candle that melts into warm oil, scented with amber and vanilla, for relaxing partner massage.'),
  P('P05', 'Compact personal massager', 39, 'A compact personal massager in body-safe silicone. Rechargeable, waterproof and quiet, with five gentle settings. Beginner-friendly and travel-size. Discreet packaging.'),
  P('P06', 'Wand personal massager', 79, 'A full-size wand personal massager in body-safe silicone with a flexible head. Rechargeable, quiet, ten settings. Discreet packaging.'),
  P('P07', 'Pelvic floor trainer set', 34, 'A pelvic floor trainer set of three graduated weights in body-safe silicone, with a guide to pelvic health exercises. Beginner-friendly.'),
  P('P08', 'Conversation card game for couples', 19, 'A card game for couples with 120 questions to talk about preferences, boundaries and connection. Printed on recycled card.'),
  P('P09', 'Latex-free condoms, 12 pack', 12, 'Latex-free condoms made from polyisoprene, suitable for people with latex allergy. Vegan and fragrance-free.'),
  P('P10', 'Ultra-thin latex condoms, 12 pack', 10, 'Ultra-thin latex condoms with water-based lubricant. Vegan.'),
  P('P11', 'Lavender bath soak', 16, 'A magnesium bath soak with lavender essential oil for self-care and relaxation evenings. Vegan.'),
  P('P12', 'Silk blindfold', 24, 'A mulberry silk blindfold for relaxation and sensory play with a partner. Hand-washable.'),
  P('P13', 'Pleasure & wellbeing guidebook', 21, 'An illustrated guidebook about intimacy, communication, consent and wellbeing, written by a clinical sexologist.'),
  P('P14', 'Couples’ personal massager', 89, 'A wearable couples’ personal massager in body-safe silicone, app-free remote, rechargeable and waterproof.'),
  P('P15', 'Aloe soothing gel', 15, 'An aloe-based gel for everyday intimate comfort.'),
];

export const resources = [
  {id: 'R1', title: 'Choosing body-safe materials', tags: ['learning', 'self-care', 'new'], mins: 4},
  {id: 'R2', title: 'Water-based or silicone-based? A simple guide', tags: ['learning', 'sensitive-skin', 'new'], mins: 3},
  {id: 'R3', title: 'Talking with a partner about preferences', tags: ['partner', 'learning'], mins: 6},
  {id: 'R4', title: 'Pelvic health basics', tags: ['pelvic-health', 'learning', 'new'], mins: 5},
  {id: 'R5', title: 'Caring for and cleaning your products', tags: ['self-care', 'learning'], mins: 3},
  {id: 'R6', title: 'Latex allergy: what to look for', tags: ['latex-free', 'learning'], mins: 3},
  {id: 'R7', title: 'Building a relaxing self-care evening', tags: ['relaxation', 'self-care'], mins: 4},
];

export const INTERESTS = [['self-care', 'Self-care'], ['relaxation', 'Relaxation & massage'], ['partner', 'With a partner'], ['pelvic-health', 'Pelvic health'], ['learning', 'Learning more']];
export const NEEDS = [['fragrance-free', 'Fragrance-free'], ['vegan', 'Vegan'], ['latex-free', 'Latex-free'], ['sensitive-skin', 'Sensitive skin']];
export const BUDGETS = [[20, 'Under $20'], [50, 'Under $50'], [999, 'Any budget']];

/** Aggregate, anonymous sessions from a fictional pilot month: counts only, no session-level data kept. */
export const aggregates = {
  sessions: 2410,
  byInterest: {'self-care': 812, relaxation: 655, partner: 731, 'pelvic-health': 148, learning: 390},
  byNeed: {'fragrance-free': 402, vegan: 267, 'latex-free': 61, 'sensitive-skin': 188},
  // recommendation shown → product viewed, by category
  ctr: {Lubricants: [1420, 312], Massage: [980, 241], 'Personal massagers': [1105, 298], 'Pelvic health': [210, 63], 'Couples & games': [540, 117], 'Sexual health': [610, 98], 'Self-care': [470, 88], Education: [330, 4]},
  byRegion: {'Lagos': 640, 'Abuja': 402, 'Port Harcourt': 133, 'Ibadan': 98, 'Enugu': 3, 'Kano': 2},
};

export const roles = [
  {id: 'merch', label: 'Merchandiser', can: ['classify']},
  {id: 'analyst', label: 'Ecommerce Analyst', can: ['analytics']},
  {id: 'dev', label: 'Developer', can: ['api', 'analytics']},
  {id: 'viewer', label: 'Viewer', can: []},
];
export const people = {merch: 'Ifeoma Nwosu', analyst: 'Kayode Bello', dev: 'Zainab Musa', viewer: 'Guest'};
