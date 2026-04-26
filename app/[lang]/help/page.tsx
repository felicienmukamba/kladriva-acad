import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Book, HelpCircle, MessageCircle, FileText, ChevronRight } from "lucide-react"

export default async function HelpPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  
  const faqs = [
    { q: "How do I enroll in a path?", a: "To enroll in a path, browse the 'Paths' catalog and click 'Enroll in Path' on the detail page." },
    { q: "Can I get a refund for a course?", a: "Yes, we offer a 14-day money-back guarantee if you haven't completed more than 20% of the course." },
    { q: "How do the mentorship sessions work?", a: "Once enrolled in a Pro plan, you can book sessions directly from a mentor's profile page." },
    { q: "Where can I find my certificates?", a: "All earned certificates are available in your Dashboard under the 'Certificates' tab." },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <section className="py-24 bg-[#f5f5f7] border-b border-[#d2d2d7]">
           <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
              <h1 className="text-[56px] leading-[1.05] font-semibold text-[#1d1d1f] tracking-tight">How can we help?</h1>
              <div className="relative max-w-2xl mx-auto">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#86868b]" />
                 <Input className="h-16 pl-16 pr-8 rounded-full bg-white border border-[#d2d2d7] text-[#1d1d1f] placeholder:text-[#86868b] focus-visible:ring-4 focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] text-[17px] shadow-sm transition-all" placeholder="Search for help articles, guides..." />
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                 <span className="text-[13px] text-[#86868b] font-semibold uppercase tracking-wider">Popular:</span>
                 {["Enrollment", "Billing", "Certificates", "Pro Plan"].map(tag => (
                   <button key={tag} className="text-[15px] font-medium hover:text-[#0066cc] transition-colors text-[#1d1d1f]">{tag}</button>
                 ))}
              </div>
           </div>
        </section>

        <section className="py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
           {[
             { icon: Book, title: "Knowledge Base", desc: "Browse hundreds of articles on everything from setup to advanced features." },
             { icon: MessageCircle, title: "Direct Support", desc: "Chat with our support team for complex technical or billing issues." },
             { icon: FileText, title: "Course Guides", desc: "Downloadable PDF summaries and supplemental materials for every path." }
           ].map((card, i) => (
             <div key={i} className="p-10 rounded-[24px] border border-[#d2d2d7] bg-white hover:border-[#1d1d1f] transition-all cursor-pointer group">
                <div className="w-14 h-14 bg-[#f5f5f7] rounded-[16px] flex items-center justify-center text-[#1d1d1f] mb-6">
                   <card.icon className="w-7 h-7" />
                </div>
                <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-3">{card.title}</h3>
                <p className="text-[#86868b] text-[15px] leading-relaxed mb-6">{card.desc}</p>
                <div className="flex items-center gap-2 text-[#0066cc] font-medium text-[15px]">
                   Learn more <ChevronRight className="w-4 h-4" />
                </div>
             </div>
           ))}
        </section>

        <section className="py-24 bg-[#f5f5f7]">
           <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-[32px] font-semibold text-center text-[#1d1d1f] mb-16 tracking-tight">Frequently Asked Questions</h2>
              <div className="space-y-4">
                 {faqs.map((faq, i) => (
                    <div key={i} className="bg-white p-8 rounded-[24px] border border-[#d2d2d7]">
                       <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-3 flex items-start gap-3">
                          <HelpCircle className="w-5 h-5 text-[#86868b] shrink-0 mt-0.5" /> {faq.q}
                       </h3>
                       <p className="text-[#86868b] text-[15px] leading-relaxed pl-8">
                          {faq.a}
                       </p>
                    </div>
                 ))}
              </div>
              <div className="mt-16 text-center">
                 <p className="text-[#86868b] text-[15px] mb-6">Still have questions?</p>
                 <Button size="lg" className="rounded-full h-12 px-8 font-medium gap-2 bg-[#1d1d1f] text-white hover:bg-black">
                    <MessageCircle className="w-5 h-5" /> Contact Support
                 </Button>
              </div>
           </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
