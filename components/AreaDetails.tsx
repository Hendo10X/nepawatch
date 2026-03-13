"use client";

import { useQuery, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { Logo, SectionLabel } from "@/components/PageShell";
import PageShell from "@/components/PageShell";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const fpPromise = FingerprintJS.load();

async function getFingerprint(): Promise<string> {
  const fp = await fpPromise;
  const result = await fp.get();
  return result.visitorId;
}

export default function AreaDetail({ slug }: { slug: string }) {
  const area = useQuery(api.queries.getAreaBySlug, { slug });
  const status = useQuery(
    api.queries.getAreaStatus,
    area ? { areaId: area._id } : "skip",
  );
  const reports = useQuery(
    api.queries.getAreaReports,
    area ? { areaId: area._id } : "skip",
  );

  const submitReport = useMutation(api.mutations.submitReport);

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    getFingerprint().then(setFingerprint);
  }, []);

  if (area === undefined)
    return (
      <PageShell>
        <Logo />
        <p className="text-[13px] text-neutral-500">Loading...</p>
      </PageShell>
    );

  if (area === null)
    return (
      <PageShell>
        <Logo />
        <p className="text-[13px] text-neutral-500 mb-3">Area not found.</p>
        <Link
          href="/"
          className="text-[12px] text-neutral-500 hover:text-[#111] transition-colors">
          ← Back
        </Link>
      </PageShell>
    );

  const hasLight = status?.hasLight;
  const outageSince = status?.outageSince;
  const duration = outageSince
    ? formatDuration(Date.now() - outageSince)
    : null;
  const monthLabel = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  async function handleReport(type: "outage" | "restored") {
    if (!fingerprint || !area) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const result = await submitReport({
        areaId: area._id,
        type,
        fingerprint,
      });
      if (result.success) {
        setFeedback("Report submitted. Thanks!");
      } else if (result.reason === "cooldown") {
        setFeedback(
          "You already reported this area recently. Try again in 30 mins.",
        );
      }
    } catch {
      setFeedback("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <Logo />

      {/* Area title */}
      <h1 className="text-[15px] font-medium text-[#111] mb-1">{area.name}</h1>
      <p className="text-[13px] text-neutral-500 mb-10">
        {area.lga} · {area.state}
      </p>

      {/* Current status */}
      <div className="mb-10">
        <SectionLabel label="Current status" />
        <div className="flex items-center justify-between py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            {status === undefined || status === null ? (
              <span className="text-[13px] text-neutral-500">
                No reports yet
              </span>
            ) : (
              <>
                <span
                  className={`inline-block w-2 h-2 rounded-full shrink-0 dot-live ${
                    hasLight ? "bg-green-400" : "bg-red-400"
                  }`}
                />
                <span className="text-[13px] text-neutral-600">
                  {hasLight ? "Light available" : "No light"}
                </span>
                {!hasLight && duration && (
                  <span className="text-[13px] text-neutral-500">
                    — out for {duration}
                  </span>
                )}
              </>
            )}
          </div>
          {status?.avgOutageMins ? (
            <span className="text-[12px] text-neutral-500 font-mono">
              avg {Math.round(status.avgOutageMins)}m
            </span>
          ) : null}
        </div>
      </div>

      {/* Report section */}
      <div className="mb-10">
        <SectionLabel label="Submit a report" />
        <div className="flex gap-2.5 pt-4">
          <button
            onClick={() => handleReport("outage")}
            disabled={submitting || !fingerprint}
            className="flex-1 py-2.5 border border-neutral-200 text-[12px] text-neutral-500 hover:border-red-200 hover:text-red-600 hover:bg-red-50/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 tracking-wide">
            No light
          </button>
          <button
            onClick={() => handleReport("restored")}
            disabled={submitting || !fingerprint}
            className="flex-1 py-2.5 border border-neutral-200 text-[12px] text-neutral-500 hover:border-green-200 hover:text-green-700 hover:bg-green-50/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 tracking-wide">
            Light is back
          </button>
        </div>
        {feedback && (
          <p className="mt-3 text-[12px] text-neutral-500">{feedback}</p>
        )}
        <p className="mt-2 text-[11px] text-neutral-400">
          Needs 2 confirmations to update · 1 report per 30 mins
        </p>
      </div>

      {/* Recent reports */}
      {reports && reports.length > 0 && (
        <div>
          <SectionLabel label="Recent reports" />
          <div className="flex">
            <div className="pt-4 pr-8 text-[12px] text-neutral-500 w-28 shrink-0 font-mono">
              {monthLabel}
            </div>
            <div className="flex-1">
              {reports.map((report) => {
                const ts = new Date(report._creationTime);
                const dateStr = `${String(ts.getDate()).padStart(2, "0")}/${String(ts.getMonth() + 1).padStart(2, "0")}`;
                return (
                  <div
                    key={report._id}
                    className="flex items-center justify-between py-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
                          report.type === "outage"
                            ? "bg-red-400"
                            : "bg-green-400"
                        }`}
                      />
                      <span className="text-[13px] text-neutral-600">
                        {report.type === "outage" ? "No light" : "Restored"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[12px] text-neutral-500 font-mono">
                        {report.confirmedCount} confirm
                        {report.confirmedCount !== 1 ? "s" : ""}
                      </span>
                      <span className="text-[12px] text-neutral-500 font-mono">
                        {dateStr}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function formatDuration(ms: number): string {
  const mins = Math.floor(ms / 60_000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
}
