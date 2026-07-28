"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export type NavItem = {
  label: string;
  href: string;
  icon: "dashboard" | "image" | "resume" | "mail" | "settings";
  color: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "dashboard", color: "#22d3ee" },
  { label: "Image Generation", href: "/image-generator", icon: "image", color: "#ec4899" },
  { label: "Resume Analyzer", href: "/resume-analyzer", icon: "resume", color: "#8b5cf6" },
  { label: "Email Generator", href: "/email-generator", icon: "mail", color: "#f97316" },
  { label: "Settings", href: "/settings", icon: "settings", color: "#94a3b8" },
];

function AppLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#ec4899]" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M7.5 18.5 12 4l4.5 14.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 8.5h16" strokeLinecap="round" />
      <path d="M6.5 14h11" strokeLinecap="round" />
    </svg>
  );
}

function NavIcon({ type, color }: { type: NavItem["icon"]; color: string }) {
  const common = { className: "h-4 w-4", fill: "none", stroke: color, strokeWidth: 2 };

  if (type === "image") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="m7 15 3-3 3 3 4-4 2 2" />
        <circle cx="10" cy="9" r="1.5" />
      </svg>
    );
  }

  if (type === "resume") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M8 3h8l4 4v14H8z" />
        <path d="M12 11v6" />
        <path d="M9 14h6" />
      </svg>
    );
  }

  if (type === "mail") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  if (type === "settings") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.05.05a2 2 0 1 1-2.83 2.83l-.05-.05A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.34 1.86v.06a2 2 0 1 1-3.28 0v-.06A1.7 1.7 0 0 0 10 20a1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.86.34l-.05.05a2 2 0 1 1-2.83-2.83l.05-.05A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.86-.34H2.08a2 2 0 1 1 0-3.28h.06A1.7 1.7 0 0 0 4 10a1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.86l-.05-.05a2 2 0 1 1 2.83-2.83l.05.05A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .34-1.86v-.06a2 2 0 1 1 3.28 0v.06A1.7 1.7 0 0 0 14 4.6a1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.86-.34l.05-.05a2 2 0 1 1 2.83 2.83l-.05.05A1.7 1.7 0 0 0 19.4 9c.24.3.47.65.6 1 .14.44.14.93 0 1.37-.13.35-.36.7-.6 1Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M4 12h16" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [generationsUsed, setGenerationsUsed] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("genius_generations_count");
      if (stored) {
        setGenerationsUsed(parseInt(stored, 10));
      }
    } catch {}
  }, []);

  return (
    <aside className="flex h-full w-[240px] flex-col bg-[#0b1220] px-4 py-6 text-white shrink-0">
      {/* Title & Logo Header with Proper Spacing - ONLY "Genius" */}
      <div className="flex items-center gap-3 px-2 pt-2 pb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
          <AppLogo />
        </div>
        <span className="text-[22px] font-bold tracking-tight text-white">Genius</span>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 flex-1 space-y-2 text-[15px] font-medium text-[#9ca3af]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3.5 rounded-[12px] px-3.5 py-3 transition ${
                isActive
                  ? "bg-[#111827] text-white font-semibold"
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0f1724]">
                <NavIcon type={item.icon} color={item.color} />
              </div>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Box */}
      <div className="mt-auto px-1 pb-1">
        <div className="rounded-xl bg-[#0f1724] p-4 text-center text-white">
          <p className="text-[13px] font-medium text-[#e5e7eb]">
            {generationsUsed} / 10 Free Generations
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[#ec4899] to-[#f97316] transition-all duration-300"
              style={{ width: `${Math.min((generationsUsed / 10) * 100, 100)}%` }}
            />
          </div>
          <Link
            href="/settings"
            className="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#ec4899] to-[#f97316] text-xs font-semibold text-white transition hover:opacity-95"
          >
            Upgrade
          </Link>
        </div>
      </div>
    </aside>
  );
}
