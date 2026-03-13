import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  areas: defineTable({
    name: v.string(),
    slug: v.string(),
    state: v.string(),
    lga: v.string(),
    lat: v.number(),
    lng: v.number(),
  }).index("by_slug", ["slug"]),

  reports: defineTable({
    areaId: v.id("areas"),
    type: v.union(v.literal("outage"), v.literal("restored")),
    fingerprint: v.string(),
    confirmedCount: v.number(),
  })
    .index("by_area", ["areaId"])
    .index("by_fingerprint_area", ["fingerprint", "areaId"]),

  areaStatus: defineTable({
    areaId: v.id("areas"),
    hasLight: v.boolean(),
    outageSince: v.optional(v.number()),
    avgOutageMins: v.number(),
    lastUpdated: v.number(),
  })
    .index("by_area", ["areaId"])
    .index("by_light", ["hasLight"]),
});
