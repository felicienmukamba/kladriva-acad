"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, MailCheck } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { AuthShell } from "@/components/auth/AuthShell"

export default function ForgotPasswordPage({ params }: { params: { lang: string } }) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Mocking email send
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSubmitted(true)
    setLoading(false)
    toast.success("Reset link sent to your email")
  }

  return (
    <AuthShell
      lang={params.lang}
      title={submitted ? "Check your email" : "Reset password"}
      subtitle={
        submitted
          ? `We've sent a recovery link to ${email}.`
          : "Enter your email address and we'll send you a reset link."
      }
    >
      {!submitted ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground/70 uppercase tracking-wider">
              Email address
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="rounded-2xl border-border bg-white h-12 transition-all"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="apple-button w-full h-12 text-base shadow-md mt-2 bg-slate-950 text-white hover:bg-slate-800"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send reset link"}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center shadow-inner">
            <MailCheck className="w-10 h-10 text-emerald-600" />
          </div>
          <Button
            variant="outline"
            className="w-full h-12 rounded-full border-border/60 hover:bg-muted/50 transition-all font-medium"
            onClick={() => setSubmitted(false)}
          >
            Try another email
          </Button>
        </div>
      )}

      <div className="pt-6 text-center">
        <Link
          href={`/${params.lang}/auth/signin`}
          className="text-sm text-slate-700 hover:text-slate-950 inline-flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>
      </div>
    </AuthShell>
  )
}
