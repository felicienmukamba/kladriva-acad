import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Search, Filter, Book, Video, Code } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getDictionary } from "@/lib/dictionary"
import { prisma } from "@/lib/prisma"

export default async function ResourcesDashboard({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const session = await auth()
  if (!session?.user) redirect(`/${lang}/auth/signin`)

  const dict = await getDictionary(lang as "en" | "fr")

  const resources = await (prisma as any).resource.findMany({
    include: {
      lesson: true
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-[32px] font-semibold tracking-tight text-[#1d1d1f]">{dict.resources.title}</h1>
          <p className="text-[#86868b] text-[17px]">{dict.resources.tagline}</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
              <Input className="pl-11 h-10 rounded-full border-transparent bg-[#f5f5f7] focus-visible:ring-2 focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] text-[15px]" placeholder={dict.admin.users.search} />
           </div>
           <Button variant="ghost" className="h-10 w-10 p-0 rounded-full bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] shrink-0">
              <Filter className="w-4 h-4" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {[
           { label: dict.common.dashboard, icon: Search, count: 42, active: true },
           { label: "Guides & PDFs", icon: Book, count: 18, active: false },
           { label: "Code Samples", icon: Code, count: 12, active: false },
           { label: "Video Bundles", icon: Video, count: 12, active: false }
         ].map((cat, i) => (
            <button key={i} className={`p-6 rounded-[20px] transition-all text-left ${
               cat.active ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]"
            }`}>
               <cat.icon className="w-6 h-6 mb-4" />
               <p className="font-semibold text-[15px]">{cat.label}</p>
               <p className={`text-[13px] mt-1 ${cat.active ? "text-[#a1a1a6]" : "text-[#86868b]"}`}>{cat.count} items</p>
            </button>
         ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {resources.map((res: any, i: number) => (
          <Card key={i} className="overflow-hidden border border-[#d2d2d7] rounded-[20px] shadow-none bg-white">
             <CardContent className="p-6 flex items-center gap-6">
                <div className="w-14 h-14 bg-[#f5f5f7] rounded-[14px] flex items-center justify-center text-[#1d1d1f]">
                   <FileText className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                   <h3 className="font-semibold text-[#1d1d1f] text-[17px] truncate">{res.title}</h3>
                   <div className="flex items-center gap-3 mt-1 text-[12px] font-medium uppercase tracking-wider text-[#86868b]">
                      <span className="text-[#0066cc]">{res.type}</span>
                      <span className="w-1 h-1 bg-[#d2d2d7] rounded-full"></span>
                      <span>{res.size}</span>
                      <span className="w-1 h-1 bg-[#d2d2d7] rounded-full"></span>
                      <span>{res.category}</span>
                   </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]">
                   <Download className="w-5 h-5" />
                </Button>
             </CardContent>
          </Card>
        ))}
      </div>

      <section className="bg-[#1d1d1f] rounded-[24px] p-12 text-white text-center">
         <div className="space-y-6">
            <h2 className="text-[32px] font-semibold tracking-tight">Request a Resource</h2>
            <p className="text-[#a1a1a6] max-w-xl mx-auto leading-relaxed text-[17px]">
               Can't find what you're looking for? Suggest a new template or guide, and our instructors will prioritize creating it for the community.
            </p>
            <Button size="lg" className="bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] font-medium px-8 h-12 rounded-full">
               Make a Request
            </Button>
         </div>
      </section>
    </div>
  )
}
