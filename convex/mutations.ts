import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitReport = mutation({
  args: {
    areaId: v.id("areas"),
    type: v.union(v.literal("outage"), v.literal("restored")),
    fingerprint: v.string(),
  },
  handler: async (ctx, { areaId, type, fingerprint }) => {
    const now = Date.now();
    const COOLDOWN_MS = 30 * 60 * 1000;
    const WINDOW_MS = 10 * 60 * 1000;
    const THRESHOLD = 2;

    const recentByUser = await ctx.db
      .query("reports")
      .withIndex("by_fingerprint_area", (q) =>
        q.eq("fingerprint", fingerprint).eq("areaId", areaId),
      )
      .filter((q) => q.gte(q.field("_creationTime"), now - COOLDOWN_MS))
      .first();

    if (recentByUser) {
      return { success: false, reason: "cooldown" as const };
    }

    await ctx.db.insert("reports", {
      areaId,
      type,
      fingerprint,
      confirmedCount: 1,
    });

    const recentSameType = await ctx.db
      .query("reports")
      .withIndex("by_area", (q) => q.eq("areaId", areaId))
      .filter((q) =>
        q.and(
          q.eq(q.field("type"), type),
          q.gte(q.field("_creationTime"), now - WINDOW_MS),
        ),
      )
      .collect();

    if (recentSameType.length >= THRESHOLD) {
      const hasLight = type === "restored";

      const existing = await ctx.db
        .query("areaStatus")
        .withIndex("by_area", (q) => q.eq("areaId", areaId))
        .first();

      if (existing) {
        let avgOutageMins = existing.avgOutageMins;

        if (!hasLight && existing.hasLight) {
          await ctx.db.patch(existing._id, {
            hasLight: false,
            outageSince: now,
            lastUpdated: now,
          });
        } else if (hasLight && !existing.hasLight && existing.outageSince) {
          const outageDurationMins = (now - existing.outageSince) / 60_000;
          avgOutageMins =
            existing.avgOutageMins === 0
              ? outageDurationMins
              : (existing.avgOutageMins + outageDurationMins) / 2;

          await ctx.db.patch(existing._id, {
            hasLight: true,
            outageSince: undefined,
            avgOutageMins,
            lastUpdated: now,
          });
        }
      } else {
        await ctx.db.insert("areaStatus", {
          areaId,
          hasLight: type === "restored",
          outageSince: type === "outage" ? now : undefined,
          avgOutageMins: 0,
          lastUpdated: now,
        });
      }
    }

    return { success: true as const };
  },
});

export const confirmReport = mutation({
  args: { reportId: v.id("reports") },
  handler: async (ctx, { reportId }) => {
    const report = await ctx.db.get(reportId);
    if (!report) return;
    await ctx.db.patch(reportId, {
      confirmedCount: report.confirmedCount + 1,
    });
  },
});
