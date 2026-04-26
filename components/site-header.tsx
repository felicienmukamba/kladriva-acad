"use client"

import { LanguageToggle } from "@/components/LanguageToggle"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

import { useDictionary } from "@/components/DictionaryProvider"

export function SiteHeader() {
  const pathname = usePathname()
  const dict = useDictionary()
  const segments = pathname.split("/").filter(Boolean)

  const segmentLabels: Record<string, string> = {
    dashboard: dict.common.dashboard,
    admin: "Admin",
    courses: dict.admin.courses.curriculum,
    jobs: dict.common.jobs,
    users: "Users",
    learning: dict.common.learning,
    mentorship: dict.common.mentorship,
    projects: dict.common.projects,
    paths: dict.sidebar.learningPaths,
    network: dict.common.network,
    certificates: dict.common.certificates,
    resources: dict.common.library,
  }

  const dashboardIndex = segments.indexOf("dashboard")
  const trail =
    dashboardIndex === -1
      ? ["dashboard"]
      : ["dashboard", ...segments.slice(dashboardIndex + 1)]

  const crumbs = trail
    .filter((segment) => segment.length > 0)
    .map((segment) => {
      if (segmentLabels[segment]) {
        return segmentLabels[segment]
      }

      if (segment.length > 12) {
        return "..."
      }

      return segment.charAt(0).toUpperCase() + segment.slice(1)
    })

  const title = crumbs.length > 0 ? crumbs[crumbs.length - 1] : dict.common.dashboard
  const breadcrumb = crumbs.slice(0, -1)

  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center border-b border-border/40 bg-background/70 backdrop-blur-2xl transition-[width,height] ease-linear shadow-sm">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
        <Separator
          orientation="vertical"
          className="mx-1 h-4 bg-border/50"
        />
        <div className="flex items-center gap-2 min-w-0">
          {breadcrumb.length > 0 ? (
            <p className="hidden sm:flex items-center gap-2 text-[13px] text-muted-foreground truncate">
              {breadcrumb.map((item) => (
                <span key={item} className="truncate">
                  {item}
                </span>
              ))}
            </p>
          ) : null}
          {breadcrumb.length > 0 ? (
            <span className="hidden sm:block text-muted-foreground/40">/</span>
          ) : null}
          <h1 className="text-[15px] font-semibold tracking-[-0.02em] text-foreground truncate">
            {title}
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-border/50 bg-background/50 backdrop-blur-md p-1 shadow-sm">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
