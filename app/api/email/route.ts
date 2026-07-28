import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const recipient: string = body.recipient || "Client";
    const purpose: string = body.purpose || "Business Inquiry";
    const tone: string = body.tone || "Professional";
    const length: string = body.length || "Standard";
    const keyPoints: string = body.keyPoints || "";
    const senderName: string = body.senderName || "Alex Morgan";

    if (!purpose.trim()) {
      return NextResponse.json(
        { error: "Email purpose or description is required" },
        { status: 400 }
      );
    }

    // Generate 3 Distinct Subject Lines based on purpose & tone
    const subjectLines = [
      `[${tone}] ${purpose.slice(0, 45)}...`,
      `Quick question regarding ${purpose.split(" ").slice(0, 4).join(" ")}`,
      `Proposal & Next Steps: ${purpose.split(" ").slice(0, 3).join(" ")}`,
    ];

    // Build Email Body
    let greeting = "Dear " + (recipient === "Boss / Manager" ? "Manager" : recipient === "Recruiter / Hiring Manager" ? "Hiring Manager" : "Team");
    if (tone === "Friendly & Warm") greeting = "Hi there,";
    if (tone === "Executive Formal") greeting = "Dear Respected " + recipient + ",";

    let bodyIntro = `I hope this message finds you well. I am writing to you today regarding ${purpose}.`;
    if (tone === "Persuasive") {
      bodyIntro = `I wanted to reach out directly to share an exciting opportunity regarding ${purpose}.`;
    } else if (tone === "Urgent & Direct") {
      bodyIntro = `I am following up urgently concerning ${purpose}.`;
    }

    let pointsSection = "";
    if (keyPoints.trim()) {
      const points = keyPoints.split("\n").filter((p) => p.trim());
      if (points.length > 1) {
        pointsSection = `\n\nKey highlights for your review:\n` + points.map((p) => `• ${p.trim()}`).join("\n");
      } else {
        pointsSection = `\n\nSpecifically, ${keyPoints.trim()}`;
      }
    }

    let cta = "Please let me know your availability for a brief 10-minute call later this week.";
    if (tone === "Urgent & Direct") {
      cta = "Please confirm your response by EOD so we can proceed without delay.";
    } else if (tone === "Friendly & Warm") {
      cta = "Would love to grab a quick virtual coffee to discuss whenever suits you best!";
    }

    const signoff = tone === "Executive Formal" ? "Sincerely,\n" + senderName : tone === "Friendly & Warm" ? "Warm regards,\n" + senderName : "Best regards,\n" + senderName;

    const emailBody = `${greeting}\n\n${bodyIntro}${pointsSection}\n\n${cta}\n\n${signoff}`;

    return NextResponse.json({
      subjectLines,
      emailBody,
      callToAction: cta,
      readTime: length === "Short & Crisp" ? "30 sec read" : length === "Detailed" ? "90 sec read" : "45 sec read",
      metadata: { recipient, tone, length }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate email", details: String(error) },
      { status: 500 }
    );
  }
}
