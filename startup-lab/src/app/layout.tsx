import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Startup Lab — Shubham Kumar | AI Builder & Startup Experimenter",
  description:
    "Backend engineer building scalable systems and AI-powered products in public. Explore experiments, lab notes, and live subdomains at startup-lab.cloud",
  keywords: [
    "Shubham Kumar",
    "Backend Developer",
    "Node.js",
    "TypeScript",
    "AI Builder",
    "Startup Experimenter",
    "Indie Hacker",
    "Blog",
  ],
  authors: [{ name: "Shubham Kumar" }],
  openGraph: {
    title: "Startup Lab — Shubham Kumar",
    description: "A public idea lab where backend systems, AI products, and live experiments ship on the internet.",
    url: "https://startup-lab.cloud",
    siteName: "Startup Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Lab — Shubham Kumar",
    description: "A public idea lab where backend systems, AI products, and live experiments ship on the internet.",
  },
  robots: "index, follow",
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Background from "@/components/ui/Background";
import PublicShell from "@/components/layout/PublicShell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Background />
          <PublicShell>{children}</PublicShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
