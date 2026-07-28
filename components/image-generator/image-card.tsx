"use client";

import { useState } from "react";

export type GeneratedImage = {
  id: string;
  url: string;
  fallbackUrl?: string;
  prompt: string;
  style: string;
  size: string;
  seed?: number;
};

export function ImageCard({
  image,
  onDownload,
  onCopyPrompt,
  onPreview,
  onDelete,
}: {
  image: GeneratedImage;
  onDownload: (image: GeneratedImage) => void;
  onCopyPrompt: (image: GeneratedImage) => void;
  onPreview: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
}) {
  const [imgSrc, setImgSrc] = useState(image.url);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyPrompt(image);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleError = () => {
    if (image.fallbackUrl && imgSrc !== image.fallbackUrl) {
      setImgSrc(image.fallbackUrl);
    }
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[1px] hover:border-slate-300 hover:shadow-[0_10px_25px_rgba(15,23,42,0.08)]">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={imgSrc}
          alt={image.prompt}
          onError={handleError}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between bg-slate-900/40 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 backdrop-blur-[2px]">
          <div className="flex justify-end">
            <button
              onClick={() => onDelete(image.id)}
              title="Delete"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => onPreview(image)}
              className="flex h-8 items-center gap-1 rounded-lg bg-white px-3 text-xs font-semibold text-slate-800 hover:bg-slate-100 shadow-sm transition-colors"
            >
              Preview
            </button>
            <button
              onClick={() => onDownload(image)}
              className="flex h-8 items-center gap-1 rounded-lg bg-[#ec4899] px-3 text-xs font-semibold text-white hover:bg-[#db2777] shadow-sm transition-colors"
            >
              ⭳ Download
            </button>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="flex flex-col p-3.5 bg-white">
        <p className="line-clamp-2 text-xs font-medium text-slate-700 leading-snug" title={image.prompt}>
          {image.prompt}
        </p>

        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <span className="capitalize font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded">
            {image.style}
          </span>

          <button
            onClick={handleCopy}
            className="font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            {copied ? "✓ Copied" : "📋 Copy Prompt"}
          </button>
        </div>
      </div>
    </article>
  );
}
