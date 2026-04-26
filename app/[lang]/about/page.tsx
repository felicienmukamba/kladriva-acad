import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/landing/Footer"
import { ShieldCheck, Target, Users, Zap } from "lucide-react"

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
             <h1 className="text-6xl font-black mb-6 tracking-tight">Transforming Careers <br/><span className="text-primary">Through Excellence</span></h1>
             <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
               Kladriva Academy is more than an online school. It's a platform designed to bridge the gap between education and industrial requirements.
             </p>
          </div>
        </section>

        <section className="py-24 max-w-7xl mx-auto px-6">
           <div className="grid md:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                 <h2 className="text-4xl font-bold text-slate-900">Our Mission</h2>
                 <p className="text-lg text-slate-600 leading-relaxed">
                   Founded with the vision of democratizing elite technical education, Kladriva Academy provides students with the tools, mentorship, and real-world projects needed to succeed in today's fast-paced tech landscape.
                 </p>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <Target className="w-6 h-6" />
                       </div>
                       <h3 className="font-bold">Goal Oriented</h3>
                       <p className="text-sm text-slate-500">Every lesson is tied to a specific career outcome.</p>
                    </div>
                    <div className="space-y-3">
                       <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                          <Users className="w-6 h-6" />
                       </div>
                       <h3 className="font-bold">Community First</h3>
                       <p className="text-sm text-slate-500">Connect with thousands of peers and mentors worldwide.</p>
                    </div>
                 </div>
              </div>
              <div className="relative">
                 <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
                 <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                    alt="Team collaboration" 
                    className="relative rounded-3xl shadow-2xl border border-slate-200"
                 />
              </div>
           </div>
        </section>

        <section className="py-24 bg-slate-50">
           <div className="max-w-7xl mx-auto px-6 text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">The Kladriva Pillars</h2>
              <p className="text-slate-500 max-w-xl mx-auto">The core values that drive our platform and your success.</p>
           </div>
           <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
              {[
                { icon: ShieldCheck, title: "Industry Verified", desc: "Our curriculum is reviewed by senior engineers from top tech companies." },
                { icon: Zap, title: "Actionable Learning", desc: "Spend less time watching, and more time building with our integrated project labs." },
                { icon: GraduationCap, title: "Global Accreditation", desc: "Earn certificates that are recognized and verifiable by employers globally." }
              ].map((pillar, i) => (
                <div key={i} className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group">
                   <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                      <pillar.icon className="w-7 h-7" />
                   </div>
                   <h3 className="text-xl font-bold mb-4">{pillar.title}</h3>
                   <p className="text-slate-500 leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
           </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  )
}

import { GraduationCap } from "lucide-react"
