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
              <h1 className="text-[56px] leading-[1.05] font-semibold text-[#1d1d1f] tracking-tight">
                Let's start a <br/><span className="text-[#86868b]">Conversation</span>
              </h1>
              <p className="text-[20px] text-[#86868b] leading-relaxed">
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
                   <div className="w-12 h-12 flex items-center justify-center text-[#1d1d1f] shrink-0">
                      <item.icon className="w-8 h-8" />
                   </div>
                   <div>
                      <h3 className="font-semibold text-[#1d1d1f] text-[17px]">{item.title}</h3>
                      <p className="text-[15px] text-[#1d1d1f]">{item.detail}</p>
                      <p className="text-[13px] text-[#86868b]">{item.sub}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#f5f5f7] rounded-[24px] p-8 md:p-12">
             <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                   <Input className="h-14 rounded-xl border-[#d2d2d7] focus-visible:ring-4 focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] bg-white text-[17px]" placeholder="First Name" />
                   <Input className="h-14 rounded-xl border-[#d2d2d7] focus-visible:ring-4 focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] bg-white text-[17px]" placeholder="Last Name" />
                </div>
                <Input className="h-14 rounded-xl border-[#d2d2d7] focus-visible:ring-4 focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] bg-white text-[17px]" placeholder="Email Address" />
                <Input className="h-14 rounded-xl border-[#d2d2d7] focus-visible:ring-4 focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] bg-white text-[17px]" placeholder="Subject" />
                <Textarea className="min-h-[160px] rounded-xl border-[#d2d2d7] focus-visible:ring-4 focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] bg-white text-[17px] py-4" placeholder="Your Message..." />
                
                <Button size="lg" className="w-full h-12 bg-[#0066cc] hover:bg-[#0055b3] text-white rounded-full font-medium text-[15px] mt-4">
                   Send Message
                </Button>
             </div>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
