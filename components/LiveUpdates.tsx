"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { SectionLabel } from "@/components/PageShell";

export default function LiveUpdates() {
  const areas = useQuery(api.queries.getLiveMap);

  const reported = areas
    ? areas
        .filter((a) => a.status !== null)
        .sort(
          (a, b) => (b.status?.lastUpdated ?? 0) - (a.status?.lastUpdated ?? 0),
        )
        .slice(0, 10)
    : null;

  const monthLabel = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full">
      <SectionLabel label="Live Update" />

      {reported === null ? (
        <div className="py-6 text-[12px] text-neutral-300 tracking-wide">
          Loading...
        </div>
      ) : reported.length === 0 ? (
        <div className="py-5 text-[13px] text-neutral-400">
          No reports yet.{" "}
          <Link
            href="/area/lekki-phase-1"
            className="underline underline-offset-2 hover:text-[#111] transition-colors">
            Be the first to report.
          </Link>
        </div>
      ) : (
        <div className="flex">
          <div className="pt-4 pr-8 text-[12px] text-neutral-400 w-28 shrink-0 font-mono">
            {monthLabel}
          </div>
          <div className="flex-1">
            {reported.map((area) => {
              const hasLight = area.status?.hasLight;
              const ts = area.status?.lastUpdated
                ? new Date(area.status.lastUpdated)
                : null;
              const dateStr = ts
                ? `${String(ts.getDate()).padStart(2, "0")}/${String(ts.getMonth() + 1).padStart(2, "0")}`
                : "—";

              return (
                <Link
                  key={area._id}
                  href={`/area/${area.slug}`}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 group hover:bg-black/2 -mx-2 px-2 transition-colors duration-100">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
                        hasLight === false
                          ? "bg-red-400"
                          : hasLight === true
                            ? "bg-green-400"
                            : "bg-neutral-200"
                      }`}
                    />
                    <span className="text-[13px] text-neutral-500 group-hover:text-[#111] transition-colors duration-100">
                      {area.name}
                    </span>
                  </div>
                  <span className="text-[12px] text-neutral-400 font-mono">
                    {dateStr}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
