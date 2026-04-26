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
    <div className="p-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-[32px] font-semibold tracking-tight text-[#1d1d1f]">{dict.certificates.title}</h1>
        <p className="text-[#86868b] text-[17px]">{dict.certificates.tagline}</p>
      </div>

      {certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-[#f5f5f7] rounded-[24px]">
          <Award className="w-16 h-16 text-[#d2d2d7] mb-6" />
          <h2 className="text-[24px] font-semibold text-[#1d1d1f] mb-2">{dict.certificates.empty}</h2>
          <p className="text-[#86868b] text-[15px] mb-8 max-w-sm text-center">{dict.certificates.emptyDesc}</p>
          <Link href={`/${lang}/paths`}>
            <Button size="lg" className="rounded-full bg-[#1d1d1f] hover:bg-black text-white font-medium h-12 px-8">{dict.sidebar.learningPaths}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {certificates.map((cert: any) => (
            <Card key={cert.id} className="overflow-hidden border border-[#d2d2d7] rounded-[24px] shadow-none bg-white">
               <CardContent className="p-10">
                  <div className="flex items-start justify-between mb-8">
                     <div className="w-16 h-16 bg-[#f5f5f7] rounded-[16px] flex items-center justify-center text-[#1d1d1f]">
                        <Award className="w-8 h-8" />
                     </div>
                     <Badge variant="outline" className="border-[#d2d2d7] bg-[#f5f5f7] text-[#1d1d1f] font-medium px-3 py-1 rounded-full text-[12px]">
                        {dict.certificates.verified}
                     </Badge>
                  </div>

                  <div className="space-y-4 mb-10">
                     <h3 className="text-[24px] font-semibold text-[#1d1d1f] leading-tight">
                        Professional Certificate in {cert.course.title}
                     </h3>
                     <div className="flex items-center gap-4 text-[12px] font-medium uppercase tracking-wider text-[#86868b]">
                        <span>Issued {new Date(cert.issuedAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-[#d2d2d7] rounded-full"></span>
                        <span>ID: {cert.code}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-8 border-t border-[#d2d2d7]">
                     <CertificateDownload 
                        data={{
                           userName: session.user?.name || "Student",
                           courseName: cert.course.title,
                           date: cert.issuedAt,
                           certificateCode: cert.code
                        }}
                     />
                     <Button variant="outline" className="rounded-full h-12 font-medium border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7] gap-2">
                        <Share2 className="w-4 h-4" /> {dict.certificates.share}
                     </Button>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="p-10 rounded-[24px] bg-[#f5f5f7] flex flex-col md:flex-row items-center gap-10">
         <div className="w-20 h-20 bg-white rounded-[20px] shadow-sm border border-[#d2d2d7] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-10 h-10 text-[#1d1d1f]" />
         </div>
         <div className="flex-1 space-y-2">
            <h4 className="text-[20px] font-semibold text-[#1d1d1f]">{dict.certificates.verified}</h4>
            <p className="text-[#86868b] text-[15px] leading-relaxed">
               {dict.certificates.verificationDesc}
            </p>
         </div>
         <Button variant="ghost" className="text-[#0066cc] font-medium gap-2 hover:bg-transparent hover:text-[#0055b3]">
            {dict.certificates.verificationPortal} <ExternalLink className="w-4 h-4" />
         </Button>
      </div>
    </div>
  )
}
