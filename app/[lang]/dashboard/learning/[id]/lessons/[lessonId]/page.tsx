import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PlayCircle, FileText } from "lucide-react";
import Link from "next/link";

export default async function LessonPage({ 
  params 
}: { 
  params: Promise<{ id: string; lessonId: string }> 
}) {
  const { id, lessonId } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: {
            include: {
              modules: {
                orderBy: { order: 'asc' },
                include: {
                  lessons: {
                    orderBy: { order: 'asc' },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    notFound();
  }

  // Find next and previous lessons
  const allLessons = lesson.module.course.modules.flatMap(m => m.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = allLessons[currentIndex - 1];
  const nextLesson = allLessons[currentIndex + 1];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href={`/dashboard/learning/${id}`} className="hover:text-white transition-colors">
          {lesson.module.course.title}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-200">{lesson.module.title}</span>
      </div>

      <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>

      <div className="aspect-video bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center relative group overflow-hidden">
        {lesson.videoUrl ? (
          <div className="text-center">
             <PlayCircle className="w-16 h-16 text-indigo-500 mb-4" />
             <p className="text-slate-400">Video Content Placeholder</p>
          </div>
        ) : (
          <div className="text-center">
             <FileText className="w-16 h-16 text-slate-700 mb-4" />
             <p className="text-slate-400">No video for this lesson</p>
          </div>
        )}
        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors pointer-events-none" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed">
              {lesson.content || "No content provided for this lesson yet."}
            </p>
          </div>

          <div className="flex justify-between pt-8 border-t border-slate-800">
            {prevLesson ? (
              <Link href={`/dashboard/learning/${id}/lessons/${prevLesson.id}`}>
                <Button variant="outline" className="border-slate-800 text-slate-300 gap-2">
                  <ChevronLeft className="w-4 h-4" /> Previous Lesson
                </Button>
              </Link>
            ) : <div />}

            {nextLesson ? (
              <Link href={`/dashboard/learning/${id}/lessons/${nextLesson.id}`}>
                <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                  Next Lesson <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link href={`/dashboard/learning/${id}`}>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Finish Course
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Course Lessons</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {lesson.module.course.modules.map((m) => (
              <div key={m.id} className="space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider py-2">
                  {m.title}
                </div>
                {m.lessons.map((l) => (
                  <Link 
                    key={l.id} 
                    href={`/dashboard/learning/${id}/lessons/${l.id}`}
                    className={`flex items-center gap-3 p-2 rounded-md text-sm transition-colors ${
                      l.id === lesson.id 
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span className="truncate">{l.title}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
