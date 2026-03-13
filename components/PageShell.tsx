import Image from "next/image";
import Link from "next/link";
import RightNav from "@/components/RightNav";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#111] flex flex-col">
      <div className="flex flex-1 px-8 md:px-12 py-10 max-w-6xl w-full mx-auto justify-between gap-12">
        <main className="w-full max-w-[540px] min-w-0 pb-24 md:pb-0">
          {children}
        </main>
        <RightNav />
      </div>
      <footer className="hidden md:block px-8 md:px-12 pb-8 max-w-6xl w-full mx-auto">
        <p className="text-center text-[11px] text-neutral-400 tracking-wide">
          Built with glee by hendo
        </p>
      </footer>
    </div>
  );
}

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center mb-10 w-fit opacity-80 hover:opacity-100 transition-opacity duration-200">
      <Image
        src="/Nepawatch.svg"
        alt="Nepawatch"
        width={128}
        height={22}
        priority
      />
    </Link>
  );
}

export function SectionLabel({ label }: { label: string }) {
  return (
    <div className="border-b border-neutral-200 pb-2 mb-0">
      <span className="text-[10px] uppercase tracking-[0.12em] text-neutral-400 font-medium">
        {label}
      </span>
    </div>
  );
}
