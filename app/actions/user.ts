"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, message: "Unauthorized" }

  const name = formData.get("name") as string
  const headline = formData.get("headline") as string
  const bio = formData.get("bio") as string
  const image = formData.get("image") as string // User can put a URL for avatar

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        headline,
        bio,
        ...(image && { image })
      }
    })

    revalidatePath("/", "layout")
    return { success: true }
  } catch (error) {
    console.error("Profile update error:", error)
    return { success: false, message: "Failed to update profile" }
  }
}
