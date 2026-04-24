"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { 
  Menu, 
  X, 
  Zap, 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  UserCircle, 
  Users, 
  Briefcase 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function MobileNav({ dict }: { dict: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { lang } = useParams();

  const links = [
    { href: `/${lang}/dashboard`, icon: LayoutDashboard, label: dict.common.dashboard },
    { href: `/${lang}/dashboard/learning`, icon: BookOpen, label: dict.common.learning },
    { href: `/${lang}/dashboard/projects`, icon: GraduationCap, label: dict.common.projects },
    { href: `/${lang}/dashboard/mentorship`, icon: UserCircle, label: dict.common.mentorship },
    { href: `/${lang}/dashboard/network`, icon: Users, label: dict.common.network },
    { href: `/${lang}/dashboard/jobs`, icon: Briefcase, label: dict.common.jobs },
  ];

  return (
    <div className="md:hidden">
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="text-primary w-6 h-6 fill-primary" />
          <span className="text-lg font-display font-bold text-white">KLADRIVA</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen(true)}
          className="text-slate-400"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-background">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2">
                <Zap className="text-primary w-6 h-6 fill-primary" />
                <span className="text-xl font-display font-bold text-white">KLADRIVA</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="text-slate-400"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <nav className="space-y-2 flex-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold transition-all",
                      isActive
                        ? "bg-primary text-white"
                        : "text-slate-400"
                    )}
                  >
                    <link.icon className="w-6 h-6" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-8 border-t border-white/5 flex justify-between">
              <div className="flex gap-4">
                <Link href={pathname.replace(`/${lang}`, "/en")} className={cn("font-bold", lang === "en" ? "text-primary" : "text-slate-500")}>EN</Link>
                <Link href={pathname.replace(`/${lang}`, "/fr")} className={cn("font-bold", lang === "fr" ? "text-primary" : "text-slate-500")}>FR</Link>
              </div>
              <button className="text-sm font-bold text-slate-500">Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
