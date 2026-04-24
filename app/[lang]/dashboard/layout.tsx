import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { getDictionary } from "@/lib/dictionary";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params as { lang: "en" | "fr" };
  const dict = await getDictionary(lang);
  const session = await auth();

  if (!session?.user) {
    redirect(`/${lang}/auth/signin`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { reputation: true }
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar dict={dict} reputation={user?.reputation ?? 0} />
      <MobileNav dict={dict} />
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 pt-24 md:pt-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
