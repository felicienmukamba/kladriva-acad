import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShieldCheck, ArrowRight, Lock } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { bookSession } from "@/app/actions/mentorship"

export default async function CheckoutPage({ 
  searchParams, params 
}: { 
  searchParams: Promise<{ slotId?: string, mentorId?: string }>,
  params: Promise<{ lang: string }> 
}) {
  const { lang } = await params
  const { slotId, mentorId } = await searchParams
  const session = await auth()

  if (!session?.user) redirect(`/${lang}/auth/signin`)
  if (!slotId || !mentorId) redirect(`/${lang}/dashboard/mentorship`)

  const mentor = await prisma.user.findUnique({ where: { id: mentorId } })

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col justify-center py-12 px-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Lock className="w-12 h-12 text-[#1d1d1f] mx-auto mb-4" />
        <h2 className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight">Secure Checkout</h2>
        <p className="text-[#86868b] text-[15px] mt-2">Powered by Stripe Processing</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white py-12 px-10 shadow-sm border border-[#d2d2d7] rounded-[24px]">
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#d2d2d7]">
            <div>
              <p className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">Session</p>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Mentorship with {mentor?.name}</h3>
            </div>
            <div className="text-right">
              <p className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">Total</p>
              <h3 className="text-[24px] font-semibold text-[#1d1d1f]">$60.00</h3>
            </div>
          </div>

          <form action={async () => {
             "use server"
             const formData = new FormData()
             formData.append("slotId", slotId)
             formData.append("mentorId", mentorId)
             formData.append("menteeId", session.user!.id!)
             await bookSession(formData)
          }}>
            <div className="space-y-6 mb-8">
              <div className="h-12 bg-[#f5f5f7] rounded-[12px] border border-[#d2d2d7] flex items-center px-4 text-[#86868b] text-[15px]">
                 **** **** **** 4242
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="h-12 bg-[#f5f5f7] rounded-[12px] border border-[#d2d2d7] flex items-center px-4 text-[#86868b] text-[15px]">
                    12/25
                 </div>
                 <div className="h-12 bg-[#f5f5f7] rounded-[12px] border border-[#d2d2d7] flex items-center px-4 text-[#86868b] text-[15px]">
                    CVC
                 </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-full bg-[#1d1d1f] hover:bg-black text-white font-medium text-[17px] gap-2">
              Pay $60.00 <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-[#86868b] text-[13px] font-medium">
             <ShieldCheck className="w-4 h-4 text-emerald-500" /> Guaranteed safe & secure checkout
          </div>
        </div>
      </div>
    </div>
  )
}
