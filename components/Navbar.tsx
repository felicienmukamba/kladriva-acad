"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const currentLang = pathname.split("/")[1] === "fr" ? "fr" : "en";
  const baseHref = `/${currentLang}`;
  const labels =
    currentLang === "fr"
      ? {
          catalog: "Formations",
          paths: "Parcours",
          about: "A propos",
          contact: "Contact",
          dashboard: "Espace",
          signIn: "Connexion",
          signOut: "Deconnexion",
          cta: "Commencer",
        }
      : {
          catalog: "Courses",
          paths: "Paths",
          about: "About",
          contact: "Contact",
          dashboard: "Dashboard",
          signIn: "Sign in",
          signOut: "Sign out",
          cta: "Get started",
        };

  const navItems = [
    { href: `${baseHref}/courses`, label: labels.catalog },
    { href: `${baseHref}/paths`, label: labels.paths },
    { href: `${baseHref}/about`, label: labels.about },
    { href: `${baseHref}/contact`, label: labels.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/6 bg-white/72 backdrop-blur-2xl">
      <div className="apple-section-shell flex h-16 items-center justify-between gap-4">
        <Link href={baseHref} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-sm">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-slate-950">
            Kladriva Academy
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium tracking-[-0.01em] text-slate-600 transition-colors hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-full border border-black/8 bg-white/80 p-1 sm:flex">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {status === "loading" ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-slate-200" />
          ) : session ? (
            <div className="flex items-center gap-2">
              <Link href={`${baseHref}/dashboard`}>
                <Button
                  variant="ghost"
                  className="h-10 rounded-full px-4 text-sm font-medium text-slate-700"
                >
                  {labels.dashboard}
                </Button>
              </Link>
              <div className="hidden items-center gap-3 rounded-full border border-black/8 bg-white/90 px-2 py-1.5 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  className="h-8 rounded-full px-3 text-sm text-slate-600"
                >
                  {labels.signOut}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => signIn()}
                variant="ghost"
                className="h-10 rounded-full px-4 text-sm font-medium text-slate-700"
              >
                {labels.signIn}
              </Button>
              <Button
                onClick={() => signIn()}
                className="h-10 rounded-full bg-slate-950 px-5 text-sm font-medium text-white shadow-[0_10px_30px_rgba(15,23,42,0.16)] hover:bg-slate-800"
              >
                {labels.cta}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
