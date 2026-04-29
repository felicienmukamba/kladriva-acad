import { ArrowUpRight, BriefcaseBusiness, Sparkles, Users } from "lucide-react";

interface FeaturesProps {
  lang: string;
}

export function Features({ lang }: FeaturesProps) {
  const copy =
    lang === "fr"
      ? {
          eyebrow: "Pourquoi choisir Kladriva ?",
          heading: "Une méthode d'apprentissage unique pour des résultats garantis.",
          description:
            "Oubliez les cours théoriques ennuyeux. Nous avons repensé la formation en ligne pour la rendre vivante, humaine et directement applicable en entreprise.",
          cards: [
            {
              icon: Sparkles,
              title: "Apprenez à votre rythme",
              description:
                "Accédez à vos cours 24h/24 et 7j/7. Progressez selon votre emploi du temps, sans stress, tout en restant accompagné.",
              tone: "light",
            },
            {
              icon: Users,
              title: "Un mentor dédié",
              description:
                "Chaque semaine, échangez en direct avec un expert de votre futur métier. Recevez des feedbacks personnalisés sur vos projets.",
              tone: "dark",
            },
            {
              icon: BriefcaseBusiness,
              title: "Focus Employabilité",
              description:
                "Construisez un portfolio solide avec des projets inspirés de cas réels en entreprise. Soyez prêt à être recruté dès la fin de votre cursus.",
              tone: "accent",
            },
          ],
          statsTitle: "Les clés de votre succès",
          stats: [
            "Parcours flexibles adaptés à votre vie",
            "Certification reconnue et valorisée",
            "Coaching carrière jusqu'à l'embauche",
          ],
        }
      : {
          eyebrow: "Why choose Kladriva?",
          heading: "A unique learning method for guaranteed results.",
          description:
            "Forget boring theory. We've redesigned online training to make it alive, human, and directly applicable in a corporate environment.",
          cards: [
            {
              icon: Sparkles,
              title: "Learn at your own pace",
              description:
                "Access your courses 24/7. Progress according to your schedule, stress-free, while remaining fully supported.",
              tone: "light",
            },
            {
              icon: Users,
              title: "A dedicated mentor",
              description:
                "Every week, talk live with an expert in your future career. Get personalized feedback on all your projects.",
              tone: "dark",
            },
            {
              icon: BriefcaseBusiness,
              title: "Employability focus",
              description:
                "Build a solid portfolio with projects inspired by real business cases. Be ready to get hired by the end of your program.",
              tone: "accent",
            },
          ],
          statsTitle: "The keys to your success",
          stats: [
            "Flexible paths adapted to your life",
            "Recognized and valued certification",
            "Career coaching until you're hired",
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
