import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download, Share2, ExternalLink, ShieldCheck, Trophy, Sparkles, GraduationCap } from "lucide-react"
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
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d1d1f]/5 border border-[#1d1d1f]/10 text-[#1d1d1f] text-[11px] font-bold uppercase tracking-widest">
            <Trophy className="w-3.5 h-3.5" /> Accomplissements
          </div>
          <h1 className="text-[32px] md:text-[40px] font-semibold tracking-tight text-[#1d1d1f]">
            {dict.certificates.title}
          </h1>
          <p className="text-[#86868b] text-xl max-w-xl leading-relaxed">
            {dict.certificates.tagline}
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-xl p-4 rounded-[28px] border border-[#d2d2d7] shadow-sm">
           <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f]">
              <Award className="w-6 h-6" />
           </div>
           <div className="pr-4">
              <div className="text-[11px] text-[#86868b] uppercase font-bold tracking-widest">Total Certificats</div>
              <div className="text-2xl font-bold text-[#1d1d1f]">{certificates.length}</div>
           </div>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white border border-[#d2d2d7] rounded-[48px] shadow-sm">
          <div className="w-24 h-24 bg-[#f5f5f7] rounded-[32px] flex items-center justify-center mb-8 shadow-inner">
            <Award className="w-12 h-12 text-[#d2d2d7]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1d1d1f] mb-3">{dict.certificates.empty}</h2>
          <p className="text-[#86868b] text-lg mb-10 max-w-sm text-center leading-relaxed">
            {dict.certificates.emptyDesc}
          </p>
          <Link href={`/${lang}/paths`}>
            <Button size="lg" className="rounded-full bg-[#1d1d1f] text-white hover:bg-black font-bold h-14 px-12 shadow-xl shadow-black/10 transition-all active:scale-95">
              Explorer les Parcours
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {certificates.map((cert: any) => (
            <Card key={cert.id} className="overflow-hidden border border-[#d2d2d7] rounded-[48px] shadow-sm bg-white hover:border-[#1d1d1f] transition-all duration-500 group flex flex-col">
               <CardContent className="p-10 relative flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-10">
                     <div className="w-20 h-20 bg-[#f5f5f7] rounded-[28px] flex items-center justify-center text-[#1d1d1f] shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <GraduationCap className="w-10 h-10" />
                     </div>
                     <div className="flex flex-col items-end gap-3">
                        <Badge variant="outline" className="border-none bg-emerald-500/10 text-emerald-600 font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest">
                           {dict.certificates.verified}
                        </Badge>
                        <span className="text-[10px] text-[#86868b] font-bold font-mono tracking-tighter uppercase">ID: {cert.qrCodeToken?.slice(0, 8) || "KL-8291"}</span>
                     </div>
                  </div>

                  <div className="space-y-4 mb-12 flex-1">
                     <h3 className="text-[28px] font-bold text-[#1d1d1f] leading-tight tracking-tight">
                        {cert.course.title}
                     </h3>
                     <p className="text-[#86868b] text-[15px] leading-relaxed max-w-sm">
                        Ce certificat atteste de la réussite aux examens et de la validation des projets pratiques de la formation.
                     </p>
                     <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-[#86868b] pt-4">
                        <span>Délivré le {new Date(cert.issuedAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-[#d2d2d7] rounded-full"></span>
                        <span>Kladriva Academy</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10 border-t border-[#f5f5f7]">
                     <CertificateDownload 
                        data={{
                           userName: session.user?.name || "Student",
                           courseName: cert.course.title,
                           date: cert.issuedAt,
                           certificateCode: cert.qrCodeToken
                        }}
                     />
                     <Button variant="outline" className="rounded-full h-12 font-bold border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7] gap-3 transition-all">
                        <Share2 className="w-4 h-4" /> Partager
                     </Button>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Trust Banner */}
      <div className="p-12 rounded-[48px] bg-[#1d1d1f] text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl shadow-black/10 overflow-hidden relative group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-white/10 transition-colors duration-1000" />
         <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
            <ShieldCheck className="w-12 h-12 text-white" />
         </div>
         <div className="flex-1 space-y-3 text-center md:text-left relative z-10">
            <h4 className="text-[24px] font-bold">{dict.certificates.verified}</h4>
            <p className="text-white/60 text-[17px] leading-relaxed max-w-2xl">
               {dict.certificates.verificationDesc}
            </p>
         </div>
         <Button variant="ghost" className="text-white bg-white/10 hover:bg-white/20 font-bold rounded-full h-14 px-10 gap-3 relative z-10 transition-all active:scale-95">
            Portail de Vérification <ExternalLink className="w-5 h-5" />
         </Button>
      </div>
    </div>
  )
}
