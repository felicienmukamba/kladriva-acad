import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kladriva Academy — Plateforme d'apprentissage immersive",
  description: "Maîtrisez les technologies modernes avec un mentorat personnalisé, des cours immersifs et des certifications reconnues.",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
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
