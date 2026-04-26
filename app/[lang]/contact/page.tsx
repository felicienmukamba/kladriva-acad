import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react"

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl font-black tracking-tight">Let's start a <br/><span className="text-primary">Conversation</span></h1>
              <p className="text-xl text-slate-500 leading-relaxed">
                Have questions about our programs, mentorship, or corporate training? We're here to help you navigate your journey.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { icon: Mail, title: "Email us", detail: "hello@kladriva.com", sub: "Response within 24 hours" },
                { icon: Phone, title: "Call us", detail: "+1 (555) 000-0000", sub: "Mon-Fri from 9am to 6pm" },
                { icon: MapPin, title: "Visit us", detail: "123 Tech Avenue, Silicon Valley", sub: "Global Headquarters" }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                   <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary shrink-0">
                      <item.icon className="w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      <p className="text-lg text-slate-600 font-medium">{item.detail}</p>
                      <p className="text-sm text-slate-400">{item.sub}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-200 shadow-sm relative">
             <div className="space-y-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Full Name</label>
                      <Input className="h-14 rounded-2xl border-slate-200 focus-visible:ring-primary/20 bg-white" placeholder="John Doe" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Email Address</label>
                      <Input className="h-14 rounded-2xl border-slate-200 focus-visible:ring-primary/20 bg-white" placeholder="john@example.com" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Subject</label>
                   <Input className="h-14 rounded-2xl border-slate-200 focus-visible:ring-primary/20 bg-white" placeholder="How can we help?" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Message</label>
                   <Textarea className="min-h-[160px] rounded-2xl border-slate-200 focus-visible:ring-primary/20 bg-white py-4" placeholder="Tell us more about your inquiry..." />
                </div>
                <Button size="lg" className="w-full h-16 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 gap-2">
                   <MessageSquare className="w-5 h-5" /> Send Message
                </Button>
             </div>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
