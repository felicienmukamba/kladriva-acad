import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CoursePreview } from "@/components/landing/CoursePreview";
import { Footer } from "@/components/landing/Footer";
import { ShowcaseCarousel } from "@/components/landing/ShowcaseCarousel";
import { Navbar } from "@/components/Navbar";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: "en" | "fr" };

  const [courses, publishedCourseCount, publishedPathCount] = await Promise.all([
    prisma.course.findMany({
      where: { published: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.count({ where: { published: true } }),
    prisma.path.count({ where: { published: true } }),
  ]);

  const copy =
    lang === "fr"
      ? {
          hero: {
            eyebrow: "L'academie qui transforme les visiteurs en eleves engages",
            title: "Des formations premium pour apprendre, progresser et acheter avec confiance.",
            subtitle:
              "Une landing page plus proche de l'univers Apple: sobre, nette, immersive et construite pour donner envie de rejoindre vos programmes.",
            primaryCta: "Voir les formations",
            secondaryCta: "Creer mon compte",
            announcement: "Nouveau design de landing page",
            stats: [
              { value: `${publishedCourseCount}+`, label: "formations publiees" },
              { value: `${publishedPathCount}+`, label: "parcours premium" },
              { value: "100%", label: "experience mobile et desktop" },
            ],
          },
          carouselHeading: "Un carrousel editorial qui donne le ton des offres.",
          carouselDescription:
            "Chaque slide presente une promesse claire, une mise en scene premium et une prochaine action evidente, avec un rendu beaucoup plus cinematographique que votre home actuelle.",
          slides: [
            {
              eyebrow: "Flagship program",
              title: "Frontend haut de gamme, experience ultra fluide.",
              description:
                "Mettez vos formations au niveau d'un produit premium grace a une narration visuelle plus forte et des points d'entree mieux choisis.",
              detail: "Hero large, typographie ample, CTA forts",
              href: `/${lang}/courses`,
              cta: "Explorer",
              theme: "light" as const,
            },
            {
              eyebrow: "Mentorat",
              title: "Des parcours qui rassurent avant meme l'inscription.",
              description:
                "Les visiteurs comprennent plus vite ce qu'ils achetent: accompagnement, structure, progression et resultat professionnel.",
              detail: "Confiance, clarte, valeur percue",
              href: `/${lang}/paths`,
              cta: "Voir les parcours",
              theme: "dark" as const,
            },
            {
              eyebrow: "Conversion",
              title: "Une page qui pousse naturellement a passer a l'action.",
              description:
                "Le design ne se contente plus d'etre joli: il sert le catalogue, renforce les CTA et rend vos programmes plus desirables.",
              detail: "Sections memorables et rythme editorial",
              href: `/${lang}/auth/signup`,
              cta: "Commencer",
              theme: "accent" as const,
            },
          ],
        }
      : {
          hero: {
            eyebrow: "An academy built to turn visitors into committed learners",
            title: "Premium training programs that feel clear, credible, and worth buying.",
            subtitle:
              "A landing page closer to Apple's visual rhythm: calm, sharp, immersive, and intentionally designed to increase trust and enrollment.",
            primaryCta: "Browse courses",
            secondaryCta: "Create account",
            announcement: "New landing page redesign",
            stats: [
              { value: `${publishedCourseCount}+`, label: "published programs" },
              { value: `${publishedPathCount}+`, label: "guided paths" },
              { value: "100%", label: "responsive buying flow" },
            ],
          },
          carouselHeading: "An editorial carousel that sets the tone for the offer.",
          carouselDescription:
            "Each slide combines a clear promise, premium presentation, and an obvious next step, making the homepage feel more cinematic and more intentional.",
          slides: [
            {
              eyebrow: "Flagship program",
              title: "Premium frontend design with a smoother buying experience.",
              description:
                "Present your training like a polished product with stronger storytelling and more deliberate entry points.",
              detail: "Large hero, spacious typography, stronger CTAs",
              href: `/${lang}/courses`,
              cta: "Explore",
              theme: "light" as const,
            },
            {
              eyebrow: "Mentorship",
              title: "Guided paths that reduce hesitation before enrollment.",
              description:
                "Visitors understand faster what they are paying for: support, structure, progress, and professional outcomes.",
              detail: "Trust, clarity, and perceived value",
              href: `/${lang}/paths`,
              cta: "View paths",
              theme: "dark" as const,
            },
            {
              eyebrow: "Conversion",
              title: "A homepage that naturally moves people to take action.",
              description:
                "The design no longer just looks good. It supports the catalog, reinforces the CTAs, and makes each program feel more desirable.",
              detail: "Memorable sections with editorial pacing",
              href: `/${lang}/auth/signup`,
              cta: "Get started",
              theme: "accent" as const,
            },
          ],
        };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 font-sans">
      <Navbar />

      <Hero
        lang={lang}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        subtitle={copy.hero.subtitle}
        primaryCta={copy.hero.primaryCta}
        secondaryCta={copy.hero.secondaryCta}
        announcement={copy.hero.announcement}
        stats={copy.hero.stats}
      />

      <ShowcaseCarousel
        heading={copy.carouselHeading}
        description={copy.carouselDescription}
        slides={copy.slides}
      />

      <Features lang={lang} />

      <CoursePreview
        lang={lang}
        courses={courses}
      />

      <Footer lang={lang} />
    </div>
  );
}
