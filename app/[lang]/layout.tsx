import { ThemeProvider } from "@/components/ThemeProvider";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { getDictionary } from "@/lib/dictionary";
import { DictionaryProvider } from "@/components/DictionaryProvider";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const session = await auth();
  const { lang } = await params;
  const dictionary = await getDictionary(lang as "en" | "fr");

  return (
    <SessionProvider session={session}>
      <DictionaryProvider dictionary={dictionary}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </DictionaryProvider>
    </SessionProvider>
  );
}
