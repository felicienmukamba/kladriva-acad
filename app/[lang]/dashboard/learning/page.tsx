import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, BookOpen, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { getDictionary } from "@/lib/dictionary";

export default async function LearningDashboard({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${lang}/auth/signin`);
  }

  const dict = await getDictionary(lang as "en" | "fr");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id! },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: true,
            },
          },
        },
      },
    },
  });

  const courses = enrollments.map((en) => ({
    id: en.course.id,
    title: en.course.title,
    description: en.course.description,
    progress: en.progress,
    modulesCount: en.course.modules.length,
    lessonsCount: en.course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0),
    status: en.progress === 100 ? "COMPLETED" : "IN_PROGRESS",
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold tracking-tight text-[#1d1d1f]">{dict.learning.title}</h1>
          <p className="text-[#86868b] text-[17px]">{dict.learning.tagline}</p>
        </div>
        <Link href={`/${lang}/courses`}>
          <Button className="h-10 rounded-full bg-[#1d1d1f] text-white hover:bg-black font-medium gap-2 px-6">
            <Search className="w-4 h-4" /> {dict.common.library}
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {courses.length === 0 ? (
          <div className="text-center py-32 bg-[#f5f5f7] rounded-[24px]">
            <div className="bg-white w-16 h-16 rounded-[16px] flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#d2d2d7]">
               <BookOpen className="text-[#1d1d1f] w-8 h-8" />
            </div>
            <h3 className="text-[24px] font-semibold mb-2 text-[#1d1d1f]">No courses yet</h3>
            <p className="text-[#86868b] text-[15px] mb-8 max-w-xs mx-auto">
              Enroll in your first course to start your professional transformation.
            </p>
            <Link href={`/${lang}/courses`}>
              <Button size="lg" className="h-12 rounded-full bg-[#1d1d1f] hover:bg-black text-white px-8 font-medium">
                {dict.common.library}
              </Button>
            </Link>
          </div>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className="border border-[#d2d2d7] rounded-[24px] shadow-none overflow-hidden bg-white">
              <div className="md:flex">
                <div className="md:w-1/4 bg-[#f5f5f7] flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-[#d2d2d7]">
                  <PlayCircle className="w-16 h-16 text-[#86868b]/30" />
                </div>
                <div className="md:w-3/4 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-[20px] font-semibold text-[#1d1d1f]">{course.title}</CardTitle>
                      {course.status === "COMPLETED" ? (
                        <Badge className="bg-[#0066cc]/10 text-[#0066cc] hover:bg-[#0066cc]/20 border-none font-medium px-3 rounded-full text-[12px]">{dict.learning.completed}</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[#1d1d1f] border-[#d2d2d7] bg-[#f5f5f7] px-3 rounded-full font-medium text-[12px]">{course.progress}%</Badge>
                      )}
                    </div>
                    <CardDescription className="text-[#86868b] text-[15px] mb-8 line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[11px] font-medium uppercase tracking-wider text-[#86868b] mb-2">
                        <span>{dict.learning.resume}</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-[#f5f5f7] rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-[#0066cc] h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-[#d2d2d7] mt-6">
                      <div className="flex gap-4 text-[12px] font-medium uppercase tracking-wider text-[#86868b]">
                        <span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-[#1d1d1f]" /> {course.modulesCount} Modules</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-[#1d1d1f]" /> {course.lessonsCount} Lessons</span>
                      </div>
                      
                      <Link href={`/${lang}/dashboard/learning/${course.id}`}>
                        <Button variant="ghost" className="h-10 rounded-full text-[#0066cc] hover:bg-transparent hover:text-[#0055b3] font-medium gap-2 px-0">
                          {course.progress === 0 ? 'Start' : course.progress === 100 ? 'Review' : 'Continue'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
