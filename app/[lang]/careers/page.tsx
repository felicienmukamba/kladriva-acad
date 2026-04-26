import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, Clock, ArrowRight, Zap, Heart, Globe } from "lucide-react"

export default async function CareersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  
  const jobs = [
    { title: "Senior React Instructor", type: "Full-time", location: "Remote", dept: "Education" },
    { title: "Product Designer", type: "Full-time", location: "London / Remote", dept: "Design" },
    { title: "Developer Relations Manager", type: "Full-time", location: "San Francisco", dept: "Marketing" },
    { title: "Backend Engineer (Go)", type: "Contract", location: "Remote", dept: "Engineering" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <section className="py-24 bg-slate-50 border-b">
           <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                 <Briefcase className="w-4 h-4" />
                 <span>We are hiring!</span>
              </div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tight">Build the future of <br/>Technical Education</h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                 Join a mission-driven team of engineers, designers, and educators dedicated to empowering the next generation of professional talent.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                 <Button size="lg" className="rounded-2xl h-14 px-10 font-bold">View Openings</Button>
                 <Button size="lg" variant="outline" className="rounded-2xl h-14 px-10 font-bold border-slate-200">Our Culture</Button>
              </div>
           </div>
        </section>

        <section className="py-24 max-w-7xl mx-auto px-6">
           <div className="grid md:grid-cols-3 gap-12 mb-24">
              {[
                { icon: Zap, title: "Fast-paced growth", desc: "Work in a dynamic environment where your impact is immediate." },
                { icon: Heart, title: "Student-first", desc: "Every decision we make is driven by student success and outcomes." },
                { icon: Globe, title: "Remote-friendly", desc: "We believe in talent over location. Work from anywhere in the world." }
              ].map((benefit, i) => (
                <div key={i} className="space-y-4">
                   <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                      <benefit.icon className="w-6 h-6" />
                   </div>
                   <h3 className="text-xl font-bold">{benefit.title}</h3>
                   <p className="text-slate-500 leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
           </div>

           <div className="space-y-12">
              <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-black tracking-tight">Current Openings</h2>
                 <p className="text-slate-400 font-bold">{jobs.length} roles available</p>
              </div>
              <div className="space-y-4">
                 {jobs.map((job, i) => (
                    <div key={i} className="group p-8 rounded-3xl border border-slate-100 bg-white hover:border-primary hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6">
                       <div className="space-y-2">
                          <div className="text-xs font-black uppercase tracking-widest text-primary">{job.dept}</div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{job.title}</h3>
                          <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
                             <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {job.location}</span>
                             <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {job.type}</span>
                          </div>
                       </div>
                       <Button variant="ghost" className="rounded-xl font-bold group/btn">
                          Apply Now <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                       </Button>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
