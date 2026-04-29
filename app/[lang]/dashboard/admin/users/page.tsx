import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus, Search, Filter, MoreVertical, Shield, UserX, Mail, ArrowRight, Star } from "lucide-react"
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
import { UserActions } from "@/components/admin/UserActions"

export default async function AdminUsersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  await isAdmin(lang)
  const dict = await getDictionary(lang as "en" | "fr")

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d1d1f]/5 border border-[#1d1d1f]/10 text-[#1d1d1f] text-[11px] font-bold uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5" /> Administration Système
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">Gestion des Utilisateurs</h1>
          <p className="text-[#86868b] text-xl max-w-xl leading-relaxed">
            Supervisez les comptes, gérez les rôles et assurez le suivi de l'engagement de la communauté.
          </p>
        </div>
        
        <Button className="h-14 rounded-full bg-[#1d1d1f] text-white hover:bg-black font-bold px-8 gap-3 shadow-xl shadow-black/10 transition-all hover:scale-[1.02]">
          <UserPlus className="w-5 h-5" /> Inviter un collaborateur
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Utilisateurs totaux", value: users.length, icon: UserPlus },
           { label: "Nouveaux (7j)", value: "24", icon: ArrowRight },
           { label: "Rapport d'activité", value: "98%", icon: Star },
           { label: "Tickets en attente", value: "2", icon: Mail }
         ].map((stat, i) => (
           <div key={i} className="bg-white/50 backdrop-blur-xl border border-[#d2d2d7] rounded-[28px] p-8 shadow-sm">
              <p className="text-[#86868b] text-[13px] font-bold uppercase tracking-wider mb-2">{stat.label}</p>
              <div className="flex items-center justify-between">
                <p className="text-4xl font-semibold tracking-tight text-[#1d1d1f]">{stat.value}</p>
                <div className="p-3 bg-[#f5f5f7] rounded-2xl text-[#1d1d1f]">
                   <stat.icon className="w-5 h-5" />
                </div>
              </div>
           </div>
         ))}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white/50 backdrop-blur-xl p-4 rounded-[32px] border border-[#d2d2d7] shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#86868b]" />
          <Input className="pl-14 h-14 rounded-[24px] border-transparent bg-transparent focus-visible:ring-0 text-[17px] placeholder:text-[#86868b]" placeholder="Rechercher par nom, email ou rôle..." />
        </div>
        <div className="flex items-center gap-3 pr-2">
          <Button variant="ghost" className="h-12 rounded-full gap-2 text-[#1d1d1f] font-bold px-6 hover:bg-[#f5f5f7]">
            <Filter className="w-4 h-4" /> Filtres avancés
          </Button>
        </div>
      </div>

      {/* Users Table - Apple Style */}
      <div className="bg-white border border-[#d2d2d7] rounded-[40px] overflow-hidden shadow-sm relative">
        <Table>
          <TableHeader className="bg-[#f5f5f7]/50">
            <TableRow className="hover:bg-transparent border-b-[#d2d2d7]">
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b] py-8 pl-10">Utilisateur</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Rôle & Permission</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Engagement</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Dernière Activité</TableHead>
              <TableHead className="text-right pr-10 font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="group hover:bg-[#f5f5f7]/30 transition-all border-b-[#d2d2d7]">
                <TableCell className="py-8 pl-10">
                  <div className="flex items-center gap-5">
                    <Avatar className="w-14 h-14 rounded-[20px] shadow-sm ring-2 ring-white">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback className="font-bold text-lg bg-[#f5f5f7] text-[#1d1d1f]">{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-bold text-[#1d1d1f] text-[17px] truncate tracking-tight">{user.name || "Apprenant Kladriva"}</p>
                      <p className="text-[14px] text-[#86868b] truncate">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider border-none ${
                    user.role === "ADMIN" ? "bg-amber-100 text-amber-700" :
                    user.role === "MENTOR" ? "bg-indigo-100 text-indigo-700" :
                    user.role === "COMPANY" ? "bg-rose-100 text-rose-700" : "bg-[#f5f5f7] text-[#1d1d1f]"
                  }`}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                       <span className="text-[15px] font-bold text-[#1d1d1f]">{user.reputation}</span>
                       <span className="text-[11px] font-black text-[#86868b] uppercase tracking-tighter">points</span>
                    </div>
                    <div className="w-20 h-1 bg-[#f5f5f7] rounded-full overflow-hidden">
                       <div className="h-full bg-[#1d1d1f]" style={{ width: `${Math.min((user.reputation / 1000) * 100, 100)}%` }} />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                   <div className="flex flex-col gap-1">
                      <span className="text-[14px] font-semibold text-[#1d1d1f]">Aujourd'hui</span>
                      <span className="text-[11px] text-[#86868b] uppercase font-bold">14:24</span>
                   </div>
                </TableCell>
                <TableCell className="text-right pr-10">
                  <UserActions userId={user.id} currentRole={user.role} userName={user.name || "Utilisateur"} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
