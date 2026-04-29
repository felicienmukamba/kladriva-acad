import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, DollarSign, Clock, ExternalLink, Search, Filter, Sparkles, Building2, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { JobApplyButton } from "@/components/jobs/JobApplyButton"

export default async function JobsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const session = await auth()

  if (!session?.user) redirect(`/${lang}/auth/signin`)

  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066cc]/10 border border-[#0066cc]/20 text-[#0066cc] text-[11px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Opportunités Partenaires
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">Carrière & Emploi</h1>
          <p className="text-[#86868b] text-xl max-w-xl leading-relaxed">
            Accédez en exclusivité aux offres de nos entreprises partenaires recrutant activement nos diplômés.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
              <Input className="pl-11 h-12 rounded-full border-[#d2d2d7] bg-white focus-visible:ring-2 focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] text-[15px] shadow-sm" placeholder="Rechercher un poste, une techno..." />
           </div>
           <Button variant="outline" className="h-12 w-12 p-0 rounded-full border-[#d2d2d7] bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] shrink-0 shadow-sm">
              <Filter className="w-4 h-4" />
           </Button>
        </div>
      </div>

      {/* Stats Cards - Apple Style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         {[
           { label: "Postes ouverts", value: jobs.length, color: "text-[#1d1d1f]" },
           { label: "Partenaires actifs", value: "12", color: "text-[#0066cc]" },
           { label: "Candidatures envoyées", value: "3", color: "text-emerald-600" }
         ].map((stat, i) => (
           <div key={i} className="bg-white/50 backdrop-blur-xl border border-[#d2d2d7] rounded-[28px] p-8 shadow-sm">
              <p className="text-[#86868b] text-[13px] font-bold uppercase tracking-wider mb-2">{stat.label}</p>
              <p className={`text-4xl font-semibold tracking-tight ${stat.color}`}>{stat.value}</p>
           </div>
         ))}
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white border border-[#d2d2d7] rounded-[36px] p-10 group flex flex-col justify-between hover:border-[#1d1d1f] hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
               <Building2 className="w-32 h-32" />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="bg-[#f5f5f7] w-16 h-16 rounded-[22px] flex items-center justify-center group-hover:scale-105 transition-all duration-500 shadow-sm">
                   <Briefcase className="w-8 h-8 text-[#1d1d1f]" />
                </div>
                <Badge variant="secondary" className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border-transparent ${job.type === 'FULL_TIME' ? 'bg-[#1d1d1f] text-white' : 'bg-[#0066cc] text-white'}`}>
                   {job.type.replace('_', ' ')}
                </Badge>
              </div>
              
              <div className="space-y-3 mb-8">
                <h3 className="text-[24px] font-bold tracking-tight text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors">{job.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-[#1d1d1f] font-semibold text-[17px]">{job.company || "Kladriva Partner"}</span>
                  <span className="w-1.5 h-1.5 bg-[#d2d2d7] rounded-full" />
                  <span className="text-[#86868b] font-medium text-[15px]">Vérifié</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-6 mb-10">
                 <div className="flex items-center gap-2.5 text-[15px] text-[#86868b] font-medium">
                    <MapPin className="w-4.5 h-4.5 text-[#1d1d1f]" /> {job.location || "Remote"}
                 </div>
                  <div className="flex items-center gap-2.5 text-[15px] text-[#86868b] font-medium">
                     <DollarSign className="w-4.5 h-4.5 text-[#1d1d1f]" /> {job.salary || "À négocier"}
                  </div>
                 <div className="flex items-center gap-2.5 text-[15px] text-[#86868b] font-medium">
                    <Clock className="w-4.5 h-4.5 text-[#1d1d1f]" /> Publiée il y a {Math.floor((new Date().getTime() - new Date(job.createdAt).getTime()) / (1000 * 3600 * 24))}j
                 </div>
              </div>
            </div>

            <div className="relative z-10 pt-4">
              <JobApplyButton jobId={job.id} jobTitle={job.title} company={job.company || "Kladriva Partner"} />
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white border border-dashed border-[#d2d2d7] rounded-[40px]">
             <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-[#86868b]" />
             </div>
             <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">Aucune offre disponible</h3>
             <p className="text-[#86868b] text-[17px] max-w-sm mx-auto">Revenez bientôt ! De nouvelles opportunités sont ajoutées chaque semaine par nos partenaires.</p>
          </div>
        )}
      </div>

      {/* Talent Network Banner */}
      <section className="rounded-[40px] p-12 md:p-16 text-white bg-[#1d1d1f] shadow-2xl flex flex-col md:flex-row items-center gap-12 justify-between">
         <div className="space-y-6 flex-1">
            <h2 className="text-[32px] md:text-[40px] font-semibold tracking-tight leading-tight">Rejoignez le réseau de talents.</h2>
            <p className="text-[#a1a1a6] text-xl leading-relaxed">
               Laissez les entreprises venir à vous. En rendant votre profil public aux recruteurs, vous augmentez vos chances d'être chassé pour des postes non publiés.
            </p>
         </div>
         <Button size="lg" className="bg-[#0066cc] text-white hover:bg-[#0077ee] font-bold px-10 h-14 rounded-full text-lg shadow-xl shadow-[#0066cc]/20 shrink-0 group">
            Activer mon profil <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
         </Button>
      </section>
    </div>
  )
}
