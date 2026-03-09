import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { resume } from "@/content/resume";
import { workHistory } from "@/content/work-history";
import { skills } from "@/content/skills";

function getFeaturedProjects() {
  const dir = path.join(process.cwd(), "projects");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  return files
    .map((f) => matter(fs.readFileSync(path.join(dir, f), "utf-8")).data)
    .filter((p) => p.visibility !== "private" && p.featured)
    .sort((a, b) => (a.highlight_order ?? 99) - (b.highlight_order ?? 99));
}

const stats = [
  { value: "5", label: "Years of PM experience" },
  { value: "4", label: "Years in fintech" },
  { value: "2", label: "Startups co-founded" },
];

export default function Home() {
  const currentJob = workHistory[0];
  const currentRole = currentJob.roles[0];
  const featuredProjects = getFeaturedProjects();

  return (
    <div className="max-w-5xl mx-auto px-6">

      {/* Hero */}
      <section className="pt-20 pb-16">
        <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-4">
          {resume.name}
        </h1>
        <p className="text-2xl text-slate-500 font-light mb-6">{resume.title}</p>
        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed mb-8">
          {resume.summary}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/resume"
            className="px-6 py-3 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-700 transition-colors"
          >
            View Resume
          </Link>
          <Link
            href="/projects"
            className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-full hover:border-slate-500 transition-colors"
          >
            See Projects
          </Link>
          <a
            href={resume.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-full hover:border-slate-500 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={resume.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-full hover:border-slate-500 transition-colors"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-100">
        <div className="grid grid-cols-3 gap-8">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Current Role */}
      <section className="py-16">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
          Currently
        </h2>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-white font-bold text-sm">C1</span>
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-lg">{currentRole.title}</p>
            <p className="text-slate-500">{currentJob.company} · {currentJob.location}</p>
            <ul className="mt-4 space-y-2">
              {currentRole.bullets.slice(0, 3).map((b, i) => (
                <li key={i} className="text-slate-600 text-sm flex gap-2">
                  <span className="text-blue-400 mt-1 flex-shrink-0">→</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <Link href="/resume" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            Full work history →
          </Link>
        </div>
      </section>

      {/* Skills highlight */}
      <section className="py-16 border-t border-slate-100">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
          Skills
        </h2>
        <div className="grid sm:grid-cols-2 gap-8">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects teaser */}
      <section className="py-16 border-t border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Side Projects
          </h2>
          <Link href="/projects" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {featuredProjects.map((p) => (
            <div key={p.id} className="p-6 border border-slate-200 rounded-xl hover:border-slate-400 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${p.status === "active" ? "bg-green-500" : "bg-slate-300"}`} />
                <span className="text-xs text-slate-400 uppercase tracking-wide font-medium capitalize">{p.status}</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{p.title}</h3>
              <p className="text-sm text-slate-500">{p.tagline}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {p.stack.slice(0, 3).map((t: string) => (
                  <span key={t} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
