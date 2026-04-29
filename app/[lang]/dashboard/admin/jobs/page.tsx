import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Briefcase, Search, Filter, MoreVertical, ExternalLink, Archive, CheckCircle2, Trash2, Edit, Sparkles, Building2, Users, DollarSign, Plus } from "lucide-react"
import { getDictionary } from "@/lib/dictionary"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default async function AdminJobsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  await isAdmin(lang)
  const dict = await getDictionary(lang as "en" | "fr")

  const jobs = await prisma.job.findMany({
    include: {
      _count: {
        select: { applications: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066cc]/10 border border-[#0066cc]/20 text-[#0066cc] text-[11px] font-bold uppercase tracking-widest">
            <Briefcase className="w-3.5 h-3.5" /> Gestion Recrutement
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">Gestion des Offres</h1>
          <p className="text-[#86868b] text-xl max-w-xl leading-relaxed">
            Gérez les opportunités de carrière de nos partenaires et suivez les candidatures de vos étudiants.
          </p>
        </div>
        
        <Link href={`/${lang}/dashboard/admin/jobs/new`}>
          <Button className="h-14 rounded-full bg-[#1d1d1f] text-white hover:bg-black font-bold px-8 gap-3 shadow-xl shadow-black/10 transition-all hover:scale-[1.02]">
            <Plus className="w-5 h-5" /> Publier une offre
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Offres actives", value: jobs.length, icon: Briefcase, color: "text-[#1d1d1f]" },
           { label: "Candidats totaux", value: jobs.reduce((acc, j) => acc + j._count.applications, 0), icon: Users, color: "text-[#0066cc]" },
           { label: "Partenaires", value: "12", icon: Building2, color: "text-emerald-600" },
           { label: "Budget moyen", value: "45k", icon: DollarSign, color: "text-orange-500" }
         ].map((stat, i) => (
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

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white/50 backdrop-blur-xl p-4 rounded-[32px] border border-[#d2d2d7] shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#86868b]" />
          <Input className="pl-14 h-14 rounded-[24px] border-transparent bg-transparent focus-visible:ring-0 text-[17px] placeholder:text-[#86868b]" placeholder="Rechercher une offre, un partenaire..." />
        </div>
        <div className="flex items-center gap-3 pr-2">
          <Button variant="ghost" className="h-12 rounded-full gap-2 text-[#1d1d1f] font-bold px-6 hover:bg-[#f5f5f7]">
            <Filter className="w-4 h-4" /> Filtres avancés
          </Button>
        </div>
      </div>

      {/* Jobs Table - Apple Style */}
      <div className="bg-white border border-[#d2d2d7] rounded-[40px] overflow-hidden shadow-sm relative">
        <Table>
          <TableHeader className="bg-[#f5f5f7]/50">
            <TableRow className="hover:bg-transparent border-b-[#d2d2d7]">
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b] py-8 pl-10">Opportunité</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Entreprise</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Candidats</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Salaire</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Publiée le</TableHead>
              <TableHead className="text-right pr-10 font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id} className="group hover:bg-[#f5f5f7]/30 transition-all border-b-[#d2d2d7]">
                <TableCell className="py-8 pl-10">
                  <div className="min-w-0">
                    <p className="font-bold text-[#1d1d1f] text-[17px] truncate tracking-tight">{job.title}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                       <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest border-none ${
                         job.type === 'FULL_TIME' ? 'bg-[#1d1d1f] text-white' : 'bg-[#0066cc] text-white'
                       }`}>
                          {job.type.replace("_", " ")}
                       </Badge>
                       <span className="text-[13px] text-[#86868b] font-medium">{job.location || "Remote"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] flex items-center justify-center font-bold text-[12px] text-[#1d1d1f] border border-[#d2d2d7] shadow-sm">
                       {job.company?.[0]}
                    </div>
                    <span className="text-[15px] font-bold text-[#1d1d1f]">{job.company}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-[#1d1d1f]">{job._count.applications}</span>
                    <span className="text-[11px] font-black text-[#86868b] uppercase tracking-tighter">profils</span>
                  </div>
                </TableCell>
                <TableCell>
                   <span className="text-[14px] font-semibold text-[#1d1d1f]">{job.salary || "À négocier"}</span>
                </TableCell>
                <TableCell>
                   <span className="text-[14px] font-semibold text-[#1d1d1f]">
                      {new Date(job.createdAt).toLocaleDateString()}
                   </span>
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
                          <Edit className="w-4.5 h-4.5 text-[#86868b]" /> Modifier l'offre
                        </div>
                      } />
                      <DropdownMenuItem render={
                        <div className="rounded-2xl gap-3 font-semibold p-3 cursor-pointer text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50">
                          <CheckCircle2 className="w-4.5 h-4.5" /> Marquer comme pourvue
                        </div>
                      } />
                      <DropdownMenuItem render={
                        <div className="rounded-2xl gap-3 font-semibold p-3 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                          <Trash2 className="w-4.5 h-4.5" /> Supprimer l'annonce
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
