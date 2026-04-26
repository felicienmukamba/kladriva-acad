import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, ArrowRight, Zap, Heart, Globe } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function CareersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <section className="py-32 bg-[#f5f5f7]">
           <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
              <h1 className="text-[56px] leading-[1.05] font-semibold text-[#1d1d1f] tracking-tight">
                Build the future of <br/><span className="text-[#86868b]">Technical Education</span>
              </h1>
              <p className="text-[24px] text-[#86868b] max-w-3xl mx-auto leading-relaxed font-normal">
                 Join a mission-driven team of engineers, designers, and educators dedicated to empowering the next generation of professional talent.
              </p>
              <div className="flex justify-center gap-4 pt-8">
                 <Button size="lg" className="rounded-full h-12 px-8 font-medium bg-[#1d1d1f] hover:bg-black text-white">View Openings</Button>
                 <Button size="lg" variant="outline" className="rounded-full h-12 px-8 font-medium border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#e8e8ed]">Our Culture</Button>
              </div>
           </div>
        </section>

        <section className="py-32 max-w-7xl mx-auto px-6">
           <div className="grid md:grid-cols-3 gap-12 mb-32">
              {[
                { icon: Zap, title: "Fast-paced growth", desc: "Work in a dynamic environment where your impact is immediate." },
                { icon: Heart, title: "Student-first", desc: "Every decision we make is driven by student success and outcomes." },
                { icon: Globe, title: "Remote-friendly", desc: "We believe in talent over location. Work from anywhere in the world." }
              ].map((benefit, i) => (
                <div key={i} className="space-y-4">
                   <div className="w-14 h-14 bg-[#f5f5f7] rounded-[14px] flex items-center justify-center text-[#1d1d1f]">
                      <benefit.icon className="w-7 h-7" />
                   </div>
                   <h3 className="text-[20px] font-semibold text-[#1d1d1f]">{benefit.title}</h3>
                   <p className="text-[17px] text-[#86868b] leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
           </div>

           <div className="space-y-12">
              <div className="flex items-center justify-between border-b border-[#d2d2d7] pb-4">
                 <h2 className="text-[32px] font-semibold tracking-tight text-[#1d1d1f]">Current Openings</h2>
                 <p className="text-[#86868b] font-medium">{jobs.length} roles available</p>
              </div>
              <div className="space-y-6">
                 {jobs.length === 0 ? (
                    <div className="text-center py-20 bg-[#f5f5f7] rounded-[24px]">
                       <p className="text-[#86868b] text-[17px]">No open positions currently available. Please check back later.</p>
                    </div>
                 ) : (
                   jobs.map((job) => (
                      <div key={job.id} className="group p-8 rounded-[24px] bg-[#f5f5f7] hover:bg-[#e8e8ed] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6">
                         <div className="space-y-3">
                            <div className="text-[12px] font-semibold uppercase tracking-wider text-[#0066cc]">{job.type.replace("_", " ")}</div>
                            <h3 className="text-[24px] font-semibold text-[#1d1d1f]">{job.title}</h3>
                            <div className="flex items-center gap-6 text-[15px] text-[#86868b] font-medium">
                               <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {job.location || "Remote"}</span>
                               <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {job.type}</span>
                            </div>
                         </div>
                         <Button variant="ghost" className="rounded-full font-medium text-[#0066cc] hover:bg-transparent hover:text-[#0055b3] px-0">
                            Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                         </Button>
                      </div>
                   ))
                 )}
              </div>
           </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
