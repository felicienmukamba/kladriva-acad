"use client"

import Link from "next/link"
import { GraduationCap, Quote, Star, Sparkles, BookOpen, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

const slides = [
  {
    icon: Sparkles,
    title: "Master Industrial AI",
    description: "Join the next generation of engineers building the world's most advanced automated systems.",
    testimonial: "The courses here transformed my career. I went from junior to lead in just one year.",
    author: "Marc-Aurel T.",
    role: "AI Engineer at Tesla"
  },
  {
    icon: BookOpen,
    title: "Curated Learning Paths",
    description: "Follow paths designed by industry experts to take you from beginner to job-ready professional.",
    testimonial: "Highly technical but accessible. The best academy for industrial tech in the region.",
    author: "Elena G.",
    role: "Senior Developer"
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    description: "Get one-on-one guidance from senior engineers working at top global tech companies.",
    testimonial: "My mentor helped me navigate the complexities of real-world production environments.",
    author: "Kevin L.",
    role: "Full-stack Developer"
  }
]

export function AuthShell({
  lang,
  title,
  subtitle,
  children,
}: {
  lang: string
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-primary/10 selection:text-primary">
      {/* Left Side: Marketing Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-40">
           <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-rose-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 w-full h-full p-16 flex flex-col justify-between">
          <Link href={`/${lang}`} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">
              Kladriva
            </span>
          </Link>

          <div className="relative h-96">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <div className="mb-8">
                  {slides[currentSlide].icon && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-foreground text-xs font-bold uppercase tracking-widest mb-6">
                      {(() => {
                        const Icon = slides[currentSlide].icon;
                        return <Icon className="w-3 h-3 text-primary" />;
                      })()}
                      Next-Gen Learning
                    </div>
                  )}
                  <h2 className="text-5xl font-black tracking-tight text-white mb-6 leading-[1.1]">
                    {slides[currentSlide].title}
                  </h2>
                  <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
                    {slides[currentSlide].description}
                  </p>
                </div>

                <div className="mt-8 p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 relative group">
                  <Quote className="absolute top-6 left-6 w-8 h-8 text-white/5 group-hover:text-white/10 transition-colors" />
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-lg italic text-slate-200 mb-6 relative z-10 leading-relaxed">
                    "{slides[currentSlide].testimonial}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-rose-500 p-[2px]">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-xs text-white">
                        {slides[currentSlide].author[0]}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{slides[currentSlide].author}</p>
                      <p className="text-xs text-slate-500">{slides[currentSlide].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
             {slides.map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => setCurrentSlide(i)}
                 className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
                 aria-label={`Go to slide ${i + 1}`}
               />
             ))}
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 xl:px-48 py-12 relative overflow-y-auto custom-scrollbar bg-slate-50">
        <div className="max-w-md w-full mx-auto">
          <Link href={`/${lang}`} className="lg:hidden flex items-center gap-3 mb-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-2xl">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-slate-950">
              Kladriva
            </span>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-black tracking-tight text-slate-950 mb-3">
              {title}
            </h1>
            <p className="text-slate-500 leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="relative">
            {children}
          </div>

          <footer className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[13px] font-medium text-slate-400">
               <span className="">&copy; 2026 Kladriva Academy</span>
               <Link href="#" className="hover:text-slate-600 transition-colors">Privacy</Link>
               <Link href="#" className="hover:text-slate-600 transition-colors">Terms</Link>
               <Link href="#" className="hover:text-slate-600 transition-colors">Help</Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

