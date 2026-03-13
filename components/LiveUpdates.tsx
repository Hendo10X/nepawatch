"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { SectionLabel } from "@/components/PageShell";

export default function LiveUpdates() {
  const recent = useQuery(api.queries.getRecentReports);

  const monthLabel = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const visible = recent && recent.length > 0 ? recent.slice(0, 5) : recent;
  const hasMore = !!recent && recent.length > 5;

  return (
    <div className="w-full">
      <SectionLabel label="Live updates across Lagos" />

      {recent === undefined ? (
        <div className="py-6 text-[12px] text-neutral-400 tracking-wide">
          Loading latest reports...
        </div>
      ) : !recent || recent.length === 0 ? (
        <div className="py-5 text-[13px] text-neutral-500">
          No reports yet.{" "}
          <Link
            href="/area/lekki-phase-1"
            className="underline underline-offset-2 hover:text-[#111] transition-colors">
            Be the first to report.
          </Link>
        </div>
      ) : (
        <div className="flex">
          <div className="pt-4 pr-8 text-[12px] text-neutral-500 w-28 shrink-0 font-mono">
            {monthLabel}
          </div>
          <div className="flex-1">
            {visible!.map((report) => {
              const ts = new Date(report._creationTime);
              const dateStr = `${String(ts.getDate()).padStart(2, "0")}/${String(ts.getMonth() + 1).padStart(2, "0")}`;
              const areaName = report.area?.name ?? "Unknown area";
              const region =
                report.area != null
                  ? `${report.area.lga}, ${report.area.state}`
                  : "Nigeria";
              const isOutage = report.type === "outage";

              return (
                <Link
                  key={report._id}
                  href={report.area ? `/area/${report.area.slug}` : "#"}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 group hover:bg-black/2 -mx-2 px-2 transition-colors duration-100">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
                        isOutage ? "bg-red-400" : "bg-green-400"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="text-[13px] text-neutral-600 group-hover:text-[#111] transition-colors duration-100">
                        {areaName}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {region} · {isOutage ? "No light reported" : "Light restored"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[12px] text-neutral-500 font-mono">
                    {dateStr}
                  </span>
                </Link>
              );
            })}

            {hasMore && (
              <div className="flex justify-end pt-3">
                <Link
                  href="/dashboard"
                  className="text-[12px] text-neutral-600 hover:text-[#111] underline underline-offset-2">
                  Show more reports →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
