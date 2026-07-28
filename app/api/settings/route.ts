import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "active",
    plan: "Free Tier",
    generationsLimit: 10,
    availableModels: ["Genius-v3-Turbo", "Pollinations-Flux", "OpenAI-DALL-E-3", "GPT-4o-Email-Engine"],
    settings: {
      defaultImageStyle: "realistic",
      defaultEmailTone: "professional",
      defaultResumeIndustry: "technology",
      aiProvider: "pollinations",
      theme: "dark",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
      updatedSettings: body,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to process settings update" }, { status: 400 });
  }
}
