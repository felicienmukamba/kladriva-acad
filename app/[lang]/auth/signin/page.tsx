import { LoginForm } from "@/components/auth/LoginForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params as { lang: "en" | "fr" };

  return (
    <AuthShell
      lang={lang}
      title="Sign in"
      subtitle="Access your dashboard, programs, and mentorship in a calmer, Apple-like layout."
    >
      <LoginForm lang={lang} />
    </AuthShell>
  );
}
