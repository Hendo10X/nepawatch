"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/find", label: "Find your local" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/map", label: "Area map" },
];

export default function RightNav() {
  const pathname = usePathname();
  return (
    <>
      {/* Desktop — right column */}
      <nav className="hidden md:flex flex-col items-end gap-3 pt-1 shrink-0 min-w-[140px]">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-[12px] font-semibold transition-colors duration-150 ${
              pathname === href
                ? "text-[#111]"
                : "text-neutral-400 hover:text-[#111]"
            }`}>
            {label}
          </Link>
        ))}
      </nav>

      {/* Mobile — fixed bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#fafaf8] border-t border-neutral-200">
        <div className="flex items-stretch divide-x divide-neutral-200">
          {links.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-150 ${
                  isActive ? "bg-[#111]" : "hover:bg-neutral-100"
                }`}>
                <span
                  className={`text-[11px] font-semibold tracking-wide leading-tight text-center ${
                    isActive ? "text-[#fafaf8]" : "text-neutral-400"
                  }`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
