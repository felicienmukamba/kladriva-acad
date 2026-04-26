import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params as { lang: "en" | "fr" };

  return (
    <AuthShell
      lang={lang}
      title="Create account"
      subtitle="Join Kladriva and start learning with a premium, Apple-like experience."
    >
      <RegisterForm lang={lang} />
    </AuthShell>
  );
}
