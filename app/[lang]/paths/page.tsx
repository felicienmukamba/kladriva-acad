import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/landing/Footer"
import { PathList } from "@/components/learning/PathList"
import { getDictionary } from "@/lib/dictionary"
import { Layers } from "lucide-react"

export default async function PathsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: "en" | "fr" }
  const dict = await getDictionary(lang)

  const paths = await (prisma as any).path.findMany({
    where: { published: true },
    include: {
      courses: {
        include: {
          course: true
        }
      }
    }
  })

  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      <Navbar />
      
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Layers className="w-3 h-3 text-indigo-400" />
              Career Acceleration
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-slate-950 mb-8 tracking-tight leading-[0.95]">
              Curated <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 italic">Learning Journeys.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
              Take the guesswork out of learning. Our paths are carefully designed sequences of courses 
              that take you from beginner to job-ready professional.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-32">
        <PathList initialPaths={paths} lang={lang} dict={dict} />
      </main>

      <Footer lang={lang} />
    </div>
  )
}
