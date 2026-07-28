"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { ImageGrid } from "@/components/image-generator/image-grid";
import { LoadingSkeleton } from "@/components/image-generator/loading-skeleton";
import { GeneratedImage } from "@/components/image-generator/image-card";

const STYLES = [
  { id: "photorealistic", name: "Photorealistic" },
  { id: "anime", name: "Anime / Manga" },
  { id: "cyberpunk", name: "Cyberpunk" },
  { id: "3d", name: "3D Render" },
  { id: "fantasy", name: "Fantasy Art" },
  { id: "cinematic", name: "Cinematic" },
];

const RATIOS = [
  { id: "1:1", label: "1:1 Square (1024x1024)" },
  { id: "16:9", label: "16:9 Landscape (1280x720)" },
  { id: "9:16", label: "9:16 Portrait (720x1280)" },
  { id: "4:3", label: "4:3 Standard (1024x768)" },
];

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("photorealistic");
  const [ratio, setRatio] = useState("1:1");
  const [count, setCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("genius_image_history");
      if (stored) setImages(JSON.parse(stored));
    } catch {}
  }, []);

  const saveHistory = (newImages: GeneratedImage[]) => {
    try {
      const updated = [...newImages, ...images].slice(0, 24);
      setImages(updated);
      localStorage.setItem("genius_image_history", JSON.stringify(updated));
    } catch {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style,
          size: ratio,
          numberOfImages: count,
        }),
      });

      const data = await res.json();

      if (data.images && Array.isArray(data.images)) {
        saveHistory(data.images);
        const currentCount = parseInt(localStorage.getItem("genius_generations_count") || "0", 10);
        localStorage.setItem("genius_generations_count", String(currentCount + 1));
        showToast("Images generated successfully!");
      }
    } catch {
      showToast("Error generating image.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const link = document.createElement("a");
      link.href = image.url;
      link.download = `genius-image-${image.id.slice(0, 6)}.png`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Download started!");
    } catch {
      window.open(image.url, "_blank");
    }
  };

  const handleCopyPrompt = (image: GeneratedImage) => {
    navigator.clipboard.writeText(image.prompt);
    showToast("Prompt copied!");
  };

  const handleDelete = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    setImages(updated);
    localStorage.setItem("genius_image_history", JSON.stringify(updated));
    showToast("Image removed!");
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#fdf2f8]/40 text-slate-900">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-y-auto bg-white px-10 py-10">
        {/* Top Header */}
        <header className="mb-8 border-b border-pink-100/80 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#111827] flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 shadow-sm">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </span>
              Image Generation
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Turn text prompts into stunning high-resolution AI artwork and photorealistic images.
            </p>
          </div>

          {toastMessage && (
            <div className="rounded-2xl bg-pink-50 border border-pink-200 px-4 py-2 text-xs font-bold text-pink-600 animate-bounce">
              {toastMessage}
            </div>
          )}
        </header>

        {/* Input Form Card - Larger size & Light Pink Accent */}
        <form onSubmit={handleGenerate} className="mb-10 rounded-2xl border border-pink-200/80 bg-gradient-to-b from-white via-pink-50/20 to-white p-8 shadow-[0_4px_24px_rgba(244,114,182,0.08)] space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Prompt Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create... (e.g. A cute cat sitting on a neon rooftop)"
              rows={4}
              className="w-full rounded-2xl border border-pink-200/80 bg-white p-5 text-sm text-slate-900 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition"
            />
          </div>

          {/* Options */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-2xl border border-pink-200/80 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition"
              >
                {STYLES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Aspect Ratio
              </label>
              <select
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
                className="w-full rounded-2xl border border-pink-200/80 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition"
              >
                {RATIOS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Variations
              </label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full rounded-2xl border border-pink-200/80 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition"
              >
                <option value={1}>1 Image</option>
                <option value={2}>2 Images</option>
                <option value={3}>3 Images</option>
                <option value={4}>4 Images</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="flex h-13 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 text-base font-bold text-white shadow-lg shadow-pink-500/25 transition-all hover:opacity-95 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating Images...
              </span>
            ) : (
              "Generate Images"
            )}
          </button>
        </form>

        {/* Gallery */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <h2 className="text-lg font-bold text-[#111827]">
              Generated Images {images.length > 0 && `(${images.length})`}
            </h2>
            {images.length > 0 && (
              <button
                onClick={() => {
                  setImages([]);
                  localStorage.removeItem("genius_image_history");
                  showToast("History cleared!");
                }}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition"
              >
                Clear History
              </button>
            )}
          </div>

          {loading ? (
            <LoadingSkeleton count={count} />
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-pink-200/80 bg-pink-50/30 p-16 text-center">
              <span className="text-5xl mb-3">🖼️</span>
              <p className="text-base font-semibold text-slate-800">No images generated yet</p>
              <p className="text-xs text-slate-500 mt-1">Enter a prompt above and click Generate.</p>
            </div>
          ) : (
            <ImageGrid
              images={images}
              onDownload={handleDownload}
              onCopyPrompt={handleCopyPrompt}
              onPreview={(img) => setPreviewImage(img)}
              onDelete={handleDelete}
            />
          )}
        </section>
      </div>

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-6 backdrop-blur-sm">
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col border border-pink-100">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <span className="text-sm font-bold text-slate-800 capitalize">
                {previewImage.style} Style
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden bg-slate-50 flex items-center justify-center p-4">
              <img
                src={previewImage.url}
                alt={previewImage.prompt}
                className="max-h-[65vh] w-auto rounded-lg object-contain"
              />
            </div>
            <div className="p-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-slate-600 max-w-lg">{previewImage.prompt}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCopyPrompt(previewImage)}
                  className="rounded-2xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Copy Prompt
                </button>
                <button
                  onClick={() => handleDownload(previewImage)}
                  className="rounded-2xl bg-pink-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-pink-600 shadow-md shadow-pink-500/20"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
