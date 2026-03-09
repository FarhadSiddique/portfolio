"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { resume } from "@/content/resume";

const links = [
  { href: "/", label: "Home" },
  { href: "/resume", label: "Resume" },
  { href: "/projects", label: "Projects" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-slate-900 tracking-tight">
          {resume.name}
        </Link>
        <ul className="flex items-center gap-6">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium transition-colors ${
                  pathname === href
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${resume.email}`}
              className="text-sm font-medium px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition-colors"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
