import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function checkRole(allowedRoles: string[], lang: string = "en") {
  const session = await auth()
  
  if (!session?.user) {
    redirect(`/${lang}/auth/signin`)
  }

  if (!allowedRoles.includes(session.user.role)) {
    redirect(`/${lang}/dashboard?error=unauthorized`)
  }

  return session.user
}

export async function isAdmin(lang: string = "en") {
  return checkRole(["ADMIN", "INSTRUCTOR"], lang)
}

export async function isInstructor(lang: string = "en") {
  return checkRole(["ADMIN", "INSTRUCTOR"], lang)
}
