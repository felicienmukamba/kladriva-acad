import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download, Share2, ExternalLink, ShieldCheck } from "lucide-react"
import Link from "next/link"
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
    <div className="p-6 md:p-10 space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">
            <Award className="w-3 h-3" /> Récompenses & Médailles
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">{dict.certificates.title}</h1>
          <p className="text-slate-400 text-lg">{dict.certificates.tagline}</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
           <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-500" />
           </div>
           <div className="pr-4">
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total Certificats</div>
              <div className="text-xl font-bold text-white">{certificates.length}</div>
           </div>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-800">
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Award className="w-12 h-12 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{dict.certificates.empty}</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-sm text-center">{dict.certificates.emptyDesc}</p>
          <Link href={`/${lang}/paths`}>
            <Button size="lg" className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-14 px-10 shadow-xl shadow-indigo-600/20 transition-all active:scale-95">
              Explorer les Parcours
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {certificates.map((cert: any) => (
            <Card key={cert.id} className="overflow-hidden border border-slate-800 rounded-[40px] shadow-2xl bg-slate-900/50 backdrop-blur-md group hover:border-amber-500/30 transition-all">
               <CardContent className="p-10 relative">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-amber-500/10 transition-colors" />
                  
                  <div className="flex items-start justify-between mb-10">
                     <div className="w-20 h-20 bg-slate-800 rounded-[24px] flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-110 transition-transform">
                        <Award className="w-10 h-10" />
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-500 font-bold px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest">
                           {dict.certificates.verified}
                        </Badge>
                        <span className="text-[10px] text-slate-500 font-bold font-mono">VERIFIED ID: {cert.code}</span>
                     </div>
                  </div>

                  <div className="space-y-4 mb-12">
                     <h3 className="text-3xl font-bold text-white leading-tight tracking-tight">
                        Professional Certificate in {cert.course.title}
                     </h3>
                     <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                        Ce certificat atteste de la maîtrise complète des modules, exercices pratiques et du projet final validé par le jury.
                     </p>
                     <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 pt-2">
                        <span>Délivré le {new Date(cert.issuedAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                        <span>Kladriva Academy</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10 border-t border-slate-800/50">
                     <CertificateDownload 
                        data={{
                           userName: session.user?.name || "Student",
                           courseName: cert.course.title,
                           date: cert.issuedAt,
                           certificateCode: cert.code
                        }}
                     />
                     <Button variant="outline" className="rounded-2xl h-14 font-bold border-slate-800 text-white bg-slate-800/50 hover:bg-slate-800 gap-3">
                        <svg className="w-5 h-5 fill-[#0A66C2]" viewBox="0 0 24 24">
                           <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        Ajouter à LinkedIn
                     </Button>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="p-10 rounded-[40px] bg-indigo-600 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-indigo-900/30 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
         <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[28px] shadow-sm border border-white/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-12 h-12 text-white" />
         </div>
         <div className="flex-1 space-y-2 text-center md:text-left relative z-10">
            <h4 className="text-2xl font-bold">{dict.certificates.verified}</h4>
            <p className="text-indigo-100 text-lg leading-relaxed max-w-2xl">
               {dict.certificates.verificationDesc}
            </p>
         </div>
         <Button variant="ghost" className="text-white bg-white/10 hover:bg-white/20 font-bold rounded-2xl h-14 px-8 gap-2 relative z-10">
            {dict.certificates.verificationPortal} <ExternalLink className="w-5 h-5" />
         </Button>
      </div>
    </div>
  )
}
