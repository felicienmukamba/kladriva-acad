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
      
      <div className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Professional Path</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
              {path.title}
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
              {path.description}
            </p>
            <div className="flex flex-wrap gap-6 text-slate-300 text-sm font-medium">
              <span className="flex items-center gap-2"><Layers className="w-4 h-4" /> {path.courses.length} Expert Courses</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> ~480 Learning Hours</span>
              <span className="flex items-center gap-2"><Award className="w-4 h-4" /> Career Credentials</span>
            </div>
            
            <div className="flex gap-4 pt-4">
              {isEnrolled ? (
                <Link href={`/${lang}/dashboard/paths`}>
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 px-10 rounded-2xl">
                    Continue Learning
                  </Button>
                </Link>
              ) : (
                <form action={async () => {
                  "use server"
                  if (!session?.user) return
                  await enrollInPath(session.user.id!, path.id)
                }}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 rounded-2xl shadow-xl shadow-primary/20 gap-2 text-lg">
                    Enroll in Path <ArrowRight className="w-5 h-5" />
                  </Button>
                </form>
              )}
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/20">
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
              <h2 className="text-3xl font-bold mb-10 text-slate-900 flex items-center gap-3">
                <Layers className="w-8 h-8 text-primary" />
                Curriculum Overview
              </h2>
              <div className="space-y-6">
                {path.courses.sort((a: any, b: any) => a.order - b.order).map((cp: any, idx: number) => (
                  <div key={cp.courseId} className="group p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400 group-hover:text-primary group-hover:border-primary transition-colors shrink-0">
                        0{idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{cp.course.title}</h3>
                        <p className="text-slate-500 text-sm mb-4">{cp.course.description}</p>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                          <span>{cp.course.modules.length} Modules</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>Certificate included</span>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-slate-50 rounded-3xl p-10 border border-slate-200">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">What you'll achieve</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  "Master industrial-standard technologies",
                  "Build 5+ real-world portfolio projects",
                  "Get personalized feedback from mentors",
                  "Access our exclusive job marketplace",
                  "Verifiable professional certification",
                  "Lifetime community access"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
             <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6 sticky top-24 shadow-2xl">
                <h3 className="text-xl font-bold">Path Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Total Courses</span>
                    <span className="font-bold">{path.courses.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Prerequisites</span>
                    <span className="font-bold">None</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Skill Level</span>
                    <span className="font-bold">Beginner to Pro</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10">
                   <p className="text-slate-400 text-xs mb-4 uppercase tracking-widest font-black">Certification Body</p>
                   <div className="flex items-center gap-3">
                     <GraduationCap className="w-10 h-10 text-primary" />
                     <div>
                       <p className="font-bold">Kladriva Academy</p>
                       <p className="text-[10px] text-slate-500">ISO 9001:2015 CERTIFIED</p>
                     </div>
                   </div>
                </div>
                {!isEnrolled && (
                  <Button className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-2xl text-lg">
                    Get Started Today
                  </Button>
                )}
             </div>
          </aside>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
