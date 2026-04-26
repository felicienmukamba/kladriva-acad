import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/landing/Footer"

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-black mb-8 tracking-tight">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none space-y-8">
           <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Data Collection</h2>
              <p className="text-slate-600 leading-relaxed">
                We collect information that you provide directly to us when you create an account, enroll in a course, or communicate with us. This includes your name, email address, and profile information.
              </p>
           </section>

           <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use of Information</h2>
              <p className="text-slate-600 leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, communicate with you, and personalize your learning experience.
              </p>
           </section>

           <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Sharing</h2>
              <p className="text-slate-600 leading-relaxed">
                We do not sell your personal information. We may share your information with third-party service providers who perform services on our behalf, or when required by law.
              </p>
           </section>

           <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Your Choices</h2>
              <p className="text-slate-600 leading-relaxed">
                You can access and update your account information at any time through your profile settings. You may also request the deletion of your account and personal data.
              </p>
           </section>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
