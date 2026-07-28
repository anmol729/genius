"use client";

import Link from "next/link";
import { Sidebar } from "@/components/sidebar";

type ModuleItem = {
  title: string;
  href: string;
  icon: "image" | "resume" | "mail" | "settings";
  color: string;
  bgColor: string;
};

const modules: ModuleItem[] = [
  {
    title: "Image Generation",
    href: "/image-generator",
    icon: "image",
    color: "#ec4899",
    bgColor: "#fdf2f8",
  },
  {
    title: "Resume Analyzer",
    href: "/resume-analyzer",
    icon: "resume",
    color: "#8b5cf6",
    bgColor: "#f5f3ff",
  },
  {
    title: "Email Generator",
    href: "/email-generator",
    icon: "mail",
    color: "#f97316",
    bgColor: "#fff7ed",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "settings",
    color: "#64748b",
    bgColor: "#f8fafc",
  },
];

function CardIcon({ type, color }: { type: ModuleItem["icon"]; color: string }) {
  const common = { className: "h-6 w-6", fill: "none", stroke: color, strokeWidth: 2 };

  if (type === "image") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    );
  }

  if (type === "resume") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  }

  if (type === "mail") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" {...common}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.05.05a2 2 0 1 1-2.83 2.83l-.05-.05A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.34 1.86v.06a2 2 0 1 1-3.28 0v-.06A1.7 1.7 0 0 0 10 20a1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.86.34l-.05.05a2 2 0 1 1-2.83-2.83l.05-.05A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.86-.34H2.08a2 2 0 1 1 0-3.28h.06A1.7 1.7 0 0 0 4 10a1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.86l-.05-.05a2 2 0 1 1 2.83-2.83l.05.05A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .34-1.86v-.06a2 2 0 1 1 3.28 0v.06A1.7 1.7 0 0 0 14 4.6a1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.86-.34l.05-.05a2 2 0 1 1 2.83 2.83l-.05.05A1.7 1.7 0 0 0 19.4 9c.24.3.47.65.6 1 .14.44.14.93 0 1.37-.13.35-.36.7-.6 1Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="flex h-screen w-full overflow-hidden bg-white text-slate-900">
      <Sidebar />

      <section className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-gradient-to-b from-white via-pink-50/20 to-white px-8 py-12">
        <div className="w-full max-w-[760px] text-center">
          <h1 className="text-[44px] font-extrabold tracking-tight text-[#111827] sm:text-[48px]">
            Explore the power of AI
          </h1>
          <p className="mx-auto mt-3 max-w-[580px] text-[15px] leading-relaxed text-[#6b7280]">
            Genius is a simple workspace for image generation, resume analysis, and email creation.
          </p>
        </div>

        <div className="mt-10 w-full max-w-[760px] space-y-4">
          {modules.map((mod) => (
            <Link
              key={mod.title}
              href={mod.href}
              className="group flex items-center justify-between rounded-2xl border border-[#eceff4] bg-white px-7 py-5.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:border-pink-300/80 hover:shadow-[0_12px_30px_rgba(244,114,182,0.12)]"
            >
              <div className="flex items-center gap-4.5">
                <div
                  className="flex h-13 w-13 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-105"
                  style={{ backgroundColor: mod.bgColor }}
                >
                  <CardIcon type={mod.icon} color={mod.color} />
                </div>
                <span className="text-[17px] font-bold text-[#111827]">
                  {mod.title}
                </span>
              </div>
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-[#111827] transition-transform duration-200 group-hover:translate-x-1.5 group-hover:text-pink-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m10 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}