import { ArrowUpRight, BriefcaseBusiness, Sparkles, Users } from "lucide-react";

interface FeaturesProps {
  lang: string;
}

export function Features({ lang }: FeaturesProps) {
  const copy =
    lang === "fr"
      ? {
          eyebrow: "Pourquoi Kladriva",
          heading: "Des formations concues pour donner de la valeur avant meme l'achat.",
          description:
            "Le design doit inspirer confiance, mais l'offre doit aussi paraitre concrete. Cette section met en avant ce que le client obtient reellement.",
          cards: [
            {
              icon: Sparkles,
              title: "Une experience premium",
              description:
                "Interface epuree, rythme editorial et details soignes pour positionner l'academie comme une offre haut de gamme.",
              tone: "light",
            },
            {
              icon: Users,
              title: "Un accompagnement visible",
              description:
                "Mentorat, retours, communaute et parcours guides pour rassurer les visiteurs avant l'inscription.",
              tone: "dark",
            },
            {
              icon: BriefcaseBusiness,
              title: "Un resultat professionnel",
              description:
                "Programmes orientes portfolio, emploi et progression concrete plutot que simple accumulation de videos.",
              tone: "accent",
            },
          ],
          statsTitle: "Ce qui declenche l'achat",
          stats: [
            "Promesse claire en moins de 5 secondes",
            "Navigation simple avec sections memorables",
            "CTA repetes sans agressivite",
          ],
        }
      : {
          eyebrow: "Why Kladriva",
          heading: "Programs designed to create value before the visitor even buys.",
          description:
            "Premium design builds trust, but the offer also needs to feel tangible. This section makes the product feel concrete and worth paying for.",
          cards: [
            {
              icon: Sparkles,
              title: "A premium experience",
              description:
                "Clean interface, editorial pacing, and polished details that position the academy as a high-value offer.",
              tone: "light",
            },
            {
              icon: Users,
              title: "Visible support",
              description:
                "Mentoring, feedback, community, and guided paths that reduce hesitation before enrollment.",
              tone: "dark",
            },
            {
              icon: BriefcaseBusiness,
              title: "Professional outcomes",
              description:
                "Programs built around portfolio, employability, and real progression instead of passive video consumption.",
              tone: "accent",
            },
          ],
          statsTitle: "What drives conversion",
          stats: [
            "A clear promise in under five seconds",
            "Simple navigation with memorable sections",
            "Repeated CTAs without feeling pushy",
          ],
        };

  const cardToneClasses = {
    light:
      "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,244,245,0.95))] text-slate-950 border-black/6",
    dark:
      "bg-[radial-gradient(circle_at_top_left,rgba(39,39,42,0.94),rgba(2,6,23,1)_68%)] text-white border-white/8",
    accent:
      "bg-[radial-gradient(circle_at_top_left,rgba(191,219,254,0.92),rgba(59,130,246,0.95)_42%,rgba(15,23,42,1)_120%)] text-white border-white/10",
  } as const;

  return (
    <section id="results" className="bg-[#f5f5f7] py-16 sm:py-24">
      <div className="apple-section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            {copy.eyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            {copy.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            {copy.description}
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
          <div className="grid gap-4 md:grid-cols-3">
            {copy.cards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className={`relative overflow-hidden rounded-[32px] p-10 flex flex-col transition-all duration-700 hover:shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${cardToneClasses[card.tone as keyof typeof cardToneClasses]}`}
                >
                  <div className="flex h-full flex-col justify-between gap-10">
                    <div>
                      <div className="inline-flex rounded-full bg-white/14 p-3 backdrop-blur-xl">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">
                        {card.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-current/75">
                        {card.description}
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-current/70" />
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="overflow-hidden rounded-[32px] border border-black/6 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {copy.statsTitle}
            </p>
            <div className="mt-6 space-y-4">
              {copy.stats.map((stat, index) => (
                <div
                  key={stat}
                  className="flex items-start gap-4 rounded-[24px] bg-slate-50 px-4 py-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-600">{stat}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
