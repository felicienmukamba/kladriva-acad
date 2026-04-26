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
      <section className="pt-32 pb-24 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-[11px] font-semibold uppercase tracking-widest mb-8">
            <Zap className="w-4 h-4 text-[#0066cc]" />
            Specialization
          </div>
          
          <h1 className="text-[56px] md:text-[80px] font-semibold text-[#1d1d1f] tracking-tight leading-[1.05] mb-6">
            {course.title}
          </h1>
          
          <p className="text-[24px] md:text-[28px] text-[#86868b] max-w-4xl mx-auto font-normal leading-relaxed mb-12">
            {course.description}
          </p>

          <div className="flex flex-col items-center gap-4">
            <div className="scale-110">
              <EnrollButton 
                userId={session?.user?.id || ""} 
                courseId={id} 
                isEnrolled={!!enrollment}
                lang={lang}
              />
            </div>
            <p className="text-[14px] text-[#86868b] mt-4">7-day free trial included.</p>
          </div>
        </div>
      </section>

      {/* Key Info Bar */}
      <section className="bg-white border-b border-[#d2d2d7]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#d2d2d7]">
           {[
             { icon: Calendar, title: "Flexible Schedule", desc: "Learn at your own pace" },
             { icon: Award, title: "Pro Certificate", desc: "Shareable on LinkedIn" },
             { icon: ShieldCheck, title: "100% Online", desc: "Start instantly today" },
             { icon: Clock, title: "120 Hours", desc: "Comprehensive content" }
           ].map((item, i) => (
             <div key={i} className="py-10 px-4 md:px-8 flex flex-col items-center text-center gap-3">
               <item.icon className="w-8 h-8 text-[#1d1d1f]" />
               <div>
                 <p className="font-semibold text-[#1d1d1f] text-[15px]">{item.title}</p>
                 <p className="text-[#86868b] text-[13px]">{item.desc}</p>
               </div>
             </div>
           ))}
        </div>
      </section>

      {/* Course Details Content */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-3 gap-16">
           <div className="lg:col-span-2 space-y-24">
              <div className="space-y-12">
                 <h2 className="text-[40px] font-semibold tracking-tight text-[#1d1d1f]">Program Syllabus</h2>
                 
                 <div className="space-y-6">
                    {course.modules.map((module, idx) => (
                      <div key={module.id} className="p-8 bg-[#f5f5f7] rounded-[24px] hover:bg-[#e8e8ed] transition-colors duration-300">
                         <div className="flex flex-col gap-4">
                            <div className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">Module {idx + 1}</div>
                            <h4 className="text-[24px] font-semibold text-[#1d1d1f]">
                              {module.title}
                            </h4>
                            <p className="text-[#1d1d1f] text-[17px] leading-relaxed max-w-xl">
                              {module.description}
                            </p>
                            <div className="flex items-center gap-2 text-[#0066cc] font-medium mt-2">
                               <PlayCircle className="w-4 h-4" />
                               <span className="text-[15px]">{module.lessons.length} Lessons</span>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <aside className="space-y-8">
              <div className="bg-[#1d1d1f] rounded-[24px] p-8 text-white">
                 <h4 className="text-[24px] font-semibold mb-4">
                   Certification
                 </h4>
                 <p className="text-[#a1a1a6] text-[15px] leading-relaxed mb-8">
                   Upon completion, you'll receive a verified digital certificate issued by Kladriva Academy 
                   to share with your professional network.
                 </p>
                 <div className="aspect-[4/3] bg-white/10 rounded-[12px] flex items-center justify-center text-white/30 text-[13px] font-medium">
                   Sample Certificate
                 </div>
              </div>

              <div className="bg-[#f5f5f7] rounded-[24px] p-8">
                 <h4 className="text-[20px] font-semibold mb-6 text-[#1d1d1f]">Tools you'll master</h4>
                 <div className="flex flex-wrap gap-3">
                    {["Python", "Docker", "TensorFlow", "React", "Prisma"].map(skill => (
                      <span key={skill} className="bg-white px-4 py-2 rounded-full text-[15px] font-medium text-[#1d1d1f] shadow-sm">
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
