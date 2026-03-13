import { mutation } from "./_generated/server";

const AREAS = [
  {
    name: "Lekki Phase 1",
    slug: "lekki-phase-1",
    state: "Lagos",
    lga: "Eti-Osa",
    lat: 6.4306,
    lng: 3.4718,
  },
  {
    name: "Victoria Island",
    slug: "victoria-island",
    state: "Lagos",
    lga: "Eti-Osa",
    lat: 6.4281,
    lng: 3.4219,
  },
  {
    name: "Surulere",
    slug: "surulere",
    state: "Lagos",
    lga: "Surulere",
    lat: 6.4969,
    lng: 3.3536,
  },
  {
    name: "Yaba",
    slug: "yaba",
    state: "Lagos",
    lga: "Lagos Mainland",
    lat: 6.5158,
    lng: 3.3764,
  },
  {
    name: "Ajah",
    slug: "ajah",
    state: "Lagos",
    lga: "Eti-Osa",
    lat: 6.4698,
    lng: 3.5852,
  },
  {
    name: "Ikeja",
    slug: "ikeja",
    state: "Lagos",
    lga: "Ikeja",
    lat: 6.6018,
    lng: 3.3515,
  },
  {
    name: "Oshodi",
    slug: "oshodi",
    state: "Lagos",
    lga: "Oshodi-Isolo",
    lat: 6.5574,
    lng: 3.3498,
  },
  {
    name: "Festac Town",
    slug: "festac-town",
    state: "Lagos",
    lga: "Amuwo-Odofin",
    lat: 6.4674,
    lng: 3.2819,
  },
  {
    name: "Gbagada",
    slug: "gbagada",
    state: "Lagos",
    lga: "Kosofe",
    lat: 6.553,
    lng: 3.3864,
  },
  {
    name: "Maryland",
    slug: "maryland",
    state: "Lagos",
    lga: "Kosofe",
    lat: 6.5636,
    lng: 3.3634,
  },
  {
    name: "Ikorodu",
    slug: "ikorodu",
    state: "Lagos",
    lga: "Ikorodu",
    lat: 6.6194,
    lng: 3.5064,
  },
  {
    name: "Badagry",
    slug: "badagry",
    state: "Lagos",
    lga: "Badagry",
    lat: 6.4149,
    lng: 2.887,
  },
  {
    name: "Mushin",
    slug: "mushin",
    state: "Lagos",
    lga: "Mushin",
    lat: 6.5351,
    lng: 3.3536,
  },
  {
    name: "Isale Eko",
    slug: "isale-eko",
    state: "Lagos",
    lga: "Lagos Island",
    lat: 6.4531,
    lng: 3.3958,
  },
  {
    name: "Ojodu Berger",
    slug: "ojodu-berger",
    state: "Lagos",
    lga: "Ikeja",
    lat: 6.6348,
    lng: 3.3652,
  },
  {
    name: "Agege",
    slug: "agege",
    state: "Lagos",
    lga: "Agege",
    lat: 6.623,
    lng: 3.3188,
  },
  {
    name: "Apapa",
    slug: "apapa",
    state: "Lagos",
    lga: "Apapa",
    lat: 6.4479,
    lng: 3.3618,
  },
  {
    name: "Ibeju-Lekki",
    slug: "ibeju-lekki",
    state: "Lagos",
    lga: "Ibeju-Lekki",
    lat: 6.4483,
    lng: 3.7203,
  },
  {
    name: "Sangotedo",
    slug: "sangotedo",
    state: "Lagos",
    lga: "Eti-Osa",
    lat: 6.4395,
    lng: 3.5606,
  },
  {
    name: "Ogba",
    slug: "ogba",
    state: "Lagos",
    lga: "Ikeja",
    lat: 6.6004,
    lng: 3.3217,
  },
];

export const seedAreas = mutation({
  args: {},
  handler: async (ctx) => {
    let inserted = 0;
    for (const area of AREAS) {
      const existing = await ctx.db
        .query("areas")
        .withIndex("by_slug", (q) => q.eq("slug", area.slug))
        .first();
      if (!existing) {
        await ctx.db.insert("areas", area);
        inserted++;
      }
    }
    return `Seeded ${inserted} areas.`;
  },
});
