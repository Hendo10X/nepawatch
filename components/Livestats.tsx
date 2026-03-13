"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function LiveStats() {
  const stats = useQuery(api.queries.getDashboardStats);

  return (
    <div className="flex items-center gap-4">
      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
      <Stat
        label="DARK"
        value={stats?.darkCount ?? "—"}
        className="text-red-500"
      />
      <div className="w-px h-3.5 bg-neutral-700" />
      <Stat
        label="LIGHT"
        value={stats?.lightCount ?? "—"}
        className="text-green-500"
      />
    </div>
  );
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: number | string;
  className: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[11px] text-neutral-500">{label}</span>
      <span className={`font-mono text-[13px] font-semibold ${className}`}>
        {value}
      </span>
    </div>
  );
}
