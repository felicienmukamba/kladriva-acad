"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function LanguageToggle() {
  const router = useRouter()
  const pathname = usePathname()

  const changeLanguage = (lang: string) => {
    const segments = pathname.split('/')
    segments[1] = lang
    router.push(segments.join('/'))
  }

  const currentLang = pathname.split('/')[1] === 'fr' ? 'Français' : 'English'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2 px-2 h-9 rounded-full")}>
        <Languages className="h-4 w-4" />
        <span className="hidden sm:inline text-xs font-bold">{currentLang}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("fr")}>
          Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
