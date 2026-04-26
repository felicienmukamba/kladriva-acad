import Link from "next/link";
import { ArrowRight, BadgeCheck, Layers3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  imageUrl?: string | null;
}

interface CoursePreviewProps {
  lang: string;
  courses: Course[];
}

export function CoursePreview({ lang, courses }: CoursePreviewProps) {
  const copy =
    lang === "fr"
      ? {
          eyebrow: "Programmes",
          heading: "Choisissez la formation qui convertit votre ambition en progression visible.",
          description:
            "Chaque programme doit sembler desirable, credible et simple a rejoindre. La grille ci-dessous sert autant a inspirer qu'a faire cliquer.",
          viewAll: "Voir toutes les formations",
          cardCta: "Voir le programme",
          tags: ["Projet reel", "Acces immediat", "Certificat"],
          ctaTitle: "Pret a lancer vos ventes de formations ?",
          ctaDescription:
            "La nouvelle landing met en scene vos offres comme un produit premium, avec un parcours de lecture plus convaincant et plus memorable.",
          primaryCta: "Explorer le catalogue",
          secondaryCta: "Creer un compte",
        }
      : {
          eyebrow: "Programs",
          heading: "Choose the training that turns ambition into visible progress.",
          description:
            "Each program should feel desirable, credible, and easy to join. This grid is built to inspire and to get clicks.",
          viewAll: "View all courses",
          cardCta: "View program",
          tags: ["Real project", "Instant access", "Certificate"],
          ctaTitle: "Ready to start selling your training programs?",
          ctaDescription:
            "The new landing page presents your offers like a premium product with a stronger reading flow and clearer conversion moments.",
          primaryCta: "Browse catalog",
          secondaryCta: "Create account",
        };

  return (
    <section id="programs" className="bg-white py-16 sm:py-24">
      <div className="apple-section-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {copy.eyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              {copy.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              {copy.description}
            </p>
          </div>

          <Link
            href={`/${lang}/courses`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition-colors hover:text-primary"
          >
            {copy.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <Link href={`/${lang}/courses/${course.id}`} key={course.id} className="group">
                <article className="relative overflow-hidden rounded-[34px] border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1">
                  <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-sky-100/80 blur-3xl transition-transform duration-500 group-hover:scale-110" />
                  <div className="relative flex h-full min-h-[260px] flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                        <Sparkles className="h-3.5 w-3.5" />
                        {index === 0 ? "Signature" : "Growth track"}
                      </div>
                      <h3 className="mt-6 max-w-xl text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                        {course.title}
                      </h3>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {copy.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <BadgeCheck className="h-4 w-4 text-primary" />
                        <span>{copy.cardCta}</span>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition-transform duration-300 group-hover:translate-x-0.5">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            [1, 2].map((placeholder) => (
              <div
                key={placeholder}
                className="min-h-[260px] animate-pulse rounded-[34px] border border-slate-200 bg-slate-50"
              />
            ))
          )}
        </div>

        <div className="mt-8 overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.92),rgba(15,23,42,1)_52%,rgba(37,99,235,0.94)_120%)] p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.14)] sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                <Layers3 className="mr-2 h-3.5 w-3.5" />
                Conversion-focused landing page
              </div>
              <h3 className="mt-5 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                {copy.ctaTitle}
              </h3>
              <p className="mt-4 text-base leading-7 text-white/72">
                {copy.ctaDescription}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={`/${lang}/courses`}>
                <Button className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-slate-950 hover:bg-slate-100">
                  {copy.primaryCta}
                </Button>
              </Link>
              <Link href={`/${lang}/auth/signup`}>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/8 px-6 text-sm font-semibold text-white hover:bg-white/12"
                >
                  {copy.secondaryCta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
