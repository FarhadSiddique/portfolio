import fs from "fs";
import path from "path";

export type ProposalStatus = "pending" | "approved" | "rejected";
export type Confidence = "high" | "medium" | "low";

export type Proposal = {
  id: string;
  created: string;
  status: ProposalStatus;
  agent: string;
  confidence: Confidence;
  affects: string[];
  source_project?: string;
  summary: string;
  body: string;
};

const PROPOSALS_DIR = path.join(process.cwd(), "proposals");

export function writeProposal(proposal: Omit<Proposal, "id" | "created">): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10);
  const timePart = now.toTimeString().slice(0, 8).replace(/:/g, "");
  const slug = proposal.summary
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const id = `${datePart}_${timePart}_${slug}`;
  const filePath = path.join(PROPOSALS_DIR, `${id}.md`);

  const frontmatter = [
    "---",
    `id: ${id}`,
    `created: ${now.toISOString()}`,
    `status: pending`,
    `agent: ${proposal.agent}`,
    `confidence: ${proposal.confidence}`,
    `affects:`,
    ...proposal.affects.map((f) => `  - ${f}`),
    ...(proposal.source_project ? [`source_project: ${proposal.source_project}`] : []),
    "---",
  ].join("\n");

  const content = `${frontmatter}\n\n## Summary\n\n${proposal.summary}\n\n${proposal.body}`;
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`  Created proposal: proposals/${id}.md`);
  return id;
}

export function loadApprovedProposals(): Array<Proposal & { filePath: string }> {
  if (!fs.existsSync(PROPOSALS_DIR)) return [];

  return fs
    .readdirSync(PROPOSALS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const filePath = path.join(PROPOSALS_DIR, f);
      const raw = fs.readFileSync(filePath, "utf-8");
      return { ...parseProposal(raw), filePath };
    })
    .filter((p) => p.status === "approved")
    .sort((a, b) => a.created.localeCompare(b.created));
}

export function proposalAlreadyExists(agent: string, sourceProject?: string): boolean {
  if (!fs.existsSync(PROPOSALS_DIR)) return false;

  const allDirs = [PROPOSALS_DIR, path.join(PROPOSALS_DIR, "applied")];
  for (const dir of allDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const p = parseProposal(raw);
      if (
        p.agent === agent &&
        p.status === "pending" &&
        (!sourceProject || p.source_project === sourceProject)
      ) {
        return true;
      }
    }
  }
  return false;
}

function parseProposal(raw: string): Proposal {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) throw new Error("Invalid proposal format");

  const fm = fmMatch[1];
  const body = fmMatch[2].trim();

  const get = (key: string) => {
    const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return m ? m[1].trim() : "";
  };

  const affectsMatch = fm.match(/^affects:\n((?:\s+- .+\n?)*)/m);
  const affects = affectsMatch
    ? affectsMatch[1]
        .split("\n")
        .filter((l) => l.trim().startsWith("-"))
        .map((l) => l.replace(/^\s*-\s*/, "").trim())
    : [];

  const summaryMatch = body.match(/## Summary\n\n([\s\S]*?)(?=\n##|$)/);

  return {
    id: get("id"),
    created: get("created"),
    status: get("status") as ProposalStatus,
    agent: get("agent"),
    confidence: get("confidence") as Confidence,
    source_project: get("source_project") || undefined,
    affects,
    summary: summaryMatch ? summaryMatch[1].trim() : "",
    body,
  };
}
