"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";

type AnalysisResult = {
  targetRole: string;
  overallScore: number;
  categories: {
    keywordMatch: { score: number; label: string };
    impactMetrics: { score: number; label: string };
    actionVerbs: { score: number; label: string };
    formattingStructure: { score: number; label: string };
    toneGrammar: { score: number; label: string };
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  bulletPointRewrites: Array<{ original: string; rewritten: string; impact: string }>;
  keyStrengths: string[];
  criticalWeaknesses: string[];
  actionPlan: string[];
};

const SAMPLE_RESUME = `Alex Morgan
Senior Full Stack Engineer | San Francisco, CA | alex@example.com

SUMMARY:
Software Engineer with 6+ years experience in React, Next.js, TypeScript, and Node.js.

EXPERIENCE:
Senior Engineer — TechCorp (2022 - Present)
- Responsible for managing web applications for high volume clients.
- Worked on team projects and fixed software bugs.
- Helped improve website load speeds.

Full Stack Developer — CloudScale (2019 - 2022)
- Built RESTful APIs using Node.js and PostgreSQL.
- Optimized database queries, cutting average response time from 450ms to 120ms.`;

const SAMPLE_JOB = `We are looking for a Senior Full Stack Engineer proficient in Next.js, TypeScript, GraphQL, AWS, and Docker.`;

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [showPasteOption, setShowPasteOption] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "rewrites" | "actionPlan">("overview");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME);
    setJobDescription(SAMPLE_JOB);
    setUploadedFileName("sample_developer_resume.pdf");
    setTargetRole("Senior Full Stack Engineer");
    showToast("Sample resume loaded!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setResumeText(text);
        showToast(`File uploaded: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      showToast("Please upload a resume file or paste text first!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          targetRole,
        }),
      });

      const data = await res.json();
      if (data.overallScore !== undefined) {
        setResult(data);
        const currentCount = parseInt(localStorage.getItem("genius_generations_count") || "0", 10);
        localStorage.setItem("genius_generations_count", String(currentCount + 1));
        showToast("Resume analysis complete!");
      }
    } catch {
      showToast("Error performing analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#fdf2f8]/40 text-slate-900">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-y-auto bg-white px-10 py-10">
        {/* Header */}
        <header className="mb-8 border-b border-pink-100/80 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#111827] flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 shadow-sm">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </span>
              Resume Analyzer
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Audit your resume against ATS requirements, identify missing keywords, and optimize your impact.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLoadSample}
              className="rounded-2xl border border-purple-200 bg-purple-50/60 px-4 py-2.5 text-xs font-bold text-purple-700 hover:bg-purple-100 transition"
            >
              Load Sample Resume
            </button>
            {toastMessage && (
              <div className="rounded-2xl bg-pink-50 border border-pink-200 px-4 py-2 text-xs font-bold text-pink-600 animate-bounce">
                {toastMessage}
              </div>
            )}
          </div>
        </header>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="mb-10 space-y-6">
          {/* Main Large Upload Box & Role Target */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* BIG PROMINENT UPLOAD BOX (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border-2 border-dashed border-pink-300/80 bg-gradient-to-b from-pink-50/30 via-white to-purple-50/20 p-8 shadow-[0_4px_24px_rgba(236,72,153,0.06)] text-center transition hover:border-pink-400">
              <div className="flex flex-col items-center justify-center py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 mb-4 shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800">Upload Your Resume</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Drag and drop your resume file here, or click to browse from your device (.pdf, .docx, .txt).
                </p>

                {uploadedFileName ? (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-pink-100 border border-pink-200 px-4 py-2 text-xs font-bold text-pink-700">
                    📄 {uploadedFileName}
                  </div>
                ) : (
                  <label className="mt-5 cursor-pointer rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-pink-500/20 hover:opacity-95 transition">
                    Browse Resume File
                    <input type="file" accept=".txt,.md,.pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Smaller secondary paste text option toggle */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPasteOption(!showPasteOption)}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition"
                >
                  {showPasteOption ? "▲ Hide Raw Text Editor" : "▼ Or Paste Resume Text Directly"}
                </button>
                {showPasteOption && (
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste resume plain text here..."
                    rows={5}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs font-mono text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:outline-none"
                  />
                )}
              </div>
            </div>

            {/* Target Role & Job Description Inputs (5 Cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Target Role / Job Title
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 mb-4 focus:border-pink-500 focus:outline-none"
                />

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Target Job Description (Optional)
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job posting description here to calculate keyword overlap..."
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs font-mono text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:outline-none"
                />
              </div>

              {/* Styled Grey Button */}
              <button
                type="submit"
                disabled={loading || !resumeText.trim()}
                className="flex h-13 w-full items-center justify-center rounded-2xl bg-slate-500 hover:bg-slate-600 text-sm font-bold text-white shadow-md transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Analyzing ATS Match...
                  </span>
                ) : (
                  "Analyze Resume"
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Results Section - Larger & Roomier Cards */}
        {result && (
          <section className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50/50 to-white p-8 flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-600 mb-2">
                  Overall ATS Score
                </span>
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-pink-200 bg-white text-4xl font-extrabold text-pink-600 shadow-inner">
                  {result.overallScore}%
                </div>
                <p className="mt-4 text-xs font-bold text-slate-800">
                  {result.overallScore >= 80 ? "🎉 Strong ATS Match" : "⚠️ Needs ATS Optimization"}
                </p>
              </div>

              <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Performance Breakdown
                </h3>
                {Object.entries(result.categories).map(([key, cat]) => (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{cat.label}</span>
                      <span className="font-extrabold text-pink-600">{cat.score}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabbed Analysis */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex border-b border-slate-100 gap-6 mb-6">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "keywords", label: "Keywords" },
                  { id: "rewrites", label: "Bullet Rewrites" },
                  { id: "actionPlan", label: "Action Plan" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-3 text-sm font-bold transition-all relative ${
                      activeTab === tab.id
                        ? "text-pink-600 border-b-2 border-pink-500"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "overview" && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50/60 p-5 border border-emerald-100">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
                      ✓ Key Strengths
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700 font-medium">
                      {result.keyStrengths.map((str, idx) => (
                        <li key={idx}>• {str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-rose-50/60 p-5 border border-rose-100">
                    <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3">
                      ⚠️ Areas to Improve
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700 font-medium">
                      {result.criticalWeaknesses.map((wk, idx) => (
                        <li key={idx}>• {wk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "keywords" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
                      Matched Keywords ({result.matchedKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedKeywords.map((kw) => (
                        <span key={kw} className="rounded-2xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-3">
                      Missing Keywords to Add ({result.missingKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((kw) => (
                        <span key={kw} className="rounded-2xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 border border-rose-200">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "rewrites" && (
                <div className="space-y-4">
                  {result.bulletPointRewrites.map((rw, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 space-y-2">
                      <div className="text-xs font-medium text-slate-400 line-through">Original: {rw.original}</div>
                      <div className="text-xs font-bold text-slate-900">Suggested: {rw.rewritten}</div>
                      <div className="text-[11px] text-pink-600 font-bold">Impact: {rw.impact}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "actionPlan" && (
                <div className="space-y-3">
                  {result.actionPlan.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs font-medium text-slate-800">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600 font-bold text-xs">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
