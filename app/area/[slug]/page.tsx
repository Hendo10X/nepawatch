"use client";

import { use, Suspense } from "react";
import dynamic from "next/dynamic";
import PageShell, { Logo } from "@/components/PageShell";

const AreaDetail = dynamic(() => import("@/components/AreaDetails"), {
  ssr: false,
});

export default function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <Suspense
      fallback={
        <PageShell>
          <Logo />
          <p className="text-[13px] text-neutral-400">Loading...</p>
        </PageShell>
      }>
      <AreaDetail slug={slug} />
    </Suspense>
  );
}
