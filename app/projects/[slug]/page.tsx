import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

type ProjectData = {
  id: string;
  title: string;
  status: string;
  tagline: string;
  stack: string[];
  started: string;
  repo: string | null;
  live_url: string | null;
  video_url: string | null;
};

function getProject(slug: string): { data: ProjectData; content: string } | null {
  const filePath = path.join(process.cwd(), "projects", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  if (data.visibility === "private") return null;
  return { data: data as ProjectData, content };
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "projects");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => ({ slug: f.replace(".md", "") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.data.title };
}

const statusColor: Record<string, string> = {
  active: "bg-green-500",
  paused: "bg-yellow-400",
  complete: "bg-blue-500",
  archived: "bg-slate-300",
};

function renderContent(content: string) {
  const sections = content.split(/^## /m).filter(Boolean);
  return sections.map((section) => {
    const newline = section.indexOf("\n");
    const heading = section.slice(0, newline).trim();
    const body = section.slice(newline + 1).trim();
    return { heading, body };
  });
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { data, content } = project;
  const sections = renderContent(content);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/projects"
        className="text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8 inline-block"
      >
        ← All projects
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-2 h-2 rounded-full ${statusColor[data.status] ?? "bg-slate-300"}`} />
          <span className="text-xs text-slate-400 uppercase tracking-wide font-medium capitalize">
            {data.status}
          </span>
          {data.started && (
            <span className="text-xs text-slate-400">· Since {data.started}</span>
          )}
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-3">{data.title}</h1>
        <p className="text-lg text-slate-500 leading-relaxed">{data.tagline}</p>
      </div>

      {/* Stack */}
      <div className="flex flex-wrap gap-2 mb-10">
        {data.stack.map((t) => (
          <span key={t} className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full">
            {t}
          </span>
        ))}
      </div>

      {/* Video */}
      {data.video_url && (
        <div className="mb-10">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={data.video_url}
              title={`${data.title} demo`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Content sections */}
      <div className="space-y-8">
        {sections.map(({ heading, body }) => (
          <section key={heading}>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">{heading}</h2>
            <div className="text-slate-600 leading-relaxed space-y-3">
              {body.split("\n\n").map((para, i) => {
                if (para.startsWith("1.") || para.match(/^\d\./)) {
                  const items = para.split("\n").filter(Boolean);
                  return (
                    <ol key={i} className="list-decimal list-inside space-y-1.5">
                      {items.map((item, j) => (
                        <li key={j} className="text-slate-600 text-sm">
                          {renderInline(item.replace(/^\d+\.\s*/, ""))}
                        </li>
                      ))}
                    </ol>
                  );
                }
                if (para.startsWith("-")) {
                  const items = para.split("\n").filter(Boolean);
                  return (
                    <ul key={i} className="list-disc list-inside space-y-1.5">
                      {items.map((item, j) => (
                        <li key={j} className="text-slate-600 text-sm">
                          {renderInline(item.replace(/^-\s*/, ""))}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i} className="text-sm">{renderInline(para)}</p>;
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Links */}
      {(data.repo || data.live_url) && (
        <div className="flex gap-4 mt-10 pt-8 border-t border-slate-100">
          {data.repo && (
            <a href={data.repo} target="_blank" rel="noopener noreferrer"
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-700 transition-colors">
              View on GitHub →
            </a>
          )}
          {data.live_url && (
            <a href={data.live_url} target="_blank" rel="noopener noreferrer"
              className="px-5 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-full hover:border-slate-500 transition-colors">
              Live Site →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
