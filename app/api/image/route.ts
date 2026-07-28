import { NextResponse } from "next/server";

function getDimensions(size: string): { width: number; height: number } {
  switch (size) {
    case "16:9":
    case "1280x720":
      return { width: 1280, height: 720 };
    case "9:16":
    case "720x1280":
      return { width: 720, height: 1280 };
    case "4:3":
    case "1024x768":
      return { width: 1024, height: 768 };
    case "1:1":
    case "1024x1024":
    default:
      return { width: 1024, height: 1024 };
  }
}

function createFallbackSvg({
  prompt,
  style,
  size,
  seed,
}: {
  prompt: string;
  style: string;
  size: string;
  seed: number;
}) {
  const safePrompt = prompt.slice(0, 60).replace(/[<>&"]/g, "");
  const palettes = [
    ["#0f172a", "#ec4899", "#8b5cf6"],
    ["#0284c7", "#6366f1", "#1e1b4b"],
    ["#059669", "#10b981", "#064e3b"],
    ["#d97706", "#f59e0b", "#451a03"],
  ];
  const palette = palettes[seed % palettes.length];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <defs>
        <linearGradient id="bg-${seed}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${palette[0]}" />
          <stop offset="50%" stop-color="${palette[1]}" />
          <stop offset="100%" stop-color="${palette[2]}" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="30" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect width="1024" height="1024" rx="36" fill="url(#bg-${seed})" />
      <circle cx="${300 + (seed * 110) % 400}" cy="${300 + (seed * 90) % 400}" r="260" fill="rgba(255,255,255,0.15)" filter="url(#glow)" />
      <circle cx="${700 - (seed * 80) % 300}" cy="${700 - (seed * 100) % 300}" r="200" fill="rgba(255,255,255,0.1)" />
      <rect x="60" y="60" width="904" height="904" rx="28" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="4" />
      <text x="100" y="200" fill="#ffffff" font-family="system-ui, sans-serif" font-size="52" font-weight="800">Genius AI Art</text>
      <text x="100" y="280" fill="rgba(255,255,255,0.9)" font-family="system-ui, sans-serif" font-size="32" font-weight="600">"${safePrompt}"</text>
      <text x="100" y="360" fill="rgba(255,255,255,0.75)" font-family="system-ui, sans-serif" font-size="24">Style: ${style} | Size: ${size}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      prompt?: string;
      style?: string;
      size?: string;
      numberOfImages?: number;
      negativePrompt?: string;
    };

    const promptText = (body.prompt || "A futuristic cyberpunk city glowing in twilight").trim();
    const style = body.style || "photorealistic";
    const size = body.size || "1024x1024";
    const numberOfImages = Math.min(Math.max(Number(body.numberOfImages ?? 1), 1), 4);
    const { width, height } = getDimensions(size);

    const images = Array.from({ length: numberOfImages }).map((_, index) => {
      const seed = Math.floor(Math.random() * 100000) + index * 42;
      const styledPrompt = `${promptText}, ${style} style, ultra detailed 8k high quality`;
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        styledPrompt
      )}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

      // Fallback SVG if pollinations is offline or disabled
      const fallbackUrl = createFallbackSvg({
        prompt: promptText,
        style,
        size,
        seed,
      });

      return {
        id: crypto.randomUUID(),
        url: pollinationsUrl,
        fallbackUrl,
        prompt: promptText,
        style,
        size,
        seed,
      };
    });

    return NextResponse.json({
      prompt: promptText,
      style,
      size,
      images,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate images", details: String(error) },
      { status: 500 }
    );
  }
}
