import { resume } from "@/content/resume";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-24">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <span>© {new Date().getFullYear()} {resume.name}</span>
        <div className="flex items-center gap-6">
          <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
            LinkedIn
          </a>
          <a href={resume.github} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
            GitHub
          </a>
          <a href={`mailto:${resume.email}`} className="hover:text-slate-900 transition-colors">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
