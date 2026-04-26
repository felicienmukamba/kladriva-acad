import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CourseList } from "@/components/learning/CourseList";
import { getDictionary } from "@/lib/dictionary";
import { Sparkles } from "lucide-react";

export default async function CoursesCatalog({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: "en" | "fr" };
  const dict = await getDictionary(lang);
  
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      modules: {
        include: {
          lessons: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-rose-50 rounded-full blur-[120px] opacity-40" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Expert-Led Training
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-slate-950 mb-8 tracking-tight leading-[0.95]">
              Level Up Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 italic">Technical Skills.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl font-medium">
              Explore our library of advanced courses in Industrial AI, Automation, and Modern Development. 
              Built by engineers, for engineers.
            </p>
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <main className="max-w-7xl mx-auto px-6 pb-32">
        <CourseList initialCourses={courses} lang={lang} dict={dict} />
      </main>

      <Footer lang={lang} />
    </div>
  );
}
