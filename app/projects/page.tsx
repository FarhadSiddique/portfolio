import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";

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
  cover_image: string | null;
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

  const statusOrder: Record<string, number> = {
    active: 0,
    stealth: 1,
    paused: 2,
    complete: 3,
    archived: 4,
  };

  return projects
    .filter((p) => p.visibility !== "private")
    .sort((a, b) => {
      const statusDiff = (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
      if (statusDiff !== 0) return statusDiff;
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
  stealth: "bg-amber-400",
};

const statusLabel: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  complete: "Complete",
  archived: "Archived",
  stealth: "Stealth",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-slate-900 mb-3">Projects</h1>
      <p className="text-slate-500 mb-12 max-w-xl">
        Side projects and startups, built to sharpen technical skills and explore product ideas.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-400 transition-colors flex flex-col"
          >
            {p.cover_image && (
              <div className="relative w-full h-44 overflow-hidden bg-slate-100">
                <Image
                  src={p.cover_image}
                  alt={p.title}
                  fill
                  className="object-cover"
                  style={{ filter: "blur(2px) brightness(0.92)", transform: "scale(1.05)" }}
                />
              </div>
            )}

            <div className="p-6 flex flex-col flex-1">
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

              <div className="pt-4 border-t border-slate-100 mt-auto">
                <span className="text-xs font-medium text-blue-600">View project →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
