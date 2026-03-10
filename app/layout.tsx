import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { resume } from "@/content/resume";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `${resume.name} | ${resume.title}`,
    template: `%s | ${resume.name}`,
  },
  description: resume.summary[0],
  metadataBase: new URL("https://farhadsiddique.com"),
  openGraph: {
    siteName: resume.name,
    url: "https://farhadsiddique.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-white text-slate-900 antialiased`}>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
