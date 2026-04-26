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
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
           <div className="absolute inset-0 bg-primary/10 opacity-50" />
           <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8">
              <h1 className="text-5xl font-black tracking-tight">How can we help?</h1>
              <div className="relative">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                 <Input className="h-16 pl-16 pr-8 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-primary/40 text-lg shadow-2xl" placeholder="Search for help articles, guides..." />
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                 <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">Popular:</span>
                 {["Enrollment", "Billing", "Certificates", "Pro Plan"].map(tag => (
                   <button key={tag} className="text-sm font-bold hover:text-primary transition-colors text-slate-300 underline underline-offset-4">{tag}</button>
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
             <div key={i} className="p-10 rounded-[2.5rem] border border-slate-100 bg-white hover:border-primary hover:shadow-xl transition-all cursor-pointer group">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all mb-6">
                   <card.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-6">{card.desc}</p>
                <div className="flex items-center gap-2 text-primary font-bold">
                   Learn more <ChevronRight className="w-4 h-4" />
                </div>
             </div>
           ))}
        </section>

        <section className="py-24 bg-slate-50">
           <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-3xl font-black text-center mb-16">Frequently Asked Questions</h2>
              <div className="space-y-4">
                 {faqs.map((faq, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100">
                       <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-3">
                          <HelpCircle className="w-5 h-5 text-primary" /> {faq.q}
                       </h3>
                       <p className="text-slate-600 leading-relaxed pl-8">
                          {faq.a}
                       </p>
                    </div>
                 ))}
              </div>
              <div className="mt-16 text-center">
                 <p className="text-slate-500 mb-6">Still have questions?</p>
                 <Button size="lg" className="rounded-2xl h-14 px-10 font-bold gap-2 shadow-xl shadow-primary/20">
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
