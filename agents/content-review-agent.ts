/**
 * Content Review Agent
 * Reviews the website's content and creative presentation.
 * Suggests improvements to make the site more compelling for job seekers.
 *
 * Run: npm run agents:content-review
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { askClaude } from "./lib/claude.ts";
import { writeProposal } from "./lib/proposal.ts";
import { resume } from "../content/resume.ts";
import { workHistory } from "../content/work-history.ts";
import { skills } from "../content/skills.ts";
import { education } from "../content/education.ts";

const PROJECTS_DIR = path.join(process.cwd(), "projects");

function loadProjects() {
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(PROJECTS_DIR, f), "utf-8");
      const { data, content } = matter(raw);
      return { file: f, ...data, content };
    });
}

function loadPageSource(relativePath: string): string {
  const full = path.join(process.cwd(), relativePath);
  return fs.existsSync(full) ? fs.readFileSync(full, "utf-8") : "";
}

async function reviewContent() {
  console.log("Content Review Agent running...\n");

  const projects = loadProjects();
  const homePage = loadPageSource("app/page.tsx");
  const resumePage = loadPageSource("app/resume/page.tsx");

  const context = `
## About the person
Name: ${resume.name}
Title: ${resume.title}
Location: ${resume.location}
Summary: ${resume.summary}

## Work History
${workHistory
  .map(
    (job) =>
      `### ${job.company} (${job.period})\n` +
      job.roles.map((r) => `**${r.title}** (${r.period})\n${r.bullets.map((b) => `- ${b}`).join("\n")}`).join("\n\n")
  )
  .join("\n\n")}

## Skills
${Object.entries(skills)
  .map(([cat, items]) => `${cat}: ${items.join(", ")}`)
  .join("\n")}

## Education
${education.map((e) => `${e.school} — ${e.degree}, ${e.majors}, Minor: ${e.minor}`).join("\n")}

## Awards
${resume.awards.map((a) => `- ${a.title} (${a.year}), ${a.issuer}`).join("\n")}

## Projects
${projects
  .map(
    (p) =>
      `### ${p.title} (${p.status})\nTagline: ${p.tagline}\nStack: ${(p.stack as string[]).join(", ")}\n\n${p.content}`
  )
  .join("\n\n---\n\n")}

## Home Page Source (app/page.tsx)
\`\`\`tsx
${homePage}
\`\`\`

## Resume Page Source (app/resume/page.tsx)
\`\`\`tsx
${resumePage}
\`\`\`
`.trim();

  const system = `You are an expert portfolio reviewer helping a Product Manager land their next job.
You review personal portfolio websites and give specific, actionable feedback.

Your goal: make this portfolio as compelling as possible to hiring managers and recruiters at top tech companies and banks.

CRITICAL RULES — you must follow these exactly:
- ONLY use facts, numbers, and claims that are explicitly present in the provided content (resume, LinkedIn, project files, work history).
- NEVER invent, estimate, or extrapolate metrics, customer counts, dollar amounts, percentages, team sizes, or timelines that are not stated in the source material.
- If a bullet point lacks a metric, suggest stronger action-oriented language using only what is known — do not add fabricated numbers.
- If you are unsure whether a fact is stated in the source, do not include it.
- Violations of this rule make the portfolio dishonest and legally risky for the job seeker.

When reviewing:
- Focus on content quality, clarity, and impact using only verified data
- Check that the writing is confident and results-focused
- Flag anything that undersells achievements that ARE documented in the source material
- Suggest stronger phrasing where wording is weak or vague, using only known facts
- Check for consistency between sections
- Identify anything missing that would strengthen the site
- Consider both technical and non-technical viewers

Be specific. Every suggestion must include exact before/after wording or a concrete action.
Do not suggest design changes that require new UI components — only content and copy changes.`;

  const prompt = `Review this portfolio website content and generate exactly 4 proposals for improvement.

REMINDER: Only use data explicitly present in the content below. Do not invent any numbers, metrics, or facts.

${context}

Generate 4 proposals. For each proposal, output a complete markdown block in this format:

===PROPOSAL_START===
SUMMARY: [one line summary]
CONFIDENCE: [high/medium/low]
AFFECTS: [comma-separated list of files like content/resume.ts, projects/budgetsync.md]

## Proposed Changes

[Specific changes with exact before/after text where applicable]

## Rationale

[Why this makes the portfolio stronger for job seekers]

## How to Approve

Change \`status: pending\` to \`status: approved\`, then run:
    npm run agents:update
===PROPOSAL_END===

Focus on the highest-impact improvements first. Mix quick wins (copy tweaks) with more substantial content gaps.`;

  console.log("Sending content for review...");
  const response = await askClaude(system, prompt, 6000);

  const proposalBlocks = response
    .split("===PROPOSAL_START===")
    .filter((b) => b.includes("===PROPOSAL_END==="))
    .map((b) => b.split("===PROPOSAL_END===")[0].trim());

  if (proposalBlocks.length === 0) {
    console.log("No proposals generated. Raw response:\n", response);
    return;
  }

  console.log(`\nGenerating ${proposalBlocks.length} proposal(s)...\n`);

  for (const block of proposalBlocks) {
    const summaryMatch = block.match(/^SUMMARY:\s*(.+)$/m);
    const confidenceMatch = block.match(/^CONFIDENCE:\s*(.+)$/m);
    const affectsMatch = block.match(/^AFFECTS:\s*(.+)$/m);

    if (!summaryMatch) continue;

    const summary = summaryMatch[1].trim();
    const confidence = (confidenceMatch?.[1].trim() ?? "medium") as "high" | "medium" | "low";
    const affects = affectsMatch
      ? affectsMatch[1].split(",").map((s) => s.trim())
      : ["content/resume.ts"];

    const body = block
      .replace(/^SUMMARY:.*$/m, "")
      .replace(/^CONFIDENCE:.*$/m, "")
      .replace(/^AFFECTS:.*$/m, "")
      .trim();

    writeProposal({
      agent: "content-review-agent",
      confidence,
      affects,
      summary,
      body,
    });
  }

  console.log("\nDone. Check proposals/ for new proposals.");
}

reviewContent().catch((err) => {
  console.error(err);
  process.exit(1);
});
