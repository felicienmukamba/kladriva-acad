import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download, Share2, ExternalLink, ShieldCheck } from "lucide-react"
import { CertificateDownload } from "@/components/certificates/CertificateDownload"
import { getDictionary } from "@/lib/dictionary"
import { Badge } from "@/components/ui/badge"

export default async function CertificatesDashboard({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const session = await auth()
  if (!session?.user) redirect(`/${lang}/auth/signin`)

  const dict = await getDictionary(lang as "en" | "fr")

  const certificates = await (prisma as any).certificate.findMany({
    where: { userId: session.user.id! },
    include: { course: true }
  })

  return (
    <div className="p-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight">{dict.certificates.title}</h1>
        <p className="text-slate-500 text-lg">{dict.certificates.tagline}</p>
      </div>

      {certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Award className="w-16 h-16 text-slate-300 mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{dict.certificates.empty}</h2>
          <p className="text-slate-500 mb-8 max-w-sm text-center">{dict.certificates.emptyDesc}</p>
          <Button size="lg" className="rounded-2xl font-bold h-14 px-10 shadow-xl shadow-primary/20">{dict.sidebar.learningPaths}</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {certificates.map((cert: any) => (
            <Card key={cert.id} className="overflow-hidden border-slate-200 hover:shadow-xl transition-all rounded-[2.5rem] bg-white group">
               <CardContent className="p-10">
                  <div className="flex items-start justify-between mb-8">
                     <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <Award className="w-8 h-8" />
                     </div>
                     <Badge variant="outline" className="border-emerald-100 bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-full text-xs">
                        {dict.certificates.verified}
                     </Badge>
                  </div>

                  <div className="space-y-4 mb-10">
                     <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                        Professional Certificate in {cert.course.title}
                     </h3>
                     <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                        <span>Issued {new Date(cert.issuedAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>ID: {cert.code}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-100">
                     <CertificateDownload 
                        data={{
                           userName: session.user?.name || "Student",
                           courseName: cert.course.title,
                           date: cert.issuedAt,
                           certificateCode: cert.code
                        }}
                     />
                     <Button variant="outline" className="rounded-2xl h-14 font-bold border-slate-200 gap-2 hover:bg-slate-50">
                        <Share2 className="w-4 h-4" /> {dict.certificates.share}
                     </Button>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center gap-10">
         <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-10 h-10 text-primary" />
         </div>
         <div className="flex-1 space-y-2">
            <h4 className="text-xl font-bold text-slate-900">{dict.certificates.verified}</h4>
            <p className="text-slate-500 leading-relaxed">
               {dict.certificates.verificationDesc}
            </p>
         </div>
         <Button variant="ghost" className="text-primary font-bold gap-2 hover:bg-white hover:shadow-sm h-12 rounded-xl">
            {dict.certificates.verificationPortal} <ExternalLink className="w-4 h-4" />
         </Button>
      </div>
    </div>
  )
}
