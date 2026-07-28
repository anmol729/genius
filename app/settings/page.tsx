"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState("pollinations");
  const [imageStyle, setImageStyle] = useState("realistic");
  const [emailTone, setEmailTone] = useState("professional");
  const [resumeIndustry, setResumeIndustry] = useState("technology");
  const [isPro, setIsPro] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem("genius_api_key") || "";
      const storedProvider = localStorage.getItem("genius_provider") || "pollinations";
      const storedStyle = localStorage.getItem("genius_image_style") || "realistic";
      const storedTone = localStorage.getItem("genius_email_tone") || "professional";
      const storedIndustry = localStorage.getItem("genius_resume_industry") || "technology";
      const storedPro = localStorage.getItem("genius_pro_user") === "true";

      setApiKey(storedKey);
      setProvider(storedProvider);
      setImageStyle(storedStyle);
      setEmailTone(storedTone);
      setResumeIndustry(storedIndustry);
      setIsPro(storedPro);
    } catch {}
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("genius_api_key", apiKey);
      localStorage.setItem("genius_provider", provider);
      localStorage.setItem("genius_image_style", imageStyle);
      localStorage.setItem("genius_email_tone", emailTone);
      localStorage.setItem("genius_resume_industry", resumeIndustry);
      localStorage.setItem("genius_pro_user", isPro ? "true" : "false");

      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 3000);
    } catch {}
  };

  const handleUpgrade = () => {
    const nextState = !isPro;
    setIsPro(nextState);
    localStorage.setItem("genius_pro_user", nextState ? "true" : "false");
    if (nextState) {
      localStorage.setItem("genius_generations_count", "0");
    }
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-white text-slate-900">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-y-auto bg-white px-8 py-10">
        <header className="mb-8 border-b border-slate-100 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827] flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.05.05a2 2 0 1 1-2.83 2.83l-.05-.05A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.34 1.86v.06a2 2 0 1 1-3.28 0v-.06A1.7 1.7 0 0 0 10 20a1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.86.34l-.05.05a2 2 0 1 1-2.83-2.83l.05-.05A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.86-.34H2.08a2 2 0 1 1 0-3.28h.06A1.7 1.7 0 0 0 4 10a1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.86l-.05-.05a2 2 0 1 1 2.83-2.83l.05.05A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .34-1.86v-.06a2 2 0 1 1 3.28 0v.06A1.7 1.7 0 0 0 14 4.6a1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.86-.34l.05-.05a2 2 0 1 1 2.83 2.83l-.05.05A1.7 1.7 0 0 0 19.4 9c.24.3.47.65.6 1 .14.44.14.93 0 1.37-.13.35-.36.7-.6 1Z" />
                </svg>
              </span>
              Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your AI provider, API keys, default tool preferences, and account tier.
            </p>
          </div>

          {savedStatus && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-semibold text-emerald-700">
              ✓ Settings Saved
            </div>
          )}
        </header>

        <form onSubmit={handleSave} className="max-w-3xl space-y-6 pb-12">
          {/* Subscription Box */}
          <section className="rounded-[14px] border border-[#eceff4] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex items-center justify-between gap-4">
            <div>
              <span className="inline-block rounded-md bg-pink-50 px-2.5 py-0.5 text-xs font-semibold text-[#ec4899] mb-2">
                Current Plan
              </span>
              <h2 className="text-lg font-bold text-[#111827]">
                {isPro ? "Genius Pro Unlimited" : "Free Tier (10 Generations)"}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {isPro
                  ? "Unlimited access to all AI image generation, resume analysis, and email drafting tools."
                  : "Free plan includes 10 generations. Upgrade anytime for unlimited access."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleUpgrade}
              className={`rounded-xl px-5 py-2.5 text-xs font-semibold transition ${
                isPro
                  ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  : "bg-gradient-to-r from-[#ec4899] to-[#f97316] text-white hover:opacity-95"
              }`}
            >
              {isPro ? "Downgrade" : "Upgrade Plan"}
            </button>
          </section>

          {/* AI Engines */}
          <section className="rounded-[14px] border border-[#eceff4] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] space-y-4">
            <h2 className="text-sm font-semibold text-[#111827] uppercase tracking-wider">
              AI Engine & API Keys
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                AI Provider
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-[#ec4899] focus:outline-none"
              >
                <option value="pollinations">Pollinations AI (Free - No Key Required)</option>
                <option value="openai">OpenAI (DALL-E & GPT-4o)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Custom OpenAI API Key (Optional)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#ec4899] focus:outline-none"
              />
            </div>
          </section>

          {/* Tool Preferences */}
          <section className="rounded-[14px] border border-[#eceff4] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] space-y-4">
            <h2 className="text-sm font-semibold text-[#111827] uppercase tracking-wider">
              Default Tool Preferences
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Image Style
                </label>
                <select
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#ec4899] focus:outline-none"
                >
                  <option value="realistic">Photorealistic</option>
                  <option value="anime">Anime</option>
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="3d">3D Render</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Email Tone
                </label>
                <select
                  value={emailTone}
                  onChange={(e) => setEmailTone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#ec4899] focus:outline-none"
                >
                  <option value="professional">Professional</option>
                  <option value="persuasive">Persuasive</option>
                  <option value="friendly">Friendly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Target Field
                </label>
                <select
                  value={resumeIndustry}
                  onChange={(e) => setResumeIndustry(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#ec4899] focus:outline-none"
                >
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="rounded-xl bg-[#111827] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
          >
            Save Settings
          </button>
        </form>
      </div>
    </main>
  );
}
