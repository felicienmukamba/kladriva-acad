import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/landing/Footer"

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-[48px] font-semibold mb-12 tracking-tight text-[#1d1d1f]">Privacy Policy</h1>
        <div className="space-y-12">
           <section>
              <h2 className="text-[24px] font-semibold text-[#1d1d1f] mb-4">1. Data Collection</h2>
              <p className="text-[17px] text-[#1d1d1f] leading-relaxed">
                We collect information that you provide directly to us when you create an account, enroll in a course, or communicate with us. This includes your name, email address, and profile information.
              </p>
           </section>

           <section>
              <h2 className="text-[24px] font-semibold text-[#1d1d1f] mb-4">2. Use of Information</h2>
              <p className="text-[17px] text-[#1d1d1f] leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, communicate with you, and personalize your learning experience.
              </p>
           </section>

           <section>
              <h2 className="text-[24px] font-semibold text-[#1d1d1f] mb-4">3. Data Sharing</h2>
              <p className="text-[17px] text-[#1d1d1f] leading-relaxed">
                We do not sell your personal information. We may share your information with third-party service providers who perform services on our behalf, or when required by law.
              </p>
           </section>

           <section>
              <h2 className="text-[24px] font-semibold text-[#1d1d1f] mb-4">4. Your Choices</h2>
              <p className="text-[17px] text-[#1d1d1f] leading-relaxed">
                You can access and update your account information at any time through your profile settings. You may also request the deletion of your account and personal data.
              </p>
           </section>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
