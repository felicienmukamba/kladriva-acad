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
    <footer className="bg-[#f5f5f7] py-16 border-t border-[#d2d2d7]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href={`/${lang}`} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1d1d1f] text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">
                Kladriva Academy
              </span>
            </Link>
            <p className="mt-4 text-[13px] leading-relaxed text-[#86868b]">{copy.description}</p>
          </div>

          {copy.sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#1d1d1f]">
                {section.title}
              </h4>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[#86868b] transition-colors hover:text-[#1d1d1f]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-[#d2d2d7] pt-8 text-[12px] text-[#86868b] text-center">
          {copy.footer}
        </div>
      </div>
    </footer>
  );
}
