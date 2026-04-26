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
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="text-[56px] leading-[1.05] font-semibold text-[#1d1d1f] tracking-tight">
              <span className="text-[#86868b]">Kladriva Courses.</span> The best way to master industrial technology.
            </h1>
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
