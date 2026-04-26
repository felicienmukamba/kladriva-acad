"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, User, Mail, Lock } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { SocialLogin } from "./SocialLogin"
import { Label } from "../ui/label"
import { useDictionary } from "@/components/DictionaryProvider"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof formSchema>

export function RegisterForm({ lang }: { lang: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const dict = useDictionary()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Registration failed")
      }

      toast.success("Account created! Signing you in...")
      
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: `/${lang}/dashboard`,
      })
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{dict.auth.name}</Label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                {...register("name")}
                id="name"
                placeholder="John Doe"
                className="rounded-2xl border-slate-200 bg-white pl-12 h-14 text-slate-900 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all shadow-sm"
                required
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className="text-xs font-medium text-rose-500 mt-1 pl-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{dict.auth.email}</Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="name@example.com"
                className="rounded-2xl border-slate-200 bg-white pl-12 h-14 text-slate-900 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all shadow-sm"
                required
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-rose-500 mt-1 pl-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{dict.auth.password}</Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                {...register("password")}
                id="password" 
                type="password" 
                placeholder="••••••••"
                className="rounded-2xl border-slate-200 bg-white pl-12 h-14 text-slate-900 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all shadow-sm"
                required 
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-rose-500 mt-1 pl-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-14 bg-slate-950 text-white hover:bg-slate-900 rounded-2xl text-base font-bold shadow-xl shadow-slate-950/10 transition-all active:scale-[0.98] mt-4"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : dict.auth.signUp}
        </Button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
            <span className="bg-slate-50 px-4 text-slate-400">Or connect via</span>
          </div>
        </div>
        
        <SocialLogin callbackUrl={`/${lang}/dashboard`} />

        <div className="text-center text-sm pt-4">
          <span className="text-slate-500 font-medium">{dict.auth.alreadyHaveAccount}</span>{" "}
          <Link href={`/${lang}/auth/signin`} className="text-primary font-bold hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
            {dict.auth.signIn}
          </Link>
        </div>
      </form>
    </div>
  )
}
