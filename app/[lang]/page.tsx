import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionary";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Zap, 
  Globe,
  Briefcase,
  GraduationCap
} from "lucide-react";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params as { lang: "en" | "fr" };
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col min-h-screen bg-background bg-grid selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="text-white w-5 h-5 fill-white" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-white">KLADRIVA</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href={`/${lang}/api/auth/signin`}>
              <Button variant="ghost" className="text-slate-300 hover:text-white">Login</Button>
            </Link>
            <Link href={`/${lang}/dashboard`}>
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Sparkles className="w-3 h-3" />
            THE FUTURE OF PROFESSIONAL GROWTH
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tight text-white mb-8 leading-[0.9]">
            TRANSFORM YOUR <br />
            <span className="text-primary italic">CAREER</span> WITH AI.
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-12 leading-relaxed">
            Beyond Coursera. Beyond LinkedIn. A radical platform built for outcomes. 
            Real projects, human mentors, and AI-powered personalization.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href={`/${lang}/dashboard`}>
              <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-xl shadow-xl shadow-primary/20">
                Start Your Transformation <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 border-white/10 bg-white/5 text-white text-lg font-bold rounded-xl hover:bg-white/10 transition-all">
              Watch Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="pt-20 border-t border-white/5">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-10">Trusted by professionals from</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="text-2xl font-black text-white">GOOGLE</div>
              <div className="text-2xl font-black text-white">STRIPE</div>
              <div className="text-2xl font-black text-white">NOTION</div>
              <div className="text-2xl font-black text-white">VERCEL</div>
              <div className="text-2xl font-black text-white">OPENAI</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="max-w-7xl mx-auto px-6 py-40">
          <div className="grid md:grid-cols-3 gap-8">
            <Card 
              icon={<Zap className="w-6 h-6 text-primary" />}
              title="Outcome-Driven Learning"
              description="Forget generic certificates. Build a verified portfolio through real-world projects that recruiters actually care about."
            />
            <Card 
              icon={<Users className="w-6 h-6 text-primary" />}
              title="Elite Mentorship"
              description="Get matched with industry leaders from top tech companies for 1:1 coaching that accelerates your path."
            />
            <Card 
              icon={<Briefcase className="w-6 h-6 text-primary" />}
              title="Direct Marketplace"
              description="Our AI matches your specific skill profile with high-paying jobs and freelance missions automatically."
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="text-primary w-6 h-6 fill-primary" />
            <span className="text-xl font-display font-bold text-white">KLADRIVA</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Kladriva Academy. Built for the new economy.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
            <a href="#" className="hover:text-white">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Card({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all duration-500">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
