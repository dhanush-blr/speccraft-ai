import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpecCraft AI — Visual QA to Playwright Studio",
  description:
    "Convert UI bug screenshots into runnable Playwright test scripts and GitHub Issue reports using Groq multimodal AI. Built for the AI Tester 3X Hackathon.",
  keywords: [
    "QA automation",
    "Playwright",
    "AI testing",
    "bug reporting",
    "Groq AI",
    "visual testing",
  ],
  authors: [{ name: "SpecCraft AI" }],
  openGraph: {
    title: "SpecCraft AI — Visual QA to Playwright Studio",
    description:
      "Convert UI bug screenshots into runnable Playwright test scripts instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
