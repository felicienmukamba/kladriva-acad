import Link from "next/link";
import { GraduationCap } from "lucide-react";

interface FooterProps {
  lang: string;
}

export function Footer({ lang }: FooterProps) {
  const copy =
    lang === "fr"
      ? {
          description:
            "Une academie qui vend mieux ses formations grace a une experience plus claire, plus premium et plus rassurante.",
          sections: [
            {
              title: "Explorer",
              links: [
                { label: "Formations", href: `/${lang}/courses` },
                { label: "Parcours", href: `/${lang}/paths` },
                { label: "A propos", href: `/${lang}/about` },
              ],
            },
            {
              title: "Entreprise",
              links: [
                { label: "Carrieres", href: `/${lang}/careers` },
                { label: "Contact", href: `/${lang}/contact` },
                { label: "Aide", href: `/${lang}/help` },
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Confidentialite", href: `/${lang}/privacy` },
                { label: "Conditions", href: `/${lang}/terms` },
              ],
            },
          ],
          footer: "© 2026 Kladriva Academy. Experience premium, progression reelle.",
        }
      : {
          description:
            "An academy designed to sell training more effectively through a clearer, more premium, and more reassuring experience.",
          sections: [
            {
              title: "Explore",
              links: [
                { label: "Courses", href: `/${lang}/courses` },
                { label: "Paths", href: `/${lang}/paths` },
                { label: "About", href: `/${lang}/about` },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "Careers", href: `/${lang}/careers` },
                { label: "Contact", href: `/${lang}/contact` },
                { label: "Help", href: `/${lang}/help` },
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Privacy", href: `/${lang}/privacy` },
                { label: "Terms", href: `/${lang}/terms` },
              ],
            },
          ],
          footer: "© 2026 Kladriva Academy. Premium experience, real progress.",
        };

  return (
    <footer className="border-t border-black/6 bg-[#f5f5f7] py-12">
      <div className="apple-section-shell">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href={`/${lang}`} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold tracking-[-0.02em] text-slate-950">
                Kladriva Academy
              </span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-slate-500">{copy.description}</p>
          </div>

          {copy.sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {section.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 transition-colors hover:text-slate-950"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-black/6 pt-6 text-xs text-slate-500">
          {copy.footer}
        </div>
      </div>
    </footer>
  );
}
