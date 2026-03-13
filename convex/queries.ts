import { query } from "./_generated/server";
import { v } from "convex/values";


export const getLiveMap = query({
  args: {},
  handler: async (ctx) => {
    const areas = await ctx.db.query("areas").collect();

    const result = await Promise.all(
      areas.map(async (area) => {
        const status = await ctx.db
          .query("areaStatus")
          .withIndex("by_area", (q) => q.eq("areaId", area._id))
          .first();
        return { ...area, status: status ?? null };
      }),
    );

    return result;
  },
});

export const getAreaBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("areas")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const getAreaStatus = query({
  args: { areaId: v.id("areas") },
  handler: async (ctx, { areaId }) => {
    return await ctx.db
      .query("areaStatus")
      .withIndex("by_area", (q) => q.eq("areaId", areaId))
      .first();
  },
});

export const getAreaReports = query({
  args: { areaId: v.id("areas") },
  handler: async (ctx, { areaId }) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_area", (q) => q.eq("areaId", areaId))
      .order("desc")
      .take(20);
  },
});

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const statuses = await ctx.db.query("areaStatus").collect();
    const darkCount = statuses.filter((s) => !s.hasLight).length;
    const lightCount = statuses.filter((s) => s.hasLight).length;

    const withAreas = await Promise.all(
      statuses
        .filter((s) => s.avgOutageMins > 0)
        .sort((a, b) => b.avgOutageMins - a.avgOutageMins)
        .slice(0, 5)
        .map(async (s) => {
          const area = await ctx.db.get(s.areaId);
          return { ...s, area };
        }),
    );

    return { darkCount, lightCount, worstAreas: withAreas };
  },
});
