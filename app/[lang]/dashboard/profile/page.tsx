import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Shield, User, Mail, Camera, Save, Lock, Bell, Sparkles, ChevronRight } from "lucide-react"
import { updateProfile } from "@/lib/user-actions"
import { revalidatePath } from "next/cache"

export default async function ProfilePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const session = await auth()
  if (!session?.user) redirect(`/${lang}/auth/signin`)

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) redirect(`/${lang}/auth/signin`)

  async function handleUpdate(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const bio = formData.get("bio") as string
    
    await updateProfile({ name, bio })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d1d1f]/5 border border-[#1d1d1f]/10 text-[#1d1d1f] text-[11px] font-bold uppercase tracking-widest">
          <User className="w-3.5 h-3.5" /> Compte Utilisateur
        </div>
        <h1 className="text-[32px] md:text-[40px] font-semibold tracking-tight text-[#1d1d1f]">
          Mon Profil
        </h1>
        <p className="text-[#86868b] text-xl leading-relaxed">
          Gérez vos informations personnelles et personnalisez votre expérience d'apprentissage.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Sidebar Info */}
        <div className="md:col-span-4 space-y-6">
          <Card className="border-[#d2d2d7] rounded-[40px] shadow-sm overflow-hidden bg-white group">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <Avatar className="w-32 h-32 rounded-[40px] shadow-2xl ring-4 ring-white border border-[#d2d2d7]/30">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="bg-[#f5f5f7] text-[#1d1d1f] font-bold text-4xl">{user.name?.[0]}</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-2.5 bg-[#1d1d1f] text-white rounded-2xl shadow-xl hover:scale-110 transition-transform active:scale-95">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">{user.name}</h2>
              <p className="text-[#86868b] text-[15px] font-medium mt-1 uppercase tracking-tighter">{user.role}</p>
              
              <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-[#f5f5f7]">
                 <div className="space-y-1">
                    <p className="text-[17px] font-bold text-[#1d1d1f]">{user.reputation}</p>
                    <p className="text-[10px] text-[#86868b] uppercase font-black tracking-widest">Points</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[17px] font-bold text-[#1d1d1f]">0</p>
                    <p className="text-[10px] text-[#86868b] uppercase font-black tracking-widest">Badges</p>
                 </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-8 rounded-[40px] bg-[#f5f5f7]/50 border border-[#d2d2d7] space-y-4">
             <h3 className="text-sm font-bold text-[#1d1d1f] uppercase tracking-widest">Statut du compte</h3>
             <div className="flex items-center gap-3 text-emerald-600">
                <Shield className="w-5 h-5" />
                <span className="text-[15px] font-bold">Vérifié & Sécurisé</span>
             </div>
          </div>
        </div>

        {/* Main Settings Form */}
        <div className="md:col-span-8 space-y-8">
          <Card className="border-[#d2d2d7] rounded-[40px] shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-10 pb-0">
              <CardTitle className="text-2xl font-bold text-[#1d1d1f]">Informations Générales</CardTitle>
              <CardDescription className="text-[#86868b] text-[15px]">Ces détails seront visibles par vos mentors et pairs.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-8">
              <form action={handleUpdate} className="space-y-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label htmlFor="name" className="text-[13px] font-bold text-[#1d1d1f] uppercase tracking-wider ml-1">Nom complet</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      defaultValue={user.name || ""} 
                      className="h-12 rounded-2xl border-[#d2d2d7] focus:ring-[#0066cc] bg-[#f5f5f7]/30"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="email" className="text-[13px] font-bold text-[#1d1d1f] uppercase tracking-wider ml-1">Adresse Email</Label>
                    <div className="relative">
                      <Input 
                        id="email" 
                        disabled 
                        defaultValue={user.email || ""} 
                        className="h-12 rounded-2xl border-[#d2d2d7] bg-[#f5f5f7] text-[#86868b] cursor-not-allowed pl-10"
                      />
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#86868b]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="bio" className="text-[13px] font-bold text-[#1d1d1f] uppercase tracking-wider ml-1">Biographie</Label>
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    defaultValue={user.bio || ""} 
                    placeholder="Dites-nous en plus sur vous, vos objectifs et votre parcours..."
                    className="min-h-[160px] rounded-[24px] border-[#d2d2d7] focus:ring-[#0066cc] bg-[#f5f5f7]/30 p-5 text-[15px] resize-none"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button className="h-12 rounded-full bg-[#1d1d1f] text-white hover:bg-black font-bold px-10 gap-2 shadow-xl shadow-black/10 transition-all active:scale-95">
                    <Save className="w-4.5 h-4.5" /> Enregistrer les modifications
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security & Notifications Placeholder */}
          <div className="grid gap-6 sm:grid-cols-2">
             <div className="p-8 rounded-[40px] border border-[#d2d2d7] bg-white flex items-center justify-between group cursor-pointer hover:border-[#1d1d1f] transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f]">
                      <Lock className="w-5 h-5" />
                   </div>
                   <div className="space-y-0.5">
                      <p className="font-bold text-[#1d1d1f]">Mot de passe</p>
                      <p className="text-[13px] text-[#86868b]">Dernière modification : 3j</p>
                   </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#d2d2d7] group-hover:text-[#1d1d1f] transition-colors" />
             </div>

             <div className="p-8 rounded-[40px] border border-[#d2d2d7] bg-white flex items-center justify-between group cursor-pointer hover:border-[#1d1d1f] transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f]">
                      <Bell className="w-5 h-5" />
                   </div>
                   <div className="space-y-0.5">
                      <p className="font-bold text-[#1d1d1f]">Notifications</p>
                      <p className="text-[13px] text-[#86868b]">Email & Push activés</p>
                   </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#d2d2d7] group-hover:text-[#1d1d1f] transition-colors" />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
