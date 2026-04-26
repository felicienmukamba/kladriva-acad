import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = (await params) as { lang: "en" | "fr" }
  const session = await auth()

  if (!session?.user) {
    redirect(`/${lang}/auth/signin`)
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "4rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" lang={lang} />
      <SidebarInset className="bg-[#f5f5f7] relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh pointer-events-none opacity-50" />
        <SiteHeader />
        <main className="flex flex-1 flex-col relative z-10">
          <div className="@container/main flex flex-1 flex-col py-8">
            <div className="apple-section-shell flex flex-1 flex-col">
              {children}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
