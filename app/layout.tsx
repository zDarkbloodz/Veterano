import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";

export const metadata: Metadata = {
  title: "Veterano - Tech Careers for Military Veterans",
  description: "Helping military veterans transition to tech careers with AI-powered tools, job listings, and resources tailored for your unique experience.",
  keywords: ["veterans", "tech jobs", "career transition", "military", "resume", "AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
