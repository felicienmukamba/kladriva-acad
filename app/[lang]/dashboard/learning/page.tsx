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
      <div className="apple-toolbar">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{dict.learning.title}</h1>
          <p className="text-sm text-slate-600">{dict.learning.tagline}</p>
        </div>
        <Link href={`/${lang}/courses`}>
          <Button className="h-11 rounded-full bg-slate-950 text-white hover:bg-slate-800 font-medium gap-2">
            <Search className="w-4 h-4" /> {dict.sidebar.library}
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {courses.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
               <BookOpen className="text-slate-950 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">No courses yet</h3>
            <p className="text-slate-600 mb-8 max-w-xs mx-auto">
              Enroll in your first course to start your professional transformation.
            </p>
            <Link href={`/${lang}/courses`}>
              <Button variant="outline" className="h-11 rounded-full border-slate-200 bg-white text-slate-900 hover:bg-slate-50 font-medium">
                {dict.sidebar.library}
              </Button>
            </Link>
          </div>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className="apple-surface overflow-hidden bg-white border-black/6 hover:shadow-apple-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/4 bg-slate-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-slate-200/70">
                  <PlayCircle className="w-16 h-16 text-slate-950/15" />
                </div>
                <div className="md:w-3/4 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl font-bold">{course.title}</CardTitle>
                      {course.status === "COMPLETED" ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">{dict.learning.completed}</Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-700 border-slate-200 bg-slate-50">{course.progress}%</Badge>
                      )}
                    </div>
                    <CardDescription className="text-slate-600 mb-6 line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                        <span className="uppercase">{dict.learning.resume}</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200/70 rounded-full h-2">
                        <div 
                          className="bg-slate-950 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t mt-4">
                      <div className="flex gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1 uppercase"><BookOpen className="w-3 h-3" /> {course.modulesCount} Modules</span>
                        <span className="flex items-center gap-1 uppercase"><Clock className="w-3 h-3" /> {course.lessonsCount} Lessons</span>
                      </div>
                      
                      <Link href={`/${lang}/dashboard/learning/${course.id}`}>
                        <Button className="h-10 rounded-full bg-slate-950 hover:bg-slate-800 gap-2 font-medium text-white">
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
