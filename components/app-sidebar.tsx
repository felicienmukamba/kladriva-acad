"use client"

import * as React from "react"
import {
  IconDashboard,
  IconDatabase,
  IconFolder,
  IconHelp,
  IconBook,
  IconSchool,
  IconAward,
  IconMessageCircle,
  IconBriefcase,
  IconShieldLock,
  IconLayersLinked
} from "@tabler/icons-react"
import { useSession } from "next-auth/react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { ThemeToggle } from "./ThemeToggle"
import { LanguageToggle } from "./LanguageToggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useDictionary } from "@/components/DictionaryProvider"

export function AppSidebar({ lang, ...props }: React.ComponentProps<typeof Sidebar> & { lang: string }) {
  const { data: session } = useSession()
  const dict = useDictionary()
  const role = session?.user?.role || "STUDENT"
  const isAdmin = role === "ADMIN" || role === "INSTRUCTOR"
  const isMentor = role === "MENTOR"
  const isCompany = role === "COMPANY"

  const data = {
    user: {
      name: session?.user?.name || "User",
      email: session?.user?.email || "user@kladriva.com",
      avatar: session?.user?.image || "/avatars/default.jpg",
    },
    navPlatform: [
      {
        title: dict.sidebar.overview,
        url: `/${lang}/dashboard`,
        icon: IconDashboard,
      },
      {
        title: dict.sidebar.myLearning,
        url: `/${lang}/dashboard/learning`,
        icon: IconBook,
      },
      {
        title: dict.sidebar.network,
        url: `/${lang}/dashboard/network`,
        icon: IconMessageCircle,
      },
    ],
    navLearning: [
      {
        title: dict.sidebar.learningPaths,
        url: `/${lang}/dashboard/paths`,
        icon: IconLayersLinked,
      },
      {
        title: dict.sidebar.projectLabs,
        url: `/${lang}/dashboard/projects`,
        icon: IconFolder,
      },
    ],
    navAdmin: isAdmin ? [
      {
        title: dict.sidebar.adminConsole,
        url: `/${lang}/dashboard/admin`,
        icon: IconShieldLock,
      },
    ] : [],
    navMentorship: isMentor ? [
      {
        title: dict.sidebar.coachDashboard,
        url: `/${lang}/dashboard/mentorship`,
        icon: IconSchool,
      },
    ] : [
      {
        title: dict.sidebar.findMentor,
        url: `/${lang}/dashboard/mentorship`,
        icon: IconSchool,
      }
    ],
    navCareers: isCompany ? [
      {
        title: dict.sidebar.hiringPortal,
        url: `/${lang}/dashboard/jobs`,
        icon: IconBriefcase,
      },
    ] : [
      {
        title: dict.sidebar.careers,
        url: `/${lang}/dashboard/jobs`,
        icon: IconBriefcase,
      },
    ],
    documents: [
      {
        name: dict.common.certificates,
        url: `/${lang}/dashboard/certificates`,
        icon: IconAward,
      },
      {
        name: dict.common.library,
        url: `/${lang}/dashboard/resources`,
        icon: IconDatabase,
      },
    ],
    navSupport: [
      {
        title: dict.sidebar.helpCenter,
        url: `/${lang}/help`,
        icon: IconHelp,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-r-0 bg-transparent" {...props}>
      <SidebarHeader className="h-(--header-height) flex items-center px-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="hover:bg-transparent active:bg-transparent"
              render={<a href={`/${lang}/dashboard`} title="Dashboard" />}
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                  <IconSchool className="size-5" />
                </div>
                <span className="text-[15px] font-semibold tracking-tight text-sidebar-foreground">
                  Kladriva
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-2 gap-6 no-scrollbar">
        {isAdmin && (
          <div className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/30">
              {dict.common.system}
            </h3>
            <NavMain items={data.navAdmin} />
          </div>
        )}

        <div className="space-y-1">
          <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/30">
            {dict.common.platform}
          </h3>
          <NavMain items={data.navPlatform} />
        </div>

        <div className="space-y-1">
          <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/30">
            {dict.common.education}
          </h3>
          <NavMain items={data.navLearning} />
          <NavDocuments items={data.documents} />
        </div>

        <div className="space-y-1">
          <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/30">
            {dict.common.growth}
          </h3>
          <NavMain items={data.navMentorship} />
          <NavMain items={data.navCareers} />
        </div>

        <div className="space-y-1">
          <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/30">
            {dict.common.support}
          </h3>
          <NavMain items={data.navSupport} />
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-sidebar/70 mt-auto border-t border-sidebar-border/70">
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-1 rounded-full border border-sidebar-border/70 bg-sidebar-accent/40 p-1 shadow-sm">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
