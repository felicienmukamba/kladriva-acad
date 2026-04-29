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
            eyebrow: "L'accélérateur de carrière tech",
            title: "Devenez l'expert que les entreprises s'arrachent.",
            subtitle:
              "Kladriva Academy transforme votre potentiel en expertise concrète. Profitez de parcours diplômants, de projets réels et d'un mentorat individuel pour garantir votre succès.",
            primaryCta: "Trouver ma formation",
            secondaryCta: "Voir le fonctionnement",
            announcement: "Diplômes reconnus par l'État et mentorat d'élite",
            stats: [
              { value: `${publishedCourseCount}+`, label: "programmes certifiants" },
              { value: `${publishedPathCount}+`, label: "parcours métiers" },
              { value: "100%", label: "réussite mentorée" },
            ],
          },
          carouselHeading: "Plus qu'une formation, un nouveau départ professionnel.",
          carouselDescription:
            "Nos méthodes d'apprentissage sont basées sur la pratique intensive et l'accompagnement par des professionnels du secteur. Obtenez un diplôme, trouvez un job.",
          slides: [
            {
              eyebrow: "Diplômes reconnus",
              title: "Parcours Diplômants de Niveau 6 et 7 (Bac+3/5)",
              description:
                "Obtenez un titre RNCP officiel. Nos cursus en Développement Fullstack, Data Science et Cloud Architecture sont conçus pour l'emploi.",
              detail: "Certification Officielle • Mentorat Hebdo • Projet Réel",
              href: `/${lang}/courses`,
              cta: "Explorer les diplômes",
              theme: "light" as const,
            },
            {
              eyebrow: "Garantie Emploi",
              title: "Votre CDI en moins de 6 mois, ou remboursé",
              description:
                "Nous sommes les seuls à nous engager sur votre réussite. Si vous ne trouvez pas d'emploi après votre diplôme, nous vous remboursons vos frais.",
              detail: "Coaching Carrière • Job Board Privé • Réseau Alumni",
              href: `/${lang}/paths`,
              cta: "Découvrir la garantie",
              theme: "dark" as const,
            },
            {
              eyebrow: "Mentorat Individuel",
              title: "Un Expert Dédié à 100% à Votre Progression",
              description:
                "Chaque semaine, votre mentor (un pro du secteur) vous guide en visioconférence. Il valide vos compétences et vous aide à lever chaque blocage.",
              detail: "Revue de Code • Session Live • Suivi Personnalisé",
              href: `/${lang}/auth/signup`,
              cta: "Démarrer maintenant",
              theme: "accent" as const,
            },
          ],
        }
      : {
          hero: {
            eyebrow: "The Tech Career Accelerator",
            title: "Become the Expert Companies Are Looking For.",
            subtitle:
              "Kladriva Academy transforms your potential into concrete expertise. Benefit from degree programs, real-world projects, and individual mentorship to guarantee your success.",
            primaryCta: "Find My Program",
            secondaryCta: "See How It Works",
            announcement: "State-recognized degrees and elite mentorship",
            stats: [
              { value: `${publishedCourseCount}+`, label: "certified programs" },
              { value: `${publishedPathCount}+`, label: "career paths" },
              { value: "100%", label: "mentored success" },
            ],
          },
          carouselHeading: "More Than a Course, a Professional New Beginning.",
          carouselDescription:
            "Our learning methods are based on intensive practice and coaching by industry professionals. Get a degree, find a job.",
          slides: [
            {
              eyebrow: "Recognized Degrees",
              title: "Bachelor's & Master's Level Programs",
              description:
                "Earn an official accredited degree. Our Fullstack Development, Data Science, and Cloud Architecture courses are built for employability.",
              detail: "Official Certification • Weekly Mentorship • Real Projects",
              href: `/${lang}/courses`,
              cta: "Explore Degrees",
              theme: "light" as const,
            },
            {
              eyebrow: "Job Guarantee",
              title: "A Job in Under 6 Months, or Your Money Back",
              description:
                "We are the only ones committed to your success. If you don't find a job after graduation, we will refund your tuition fees.",
              detail: "Career Coaching • Private Job Board • Alumni Network",
              href: `/${lang}/paths`,
              cta: "See Guarantee",
              theme: "dark" as const,
            },
            {
              eyebrow: "Individual Mentorship",
              title: "An Expert 100% Dedicated to Your Progress",
              description:
                "Every week, your mentor (an industry pro) guides you via video call. They validate your skills and help you clear every hurdle.",
              detail: "Code Review • Live Sessions • Personalized Follow-up",
              href: `/${lang}/auth/signup`,
              cta: "Start Now",
              theme: "accent" as const,
            },
          ],
        };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
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
