"use client";

import { ImageCard, type GeneratedImage } from "./image-card";

export function ImageGrid({
  images,
  onDownload,
  onCopyPrompt,
  onPreview,
  onDelete,
}: {
  images: GeneratedImage[];
  onDownload: (image: GeneratedImage) => void;
  onCopyPrompt: (image: GeneratedImage) => void;
  onPreview: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
}) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onDownload={onDownload}
          onCopyPrompt={onCopyPrompt}
          onPreview={onPreview}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
