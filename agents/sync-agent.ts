/**
 * Sync Agent
 * Reads projects/ directory and keeps the portfolio in sync.
 *
 * Checks per project:
 * 1. New project detection — if a project was added recently, propose full portfolio integration
 * 2. Missing skills — if stack items are absent from skills.ts, propose adding them
 * 3. Stale content — if a project file was edited after last_updated, propose content review
 *
 * Run: npm run agents:sync
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import matter from "gray-matter";
import { askClaude } from "./lib/claude.ts";
import { writeProposal, proposalAlreadyExists } from "./lib/proposal.ts";
import { skills } from "../content/skills.ts";
import { resume } from "../content/resume.ts";
import { workHistory } from "../content/work-history.ts";

const PROJECTS_DIR = path.join(process.cwd(), "projects");
const NEW_PROJECT_THRESHOLD_DAYS = 30;

type ProjectFrontmatter = {
  id: string;
  title: string;
  status: string;
  visibility: string;
  tagline: string;
  stack: string[];
  category: string;
  started: string;
  last_updated: string;
  repo?: string;
  live_url?: string;
  featured?: boolean;
  highlight_order?: number;
};

// ----------------------------------------------------------------
// File helpers
// ----------------------------------------------------------------

function getAllProjects(): Array<{ data: ProjectFrontmatter; content: string; file: string }> {
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(PROJECTS_DIR, f), "utf-8");
      const { data, content } = matter(raw);
      return { data: data as ProjectFrontmatter, content, file: f };
    })
    .filter((p) => p.data.visibility !== "private");
}

function readFileContent(relPath: string): string {
  const full = path.join(process.cwd(), relPath);
  return fs.existsSync(full) ? fs.readFileSync(full, "utf-8") : "";
}

// ----------------------------------------------------------------
// Git helpers
// ----------------------------------------------------------------

function getGitDate(filePath: string, filter: "A" | "M"): Date | null {
  try {
    const flag = filter === "A" ? "--diff-filter=A" : "--diff-filter=M";
    const result = execSync(
      `git log ${flag} --format=%ci -- "${filePath}"`,
      { encoding: "utf-8", cwd: process.cwd() }
    ).trim();
    // For "A" (added), take the first commit; for "M" (modified), take the latest
    const line = filter === "A" ? result.split("\n").pop() : result.split("\n")[0];
    return line ? new Date(line.trim()) : null;
  } catch {
    return null;
  }
}

function daysSince(date: Date): number {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
}

// ----------------------------------------------------------------
// Check 1: New project — propose full portfolio integration
// ----------------------------------------------------------------

async function checkNewProject(project: {
  data: ProjectFrontmatter;
  content: string;
  file: string;
}) {
  const filePath = path.join(PROJECTS_DIR, project.file);
  const addedDate = getGitDate(filePath, "A");

  if (!addedDate) return;
  if (daysSince(addedDate) > NEW_PROJECT_THRESHOLD_DAYS) return;

  const proposalKey = `new-project-${project.data.id}`;
  if (proposalAlreadyExists("sync-agent", proposalKey)) {
    console.log(`  Skipping new-project check for ${project.data.id} — proposal already exists`);
    return;
  }

  console.log(`  New project detected: ${project.file} (added ${Math.round(daysSince(addedDate))} days ago)`);

  const projectRaw = matter.stringify(project.content, project.data);
  const currentSkills = JSON.stringify(skills, null, 2);
  const currentResumeSummary = resume.summary.join("\n");
  const currentStats = `Years of PM experience, Years in banking, Revenue generated, Startups co-founded`;
  const homepageTsx = readFileContent("app/page.tsx");
  const allProjects = getAllProjects();
  const featuredProjects = allProjects.filter((p) => p.data.featured);

  const prompt = `You are reviewing a portfolio website for a Product Manager. A new project has been added to the projects/ directory and the website needs to be updated to reflect it.

NEW PROJECT FILE (projects/${project.file}):
---
${projectRaw}
---

CURRENT SKILLS (content/skills.ts):
${currentSkills}

CURRENT RESUME SUMMARY:
${currentResumeSummary}

CURRENTLY FEATURED PROJECTS (featured: true):
${featuredProjects.map((p) => `- ${p.data.title} (highlight_order: ${p.data.highlight_order ?? "none"})`).join("\n")}

HOME PAGE (app/page.tsx):
${homepageTsx}

Based on this new project, suggest specific updates to integrate it fully into the portfolio. Consider:
1. Should it be featured on the homepage? If yes, what highlight_order makes sense?
2. Are there skills in its stack missing from content/skills.ts?
3. Should the resume summary mention it?
4. Are there any homepage stats (e.g. "2 Startups co-founded") that should be updated?

CRITICAL: Only suggest changes that are clearly justified. If the project is already well integrated, say so. Do not invent metrics or details not present in the project file.

Format your response as:

## Proposed Changes

[Specific before/after changes for each file that needs updating]

## Rationale

[Why each change improves the portfolio]

## How to Approve

Change \`status: pending\` to \`status: approved\`, then run:
    npm run agents:update`;

  const body = await askClaude(
    "You are a portfolio integration assistant. Be specific. Only propose changes that directly improve portfolio completeness and consistency.",
    prompt
  );

  writeProposal({
    agent: "sync-agent",
    confidence: "high",
    affects: [
      `projects/${project.file}`,
      "content/skills.ts",
      "content/resume.ts",
      "app/page.tsx",
    ],
    source_project: proposalKey,
    summary: `Integrate new project "${project.data.title}" into portfolio`,
    body,
  });
}

// ----------------------------------------------------------------
// Check 2: Missing skills
// ----------------------------------------------------------------

async function checkMissingSkills(project: { data: ProjectFrontmatter; file: string }) {
  const allSkills = Object.values(skills).flat().map((s) => s.toLowerCase());
  const missing = project.data.stack.filter((s) => !allSkills.includes(s.toLowerCase()));

  if (missing.length === 0) return;

  if (proposalAlreadyExists("sync-agent", `missing-skills-${project.data.id}`)) {
    console.log(`  Skipping missing skills for ${project.data.id} — proposal already exists`);
    return;
  }

  console.log(`  Found ${missing.length} missing skill(s) in ${project.file}: ${missing.join(", ")}`);

  writeProposal({
    agent: "sync-agent",
    confidence: "high",
    affects: ["content/skills.ts"],
    source_project: `missing-skills-${project.data.id}`,
    summary: `Add missing skills from ${project.data.title} to skills list`,
    body: `## Proposed Changes

### Add to \`content/skills.ts\`

The following skills appear in \`projects/${project.file}\` stack but are missing from \`content/skills.ts\`:

${missing.map((s) => `- \`${s}\``).join("\n")}

Add each to the most appropriate category in the skills object.

## Rationale

The skills section should reflect all technologies used in active and featured projects. Missing skills underrepresent technical depth to recruiters and employers.

## How to Approve

Change \`status: pending\` to \`status: approved\`, then run:
    npm run agents:update`,
  });
}

// ----------------------------------------------------------------
// Check 3: Stale content
// ----------------------------------------------------------------

async function checkStaleContent(project: {
  data: ProjectFrontmatter;
  content: string;
  file: string;
}) {
  const filePath = path.join(PROJECTS_DIR, project.file);
  const lastModified = getGitDate(filePath, "M");
  const lastUpdated = project.data.last_updated ? new Date(project.data.last_updated) : null;

  const isStale =
    lastModified &&
    lastUpdated &&
    lastModified > lastUpdated &&
    daysSince(lastUpdated) > 3;

  if (!isStale) return;

  const proposalKey = `stale-${project.data.id}`;
  if (proposalAlreadyExists("sync-agent", proposalKey)) return;

  console.log(`  Detected stale content in ${project.file}`);

  const skillsSnapshot = JSON.stringify(skills, null, 2);

  const body = await askClaude(
    "You are a portfolio review assistant. Be specific and concise. Only suggest changes that directly improve how the portfolio reads to hiring managers.",
    `You are reviewing a portfolio project file for a Product Manager's personal website.

The project file has been modified recently but the \`last_updated\` date is stale.

CRITICAL: Only use facts explicitly stated in the project file. Do not invent metrics or details.

Project file (projects/${project.file}):
---
${matter.stringify(project.content, project.data)}
---

Current skills in content/skills.ts:
${skillsSnapshot}

Suggest 1-2 specific, concrete improvements using only facts in the file above.

Format as:
## Proposed Changes
[specific changes with before/after]

## Rationale
[why this improves the portfolio]

## How to Approve
Change \`status: pending\` to \`status: approved\`, then run:
    npm run agents:update`
  );

  writeProposal({
    agent: "sync-agent",
    confidence: "medium",
    affects: [`projects/${project.file}`, "content/skills.ts"],
    source_project: proposalKey,
    summary: `Review updates to ${project.data.title} project content`,
    body,
  });
}

// ----------------------------------------------------------------
// Main
// ----------------------------------------------------------------

async function main() {
  console.log("Sync Agent running...\n");
  const projects = getAllProjects();
  console.log(`Found ${projects.length} project(s)\n`);

  for (const project of projects) {
    console.log(`Checking: ${project.data.title}`);
    await checkNewProject(project);
    await checkMissingSkills(project);
    await checkStaleContent(project);
  }

  console.log("\nDone. Check proposals/ for new proposals.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
