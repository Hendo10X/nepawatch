"use client";

import { useQuery } from "convex/react";
import { Liveline } from "liveline";
import { api } from "@/convex/_generated/api";
import PageShell, { Logo, SectionLabel } from "@/components/PageShell";
import Link from "next/link";

export default function DashboardClient() {
  const stats = useQuery(api.queries.getDashboardStats);
  const areas = useQuery(api.queries.getLiveMap);
  const recentReports = useQuery(api.queries.getRecentReports);

  const dark = areas?.filter((a) => a.status && !a.status.hasLight) ?? [];
  const light = areas?.filter((a) => a.status?.hasLight) ?? [];
  const unreported = areas?.filter((a) => !a.status) ?? [];

  const sortedReports = recentReports
    ? [...recentReports].sort((a, b) => a._creationTime - b._creationTime)
    : [];

  const chartPoints = sortedReports.map((report, index) => ({
    // Use epoch seconds for time; works with Liveline's window handling.
    time: report._creationTime / 1000,
    value: index + 1,
  }));

  const latestValue = sortedReports.length;

  const monthLabel = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <PageShell>
      <Logo />

      <h1 className="text-[15px] font-medium text-[#111] mb-1">Dashboard</h1>
      <p className="text-[13px] text-neutral-500 mb-10">
        Live overview of power availability across Lagos.
      </p>

      {/* Summary stats */}
      <div className="mb-10">
        <SectionLabel label="Summary" />
        <div className="flex">
          <div className="w-28 shrink-0 pt-4 text-[12px] text-neutral-500 pr-8 font-mono">
            {monthLabel}
          </div>
          <div className="flex-1">
            <StatRow
              label="Areas with no light"
              value={stats?.darkCount ?? "—"}
              dot="bg-red-400"
            />
            <StatRow
              label="Areas with light"
              value={stats?.lightCount ?? "—"}
              dot="bg-green-400"
            />
            <StatRow
              label="No reports yet"
              value={unreported.length || "—"}
              dot="bg-neutral-300"
            />
          </div>
        </div>
      </div>

      {/* Live reports chart */}
      <div className="mb-10">
        <SectionLabel label="Live reports activity" />
        <div className="pt-4">
          <div className="h-40 md:h-48 border border-neutral-200 bg-white/60 flex items-center">
            {recentReports === undefined ? (
              <p className="w-full text-center text-[12px] text-neutral-500">
                Loading live activity…
              </p>
            ) : chartPoints.length === 0 ? (
              <p className="w-full text-center text-[12px] text-neutral-500">
                No live reports yet. As soon as people start reporting, this
                chart will move.
              </p>
            ) : (
              <Liveline
                data={chartPoints}
                value={latestValue}
                color="#16a34a"
                theme="light"
                grid
                badge={false}
                exaggerate
                // Show roughly last 30 days of activity so older test reports are still visible.
                window={30 * 24 * 60 * 60}
              />
            )}
          </div>
        </div>
      </div>

      {/* Worst areas */}
      {stats?.worstAreas && stats.worstAreas.length > 0 && (
        <div className="mb-10">
          <SectionLabel label="Worst areas by avg outage" />
          <div className="flex">
            <div className="w-28 shrink-0 pt-4 text-[12px] text-neutral-500 pr-8">
              Ranked
            </div>
            <div className="flex-1">
              {stats.worstAreas.map((s, i) => (
                <Link
                  key={s.areaId}
                  href={`/area/${s.area?.slug}`}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 group hover:bg-black/2 -mx-2 px-2 transition-colors duration-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[12px] text-neutral-400 w-4 font-mono shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-[13px] text-neutral-500 group-hover:text-[#111] transition-colors duration-100">
                      {s.area?.name ?? "—"}
                    </span>
                  </div>
                  <span className="text-[12px] text-neutral-500 font-mono">
                    {Math.round(s.avgOutageMins)}m avg
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Currently dark */}
      {dark.length > 0 && (
        <div className="mb-10">
          <SectionLabel label="Currently dark" />
          <div className="flex">
            <div className="w-28 shrink-0 pt-4 text-[12px] text-neutral-500 pr-8">
              Now
            </div>
            <div className="flex-1">
              {dark.map((area) => {
                const since = area.status?.outageSince;
                const duration = since
                  ? formatDuration(Date.now() - since)
                  : null;
                return (
                  <Link
                    key={area._id}
                    href={`/area/${area.slug}`}
                    className="flex items-center justify-between py-3 border-b border-neutral-100 group hover:bg-black/2 -mx-2 px-2 transition-colors duration-100">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      <span className="text-[13px] text-neutral-600 group-hover:text-[#111] transition-colors duration-100">
                        {area.name}
                      </span>
                    </div>
                    <span className="text-[12px] text-neutral-500 font-mono">
                      {duration ?? "—"}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Currently lit */}
      {light.length > 0 && (
        <div className="mb-10">
          <SectionLabel label="Currently lit" />
          <div className="flex">
            <div className="w-28 shrink-0 pt-4 text-[12px] text-neutral-500 pr-8">
              Now
            </div>
            <div className="flex-1">
              {light.map((area) => (
                <Link
                  key={area._id}
                  href={`/area/${area.slug}`}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 group hover:bg-black/2 -mx-2 px-2 transition-colors duration-100">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                    <span className="text-[13px] text-neutral-600 group-hover:text-[#111] transition-colors duration-100">
                      {area.name}
                    </span>
                  </div>
                  <span className="text-[12px] text-neutral-500 font-mono">
                    {area.lga}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No reports yet (areas with zero user reports) */}
      {unreported.length > 0 && (
        <div>
          <SectionLabel label="No reports yet (no user data)" />
          <div className="flex">
            <div className="w-28 shrink-0 pt-4 text-[12px] text-neutral-500 pr-8">
              Waiting
            </div>
            <div className="flex-1">
              {unreported.map((area) => (
                <Link
                  key={area._id}
                  href={`/area/${area.slug}`}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 group hover:bg-black/2 -mx-2 px-2 transition-colors duration-100">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0" />
                    <span className="text-[13px] text-neutral-600 group-hover:text-[#111] transition-colors duration-100">
                      {area.name}
                    </span>
                  </div>
                  <span className="text-[12px] text-neutral-500 font-mono">
                    {area.lga}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function StatRow({
  label,
  value,
  dot,
}: {
  label: string;
  value: number | string;
  dot: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100">
      <div className="flex items-center gap-2.5">
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${dot}`}
        />
        <span className="text-[13px] text-neutral-500">{label}</span>
      </div>
      <span className="text-[13px] text-neutral-500 font-mono">{value}</span>
    </div>
  );
}

function formatDuration(ms: number): string {
  const mins = Math.floor(ms / 60_000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
}
