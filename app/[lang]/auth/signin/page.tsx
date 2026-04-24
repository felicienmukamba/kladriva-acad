import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Command, Globe } from "lucide-react";
import Link from "next/link";
import { signIn } from "@/lib/auth";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params as { lang: "en" | "fr" };

  return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center px-6">
      <div className="absolute top-10 left-10 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Zap className="text-white w-5 h-5 fill-white" />
        </div>
        <Link href={`/${lang}`} className="text-xl font-display font-bold tracking-tight text-white">KLADRIVA</Link>
      </div>

      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
        <CardHeader className="pt-10 pb-6 text-center">
          <CardTitle className="text-3xl font-display font-extrabold text-white mb-2">Welcome Back</CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to continue your career transformation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-10">
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: `/${lang}/dashboard` });
            }}
          >
            <Button className="w-full h-12 bg-white text-black hover:bg-slate-200 rounded-xl font-bold gap-3">
              <Command className="w-5 h-5" /> Continue with GitHub
            </Button>
          </form>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: `/${lang}/dashboard` });
            }}
          >
            <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl font-bold gap-3">
              <Globe className="w-5 h-5" /> Continue with Google
            </Button>
          </form>

          <div className="pt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account? {" "}
              <Link href={`/${lang}/auth/signup`} className="text-primary font-bold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Decorative gradient */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
