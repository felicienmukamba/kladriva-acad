"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: {
  name?: string
  image?: string
  bio?: string
}) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: formData.name,
      image: formData.image,
      bio: formData.bio,
    }
  })

  revalidatePath("/[lang]/dashboard/profile", "page")
  return { success: true }
}
