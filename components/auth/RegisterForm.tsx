"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
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
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <Input
              {...register("name")}
              id="name"
              placeholder={dict.auth.name}
              className="rounded-xl border-[#d2d2d7] bg-white px-4 h-14 text-[17px] text-[#1d1d1f] focus-visible:ring-4 focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] transition-all placeholder:text-[#86868b]"
              required
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-xs text-rose-500 mt-1 pl-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder={dict.auth.email}
              className="rounded-xl border-[#d2d2d7] bg-white px-4 h-14 text-[17px] text-[#1d1d1f] focus-visible:ring-4 focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] transition-all placeholder:text-[#86868b]"
              required
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-rose-500 mt-1 pl-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Input 
              {...register("password")}
              id="password" 
              type="password" 
              placeholder={dict.auth.password}
              className="rounded-xl border-[#d2d2d7] bg-white px-4 h-14 text-[17px] text-[#1d1d1f] focus-visible:ring-4 focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] transition-all placeholder:text-[#86868b]"
              required 
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-xs text-rose-500 mt-1 pl-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-black text-white hover:bg-[#333336] rounded-full text-[15px] font-medium transition-all active:scale-[0.98] mt-4"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : dict.auth.signUp}
        </Button>

        <div className="text-center text-[13px] pt-6 border-t border-[#d2d2d7] mt-8">
          <span className="text-[#86868b]">{dict.auth.alreadyHaveAccount}</span>{" "}
          <Link href={`/${lang}/auth/signin`} className="text-[#0066cc] hover:underline">
            {dict.auth.signIn}
          </Link>
        </div>
      </form>
    </div>
  )
}
