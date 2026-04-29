import { ArrowUpRight, BriefcaseBusiness, Sparkles, Users, Target, ShieldCheck, Rocket } from "lucide-react";

interface FeaturesProps {
  lang: string;
}

export function Features({ lang }: FeaturesProps) {
  const copy =
    lang === "fr"
      ? {
          eyebrow: "Pourquoi Kladriva ?",
          heading: "Une pédagogie pensée pour votre premier job.",
          description:
            "Nous avons supprimé tout ce qui est inutile pour nous concentrer sur ce qui compte vraiment : votre employabilité et votre maîtrise technique.",
          cards: [
            {
              icon: Target,
              title: "Apprentissage par Projet",
              description:
                "Pas de QCM. Vous validez vos compétences en réalisant des projets concrets, identiques à ceux rencontrés en entreprise.",
              tone: "light",
            },
            {
              icon: Users,
              title: "Mentorat d'Elite",
              description:
                "Chaque semaine, un expert du métier vous coache en direct. C'est votre filet de sécurité et votre accélérateur de progression.",
              tone: "dark",
            },
            {
              icon: BriefcaseBusiness,
              title: "Garantie de Succès",
              description:
                "Notre objectif est votre embauche. Nous vous préparons au marché du travail avec un coaching carrière ultra-personnalisé.",
              tone: "accent",
            },
          ],
          statsTitle: "La méthode OpenClassrooms inspirée",
          stats: [
            "Projets réels validés par des experts",
            "Mentorat individuel hebdomadaire",
            "Certifications reconnues par l'État",
          ],
        }
      : {
          eyebrow: "Why Kladriva?",
          heading: "Pedagogy designed for your first job.",
          description:
            "We've removed everything unnecessary to focus on what really matters: your employability and technical mastery.",
          cards: [
            {
              icon: Target,
              title: "Project-Based Learning",
              description:
                "No multiple-choice questions. You validate your skills by completing concrete projects, identical to those in the industry.",
              tone: "light",
            },
            {
              icon: Users,
              title: "Elite Mentorship",
              description:
                "Every week, an industry expert coaches you live. They are your safety net and your progress accelerator.",
              tone: "dark",
            },
            {
              icon: BriefcaseBusiness,
              title: "Success Guarantee",
              description:
                "Our goal is your hiring. We prepare you for the job market with ultra-personalized career coaching.",
              tone: "accent",
            },
          ],
          statsTitle: "Inspired Learning Method",
          stats: [
            "Real projects validated by experts",
            "Weekly individual mentorship",
            "State-recognized certifications",
          ],
        };

  const cardToneClasses = {
    light:
      "bg-white text-[#1d1d1f] border-[#d2d2d7]/50",
    dark:
      "bg-[#1d1d1f] text-white border-white/10",
    accent:
      "bg-[#0066cc] text-white border-white/10",
  } as const;

  return (
    <section id="results" className="bg-[#f5f5f7] py-24 sm:py-32">
      <div className="apple-section-shell">
        <div className="mx-auto max-w-4xl text-center mb-20">
          <p className="text-[13px] font-bold uppercase tracking-[0.25em] text-[#86868b] mb-4">
            {copy.eyebrow}
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-6xl lg:text-7xl leading-tight">
            {copy.heading}
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-[21px] leading-relaxed text-[#86868b]">
            {copy.description}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div className="grid gap-6 md:grid-cols-3">
            {copy.cards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className={`relative overflow-hidden rounded-[40px] p-8 flex flex-col justify-between min-h-[360px] border shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 ${cardToneClasses[card.tone as keyof typeof cardToneClasses]}`}
                >
                  <div>
                    <div className={`inline-flex rounded-2xl p-3 ${card.tone === 'light' ? 'bg-[#f5f5f7]' : 'bg-white/10'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-8 text-2xl font-bold tracking-tight">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed opacity-70">
                      {card.description}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 self-end opacity-40" />
                </article>
              );
            })}
          </div>

          <aside className="overflow-hidden rounded-[40px] border border-[#d2d2d7] bg-white p-10 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.25em] text-[#86868b] mb-8">
                {copy.statsTitle}
              </p>
              <div className="space-y-6">
                {copy.stats.map((stat, index) => (
                  <div
                    key={stat}
                    className="flex items-center gap-5 p-5 rounded-[24px] bg-[#f5f5f7]/50 border border-transparent hover:border-[#d2d2d7]/30 transition-all"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1d1d1f] text-sm font-bold text-white shadow-sm">
                      {index + 1}
                    </div>
                    <p className="text-[17px] font-semibold text-[#1d1d1f]">{stat}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 p-6 rounded-[32px] bg-[#0066cc]/5 border border-[#0066cc]/10 flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Rocket className="w-6 h-6 text-[#0066cc]" />
               </div>
               <div>
                  <p className="text-[15px] font-bold text-[#1d1d1f]">Démarrage immédiat</p>
                  <p className="text-[13px] text-[#86868b]">Rejoignez la cohorte de ce mois.</p>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
