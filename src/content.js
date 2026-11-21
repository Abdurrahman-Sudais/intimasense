// IntimaSense — site facts used by the pages, the prerender step and the tests.
// A proposed product: features, integrations and AWS services are planned until implemented and verified.
const site = {
  name: 'IntimaSense',
  slug: 'intimasense',
  tagline: 'Personalized discovery. Private by design.',
  about: 'IntimaSense is a proposed personalisation platform for adult sexual wellness retailers and brands. It would help businesses organise product information and recommend relevant products and educational resources to consenting adult customers, using product attributes and voluntarily provided preferences with minimal data collection.',
  url: 'https://intimasense.space',
  email: 'nathaniel@intimasense.space',
  team: [
    {name: 'Nathaniel Okoro', role: 'Founder', initials: 'NO', bio: 'Nathaniel founded IntimaSense after seeing wellness retailers choose between generic shops and personalisation that collected far more than shoppers would ever want to share. Nathaniel leads product, retailer partnerships and every pilot, with privacy as the starting point.', focus: ['Product', 'Privacy-first personalisation', 'Retailer pilots']},
    {name: "Zainab Yusuf", role: "Co-founder", initials: "ZY", bio: "Zainab leads retailer partnerships and customer success at IntimaSense: onboarding wellness retailers and brands, shaping catalogue review with merchandisers and turning their feedback into product changes.", focus: ["Ecommerce partnerships", "Merchandising", "Pilot onboarding"]},
    {name: "Emeka Uzor", role: "CTO", initials: "EU", bio: "Emeka leads engineering: catalogue classification, the recommendation engine, anonymous session handling, aggregate analytics with suppression and the AWS platform it runs on.", focus: ["Platform architecture", "Privacy engineering", "AWS infrastructure"]},
  ],
  app: {
    title: 'Discovery studio',
    subtitle: 'A fictional, non-explicit wellness catalogue: classification with merchandiser review, anonymous preference selection, explained recommendations, education, suppressed aggregate analytics and the recommendation API.',
  },
};
export default site;
