import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, User, MoreVertical, CheckCircle, XCircle, UserCheck, Video, Clock, Star, Sparkles } from "lucide-react"
import { getDictionary } from "@/lib/dictionary"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default async function AdminMentorshipPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  await isAdmin(lang)
  const dict = await getDictionary(lang as "en" | "fr")

  const sessions = await prisma.mentorshipSession.findMany({
    include: {
      mentor: true,
      mentee: true
    },
    orderBy: { date: "desc" }
  })

  const stats = [
    { label: "Sessions totales", value: sessions.length, icon: Calendar, color: "text-[#1d1d1f]" },
    { label: "Sessions terminées", value: sessions.filter(s => s.status === "COMPLETED").length, icon: CheckCircle, color: "text-emerald-600" },
    { label: "Mentors actifs", value: "8", icon: UserCheck, color: "text-[#0066cc]" },
    { label: "Satisfaction", value: "4.9/5", icon: Star, color: "text-yellow-500" }
  ]

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066cc]/10 border border-[#0066cc]/20 text-[#0066cc] text-[11px] font-bold uppercase tracking-widest">
            <UserCheck className="w-3.5 h-3.5" /> Suivi Académique
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">Gestion du Mentorat</h1>
          <p className="text-[#86868b] text-xl max-w-xl leading-relaxed">
            Supervisez les échanges entre experts et apprenants pour garantir la qualité de l'accompagnement.
          </p>
        </div>
        
        <Button variant="outline" className="h-14 rounded-full border-[#d2d2d7] bg-white text-[#1d1d1f] font-bold px-8 shadow-sm">
           Rapport de performance
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat, i) => (
           <div key={i} className="bg-white/50 backdrop-blur-xl border border-[#d2d2d7] rounded-[28px] p-8 shadow-sm">
              <p className="text-[#86868b] text-[13px] font-bold uppercase tracking-wider mb-2">{stat.label}</p>
              <div className="flex items-center justify-between">
                <p className={`text-4xl font-semibold tracking-tight ${stat.color}`}>{stat.value}</p>
                <div className="p-3 bg-[#f5f5f7] rounded-2xl text-[#1d1d1f]">
                   <stat.icon className="w-5 h-5" />
                </div>
              </div>
           </div>
         ))}
      </div>

      {/* Mentorship Table - Apple Style */}
      <div className="bg-white border border-[#d2d2d7] rounded-[40px] overflow-hidden shadow-sm relative">
        <Table>
          <TableHeader className="bg-[#f5f5f7]/50">
            <TableRow className="hover:bg-transparent border-b-[#d2d2d7]">
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b] py-8 pl-10">Planification</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Mentor</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Apprenant</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Statut</TableHead>
              <TableHead className="text-right pr-10 font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id} className="group hover:bg-[#f5f5f7]/30 transition-all border-b-[#d2d2d7]">
                <TableCell className="py-8 pl-10">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[15px] font-bold text-[#1d1d1f]">
                      <Calendar className="w-4 h-4 text-[#86868b]" />
                      {session.date ? new Date(session.date).toLocaleDateString() : 'À définir'}
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-[#86868b]">
                       <Clock className="w-3.5 h-3.5" />
                       {session.date ? new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 rounded-full border border-[#d2d2d7] shadow-sm">
                      <AvatarImage src={session.mentor.image || ""} />
                      <AvatarFallback className="text-[10px] font-bold bg-indigo-50 text-indigo-700">{session.mentor.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-[15px] font-bold text-[#1d1d1f]">{session.mentor.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 rounded-full border border-[#d2d2d7] shadow-sm">
                      <AvatarImage src={session.mentee.image || ""} />
                      <AvatarFallback className="text-[10px] font-bold bg-emerald-50 text-emerald-700">{session.mentee.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-[15px] font-bold text-[#1d1d1f]">{session.mentee.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider border-none ${
                    session.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
                    session.status === "CANCELLED" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {session.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-[#f5f5f7] h-10 w-10">
                        <MoreVertical className="w-5 h-5 text-[#86868b]" />
                      </Button>
                    } />
                    <DropdownMenuContent align="end" className="w-56 rounded-[24px] p-2 shadow-2xl border-[#d2d2d7] bg-white/80 backdrop-blur-xl">
                      <DropdownMenuItem render={
                        <div className="rounded-2xl gap-3 font-semibold p-3 cursor-pointer text-[#1d1d1f] hover:bg-[#f5f5f7]">
                          <CheckCircle className="w-4.5 h-4.5 text-emerald-500" /> Marquer comme terminée
                        </div>
                      } />
                      <DropdownMenuItem render={
                        <div className="rounded-2xl gap-3 font-semibold p-3 cursor-pointer text-[#1d1d1f] hover:bg-[#f5f5f7]">
                          <Video className="w-4.5 h-4.5 text-[#86868b]" /> Rejoindre (Supervision)
                        </div>
                      } />
                      <DropdownMenuItem render={
                        <div className="rounded-2xl gap-3 font-semibold p-3 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                          <XCircle className="w-4.5 h-4.5" /> Annuler la session
                        </div>
                      } />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
