"use client";

import Link from "next/link";
import { ArrowRight, PlayCircle, Sparkles, Trophy, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroStat {
  label: string;
  value: string;
}

interface HeroProps {
  lang: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  announcement: string;
  stats: HeroStat[];
}

export function Hero({
  lang,
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  announcement,
  stats,
}: HeroProps) {
  const secondaryCopy =
    lang === "fr"
      ? {
          shellEyebrow: "Pédagogie par projet",
          shellTitle:
            "Devenez ce que vous voulez être. Apprenez par la pratique.",
          panelEyebrow: "Garantie Emploi",
          panelTitle: "Votre job demain, ou remboursé.",
          panelDescription:
            "Nous ne nous contentons pas de vous former. Nous vous accompagnons jusqu'à la signature de votre contrat : coaching, réseau et accès exclusif.",
          checklist: [
            "Accompagnement individuel",
            "Communauté d'experts active",
            "Réseau d'entreprises partenaires",
          ],
        }
      : {
          shellEyebrow: "Project-based learning",
          shellTitle:
            "Become who you want to be. Learn by doing.",
          panelEyebrow: "Job Guarantee",
          panelTitle: "Your dream job, or your money back.",
          panelDescription:
            "We don't just train you. We support you until you sign your contract: coaching, networking, and exclusive access.",
          checklist: [
            "Individual support",
            "Active expert community",
            "Partner company network",
          ],
        };

  return (
    <section className="relative overflow-hidden bg-[#fbfbfd] pb-20 pt-16 sm:pb-24 sm:pt-20">
      {/* Premium Background Gradients */}
      <div className="absolute inset-x-0 top-0 h-[800px] bg-[radial-gradient(circle_at_top,rgba(0,102,204,0.12),rgba(255,255,255,0)_60%)]" />
      <div className="absolute right-[-10%] top-20 h-[500px] w-[500px] rounded-full bg-[#0066cc]/5 blur-[120px]" />
      <div className="absolute left-[-10%] top-48 h-[500px] w-[500px] rounded-full bg-slate-200/40 blur-[120px]" />

      <div className="apple-section-shell relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d2d2d7]/50 bg-white/60 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1d1d1f] shadow-sm backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-1000">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {announcement}
          </div>

          <p className="mt-10 text-[13px] font-bold uppercase tracking-[0.25em] text-[#86868b] animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-200">
            {eyebrow}
          </p>

          <h1 className="mt-6 text-6xl font-semibold tracking-tight text-[#1d1d1f] sm:text-7xl lg:text-[84px] leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            {title}
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-[21px] leading-relaxed text-[#86868b] sm:text-[24px] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
            {subtitle}
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <Link href={`/${lang}/courses`}>
              <Button className="h-14 rounded-full bg-[#1d1d1f] px-10 text-lg font-bold text-white shadow-2xl shadow-black/10 hover:bg-black hover:scale-[1.02] transition-all">
                {primaryCta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href={`/${lang}/auth/signup`}>
              <Button
                variant="outline"
                className="h-14 rounded-full border-[#d2d2d7] bg-white/60 px-10 text-lg font-bold text-[#1d1d1f] shadow-sm backdrop-blur-xl hover:bg-white transition-all"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                {secondaryCta}
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid - Apple Style Bento */}
        <div className="mt-24 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="relative overflow-hidden rounded-[48px] bg-white border border-[#d2d2d7] p-10 shadow-sm transition-all hover:shadow-2xl hover:shadow-black/5 group">
            <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgba(0,102,204,0.08),transparent_70%)]" />
            <div className="relative flex min-h-[400px] flex-col justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f7] text-[#1d1d1f] text-[11px] font-bold uppercase tracking-widest mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-[#0066cc]" /> {secondaryCopy.shellEyebrow}
                </div>
                <h2 className="text-[40px] font-semibold tracking-tight text-[#1d1d1f] leading-tight mb-8">
                  {secondaryCopy.shellTitle}
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[32px] border border-[#d2d2d7]/50 bg-[#f5f5f7]/50 p-6 shadow-sm transition-all hover:bg-white hover:border-[#1d1d1f]/20"
                  >
                    <p className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[13px] font-bold text-[#86868b] uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[48px] bg-[#1d1d1f] p-10 text-white shadow-2xl relative group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,102,204,0.4),transparent_60%)] opacity-50" />
              <div className="relative flex h-full min-h-[400px] flex-col justify-between z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest mb-6">
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" /> {secondaryCopy.panelEyebrow}
                  </div>
                  <h3 className="text-[40px] font-semibold tracking-tight leading-tight">
                    {secondaryCopy.panelTitle}
                  </h3>
                  <p className="mt-6 text-[19px] leading-relaxed text-white/70">
                    {secondaryCopy.panelDescription}
                  </p>
                </div>

                <div className="space-y-3 pt-8">
                {secondaryCopy.checklist.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-[15px] font-bold backdrop-blur-xl"
                  >
                    <UserCheck className="w-4.5 h-4.5 text-emerald-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
