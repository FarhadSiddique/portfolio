/**
 * Update Agent
 * Reads approved proposals and applies changes to the website files.
 *
 * Run:           npm run agents:update
 * Dry run:       npm run agents:update:dry-run
 */

import fs from "fs";
import path from "path";
import { askClaude } from "./lib/claude.ts";
import { loadApprovedProposals } from "./lib/proposal.ts";

const DRY_RUN = process.argv.includes("--dry-run");

if (DRY_RUN) {
  console.log("DRY RUN — no files will be modified\n");
}

async function applyChange(filePath: string, proposedChange: string): Promise<string> {
  const fullPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const currentContent = fs.readFileSync(fullPath, "utf-8");

  const system = `You are a precise code and content editor.
You will be given a file's current content and a description of a change to make.
Output ONLY the complete updated file content with no explanation, no markdown code fences, no commentary.
Preserve all existing formatting, indentation, and style exactly.`;

  const prompt = `Current file (${filePath}):
${currentContent}

Change to apply:
${proposedChange}

Output the complete updated file content only.`;

  return askClaude(system, prompt, 8000);
}

async function main() {
  const proposals = loadApprovedProposals();

  if (proposals.length === 0) {
    console.log("No approved proposals found.");
    console.log("To approve a proposal: open proposals/*.md and change status: pending to status: approved");
    return;
  }

  console.log(`Found ${proposals.length} approved proposal(s)\n`);

  const appliedDir = path.join(process.cwd(), "proposals", "applied");
  if (!fs.existsSync(appliedDir)) {
    fs.mkdirSync(appliedDir, { recursive: true });
  }

  for (const proposal of proposals) {
    console.log(`Applying: ${proposal.id}`);
    console.log(`  Summary: ${proposal.summary}`);
    console.log(`  Affects: ${proposal.affects.join(", ")}`);

    for (const file of proposal.affects) {
      const fullPath = path.join(process.cwd(), file);
      if (!fs.existsSync(fullPath)) {
        console.log(`  Warning: ${file} not found, skipping`);
        continue;
      }

      console.log(`  Updating ${file}...`);

      try {
        const updated = await applyChange(file, proposal.body);

        if (DRY_RUN) {
          console.log(`  [DRY RUN] Would write ${updated.length} chars to ${file}`);
          const current = fs.readFileSync(fullPath, "utf-8");
          if (current === updated) {
            console.log(`  [DRY RUN] No changes detected`);
          } else {
            console.log(`  [DRY RUN] Changes detected`);
          }
        } else {
          fs.writeFileSync(fullPath, updated, "utf-8");
          console.log(`  Written: ${file}`);
        }
      } catch (err) {
        console.error(`  Error updating ${file}:`, err);
      }
    }

    if (!DRY_RUN) {
      const dest = path.join(appliedDir, path.basename(proposal.filePath));
      const updatedProposal = fs
        .readFileSync(proposal.filePath, "utf-8")
        .replace("status: approved", "status: applied");
      fs.writeFileSync(dest, updatedProposal, "utf-8");
      fs.unlinkSync(proposal.filePath);
      console.log(`  Moved to proposals/applied/`);
    }

    console.log();
  }

  if (DRY_RUN) {
    console.log("Dry run complete. Run without --dry-run to apply changes.");
  } else {
    console.log(`Applied ${proposals.length} proposal(s).`);
    console.log("Review changes with: git diff");
    console.log("Then commit: git add . && git commit -m 'Apply approved proposals'");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
