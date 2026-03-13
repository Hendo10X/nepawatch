import LiveUpdates from "@/components/LiveUpdates";
import PageShell, { Logo } from "@/components/PageShell";

export default function HomePage() {
  return (
    <PageShell>
      <Logo />
      <p className="text-[14px] leading-[1.75] text-[#111] mb-14 max-w-[460px]">
        Nepawatch is a real-time power outage tracking app for Nigerian
        communities. It lets anyone instantly check whether their area currently
        has electricity — no sign-up, no WhatsApp group to join, no asking
        around.
      </p>
      <LiveUpdates />
    </PageShell>
  );
}
