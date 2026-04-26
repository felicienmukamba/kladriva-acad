"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

async function checkAdmin() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "INSTRUCTOR") {
    throw new Error("Unauthorized")
  }
}

export async function createCourse(data: {
  title: string
  description: string
  imageUrl?: string
  published: boolean
}) {
  await checkAdmin()
  const session = await auth()
  const course = await prisma.course.create({
    data: {
      ...data,
      instructorId: session?.user?.id as string
    }
  })
  revalidatePath("/courses")
  return course
}

export async function updateCourse(id: string, data: {
  title: string
  description: string
  imageUrl?: string
  published: boolean
}) {
  await checkAdmin()
  const course = await prisma.course.update({
    where: { id },
    data
  })
  revalidatePath("/courses")
  revalidatePath(`/courses/${id}`)
  return course
}

export async function deleteCourse(id: string) {
  await checkAdmin()
  await prisma.course.delete({
    where: { id }
  })
  revalidatePath("/courses")
}
