"use client";

import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
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
            "Apprenez en réalisant des projets concrets, comme en entreprise.",
          panelEyebrow: "Coaching carrière",
          panelTitle: "On ne vous lâche pas tant que vous n'êtes pas en poste.",
          panelDescription:
            "Au-delà des cours, nous vous préparons au marché du travail : CV, portfolio, entretiens blancs et accès exclusif à nos entreprises partenaires.",
          checklist: [
            "Accompagnement personnalisé",
            "Communauté d'entraide active",
            "Réseau d'entreprises partenaires",
          ],
        }
      : {
          shellEyebrow: "Project-based learning",
          shellTitle:
            "Learn by building real-world projects, just like in a company.",
          panelEyebrow: "Career Coaching",
          panelTitle: "We don't let go until you're hired.",
          panelDescription:
            "Beyond courses, we prepare you for the job market: CV, portfolio, mock interviews, and exclusive access to our partner companies.",
          checklist: [
            "Personalized support",
            "Active peer community",
            "Partner company network",
          ],
        };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_42%,#f6f7fb_100%)] pb-12 pt-10 sm:pb-16 sm:pt-14">
      <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.17),rgba(255,255,255,0)_58%)]" />
      <div className="absolute right-[-120px] top-20 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />
      <div className="absolute left-[-120px] top-48 h-72 w-72 rounded-full bg-slate-200/60 blur-3xl" />

      <div className="apple-section-shell relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {announcement}
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            {eyebrow}
          </p>

          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.065em] text-slate-950 sm:text-6xl lg:text-7xl">
            {title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            {subtitle}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={`/${lang}/courses`}>
              <Button className="h-12 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(15,23,42,0.18)] hover:bg-slate-800">
                {primaryCta}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/${lang}/auth/signup`}>
              <Button
                variant="outline"
                className="h-12 rounded-full border-slate-200 bg-white/85 px-6 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-xl hover:bg-white"
              >
                <PlayCircle className="mr-1 h-4 w-4" />
                {secondaryCta}
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="relative overflow-hidden rounded-[36px] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(244,244,245,0.92)_45%,rgba(226,232,240,0.95))] p-8 shadow-[0_32px_90px_rgba(15,23,42,0.12)] sm:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-white/80" />
            <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.22),rgba(59,130,246,0)_65%)]" />
            <div className="relative flex min-h-[340px] flex-col justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {secondaryCopy.shellEyebrow}
                </p>
                <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
                  {secondaryCopy.shellTitle}
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[28px] border border-white/70 bg-white/78 p-5 shadow-sm backdrop-blur-xl"
                  >
                    <p className="text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[36px] bg-[radial-gradient(circle_at_top,rgba(46,101,255,0.85),rgba(15,23,42,1)_72%)] p-8 text-white shadow-[0_32px_90px_rgba(15,23,42,0.18)] sm:p-10">
              <div className="flex h-full min-h-[340px] flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">
                    {secondaryCopy.panelEyebrow}
                  </p>
                  <h3 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
                    {secondaryCopy.panelTitle}
                  </h3>
                  <p className="mt-5 text-base leading-7 text-white/72">
                    {secondaryCopy.panelDescription}
                  </p>
                </div>

                <div className="space-y-3">
                {secondaryCopy.checklist.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/12 bg-white/10 px-4 py-3 text-sm font-medium backdrop-blur-xl"
                  >
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
