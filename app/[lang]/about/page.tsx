import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/landing/Footer"
import { ShieldCheck, Target, Users, Zap } from "lucide-react"

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <section className="py-32 bg-[#1d1d1f] text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
             <h1 className="text-[56px] md:text-[80px] font-semibold leading-[1.05] tracking-tight mb-6">
               Transforming Careers <br/><span className="text-[#86868b]">Through Excellence</span>
             </h1>
             <p className="text-[24px] text-[#a1a1a6] max-w-3xl mx-auto leading-relaxed">
               Kladriva Academy is more than an online school. It's a platform designed to bridge the gap between education and industrial requirements.
             </p>
          </div>
        </section>

        <section className="py-32 max-w-7xl mx-auto px-6">
           <div className="grid md:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                 <h2 className="text-[40px] font-semibold text-[#1d1d1f] leading-tight tracking-tight">Our Mission</h2>
                 <p className="text-[20px] text-[#86868b] leading-relaxed">
                   Founded with the vision of democratizing elite technical education, Kladriva Academy provides students with the tools, mentorship, and real-world projects needed to succeed in today's fast-paced tech landscape.
                 </p>
                 <div className="grid grid-cols-2 gap-8 pt-4">
                    <div className="space-y-3">
                       <div className="w-12 h-12 flex items-center justify-center text-[#1d1d1f]">
                          <Target className="w-8 h-8" />
                       </div>
                       <h3 className="font-semibold text-[#1d1d1f] text-[17px]">Goal Oriented</h3>
                       <p className="text-[15px] text-[#86868b]">Every lesson is tied to a specific career outcome.</p>
                    </div>
                    <div className="space-y-3">
                       <div className="w-12 h-12 flex items-center justify-center text-[#1d1d1f]">
                          <Users className="w-8 h-8" />
                       </div>
                       <h3 className="font-semibold text-[#1d1d1f] text-[17px]">Community First</h3>
                       <p className="text-[15px] text-[#86868b]">Connect with thousands of peers and mentors worldwide.</p>
                    </div>
                 </div>
              </div>
              <div className="relative aspect-[4/3] bg-[#f5f5f7] rounded-[24px] overflow-hidden">
                 <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                    alt="Team collaboration" 
                    className="w-full h-full object-cover"
                 />
              </div>
           </div>
        </section>

        <section className="py-32 bg-[#f5f5f7]">
           <div className="max-w-7xl mx-auto px-6 text-center mb-16">
              <h2 className="text-[40px] font-semibold text-[#1d1d1f] mb-4 tracking-tight">The Kladriva Pillars</h2>
              <p className="text-[20px] text-[#86868b] max-w-xl mx-auto">The core values that drive our platform and your success.</p>
           </div>
           <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: "Industry Verified", desc: "Our curriculum is reviewed by senior engineers from top tech companies." },
                { icon: Zap, title: "Actionable Learning", desc: "Spend less time watching, and more time building with our integrated project labs." },
                { icon: GraduationCap, title: "Global Accreditation", desc: "Earn certificates that are recognized and verifiable by employers globally." }
              ].map((pillar, i) => (
                <div key={i} className="bg-white p-10 rounded-[24px]">
                   <div className="w-14 h-14 bg-[#f5f5f7] rounded-[14px] flex items-center justify-center mb-6 text-[#1d1d1f]">
                      <pillar.icon className="w-7 h-7" />
                   </div>
                   <h3 className="text-[20px] font-semibold mb-3 text-[#1d1d1f]">{pillar.title}</h3>
                   <p className="text-[15px] text-[#86868b] leading-relaxed">{pillar.desc}</p>
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
