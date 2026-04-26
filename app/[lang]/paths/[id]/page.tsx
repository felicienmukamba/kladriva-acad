import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap, ArrowRight, Layers, Clock, Award, CheckCircle2, ShieldCheck } from "lucide-react"
import { enrollInPath } from "@/app/actions/paths"

export default async function PathDetailPage({ 
  params 
}: { 
  params: Promise<{ lang: string; id: string }> 
}) {
  const { lang, id } = await params
  const session = await auth()
  
  const path = await prisma.path.findUnique({
    where: { id },
    include: {
      courses: {
        include: {
          course: {
            include: {
              modules: true
            }
          }
        }
      }
    }
  })

  if (!path) return <div>Path not found</div>

  const isEnrolled = session?.user ? await prisma.pathEnrollment.findUnique({
    where: { userId_pathId: { userId: session.user.id!, pathId: id } }
  }) : false

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="bg-[#f5f5f7] py-32 border-b border-[#d2d2d7]">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8e8ed] text-[#1d1d1f] text-[12px] font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Professional Path</span>
            </div>
            <h1 className="text-[56px] leading-[1.05] font-semibold text-[#1d1d1f] tracking-tight">
              {path.title}
            </h1>
            <p className="text-[20px] text-[#86868b] leading-relaxed max-w-xl">
              {path.description}
            </p>
            <div className="flex flex-wrap gap-6 text-[#86868b] text-[15px] font-medium">
              <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-[#1d1d1f]" /> {path.courses.length} Expert Courses</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#1d1d1f]" /> ~480 Learning Hours</span>
              <span className="flex items-center gap-2"><Award className="w-4 h-4 text-[#1d1d1f]" /> Career Credentials</span>
            </div>
            
            <div className="flex gap-4 pt-8">
              {isEnrolled ? (
                <Link href={`/${lang}/dashboard/paths`}>
                  <Button size="lg" className="bg-[#1d1d1f] hover:bg-black text-white font-medium h-12 px-8 rounded-full">
                    Continue Learning
                  </Button>
                </Link>
              ) : (
                <form action={async () => {
                  "use server"
                  if (!session?.user) return
                  await enrollInPath(session.user.id!, path.id)
                }}>
                  <Button size="lg" className="bg-[#0066cc] hover:bg-[#0055b3] text-white font-medium h-12 px-8 rounded-full gap-2">
                    Enroll in Path <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="aspect-video rounded-[24px] overflow-hidden bg-white border border-[#d2d2d7]">
              <img 
                src={path.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"} 
                alt={path.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-[32px] font-semibold mb-10 text-[#1d1d1f] tracking-tight flex items-center gap-3">
                <Layers className="w-8 h-8 text-[#1d1d1f]" />
                Curriculum Overview
              </h2>
              <div className="space-y-6">
                {path.courses.sort((a: any, b: any) => a.order - b.order).map((cp: any, idx: number) => (
                  <div key={cp.courseId} className="group p-8 rounded-[24px] border border-[#d2d2d7] bg-[#f5f5f7] hover:bg-[#e8e8ed] transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 rounded-[14px] bg-white border border-[#d2d2d7] flex items-center justify-center font-semibold text-[#1d1d1f] shrink-0">
                        0{idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-2">{cp.course.title}</h3>
                        <p className="text-[#86868b] text-[15px] mb-6">{cp.course.description}</p>
                        <div className="flex items-center gap-4 text-[12px] font-medium text-[#86868b] uppercase tracking-wider">
                          <span>{cp.course.modules.length} Modules</span>
                          <span className="w-1 h-1 bg-[#d2d2d7] rounded-full"></span>
                          <span>Certificate included</span>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-[#1d1d1f] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#f5f5f7] rounded-[24px] p-10 border border-[#d2d2d7]">
              <h2 className="text-[24px] font-semibold mb-8 text-[#1d1d1f]">What you'll achieve</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  "Master industrial-standard technologies",
                  "Build 5+ real-world portfolio projects",
                  "Get personalized feedback from mentors",
                  "Access our exclusive job marketplace",
                  "Verifiable professional certification",
                  "Lifetime community access"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-[#1d1d1f] font-medium text-[15px]">
                    <CheckCircle2 className="w-5 h-5 text-[#1d1d1f] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
             <div className="p-8 rounded-[24px] bg-[#1d1d1f] text-white space-y-8 sticky top-24">
                <h3 className="text-[20px] font-semibold">Path Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-[#a1a1a6]">Total Courses</span>
                    <span className="font-semibold">{path.courses.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-[#a1a1a6]">Prerequisites</span>
                    <span className="font-semibold">None</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-[#a1a1a6]">Skill Level</span>
                    <span className="font-semibold">Beginner to Pro</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-[#424245]">
                   <p className="text-[#a1a1a6] text-[12px] mb-4 uppercase tracking-wider font-semibold">Certification Body</p>
                   <div className="flex items-center gap-4">
                     <GraduationCap className="w-10 h-10 text-white" />
                     <div>
                       <p className="font-semibold text-[15px]">Kladriva Academy</p>
                       <p className="text-[11px] text-[#a1a1a6] uppercase tracking-wider">ISO 9001:2015 CERTIFIED</p>
                     </div>
                   </div>
                </div>
                {!isEnrolled && (
                  <form action={async () => {
                    "use server"
                    if (!session?.user) return
                    await enrollInPath(session.user.id!, path.id)
                  }}>
                    <Button className="w-full h-12 bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] font-medium rounded-full text-[15px]">
                      Get Started Today
                    </Button>
                  </form>
                )}
             </div>
          </aside>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
