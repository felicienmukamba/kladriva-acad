import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, DollarSign, Clock, ExternalLink } from "lucide-react"

export default async function JobsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const session = await auth()

  if (!session?.user) redirect(`/${lang}/auth/signin`)

  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: { company: true }
  })

  return (
    <div className="space-y-8">
      <div className="apple-toolbar">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">Career</h1>
          <p className="text-sm text-slate-600">Discover opportunities from partner companies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="apple-surface bg-white p-6 group flex flex-col justify-between hover:shadow-apple-lg transition-all duration-300">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                   <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em] ${job.type === 'FULL_TIME' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-700'}`}>
                   {job.type.replace('_', ' ')}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold tracking-[-0.02em] mb-1 text-slate-950">{job.title}</h3>
              <p className="text-slate-600 font-medium text-sm mb-6">{job.company.name || "Kladriva Partner"}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5" /> {job.location || "Remote"}
                 </div>
                 <div className="flex items-center gap-2 text-xs text-slate-500">
                    <DollarSign className="w-3.5 h-3.5" /> {job.salaryRange || "Competitive"}
                 </div>
                 <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" /> {new Date(job.createdAt).toLocaleDateString()}
                 </div>
              </div>
            </div>

            <Button className="w-full h-11 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-medium transition-all gap-2">
              Apply Now <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="col-span-full py-20 text-center apple-surface bg-white border-2 border-dashed">
             <p className="text-slate-600">No job openings at the moment. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  )
}
