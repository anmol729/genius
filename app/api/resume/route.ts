import { NextResponse } from "next/server";

const COMMON_TECH_KEYWORDS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Python",
  "API", "REST", "GraphQL", "TailwindCSS", "SQL", "PostgreSQL", "MongoDB",
  "AWS", "Docker", "Git", "CI/CD", "Agile", "Scrum", "UI/UX", "System Architecture",
  "Performance Optimization", "Automated Testing", "Redux", "Express"
];

const ACTION_VERBS = [
  "Spearheaded", "Engineered", "Optimized", "Architected", "Pioneered",
  "Streamlined", "Accelerated", "Implemented", "Orchestrated", "Transformed"
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resumeText: string = body.resumeText || "";
    const jobDescription: string = body.jobDescription || "";
    const targetRole: string = body.targetRole || "Software Engineer";

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: "Resume text or content is required for analysis" },
        { status: 400 }
      );
    }

    const lowerResume = resumeText.toLowerCase();
    const lowerJob = jobDescription.toLowerCase();

    // Find matched keywords
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    COMMON_TECH_KEYWORDS.forEach((kw) => {
      const isPresentInResume = lowerResume.includes(kw.toLowerCase());
      const isRequiredInJob = lowerJob ? lowerJob.includes(kw.toLowerCase()) : true;

      if (isPresentInResume) {
        matchedKeywords.push(kw);
      } else if (isRequiredInJob) {
        missingKeywords.push(kw);
      }
    });

    // Count action verbs & numbers/metrics
    const numbersCount = (resumeText.match(/\d+%/g) || []).length + (resumeText.match(/\$\d+/g) || []).length + (resumeText.match(/\b\d+\b/g) || []).length;
    const actionVerbMatches = ACTION_VERBS.filter((v) => lowerResume.includes(v.toLowerCase()));

    // Calculate Scores dynamically
    const keywordScore = Math.min(Math.round((matchedKeywords.length / (matchedKeywords.length + missingKeywords.length || 1)) * 100), 98);
    const impactScore = Math.min(65 + Math.min(numbersCount * 6, 30), 96);
    const formattingScore = resumeText.length > 200 ? 88 : 60;
    const toneScore = actionVerbMatches.length > 2 ? 92 : 74;
    const actionVerbScore = Math.min(70 + actionVerbMatches.length * 7, 95);

    const overallScore = Math.round(
      (keywordScore * 0.35 + impactScore * 0.25 + formattingScore * 0.15 + toneScore * 0.15 + actionVerbScore * 0.1)
    );

    // Bullet point rewrite suggestions
    const bulletPointRewrites = [
      {
        original: "Responsible for managing and maintaining web applications.",
        rewritten: "Engineered and maintained high-traffic web applications using Next.js and TypeScript, reducing downtime by 40%.",
        impact: "Added strong action verb, tech stack tags, and quantifiable result."
      },
      {
        original: "Worked on team projects and fixed software bugs.",
        rewritten: "Collaborated with cross-functional teams in Agile sprints to resolve 50+ critical API bugs, improving system reliability by 25%.",
        impact: "Quantified throughput and highlighted teamwork."
      },
      {
        original: "Helped improve website load speeds.",
        rewritten: "Pioneered frontend asset optimization and code-splitting, slashing initial page load latency from 3.2s to 0.9s.",
        impact: "Replaced passive phrasing with specific performance metrics."
      }
    ];

    const keyStrengths = [
      `Strong technical terminology overlap (${matchedKeywords.length} core keywords identified).`,
      actionVerbMatches.length > 0 ? `Good usage of strong action verbs like ${actionVerbMatches.slice(0, 3).join(", ")}.` : "Clean and legible section formatting.",
      numbersCount > 2 ? "Includes quantitative performance metrics ($ and % metrics)." : "Clear concise role progression."
    ];

    const criticalWeaknesses = [
      missingKeywords.length > 0 ? `Missing ${missingKeywords.length} key industry terms: ${missingKeywords.slice(0, 4).join(", ")}.` : "Could include more quantifiable ROI metrics.",
      numbersCount < 3 ? "Lacks numerical results (e.g. '% increase', '$ saved', 'X active users')." : "Some bullet points start with passive language."
    ];

    const actionPlan = [
      `Incorporate missing ATS keywords: ${missingKeywords.slice(0, 3).join(", ") || "TypeScript, System Design"}.`,
      "Rewrite generic bullet points to follow the formula: [Action Verb] + [Task] + [Measurable Result].",
      "Add a dedicated Core Competencies/Skills section near the top of the resume for instant ATS scanning.",
      "Ensure all project descriptions highlight your specific personal contribution rather than general team duties."
    ];

    return NextResponse.json({
      targetRole,
      overallScore,
      categories: {
        keywordMatch: { score: keywordScore, label: "ATS Keyword Match" },
        impactMetrics: { score: impactScore, label: "Quantified Impact & Results" },
        actionVerbs: { score: actionVerbScore, label: "Action Verb Strength" },
        formattingStructure: { score: formattingScore, label: "Formatting & Structure" },
        toneGrammar: { score: toneScore, label: "Tone & Professionalism" }
      },
      matchedKeywords,
      missingKeywords,
      bulletPointRewrites,
      keyStrengths,
      criticalWeaknesses,
      actionPlan
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to analyze resume", details: String(error) },
      { status: 500 }
    );
  }
}
