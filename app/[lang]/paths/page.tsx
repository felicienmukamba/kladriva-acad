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
      
      <section className="pt-32 pb-16 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="text-[56px] leading-[1.05] font-semibold text-[#1d1d1f] tracking-tight mb-4">
              <span className="text-[#86868b]">Learning Paths.</span> From beginner to job-ready.
            </h1>
            <p className="text-[24px] text-[#86868b] leading-relaxed font-normal">
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
