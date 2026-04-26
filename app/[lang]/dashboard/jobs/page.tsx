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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-semibold tracking-tight text-[#1d1d1f]">Career</h1>
          <p className="text-[#86868b] text-[17px]">Discover opportunities from partner companies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white border border-[#d2d2d7] rounded-[24px] p-8 group flex flex-col justify-between hover:border-[#1d1d1f] transition-all duration-300">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="bg-[#f5f5f7] w-14 h-14 rounded-[16px] flex items-center justify-center group-hover:scale-105 transition-transform">
                   <Briefcase className="w-7 h-7 text-[#1d1d1f]" />
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${job.type === 'FULL_TIME' ? 'bg-[#f5f5f7] text-[#1d1d1f]' : 'bg-[#0066cc]/10 text-[#0066cc]'}`}>
                   {job.type.replace('_', ' ')}
                </span>
              </div>
              
              <h3 className="text-[20px] font-semibold tracking-tight mb-2 text-[#1d1d1f]">{job.title}</h3>
              <p className="text-[#86868b] font-medium text-[15px] mb-8">{job.company.name || "Kladriva Partner"}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="flex items-center gap-2 text-[13px] text-[#86868b] font-medium">
                    <MapPin className="w-4 h-4 text-[#1d1d1f]" /> {job.location || "Remote"}
                 </div>
                 <div className="flex items-center gap-2 text-[13px] text-[#86868b] font-medium">
                    <DollarSign className="w-4 h-4 text-[#1d1d1f]" /> {job.salaryRange || "Competitive"}
                 </div>
                 <div className="flex items-center gap-2 text-[13px] text-[#86868b] font-medium">
                    <Clock className="w-4 h-4 text-[#1d1d1f]" /> {new Date(job.createdAt).toLocaleDateString()}
                 </div>
              </div>
            </div>

            <Button className="w-full h-12 rounded-full bg-[#1d1d1f] hover:bg-black text-white font-medium transition-all gap-2 text-[15px]">
              Apply Now <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="col-span-full py-24 text-center bg-[#f5f5f7] rounded-[24px]">
             <p className="text-[#86868b] text-[17px]">No job openings at the moment. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  )
}
