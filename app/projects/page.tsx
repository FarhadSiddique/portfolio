import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projects" };

const projects = [
  {
    name: "BudgetSync",
    status: "active",
    tagline: "Mobile budget tracker with Google Sheets sync and multi-provider AI categorization.",
    stack: ["React Native", "TypeScript", "Expo", "Google Sheets API", "Claude / OpenAI / Gemini"],
    repo: null as string | null,
    live: null as string | null,
    highlights: [
      "AI-assisted transaction categorization supporting Claude, OpenAI, and Gemini",
      "Google OAuth for Sheets sync without a backend, using expo-auth-session",
      "Secure credential storage with expo-secure-store across app restarts",
    ],
  },
];

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
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-slate-900 mb-3">Projects</h1>
      <p className="text-slate-500 mb-12 max-w-xl">
        Side projects I build to sharpen my technical skills and explore product ideas.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((p) => (
          <div key={p.name} className="border border-slate-200 rounded-2xl p-6 hover:border-slate-400 transition-colors flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${statusColor[p.status]}`} />
              <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                {statusLabel[p.status]}
              </span>
            </div>

            <h2 className="text-xl font-semibold text-slate-900 mb-2">{p.name}</h2>
            <p className="text-slate-500 text-sm mb-4 flex-1">{p.tagline}</p>

            <ul className="space-y-1.5 mb-5">
              {p.highlights.map((h, i) => (
                <li key={i} className="text-xs text-slate-600 flex gap-2">
                  <span className="text-blue-400 flex-shrink-0 mt-0.5">→</span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {p.stack.map((t) => (
                <span key={t} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                  {t}
                </span>
              ))}
            </div>

            {(p.repo || p.live) && (
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    GitHub →
                  </a>
                )}
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
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
