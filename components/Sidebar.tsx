"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  UserCircle,
  Zap,
  TrendingUp,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar({ 
  dict, 
  reputation = 0 
}: { 
  dict: any; 
  reputation?: number 
}) {
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
    <aside className="w-64 border-r border-white/5 bg-background/50 backdrop-blur-xl hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-2">
        <Zap className="text-primary w-6 h-6 fill-primary" />
        <span className="text-xl font-display font-bold text-white tracking-tight">KLADRIVA</span>
      </div>

      <div className="p-4 flex-1">
        {/* Reputation Card */}
        <div className="mb-8 p-4 rounded-2xl bg-primary/5 border border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{dict.dashboard.reputation}</span>
            <Award className="w-3 h-3 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-display font-black text-white">{reputation}</span>
            <div className="flex items-center text-[10px] text-emerald-400 font-bold">
              <TrendingUp className="w-3 h-3 mr-1" /> +12%
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500")} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 mt-auto border-t border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Link href={pathname.replace(`/${lang}`, "/en")} className={cn("text-[10px] font-bold", lang === "en" ? "text-primary" : "text-slate-500")}>EN</Link>
            <Link href={pathname.replace(`/${lang}`, "/fr")} className={cn("text-[10px] font-bold", lang === "fr" ? "text-primary" : "text-slate-500")}>FR</Link>
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs font-bold text-white mb-1">Pro Access</p>
          <p className="text-[10px] text-slate-500 leading-relaxed mb-3">Upgrade for elite mentorship and job priority.</p>
          <button className="w-full py-2 bg-white text-black hover:bg-slate-200 rounded-lg text-xs font-black transition-colors">
            UPGRADE
          </button>
        </div>
      </div>
    </aside>
  );
}
