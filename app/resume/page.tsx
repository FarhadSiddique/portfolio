import type { Metadata } from "next";
import { resume } from "@/content/resume";
import { workHistory } from "@/content/work-history";
import { skills } from "@/content/skills";
import { education } from "@/content/education";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-12 pb-10 border-b border-slate-200">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-1">{resume.name}</h1>
          <p className="text-xl text-slate-500">{resume.title}</p>
          <p className="text-slate-500 mt-1">{resume.location}</p>
        </div>
        <div className="flex flex-col gap-1 text-sm text-slate-600 sm:text-right">
          <a href={`mailto:${resume.email}`} className="hover:text-blue-600 transition-colors">
            {resume.email}
          </a>
          <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
            LinkedIn
          </a>
          <a href={resume.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
            GitHub
          </a>
        </div>
      </div>

      {/* Summary */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Summary</h2>
        <p className="text-slate-600 leading-relaxed">{resume.summary}</p>
      </section>

      {/* Work Experience */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Work Experience</h2>
        <div className="space-y-10">
          {workHistory.map((job) => (
            <div key={job.company}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{job.company}</h3>
                <span className="text-sm text-slate-400">{job.period} · {job.location}</span>
              </div>
              <div className="space-y-6 pl-4 border-l-2 border-slate-100">
                {job.roles.map((role) => (
                  <div key={role.title}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <p className="font-medium text-slate-800">{role.title}</p>
                      <span className="text-xs text-slate-400">{role.period}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {role.bullets.map((b, i) => (
                        <li key={i} className="text-sm text-slate-600 flex gap-2">
                          <span className="text-slate-300 flex-shrink-0 mt-1">•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Skills</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span key={skill} className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Education</h2>
        {education.map((edu) => (
          <div key={edu.school}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{edu.school}</h3>
                <p className="text-slate-600 text-sm">{edu.degree}</p>
                <p className="text-slate-500 text-sm">
                  Majors: {edu.majors} · Minor: {edu.minor}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Awards</p>
                <div className="flex flex-wrap gap-1.5">
                  {edu.awards.map((a) => (
                    <span key={a} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Leadership</p>
                <div className="flex flex-wrap gap-1.5">
                  {edu.leadership.map((l) => (
                    <span key={l} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Awards */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Honors & Awards</h2>
        <div className="space-y-4">
          {resume.awards.map((award) => (
            <div key={award.title} className="flex gap-4">
              <div className="flex-shrink-0 w-12 text-xs text-slate-400 pt-0.5">{award.year}</div>
              <div>
                <p className="font-medium text-slate-900 text-sm">{award.title}</p>
                <p className="text-xs text-slate-500">{award.issuer}</p>
                {"description" in award && (
                  <p className="text-xs text-slate-500 mt-0.5">{award.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Languages</h2>
        <div className="flex gap-2">
          {resume.languages.map((lang) => (
            <span key={lang} className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
              {lang}
            </span>
          ))}
        </div>
      </section>

    </div>
  );
}
