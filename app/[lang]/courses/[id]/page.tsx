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
  PlayCircle,
  Trophy,
  Brain,
  GitBranch,
  Sparkles
} from "lucide-react";
import { EnrollButton } from "@/components/EnrollButton";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

      {/* Program Roadmap */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-white">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <div className="space-y-4">
              <h2 className="text-[40px] font-semibold tracking-tight text-[#1d1d1f]">Feuille de Route (Roadmap)</h2>
              <p className="text-[#86868b] text-[18px]">Suivez ce parcours structuré pour maîtriser les compétences clés.</p>
            </div>
            
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {course.modules.map((module, idx) => (
                <div key={module.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-indigo-500 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-all duration-500 group-hover:scale-110 group-hover:shadow-indigo-200">
                    <span className="text-xs font-bold">{idx + 1}</span>
                  </div>
                  {/* Content */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-3xl bg-[#f5f5f7] border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <time className="text-[12px] font-bold text-indigo-500 uppercase tracking-widest">Semaine {idx + 1}</time>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          ~{module.lessons.length * 15} min
                        </div>
                      </div>
                      <h4 className="text-[20px] font-bold text-[#1d1d1f] group-hover:text-indigo-600 transition-colors">
                        {module.title}
                      </h4>
                      <p className="text-slate-500 text-[15px] leading-relaxed">
                        {module.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                         <div className="flex -space-x-2">
                           {[1, 2, 3].map(i => (
                             <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                               <img src={`https://i.pravatar.cc/100?u=${module.id}${i}`} alt="Student" className="w-full h-full object-cover" />
                             </div>
                           ))}
                         </div>
                         <span className="text-[12px] text-slate-400 font-medium">+120 apprenants complété</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Boss Final Node */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-indigo-500 bg-indigo-600 text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-8 rounded-3xl bg-indigo-900 text-white shadow-2xl shadow-indigo-500/20 transform hover:-translate-y-1 transition-transform">
                  <div className="space-y-4">
                    <Badge className="bg-indigo-500/30 text-indigo-200 border-none">Projet Final (Boss)</Badge>
                    <h4 className="text-[24px] font-bold">Certification Mastery Project</h4>
                    <p className="text-indigo-200 text-[15px] leading-relaxed">
                      Appliquez tout ce que vous avez appris dans un projet réel validé par nos mentors experts.
                    </p>
                    <Button className="w-full bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-bold">
                      Voir le Brief du Projet
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#1d1d1f] rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
               <h4 className="text-[24px] font-bold mb-4 flex items-center gap-2">
                 <Award className="w-6 h-6 text-indigo-400" /> Certification
               </h4>
               <p className="text-[#a1a1a6] text-[15px] leading-relaxed mb-8">
                 Une fois complété, recevez un certificat digital vérifié par Kladriva Academy, optimisé pour LinkedIn et vos CV.
               </p>
               <div className="aspect-[4/3] bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center relative group cursor-pointer">
                  <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <img src="/certificate-preview.png" alt="Sample Certificate" className="w-full h-full object-contain p-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white/60">Aperçu interactif</span>
               </div>
            </div>

            <div className="bg-[#f5f5f7] rounded-[32px] p-8 border border-slate-200">
               <h4 className="text-[20px] font-bold mb-6 text-[#1d1d1f]">Compétences acquises</h4>
               <div className="grid grid-cols-1 gap-4">
                  {[
                    { name: "Algorithmie avancée", icon: Brain },
                    { name: "Architecture système", icon: GitBranch },
                    { name: "Déploiement Cloud", icon: Globe },
                    { name: "UI/UX Avancé", icon: Sparkles }
                  ].map(skill => (
                    <div key={skill.name} className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                      <div className="p-2 bg-indigo-50 rounded-lg">
                        <skill.icon className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="text-[15px] font-semibold text-slate-700">{skill.name}</span>
                    </div>
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
