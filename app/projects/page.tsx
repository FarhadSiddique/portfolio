import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const metadata: Metadata = { title: "Projects" };

type Project = {
  id: string;
  title: string;
  status: string;
  visibility: string;
  tagline: string;
  stack: string[];
  category: string;
  started: string;
  featured: boolean;
  highlight_order: number | null;
  repo: string | null;
  live_url: string | null;
  content: string;
};

function getProjects(): Project[] {
  const dir = path.join(process.cwd(), "projects");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_"));

  const projects = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    return { ...data, content } as Project;
  });

  return projects
    .filter((p) => p.visibility !== "private")
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.highlight_order != null && b.highlight_order != null)
        return a.highlight_order - b.highlight_order;
      return 0;
    });
}

const statusColor: Record<string, string> = {
  active: "bg-green-500",
  paused: "bg-yellow-400",
  complete: "bg-blue-500",
  archived: "bg-slate-300",
};

const statusLabel: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  complete: "Complete",
  archived: "Archived",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-slate-900 mb-3">Projects</h1>
      <p className="text-slate-500 mb-12 max-w-xl">
        Side projects and startups — built to sharpen technical skills and explore product ideas.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className="border border-slate-200 rounded-2xl p-6 hover:border-slate-400 transition-colors flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${statusColor[p.status] ?? "bg-slate-300"}`} />
              <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                {statusLabel[p.status] ?? p.status}
              </span>
            </div>

            <h2 className="text-xl font-semibold text-slate-900 mb-2">{p.title}</h2>
            <p className="text-slate-500 text-sm mb-4 flex-1">{p.tagline}</p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {p.stack.map((t) => (
                <span key={t} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                  {t}
                </span>
              ))}
            </div>

            {(p.repo || p.live_url) && (
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                {p.repo && (
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    GitHub →
                  </a>
                )}
                {p.live_url && (
                  <a
                    href={p.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Live →
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
