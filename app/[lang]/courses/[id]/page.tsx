import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { 
  Globe, 
  Clock, 
  Calendar, 
  Award, 
  Users, 
  CheckCircle2,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Zap,
  PlayCircle
} from "lucide-react";
import { EnrollButton } from "@/components/EnrollButton";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";

export default async function CourseDetail({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const session = await auth();
  
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } }
        }
      }
    }
  });

  if (!course) {
    return <div>Course not found</div>;
  }

  const enrollment = session?.user 
    ? await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id!,
            courseId: id
          }
        }
      })
    : null;

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link href={`/${lang}/courses`} className="hover:text-primary transition-colors">Courses</Link>
          <ChevronRight className="w-4 h-4 text-slate-200" />
          <span className="text-slate-900 truncate">{course.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden border-b border-slate-100 bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-50/30 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                 <Zap className="w-3 h-3 text-primary" />
                 Specialization
               </div>
               
               <h1 className="text-5xl md:text-6xl font-black text-slate-950 leading-[0.95] tracking-tight">
                 {course.title}
               </h1>
               
               <p className="text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
                 {course.description}
               </p>
               
               <div className="flex flex-wrap gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100">
                        <Users className="w-5 h-5" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-slate-900">12,450+</span>
                        <span className="text-[10px]">Students</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100">
                        <Globe className="w-5 h-5" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-slate-900">English</span>
                        <span className="text-[10px]">Language</span>
                     </div>
                  </div>
               </div>

               <div className="pt-4 max-w-xs">
                  <EnrollButton 
                    userId={session?.user?.id || ""} 
                    courseId={id} 
                    isEnrolled={!!enrollment}
                    lang={lang}
                  />
                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">
                    7-day free trial included
                  </p>
               </div>
            </div>

            <div className="relative group lg:block hidden">
               <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-rose-500/10 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-700" />
               <div className="relative aspect-video rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl bg-slate-900">
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <PlayCircle className="w-20 h-20 text-white/20" />
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Info Bar */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
           {[
             { icon: Calendar, title: "Flexible Schedule", desc: "Learn at your own pace" },
             { icon: Award, title: "Pro Certificate", desc: "Shareable on LinkedIn" },
             { icon: ShieldCheck, title: "100% Online", desc: "Start instantly today" },
             { icon: Clock, title: "120 Hours", desc: "Comprehensive content" }
           ].map((item, i) => (
             <div key={i} className="py-8 md:px-8 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary shrink-0">
                 <item.icon className="w-6 h-6" />
               </div>
               <div>
                 <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                 <p className="text-slate-500 text-xs">{item.desc}</p>
               </div>
             </div>
           ))}
        </div>
      </section>

      {/* Course Details Content */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-3 gap-24">
           <div className="lg:col-span-2 space-y-20">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-50" />
                 <h2 className="text-3xl font-black mb-8 tracking-tight">Skills you'll acquire</h2>
                 <div className="grid sm:grid-cols-2 gap-6">
                    {[
                      "Advanced System Architecture",
                      "Industrial AI Implementation",
                      "Production-grade Security",
                      "Real-time Data Processing"
                    ].map(text => (
                      <div key={text} className="flex gap-4 items-center">
                         <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                         </div>
                         <span className="text-slate-700 font-bold text-sm">{text}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-10">
                 <div className="flex items-center justify-between">
                   <h2 className="text-3xl font-black tracking-tight">Program Syllabus</h2>
                   <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                     {course.modules.length} Modules • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons
                   </div>
                 </div>
                 
                 <div className="space-y-4">
                    {course.modules.map((module, idx) => (
                      <div key={module.id} className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all duration-500">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                               <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Module {idx + 1}</div>
                               <h4 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                                 {module.title}
                               </h4>
                               <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
                                 {module.description}
                               </p>
                            </div>
                            <div className="shrink-0 flex items-center gap-3">
                               <div className="bg-slate-50 px-4 py-2 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                 {module.lessons.length} Lessons
                               </div>
                               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                                 <ChevronRight className="w-5 h-5" />
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <aside className="space-y-12">
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-[80px] opacity-20" />
                 <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <Award className="w-5 h-5 text-primary" />
                   Certification
                 </h4>
                 <p className="text-slate-400 text-sm leading-relaxed mb-8">
                   Upon completion, you'll receive a verified digital certificate issued by Kladriva Academy 
                   to share with your professional network.
                 </p>
                 <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center italic text-white/20 text-xs font-bold uppercase tracking-widest">
                   Sample Certificate
                 </div>
              </div>

              <div className="space-y-6">
                 <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-2">Tools you'll master</h4>
                 <div className="flex flex-wrap gap-2">
                    {["Python", "Docker", "TensorFlow", "React", "Prisma"].map(skill => (
                      <span key={skill} className="bg-white border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-900 shadow-sm">
                        {skill}
                      </span>
                    ))}
                 </div>
              </div>
           </aside>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
