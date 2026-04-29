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
export async function createModule(courseId: string, data: { title: string; description?: string; order: number }) {
  await checkAdmin()
  const module = await prisma.module.create({
    data: {
      ...data,
      courseId
    }
  })
  revalidatePath(`/dashboard/admin/courses/${courseId}`)
  return module
}

export async function updateModule(id: string, courseId: string, data: { title: string; description?: string; order: number }) {
  await checkAdmin()
  const module = await prisma.module.update({
    where: { id },
    data
  })
  revalidatePath(`/dashboard/admin/courses/${courseId}`)
  return module
}

export async function deleteModule(id: string, courseId: string) {
  await checkAdmin()
  await prisma.module.delete({
    where: { id }
  })
  revalidatePath(`/dashboard/admin/courses/${courseId}`)
}

// Lesson Actions
export async function createLesson(moduleId: string, courseId: string, data: { title: string; content?: string; videoUrl?: string; order: number }) {
  await checkAdmin()
  const lesson = await prisma.lesson.create({
    data: {
      ...data,
      moduleId
    }
  })
  revalidatePath(`/dashboard/admin/courses/${courseId}`)
  return lesson
}

export async function updateLesson(id: string, courseId: string, data: { title: string; content?: string; videoUrl?: string; order: number }) {
  await checkAdmin()
  const lesson = await prisma.lesson.update({
    where: { id },
    data
  })
  revalidatePath(`/dashboard/admin/courses/${courseId}`)
  return lesson
}

export async function deleteLesson(id: string, courseId: string) {
  await checkAdmin()
  await prisma.lesson.delete({
    where: { id }
  })
  revalidatePath(`/dashboard/admin/courses/${courseId}`)
}

// Quiz/Question Actions
export async function getOrCreateQuiz(targetId: string, targetType: 'module' | 'lesson', courseId: string) {
  await checkAdmin()
  
  const where: any = targetType === 'module' ? { moduleId: targetId } : { lessonId: targetId }
  
  let quiz = await prisma.quiz.findFirst({
    where,
    include: { questions: { include: { options: true } } }
  })

  if (!quiz) {
    quiz = await prisma.quiz.create({
      data: {
        ...where,
        title: "Module Quiz",
        passingScore: 80
      },
      include: { questions: { include: { options: true } } }
    })
  }
  
  revalidatePath(`/dashboard/admin/courses/${courseId}`)
  return quiz
}

export async function addQuestion(quizId: string, courseId: string, data: { text: string; type: string; points: number; options: { text: string; isCorrect: boolean }[] }) {
  await checkAdmin()
  const question = await prisma.question.create({
    data: {
      quizId,
      text: data.text,
      type: data.type,
      points: data.points,
      options: {
        create: data.options
      }
    }
  })
  revalidatePath(`/dashboard/admin/courses/${courseId}`)
  return question
}

// Resource Actions
export async function createResource(lessonId: string, courseId: string, data: { title: string; url: string; type: string; category: string; size?: string }) {
  await checkAdmin()
  const resource = await prisma.resource.create({
    data: {
      ...data,
      lessonId
    }
  })
  revalidatePath(`/dashboard/admin/courses/${courseId}`)
  return resource
}

export async function deleteResource(id: string, courseId: string) {
  await checkAdmin()
  await prisma.resource.delete({
    where: { id }
  })
  revalidatePath(`/dashboard/admin/courses/${courseId}`)
}
