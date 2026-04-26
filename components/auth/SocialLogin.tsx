"use client"

import { Button } from "@/components/ui/button"
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"
import { signIn } from "next-auth/react"

export function SocialLogin({ callbackUrl }: { callbackUrl: string }) {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl,
    })
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button 
        variant="outline" 
        className="h-11 rounded-full border-slate-200 bg-white text-slate-900 hover:bg-slate-50 font-medium gap-2"
        onClick={() => onClick("github")}
      >
        <IconBrandGithub className="w-4 h-4" /> GitHub
      </Button>
      <Button 
        variant="outline" 
        className="h-11 rounded-full border-slate-200 bg-white text-slate-900 hover:bg-slate-50 font-medium gap-2"
        onClick={() => onClick("google")}
      >
        <IconBrandGoogle className="w-4 h-4" /> Google
      </Button>
    </div>
  )
}
