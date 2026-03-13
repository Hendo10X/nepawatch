"use client";
import dynamic from "next/dynamic";
import { Logo, SectionLabel } from "@/components/PageShell";
import RightNav from "@/components/RightNav";

const LiveMap = dynamic(() => import("@/components/Livemap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
      <p className="text-[12px] text-neutral-400 tracking-wide uppercase">
        Loading map...
      </p>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#111] flex flex-col">
      {/* Header row */}
      <div className="flex justify-between px-8 md:px-12 pt-10 pb-6 max-w-6xl w-full mx-auto gap-12">
        <div className="min-w-0">
          <Logo />
          <h1 className="text-[15px] font-medium mb-1">Area map</h1>
          <p className="text-[13px] text-neutral-400">
            Live power status across Lagos.
          </p>
        </div>
        <RightNav />
      </div>

      {/* Legend + map */}
      <div className="px-8 md:px-12 pb-24 md:pb-10 max-w-6xl w-full mx-auto flex-1 flex flex-col gap-4">
        {/* Legend */}
        <div className="flex items-center gap-6">
          <SectionLabel label="Legend" />
          <div className="flex items-center gap-5 ml-1">
            <LegendItem dot="bg-red-400" label="No light" />
            <LegendItem dot="bg-green-400" label="Light available" />
            <LegendItem dot="bg-neutral-300" label="No reports" />
          </div>
          <span className="ml-auto text-[11px] text-neutral-400 tracking-wide">
            Tap any pin to report
          </span>
        </div>

        {/* Map */}
        <div className="w-full flex-1 min-h-[480px] border border-neutral-200 overflow-hidden rounded-sm">
          <LiveMap />
        </div>
      </div>

      <footer className="px-8 md:px-12 pb-8 max-w-6xl w-full mx-auto">
        <p className="text-center text-[11px] text-neutral-400 tracking-wide">
          Built with glee by hendo
        </p>
      </footer>
    </div>
  );
}

function LegendItem({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${dot}`} />
      <span className="text-[12px] text-neutral-500">{label}</span>
    </div>
  );
}
