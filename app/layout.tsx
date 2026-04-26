import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kladriva Academy — Career Transformation Platform",
  description: "A next-generation professional learning platform combining outcome-driven courses, real-world projects, human mentorship, and a job marketplace. Go beyond Coursera.",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
