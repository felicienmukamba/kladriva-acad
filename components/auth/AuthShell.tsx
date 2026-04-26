"use client"

import Link from "next/link"
import { GraduationCap } from "lucide-react"

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
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans selection:bg-primary/20 selection:text-primary">
      <div className="w-full max-w-[420px] px-6 sm:px-12 py-16">
        <div className="flex flex-col items-center text-center mb-10">
          <Link href={`/${lang}`} className="mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-sm transition-transform hover:scale-105">
              <GraduationCap className="h-6 w-6" />
            </div>
          </Link>
          
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#1d1d1f] mb-3">
            {title}
          </h1>
          <p className="text-[15px] leading-relaxed text-[#86868b] max-w-[300px]">
            {subtitle}
          </p>
        </div>

        <div className="w-full">
          {children}
        </div>
      </div>
      
      <footer className="absolute bottom-8 text-center w-full px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-[#86868b]">
           <span>&copy; 2026 Kladriva Inc. All rights reserved.</span>
           <div className="flex items-center gap-6">
             <Link href="#" className="hover:text-[#1d1d1f] transition-colors">Privacy Policy</Link>
             <Link href="#" className="hover:text-[#1d1d1f] transition-colors">Terms of Use</Link>
             <Link href="#" className="hover:text-[#1d1d1f] transition-colors">Legal</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}

