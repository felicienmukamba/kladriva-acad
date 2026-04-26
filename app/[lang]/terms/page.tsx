import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/landing/Footer"

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-black mb-8 tracking-tight">Terms of Service</h1>
        <div className="prose prose-slate max-w-none space-y-8">
           <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-600 leading-relaxed">
                By accessing and using Kladriva Academy, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
           </section>

           <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. User Conduct</h2>
              <p className="text-slate-600 leading-relaxed">
                Users are responsible for their own actions and content. Any form of harassment, cheating, or unauthorized sharing of platform materials is strictly prohibited and may result in account termination.
              </p>
           </section>

           <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Intellectual Property</h2>
              <p className="text-slate-600 leading-relaxed">
                All content on Kladriva Academy, including videos, text, and code, is the property of Kladriva Academy or its content providers and is protected by copyright laws.
              </p>
           </section>

           <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Limitation of Liability</h2>
              <p className="text-slate-600 leading-relaxed">
                Kladriva Academy shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services.
              </p>
           </section>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
