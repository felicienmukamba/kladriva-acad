"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useDictionary } from "@/components/DictionaryProvider"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type FormData = z.infer<typeof formSchema>

export function LoginForm({ lang }: { lang: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
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
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Invalid email or password")
      } else {
        toast.success(dict.auth.welcomeBack)
        router.push(`/${lang}/dashboard`)
        router.refresh()
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
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

        <div className="flex items-center justify-center py-2">
           <Link
             href={`/${lang}/auth/forgot-password`}
             className="text-[13px] text-[#0066cc] hover:underline"
           >
             {dict.auth.forgotPassword}
           </Link>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-black text-white hover:bg-[#333336] rounded-full text-[15px] font-medium transition-all active:scale-[0.98]"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : dict.auth.signIn}
        </Button>

        <div className="text-center text-[13px] pt-6 border-t border-[#d2d2d7] mt-8">
          <span className="text-[#86868b]">{dict.auth.dontHaveAccount}</span>{" "}
          <Link href={`/${lang}/auth/signup`} className="text-[#0066cc] hover:underline">
            {dict.auth.signUp}
          </Link>
        </div>
      </form>
    </div>
  )
}
