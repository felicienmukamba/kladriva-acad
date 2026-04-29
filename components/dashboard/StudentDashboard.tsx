"use client"

import { useDictionary } from "@/components/DictionaryProvider"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { Briefcase, GraduationCap, Award, Rocket, CheckCircle2, Clock } from "lucide-react"

export function StudentDashboard({ data }: { data: any }) {
  const dict = useDictionary()
  const { enrollments, certificates, projects } = data

  const stats = [
    { label: "Parcours Actifs", value: enrollments?.length || 0, icon: Rocket, color: "text-[#0066cc]" },
    { label: "Projets Validés", value: projects || 0, icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Certifications", value: certificates || 0, icon: Award, color: "text-indigo-500" },
    { label: "Temps Apprentissage", value: "12h", icon: Clock, color: "text-orange-500" }
  ]
  
  return (
    <div className="flex flex-col gap-12 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[32px] md:text-[40px] font-semibold tracking-tight text-[#1d1d1f]">
            {dict.dashboard.student.title}
          </h2>
          <p className="text-[#86868b] text-[17px] md:text-[19px]">
            {dict.dashboard.student.tagline}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/50 backdrop-blur-xl border border-[#d2d2d7] rounded-[28px] p-8 shadow-sm hover:shadow-md transition-all">
             <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-[#f5f5f7] ${stat.color}`}>
                   <stat.icon className="w-6 h-6" />
                </div>
             </div>
             <p className="text-[#86868b] text-[13px] font-bold uppercase tracking-wider mb-1">{stat.label}</p>
             <p className={`text-4xl font-semibold tracking-tight text-[#1d1d1f]`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-12">
        <div className="space-y-6">
           <h3 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f] pl-2">Activité Hebdomadaire</h3>
           <div className="border border-[#d2d2d7] rounded-[32px] bg-white overflow-hidden p-8 shadow-sm">
             <ChartAreaInteractive />
           </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f] pl-2">{dict.dashboard.student.activePrograms}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {enrollments?.map((enrollment: any) => (
              <div key={enrollment.id} className="bg-white border border-[#d2d2d7] rounded-[32px] p-8 hover:border-[#1d1d1f] transition-all group shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-[#f5f5f7] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                       <GraduationCap className="w-7 h-7 text-[#1d1d1f]" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#0066cc] bg-[#0066cc]/10 px-3 py-1 rounded-full">En cours</span>
                  </div>
                  <h4 className="text-[20px] font-bold text-[#1d1d1f] mb-2">{enrollment.course.title}</h4>
                  <div className="flex items-center gap-3 text-[#86868b] text-[14px]">
                    <span className="font-semibold text-emerald-500">{enrollment.progress}% terminé</span>
                    <span className="w-1 h-1 bg-[#d2d2d7] rounded-full" />
                    <span>Dernière activité hier</span>
                  </div>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="w-full h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1d1d1f] transition-all duration-1000" style={{ width: `${enrollment.progress}%` }} />
                  </div>
                  <button className="w-full h-11 rounded-full bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] font-bold text-[14px] transition-all">
                    Continuer l'apprentissage
                  </button>
                </div>
              </div>
            ))}
            {(!enrollments || enrollments.length === 0) && (
              <div className="col-span-full py-16 text-center border border-dashed border-[#d2d2d7] rounded-[32px]">
                <p className="text-[#86868b]">Vous n'avez pas encore de cours actifs.</p>
                <button className="mt-4 text-[#0066cc] font-bold hover:underline">Explorer le catalogue</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
