"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { GraduationCap, User, Settings, LogOut, ChevronDown, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const currentLang = pathname.split("/")[1] === "fr" ? "fr" : "en";
  const baseHref = `/${currentLang}`;
  
  const labels = currentLang === "fr" ? {
    catalog: "Formations",
    paths: "Parcours",
    about: "À propos",
    contact: "Contact",
    dashboard: "Tableau de bord",
    profile: "Mon Profil",
    settings: "Paramètres",
    signIn: "Connexion",
    signOut: "Déconnexion",
    cta: "Commencer",
  } : {
    catalog: "Courses",
    paths: "Paths",
    about: "About",
    contact: "Contact",
    dashboard: "Dashboard",
    profile: "My Profile",
    settings: "Settings",
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
    <header className="sticky top-0 z-50 w-full border-b border-[#d2d2d7]/30 bg-white/70 backdrop-blur-xl supports-backdrop-filter:bg-white/60">
      <div className="max-w-7xl mx-auto px-6 flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href={baseHref} className="flex items-center gap-3 group transition-transform active:scale-95">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#1d1d1f] text-white shadow-lg shadow-black/10 transition-transform group-hover:rotate-6">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <span className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">
              Kladriva
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13px] font-medium transition-colors hover:text-[#0066cc] ${
                  pathname.startsWith(item.href) ? "text-[#0066cc]" : "text-[#1d1d1f]/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-[#d2d2d7]/50 bg-[#f5f5f7]/50 p-1 md:flex">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-[#f5f5f7]" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <button className="flex items-center gap-2 p-1 pl-2 rounded-full border border-[#d2d2d7]/50 bg-white hover:bg-[#f5f5f7] transition-all outline-none">
                  <span className="text-[13px] font-medium text-[#1d1d1f] px-1 hidden sm:inline">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                  <Avatar className="h-7 w-7 rounded-full shadow-sm">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback className="bg-[#1d1d1f] text-white text-[10px] font-bold">
                      {session.user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-3.5 h-3.5 text-[#86868b] mr-1" />
                </button>
              } />
              <DropdownMenuContent align="end" className="w-64 rounded-[24px] p-2 shadow-2xl border-[#d2d2d7]/50 bg-white/80 backdrop-blur-xl">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-4 py-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-[#1d1d1f]">{session.user?.name}</p>
                      <p className="text-xs text-[#86868b] font-medium truncate">{session.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-[#d2d2d7]/30 my-1 mx-2" />
                <DropdownMenuItem render={
                  <Link href={`${baseHref}/dashboard`} className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-[#f5f5f7] transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-[#f5f5f7] flex items-center justify-center">
                      <Settings className="w-4 h-4 text-[#1d1d1f]" />
                    </div>
                    <span className="text-sm font-semibold text-[#1d1d1f]">{labels.dashboard}</span>
                  </Link>
                } />
                <DropdownMenuItem render={
                  <Link href={`${baseHref}/dashboard/profile`} className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-[#f5f5f7] transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-[#f5f5f7] flex items-center justify-center">
                      <User className="w-4 h-4 text-[#1d1d1f]" />
                    </div>
                    <span className="text-sm font-semibold text-[#1d1d1f]">{labels.profile}</span>
                  </Link>
                } />
                <DropdownMenuSeparator className="bg-[#d2d2d7]/30 my-1 mx-2" />
                <DropdownMenuItem render={
                  <button onClick={() => signOut()} className="w-full flex items-center gap-3 p-3 rounded-2xl cursor-pointer text-rose-600 hover:bg-rose-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">{labels.signOut}</span>
                  </button>
                } />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => signIn()}
                variant="ghost"
                className="h-9 rounded-full px-5 text-[13px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]"
              >
                {labels.signIn}
              </Button>
              <Button
                onClick={() => signIn()}
                className="h-9 rounded-full bg-[#1d1d1f] px-6 text-[13px] font-semibold text-white hover:bg-black transition-all shadow-lg shadow-black/10"
              >
                {labels.cta}
              </Button>
            </div>
          )}
          
          <Button variant="ghost" size="icon" className="lg:hidden rounded-full h-9 w-9 text-[#1d1d1f]">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
