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

// Module Actions
export async function createModule(data: {
  courseId: string
  title: string
  description?: string
  order: number
}) {
  await checkAdmin()
  const module = await prisma.module.create({ data })
  revalidatePath(`/courses/${data.courseId}`)
  return module
}

export async function updateModule(id: string, data: {
  title: string
  description?: string
  order: number
}) {
  await checkAdmin()
  const module = await prisma.module.update({
    where: { id },
    data,
    include: { course: true }
  })
  revalidatePath(`/courses/${module.courseId}`)
  return module
}

export async function deleteModule(id: string) {
  await checkAdmin()
  const module = await prisma.module.delete({ where: { id } })
  revalidatePath(`/courses/${module.courseId}`)
}

// Lesson Actions
export async function createLesson(data: {
  moduleId: string
  title: string
  content?: string
  videoUrl?: string
  order: number
}) {
  await checkAdmin()
  const lesson = await prisma.lesson.create({ data })
  return lesson
}

export async function updateLesson(id: string, data: {
  title: string
  content?: string
  videoUrl?: string
  order: number
}) {
  await checkAdmin()
  const lesson = await prisma.lesson.update({
    where: { id },
    data
  })
  return lesson
}

export async function deleteLesson(id: string) {
  await checkAdmin()
  await prisma.lesson.delete({ where: { id } })
}
