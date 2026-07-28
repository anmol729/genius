"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";

type SavedEmail = {
  id: string;
  subject: string;
  body: string;
  recipient: string;
  tone: string;
  timestamp: string;
};

const RECIPIENTS = ["Client", "Boss / Manager", "Team Member", "Recruiter", "Customer"];
const TONES = ["Professional", "Persuasive", "Friendly & Warm", "Executive Formal", "Urgent & Direct"];
const LENGTHS = ["Short & Crisp", "Standard", "Detailed"];

export default function EmailGeneratorPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("Client");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Standard");
  const [keyPoints, setKeyPoints] = useState("");
  const [senderName, setSenderName] = useState("Alex Morgan");

  const [loading, setLoading] = useState(false);
  const [subjectLines, setSubjectLines] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [readTime, setReadTime] = useState("");
  const [history, setHistory] = useState<SavedEmail[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("genius_email_history");
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose,
          recipient,
          tone,
          length,
          keyPoints,
          senderName,
        }),
      });

      const data = await res.json();
      if (data.emailBody) {
        setSubjectLines(data.subjectLines || []);
        setSelectedSubject(data.subjectLines?.[0] || "No Subject");
        setEmailBody(data.emailBody);
        setReadTime(data.readTime || "45 sec read");

        const newEntry: SavedEmail = {
          id: crypto.randomUUID(),
          subject: data.subjectLines?.[0] || purpose.slice(0, 30),
          body: data.emailBody,
          recipient,
          tone,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        const updated = [newEntry, ...history].slice(0, 15);
        setHistory(updated);
        localStorage.setItem("genius_email_history", JSON.stringify(updated));

        const currentCount = parseInt(localStorage.getItem("genius_generations_count") || "0", 10);
        localStorage.setItem("genius_generations_count", String(currentCount + 1));
        showToast("Email draft generated!");
      }
    } catch {
      showToast("Error generating email.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied!`);
  };

  const handleDownload = () => {
    const fullText = `Subject: ${selectedSubject}\n\n${emailBody}`;
    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email-${selectedSubject.slice(0, 20).replace(/[^a-zA-Z0-9]/g, "-")}.txt`;
    a.click();
    showToast("Downloaded .txt!");
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#fdf2f8]/40 text-slate-900">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-y-auto bg-white px-10 py-10">
        {/* Header */}
        <header className="mb-8 border-b border-pink-100/80 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#111827] flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              Email Generator
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Draft professional sales emails, client follow-ups, and executive communications.
            </p>
          </div>

          {toastMessage && (
            <div className="rounded-xl bg-pink-50 border border-pink-200 px-4 py-2 text-xs font-bold text-pink-600 animate-bounce">
              {toastMessage}
            </div>
          )}
        </header>

        {/* Layout: Grid with Controls (5 cols) & Email Output (7 cols) */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* BIGGER & ROOMIER FORM CARD (5 Cols) */}
          <form onSubmit={handleGenerate} className="lg:col-span-5 rounded-2xl border border-pink-200/80 bg-gradient-to-b from-white via-pink-50/20 to-white p-8 shadow-[0_4px_24px_rgba(244,114,182,0.08)] space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Email Purpose / Goal
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Cold outreach to e-commerce brands offering web design services..."
                rows={4}
                className="w-full rounded-2xl border border-pink-200/80 bg-white p-4 text-sm text-slate-900 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Recipient
                </label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full rounded-2xl border border-pink-200/80 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition"
                >
                  {RECIPIENTS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-2xl border border-pink-200/80 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition"
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full rounded-2xl border border-pink-200/80 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition"
                >
                  {LENGTHS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Sender Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full rounded-2xl border border-pink-200/80 bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Key Points (Optional)
              </label>
              <textarea
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="• Free website performance audit&#10;• 20% conversion boost guarantee"
                rows={3}
                className="w-full rounded-2xl border border-pink-200/80 bg-white p-4 text-sm text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !purpose.trim()}
              className="flex h-13 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 text-base font-bold text-white shadow-lg shadow-pink-500/25 transition-all hover:opacity-95 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating Email...
                </span>
              ) : (
                "Generate Email"
              )}
            </button>
          </form>

          {/* EMAIL OUTPUT CARD (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {emailBody ? (
              <div className="rounded-2xl border border-pink-100 bg-white shadow-[0_4px_24px_rgba(244,114,182,0.06)] overflow-hidden flex flex-col min-h-[580px]">
                {/* Subject Selector Bar */}
                {subjectLines.length > 0 && (
                  <div className="border-b border-slate-100 bg-pink-50/40 p-5 space-y-2.5">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Subject Line Options (Click to Select)
                    </span>
                    <div className="space-y-2">
                      {subjectLines.map((subj, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedSubject(subj)}
                          className={`flex items-center justify-between cursor-pointer rounded-2xl px-4 py-3 text-xs transition border ${
                            selectedSubject === subj
                              ? "bg-white border-pink-300 font-bold text-pink-700 shadow-sm"
                              : "border-transparent text-slate-600 hover:bg-white/80"
                          }`}
                        >
                          <span className="truncate pr-2 font-medium">{subj}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(subj, "Subject Line");
                            }}
                            className="text-[11px] font-bold text-pink-600 hover:text-pink-800 shrink-0"
                          >
                            Copy
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Large Email Body */}
                <div className="p-8 space-y-5 bg-white flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 text-xs text-slate-500">
                    <div>
                      <span className="font-bold text-slate-800">To:</span> {recipient}
                    </div>
                    <span className="font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                      ⏱️ {readTime}
                    </span>
                  </div>

                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={14}
                    className="w-full flex-1 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-800 font-sans focus:border-pink-500 focus:outline-none"
                  />

                  <div className="flex items-center justify-between pt-3">
                    <button
                      onClick={() => handleCopy(`Subject: ${selectedSubject}\n\n${emailBody}`, "Full Email")}
                      className="rounded-2xl bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 px-7 py-3.5 text-xs font-bold text-white hover:opacity-95 shadow-md shadow-pink-500/20 transition"
                    >
                      Copy Full Email
                    </button>
                    <button
                      onClick={handleDownload}
                      className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Download .txt
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-pink-200 bg-pink-50/20 p-20 text-center h-full min-h-[500px]">
                <span className="text-5xl mb-3">✉️</span>
                <p className="text-base font-bold text-slate-800">No Email Draft Generated Yet</p>
                <p className="text-xs text-slate-500 mt-1">Enter your prompt on the left and click Generate Email.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
