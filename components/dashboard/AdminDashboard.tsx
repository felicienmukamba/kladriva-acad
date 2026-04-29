"use client"

import { useDictionary } from "@/components/DictionaryProvider"
import { BarChart3, Settings, Shield, Users, ArrowUpRight, Plus, ExternalLink, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AdminDashboard({ data }: { data: any }) {
  const dict = useDictionary()
  const { stats } = data
  
  const metrics = [
    { title: "Utilisateurs", value: stats?.users || 0, icon: Users, color: "text-[#0066cc]", growth: "+12%" },
    { title: "Revenus (TWD)", value: `${(stats?.revenue?._sum?.amount || 0).toLocaleString()}€`, icon: BarChart3, color: "text-emerald-500", growth: "+8.4%" },
    { title: "Cours Actifs", value: stats?.courses || 0, icon: Shield, color: "text-orange-500", growth: "+2" },
    { title: "Inscriptions", value: stats?.enrollments || 0, icon: Settings, color: "text-indigo-600", growth: "+42" },
  ]

  return (
    <div className="flex flex-col gap-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d1d1f]/5 border border-[#1d1d1f]/10 text-[#1d1d1f] text-[11px] font-bold uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5" /> Centre de Contrôle
          </div>
          <h2 className="text-[32px] md:text-[40px] font-semibold tracking-tight text-[#1d1d1f]">
            {dict.dashboard.admin.title}
          </h2>
          <p className="text-[#86868b] text-xl max-w-xl leading-relaxed">
            Gérez l'ensemble de la plateforme, supervisez la croissance et maintenez l'excellence académique.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-full border-[#d2d2d7] bg-white text-[#1d1d1f] font-bold px-6 shadow-sm">
            Paramètres Système
          </Button>
          <Button className="h-12 rounded-full bg-[#1d1d1f] text-white hover:bg-black font-bold px-8 shadow-lg shadow-black/10">
            Nouveau Rapport
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-white/50 backdrop-blur-xl border border-[#d2d2d7] rounded-[28px] p-8 shadow-sm hover:shadow-md transition-all group">
             <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl bg-[#f5f5f7] ${metric.color} group-hover:scale-110 transition-transform`}>
                   <metric.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-emerald-500 font-bold text-[13px]">
                   {metric.growth} <ArrowUpRight className="w-3 h-3" />
                </div>
             </div>
             <p className="text-[#86868b] text-[13px] font-bold uppercase tracking-wider mb-1">{metric.title}</p>
             <p className={`text-4xl font-semibold tracking-tight text-[#1d1d1f]`}>{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-white border border-[#d2d2d7] rounded-[40px] p-10 space-y-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-[#1d1d1f]">Journal d'audit</h3>
            <Button variant="ghost" className="text-[#0066cc] font-bold hover:bg-[#0066cc]/5 rounded-full px-5">
               Tout voir
            </Button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-5 p-5 rounded-[24px] bg-[#f5f5f7]/50 border border-[#d2d2d7]/30 hover:bg-[#f5f5f7] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <Settings className="w-5 h-5 text-[#86868b]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-[#1d1d1f]">Mise à jour Système API {i}</p>
                  <p className="text-[14px] text-[#86868b] leading-relaxed">Déploiement automatique terminé avec succès sur le cluster principal.</p>
                  <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest mt-2">il y a 2 heures</p>
                </div>
                <ExternalLink className="w-4 h-4 text-[#d2d2d7]" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#d2d2d7] rounded-[40px] p-10 space-y-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#1d1d1f]">Croissance Platforme</h3>
            <p className="text-[#86868b]">Analyse comparative de l'acquisition utilisateur sur les 30 derniers jours.</p>
          </div>
          <div className="h-[300px] w-full bg-[#f5f5f7] rounded-[32px] flex flex-col items-center justify-center border border-dashed border-[#d2d2d7] p-8 text-center group">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-[#0066cc]" />
             </div>
             <p className="text-[17px] font-bold text-[#1d1d1f]">Visualisation des données</p>
             <p className="text-sm text-[#86868b] max-w-xs mt-2">Le moteur de rendu graphique sera initialisé après la synchronisation des données analytiques.</p>
          </div>
          <Button className="w-full h-14 rounded-full bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] font-bold text-lg mt-6">
             Configurer les métriques
          </Button>
        </div>
      </div>
    </div>
  )
}
