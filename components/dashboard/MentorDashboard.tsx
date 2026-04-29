"use client"

import { useDictionary } from "@/components/DictionaryProvider"
import { Users, Calendar, MessageSquare, Star, Video, Clock, ChevronRight, UserCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function MentorDashboard({ data }: { data: any }) {
  const dict = useDictionary()
  const { sessions, menteesCount, rating } = data
  
  const stats = [
    { title: "Mentees Actifs", value: menteesCount || 0, icon: Users, color: "text-[#0066cc]" },
    { title: "Sessions à venir", value: sessions?.length || 0, icon: Calendar, color: "text-emerald-500" },
    { title: "Messages", value: "3", icon: MessageSquare, color: "text-orange-500" },
    { title: "Note Globale", value: rating || "5.0", icon: Star, color: "text-yellow-500" },
  ]

  const upcomingSessions = sessions?.filter((s: any) => s.status === "SCHEDULED").slice(0, 4)

  return (
    <div className="flex flex-col gap-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066cc]/10 border border-[#0066cc]/20 text-[#0066cc] text-[11px] font-bold uppercase tracking-widest">
            <UserCheck className="w-3.5 h-3.5" /> Espace Mentor
          </div>
          <h2 className="text-[32px] md:text-[40px] font-semibold tracking-tight text-[#1d1d1f]">
            {dict.dashboard.mentor.title}
          </h2>
          <p className="text-[#86868b] text-xl max-w-xl leading-relaxed">
            Gérez votre emploi du temps et accompagnez vos étudiants vers la réussite.
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
             <p className="text-[#86868b] text-[13px] font-bold uppercase tracking-wider mb-1">{stat.title}</p>
             <p className={`text-4xl font-semibold tracking-tight text-[#1d1d1f]`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-8">
           <div className="flex items-center justify-between pl-2">
              <h3 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">Prochaines Sessions</h3>
              <Button variant="ghost" className="text-[#0066cc] font-bold hover:bg-[#0066cc]/5 rounded-full px-5">
                 Voir l'agenda complet <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
           </div>
           
           <div className="grid gap-4">
             {upcomingSessions?.map((sess: any) => (
               <div key={sess.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[32px] border border-[#d2d2d7] bg-white hover:border-[#1d1d1f] hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
                 <div className="flex items-center gap-5">
                   <Avatar className="w-16 h-16 rounded-[20px] shadow-sm ring-2 ring-white">
                     <AvatarImage src={sess.mentee.image || ""} />
                     <AvatarFallback className="bg-[#f5f5f7] text-[#1d1d1f] font-bold">{sess.mentee.name?.[0]}</AvatarFallback>
                   </Avatar>
                   <div>
                     <h4 className="font-bold text-[18px] text-[#1d1d1f] tracking-tight">{sess.mentee.name}</h4>
                     <div className="flex items-center gap-4 mt-1 text-[14px] text-[#86868b]">
                       <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {sess.date ? new Date(sess.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "TBD"}</span>
                       <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {sess.date ? new Date(sess.date).toLocaleDateString() : "Aujourd'hui"}</span>
                     </div>
                   </div>
                 </div>
                 <div className="mt-6 md:mt-0 flex items-center gap-3">
                   <Button variant="outline" className="h-11 rounded-full border-[#d2d2d7] text-[#1d1d1f] font-bold px-6 hover:bg-[#f5f5f7]">
                      Détails
                   </Button>
                   <Button className="h-11 rounded-full bg-[#1d1d1f] text-white hover:bg-black font-bold px-8 gap-2 shadow-lg shadow-black/10">
                      Lancer l'appel <Video className="w-4 h-4" />
                   </Button>
                 </div>
               </div>
             ))}
             {(!upcomingSessions || upcomingSessions.length === 0) && (
               <div className="py-20 text-center border border-dashed border-[#d2d2d7] rounded-[40px] bg-white/50">
                 <Calendar className="w-12 h-12 text-[#d2d2d7] mx-auto mb-4" />
                 <p className="text-[#86868b] font-medium">Aucune session programmée pour le moment.</p>
               </div>
             )}
           </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <h3 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f] pl-2">Retours Récents</h3>
           <div className="grid gap-6">
             {[1, 2].map((i) => (
               <Card key={i} className="rounded-[32px] border-[#d2d2d7] bg-white p-8 shadow-sm hover:shadow-md transition-all">
                 <div className="flex items-center gap-1 mb-4">
                   {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                 </div>
                 <p className="text-[16px] text-[#1d1d1f] leading-relaxed mb-6 font-medium italic">
                   "Session incroyable ! Les explications sur l'architecture micro-frontends étaient très claires et m'ont débloqué sur mon projet."
                 </p>
                 <div className="flex items-center gap-3 pt-4 border-t border-[#f5f5f7]">
                    <div className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center font-bold text-[10px] text-[#1d1d1f]">JD</div>
                    <span className="text-[13px] font-bold text-[#86868b] uppercase tracking-wider">Julien D.</span>
                 </div>
               </Card>
             ))}
           </div>
        </div>
      </div>
    </div>
  )
}
