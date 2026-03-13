"use client";

import { Logo } from "@/components/PageShell";
import RightNav from "@/components/RightNav";

export default function MapPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#111] flex flex-col">
      {/* Header row */}
      <div className="flex justify-between px-8 md:px-12 pt-8 pb-4 md:pt-10 md:pb-5 max-w-6xl w-full mx-auto gap-12">
        <div className="min-w-0">
          <Logo />
          <h1 className="text-[15px] font-medium mb-1">Area map</h1>
          <p className="text-[13px] text-neutral-500">
            A live, zoomable map of power across Nigeria.
          </p>
        </div>
        <RightNav />
      </div>

      {/* Coming soon content */}
      <div className="px-8 md:px-12 pb-12 md:pb-8 max-w-6xl w-full mx-auto flex-1 flex items-start md:items-center">
        <div className="w-full border border-dashed border-neutral-300 bg-white/60 px-6 py-6 md:px-10 md:py-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500 mb-2">
              Area map
            </p>
            <h2 className="text-[18px] md:text-[20px] font-medium text-[#111] mb-3">
              Coming soon to the grid
            </h2>
            <p className="text-[13px] text-neutral-500 max-w-md">
              We&apos;re building a live map that lets you see every outage and
              restoration across Nigeria at a glance. You&apos;ll be able to
              zoom into your street and watch updates roll in, powered entirely
              by reports from people like you.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-[12px] text-neutral-500 md:w-56">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-300" />
              Live pins for every area
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-300" />
              Outage history and patterns
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-300" />
              Built from real user reports
            </span>
            <span className="mt-3 text-[11px] uppercase tracking-[0.14em] text-neutral-500">
              Map view · Coming soon
            </span>
          </div>
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
