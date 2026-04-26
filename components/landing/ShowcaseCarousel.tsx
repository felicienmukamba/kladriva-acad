"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SlideTheme = "light" | "dark" | "accent";

interface ShowcaseSlide {
  eyebrow: string;
  title: string;
  description: string;
  detail: string;
  href: string;
  cta: string;
  theme: SlideTheme;
}

interface ShowcaseCarouselProps {
  heading: string;
  description: string;
  slides: ShowcaseSlide[];
}

const slideThemes: Record<SlideTheme, string> = {
  light:
    "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(244,244,245,0.85)_45%,rgba(226,232,240,0.9))] text-slate-950",
  dark:
    "bg-[radial-gradient(circle_at_top_left,rgba(39,39,42,0.92),rgba(17,24,39,0.96)_55%,rgba(2,6,23,1))] text-white",
  accent:
    "bg-[radial-gradient(circle_at_top_left,rgba(217,230,255,0.95),rgba(149,184,255,0.92)_40%,rgba(28,99,255,0.95))] text-white",
};

export function ShowcaseCarousel({
  heading,
  description,
  slides,
}: ShowcaseCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current || slides.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4800);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const container = containerRef.current;
    const slide = container?.children[activeIndex] as HTMLElement | undefined;

    if (!container || !slide) {
      return;
    }

    container.scrollTo({
      left: slide.offsetLeft - 16,
      behavior: "smooth",
    });
  }, [activeIndex]);

  const moveTo = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  return (
    <section id="experience" className="py-8 sm:py-12">
      <div className="apple-section-shell">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Experience
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl">
              {heading}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            {description}
          </p>
        </div>

        <div className="relative">
          <div
            ref={containerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {slides.map((slide, index) => (
              <article
                key={`${slide.title}-${index}`}
                className={`group relative min-h-[420px] w-[88%] flex-none snap-center overflow-hidden rounded-[34px] p-7 shadow-[0_40px_90px_rgba(15,23,42,0.12)] transition-transform duration-500 md:w-[78%] md:p-10 ${slideThemes[slide.theme]}`}
              >
                <div className="absolute inset-0 opacity-70">
                  <div className="absolute -left-16 top-6 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
                  <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-black/12 blur-3xl" />
                </div>

                <div className="relative flex h-full flex-col justify-between">
                  <div className="max-w-2xl">
                    <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-current/70">
                      {slide.eyebrow}
                    </p>
                    <h3 className="max-w-2xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl md:text-6xl">
                      {slide.title}
                    </h3>
                    <p className="mt-5 max-w-xl text-base leading-7 text-current/78 sm:text-lg">
                      {slide.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="inline-flex w-fit rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-medium text-current/92 backdrop-blur-xl">
                      {slide.detail}
                    </div>
                    <Link
                      href={slide.href}
                      className="inline-flex h-11 w-fit items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      {slide.cta}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={`${slide.title}-dot-${index}`}
                  type="button"
                  onClick={() => moveTo(index)}
                  aria-label={slide.title}
                  className={`h-2.5 rounded-full transition-all ${
                    activeIndex === index
                      ? "w-8 bg-slate-950"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveTo(activeIndex - 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-950"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => moveTo(activeIndex + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-950"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
