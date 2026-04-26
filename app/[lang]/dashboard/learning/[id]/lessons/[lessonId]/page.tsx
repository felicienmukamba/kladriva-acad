import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle, ArrowLeft, PlayCircle, FileText, Download } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default async function LessonPage({ 
  params 
}: { 
  params: Promise<{ id: string, lessonId: string, lang: string }> 
}) {
  const { id, lessonId, lang } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      resources: true,
      module: {
        include: {
          course: {
            include: {
              modules: {
                orderBy: { order: 'asc' },
                include: {
                  lessons: {
                    orderBy: { order: 'asc' },
                  }
                }
              }
            }
          }
        }
      }
    }
  } as any) as any;

  if (!lesson || lesson.module.courseId !== id) {
    notFound();
  }

  const course = lesson.module.course;
  const allLessons = course.modules.flatMap((m: any) => m.lessons);
  const currentIndex = allLessons.findIndex((l: any) => l.id === lessonId);
  const prevLesson = allLessons[currentIndex - 1];
  const nextLesson = allLessons[currentIndex + 1];

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/${lang}/dashboard/learning/${id}`}>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to course
            </Button>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-800">
            Ask AI Assistant
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <CheckCircle className="w-4 h-4" /> Complete & Next
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 overflow-hidden">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
          {lesson.videoUrl ? (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl relative group">
              <iframe
                src={lesson.videoUrl}
                title={`Video for ${lesson.title}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-2xl flex flex-col items-center justify-center bg-slate-900 border border-slate-800 border-dashed text-slate-500">
              <PlayCircle className="w-16 h-16 mb-4 opacity-20" />
              <p>No video for this lesson</p>
            </div>
          )}

          <div className="prose prose-invert prose-slate max-w-none bg-slate-900/50 p-8 rounded-2xl border border-white/5">
             <ReactMarkdown>
                {lesson.content || "No content available for this lesson."}
             </ReactMarkdown>
          </div>

          {lesson.resources.length > 0 && (
            <div className="space-y-4 pt-10">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Lesson Resources</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.resources.map((resource: any) => (
                  <div key={resource.id} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-200">{resource.title}</p>
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{resource.type} • {resource.size || 'N/A'}</p>
                      </div>
                    </div>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="rounded-lg hover:bg-white/10">
                        <Download className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center py-10 border-t border-white/5">
            {prevLesson ? (
              <Link href={`/${lang}/dashboard/learning/${id}/lessons/${prevLesson.id}`}>
                <Button variant="ghost" className="gap-2 text-slate-400 hover:text-white">
                  <ChevronLeft className="w-5 h-5" /> Previous: {prevLesson.title}
                </Button>
              </Link>
            ) : <div />}
            
            {nextLesson ? (
              <Link href={`/${lang}/dashboard/learning/${id}/lessons/${nextLesson.id}`}>
                <Button variant="ghost" className="gap-2 text-slate-400 hover:text-white">
                  Next: {nextLesson.title} <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="hidden lg:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 bg-slate-800/50">
            <h3 className="font-bold text-white text-sm">Course Content</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {course.modules.map((module: any) => (
              <div key={module.id}>
                <div className="px-4 py-2 bg-slate-800/20 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-y border-slate-800/50">
                  {module.title}
                </div>
                <div className="divide-y divide-slate-800/50">
                  {module.lessons.map((l: any) => (
                    <Link 
                      key={l.id} 
                      href={`/${lang}/dashboard/learning/${id}/lessons/${l.id}`}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-slate-800/50 ${l.id === lessonId ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500' : 'text-slate-400'}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${l.id === lessonId ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`} />
                      <span className="truncate">{l.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
