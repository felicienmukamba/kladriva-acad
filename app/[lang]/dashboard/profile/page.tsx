import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProfile } from "@/app/actions/user"
import { UserCircle, Shield, Camera, Zap } from "lucide-react"
import { subscribeToProPlan } from "@/app/actions/billing"

export default async function ProfilePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const session = await auth()

  if (!session?.user) {
    redirect(`/${lang}/auth/signin`)
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id! },
    include: { subscription: true }
  })

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <div className="space-y-2">
        <h1 className="text-[32px] font-semibold tracking-tight text-[#1d1d1f]">Your Profile</h1>
        <p className="text-[#86868b] text-[17px]">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-[#f5f5f7] border border-[#d2d2d7] rounded-[24px] overflow-hidden">
        <div className="h-32 bg-[#e8e8ed] relative">
           <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-sm border border-[#d2d2d7] group relative overflow-hidden">
                 {user.image ? (
                   <img src={user.image} alt="Profile" className="w-full h-full object-cover rounded-full" />
                 ) : (
                   <div className="w-full h-full bg-[#1d1d1f] text-white flex items-center justify-center text-3xl font-semibold rounded-full">
                     {user.name?.charAt(0)}
                   </div>
                 )}
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                    <Camera className="w-6 h-6 text-white" />
                 </div>
              </div>
           </div>
        </div>
        
        <div className="pt-20 px-8 pb-8">
          <form action={async (formData) => {
            "use server"
            await updateProfile(formData)
          }} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Full Name</label>
                <Input name="name" defaultValue={user.name || ""} className="h-12 bg-white border-[#d2d2d7] rounded-[12px] text-[#1d1d1f] focus-visible:ring-[#0066cc]" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Avatar URL</label>
                <Input name="image" defaultValue={user.image || ""} placeholder="https://..." className="h-12 bg-white border-[#d2d2d7] rounded-[12px] text-[#1d1d1f] focus-visible:ring-[#0066cc]" />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Headline / Role</label>
                <Input name="headline" defaultValue={user.headline || ""} placeholder="E.g. Senior Software Engineer" className="h-12 bg-white border-[#d2d2d7] rounded-[12px] text-[#1d1d1f] focus-visible:ring-[#0066cc]" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Bio</label>
                <textarea name="bio" defaultValue={user.bio || ""} rows={4} className="w-full bg-white border border-[#d2d2d7] rounded-[12px] p-4 text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] resize-none" placeholder="Tell us about yourself..." />
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-[#d2d2d7]">
              <Button type="submit" className="bg-[#1d1d1f] hover:bg-black text-white font-medium h-12 px-8 rounded-full">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="p-8 rounded-[24px] bg-white border border-[#d2d2d7] flex items-center gap-6">
        <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center shrink-0">
           <Shield className="w-6 h-6 text-[#1d1d1f]" />
        </div>
        <div>
           <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-1">Account Security</h3>
           <p className="text-[#86868b] text-[15px]">Your account is secured by Kladriva Authentication. To change your password or email, please contact support.</p>
        </div>
      </div>

      <div className="p-8 rounded-[24px] bg-[#1d1d1f] text-white flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-6">
           <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-yellow-400" />
           </div>
           <div>
              <h3 className="text-[20px] font-semibold mb-1">Kladriva Pro Plan</h3>
              <p className="text-[#a1a1a6] text-[15px]">
                {user.subscription?.active && user.subscription.plan === "PROFESSIONAL" 
                  ? `Active until ${new Date(user.subscription.endDate!).toLocaleDateString()}` 
                  : "Unlock all premium courses and mentorship sessions."}
              </p>
           </div>
        </div>
        {!user.subscription?.active || user.subscription.plan !== "PROFESSIONAL" ? (
           <form action={async () => {
             "use server"
             await subscribeToProPlan()
           }}>
              <Button type="submit" className="bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] font-medium h-12 px-8 rounded-full shrink-0">
                 Upgrade for $49.99/mo
              </Button>
           </form>
        ) : (
           <Button variant="outline" className="border-white/20 text-white font-medium h-12 px-8 rounded-full shrink-0 hover:bg-white/10">
              Manage Billing
           </Button>
        )}
      </div>
    </div>
  )
}
