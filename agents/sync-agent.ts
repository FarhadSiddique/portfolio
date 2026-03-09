/**
 * Review Agent
 * Reads projects/ directory, detects changes, and proposes website updates.
 *
 * Run: npm run agents:review
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import matter from "gray-matter";
import { askClaude } from "./lib/claude.ts";
import { writeProposal, proposalAlreadyExists } from "./lib/proposal.ts";
import { skills } from "../content/skills.ts";

const PROJECTS_DIR = path.join(process.cwd(), "projects");

type ProjectFrontmatter = {
  id: string;
  title: string;
  status: string;
  visibility: string;
  tagline: string;
  stack: string[];
  last_updated: string;
};

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

function getGitLastModified(filePath: string): Date | null {
  try {
    const result = execSync(`git log -1 --format=%ci -- "${filePath}"`, {
      encoding: "utf-8",
      cwd: process.cwd(),
    }).trim();
    return result ? new Date(result) : null;
  } catch {
    return null;
  }
}

function getAllSkillsFlat(): string[] {
  return Object.values(skills).flat().map((s) => s.toLowerCase());
}

async function checkMissingSkills(project: { data: ProjectFrontmatter; file: string }) {
  const allSkills = getAllSkillsFlat();
  const missing = project.data.stack.filter(
    (s) => !allSkills.includes(s.toLowerCase())
  );

  if (missing.length === 0) return;

  if (proposalAlreadyExists("review-agent", project.data.id)) {
    console.log(`  Skipping ${project.data.id} — pending proposal already exists`);
    return;
  }

  console.log(`  Found ${missing.length} missing skill(s) in ${project.file}: ${missing.join(", ")}`);

  writeProposal({
    agent: "review-agent",
    confidence: "high",
    affects: ["content/skills.ts"],
    source_project: project.data.id,
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

async function checkProjectContent(project: {
  data: ProjectFrontmatter;
  content: string;
  file: string;
}) {
  const filePath = path.join(PROJECTS_DIR, project.file);
  const gitDate = getGitLastModified(filePath);
  const lastUpdated = project.data.last_updated
    ? new Date(project.data.last_updated)
    : null;

  const isStale =
    gitDate &&
    lastUpdated &&
    gitDate > lastUpdated &&
    (gitDate.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24) > 3;

  if (!isStale) return;
  if (proposalAlreadyExists("review-agent", project.data.id)) return;

  console.log(`  Detected content changes in ${project.file} since last_updated`);

  const skillsSnapshot = JSON.stringify(skills, null, 2);

  const prompt = `You are reviewing a portfolio project file for a Product Manager's personal website.

The project file has been modified recently but the \`last_updated\` date is stale.

CRITICAL: Only use facts explicitly stated in the project file below. Do not invent metrics, numbers, or technical details not present in the source material.

Project file (projects/${project.file}):
---
${matter.stringify(project.content, project.data)}
---

Current skills in content/skills.ts:
${skillsSnapshot}

Based on any new content in the project file, suggest 1-2 specific, concrete improvements using only facts present in the file above. Each suggestion must be directly applicable to a file. Do not suggest vague improvements and do not fabricate any data.

Format your response as a markdown body with these sections only:
## Proposed Changes
[specific changes with before/after where applicable]

## Rationale
[why this improves the portfolio for job seekers]

## How to Approve
Change \`status: pending\` to \`status: approved\`, then run:
    npm run agents:update`;

  const body = await askClaude(
    "You are a portfolio review assistant. Be specific and concise. Only suggest changes that directly improve how the portfolio reads to hiring managers.",
    prompt
  );

  writeProposal({
    agent: "review-agent",
    confidence: "medium",
    affects: [`projects/${project.file}`, "content/skills.ts"],
    source_project: project.data.id,
    summary: `Review updates to ${project.data.title} project content`,
    body,
  });
}

async function main() {
  console.log("Review Agent running...\n");
  const projects = getAllProjects();
  console.log(`Found ${projects.length} project(s)\n`);

  for (const project of projects) {
    console.log(`Checking: ${project.data.title}`);
    await checkMissingSkills(project);
    await checkProjectContent(project);
  }

  console.log("\nDone. Check proposals/ for new proposals.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
