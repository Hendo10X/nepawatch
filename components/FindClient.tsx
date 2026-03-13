"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import PageShell, { Logo, SectionLabel } from "@/components/PageShell";

const COMING_SOON = [
  { name: "Abuja", region: "FCT" },
  { name: "Port Harcourt", region: "Rivers" },
  { name: "Ibadan", region: "Oyo" },
  { name: "Kano", region: "Kano" },
  { name: "Enugu", region: "Enugu" },
  { name: "Benin City", region: "Edo" },
];

export default function FindClient() {
  const areas = useQuery(api.queries.getLiveMap);
  const [query, setQuery] = useState("");

  const filtered = areas
    ? areas.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.lga.toLowerCase().includes(query.toLowerCase()),
      )
    : null;

  const matchedSoon = query
    ? COMING_SOON.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.region.toLowerCase().includes(query.toLowerCase()),
      )
    : COMING_SOON;

  const showSoon = !query || matchedSoon.length > 0;

  const monthLabel = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <PageShell>
      <Logo />

      <h1 className="text-[15px] font-medium text-[#111] mb-1">
        Find your local
      </h1>
      <p className="text-[13px] text-neutral-400 mb-10">
        Select an area to see its current power status and submit a report.
      </p>

      {/* Search input */}
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by area or LGA..."
          className="w-full border-b border-neutral-200 pb-2.5 text-[13px] text-[#111] placeholder:text-neutral-300 outline-none focus:border-neutral-400 transition-colors duration-150 bg-transparent"
        />
      </div>

      {/* Lagos results */}
      <div className="mb-10">
        <SectionLabel label={query ? `Results for "${query}"` : "Lagos"} />

        {filtered === null ? (
          <div className="py-5 text-[12px] text-neutral-300 tracking-wide">
            Loading...
          </div>
        ) : filtered.length === 0 && query ? null : filtered !== null &&
          filtered.length === 0 ? (
          <div className="py-5 text-[13px] text-neutral-400">
            No areas found.
          </div>
        ) : (
          <div className="flex">
            <div className="w-28 shrink-0 pt-4 text-[12px] text-neutral-400 pr-8 font-mono">
              {monthLabel}
            </div>
            <div className="flex-1">
              {filtered?.map((area) => {
                const hasLight = area.status?.hasLight;
                const noData = area.status === null;
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
                          noData
                            ? "bg-neutral-200"
                            : hasLight
                              ? "bg-green-400"
                              : "bg-red-400"
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

      {/* Coming soon — other Nigerian cities */}
      {showSoon && (
        <div>
          <SectionLabel label="Coming to Nigeria" />
          <div className="flex">
            <div className="w-28 shrink-0 pt-4 text-[12px] text-neutral-400 pr-8">
              Soon
            </div>
            <div className="flex-1">
              {matchedSoon.map((city) => (
                <div
                  key={city.name}
                  className="flex items-center justify-between py-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0 bg-neutral-200" />
                    <span className="text-[13px] text-neutral-400">
                      {city.name}
                    </span>
                    <span className="text-[11px] text-neutral-300">
                      · {city.region}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-300 font-medium">
                    Soon
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
