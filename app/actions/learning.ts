"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function completeLesson(enrollmentId: string, lessonId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  // In a real app, we'd have a LessonProgress model. 
  // For now, we'll update the enrollment progress percentage as a mock.
  
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: true
            }
          }
        }
      }
    }
  })

  if (!enrollment) throw new Error("Enrollment not found")

  const totalLessons = enrollment.course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)
  
  // Mocking incremental progress
  const newProgress = Math.min(100, enrollment.progress + Math.ceil(100 / totalLessons))
  const isCompleted = newProgress === 100

  await (prisma as any).enrollment.update({
    where: { id: enrollmentId },
    data: {
      progress: newProgress,
      isCompleted: isCompleted,
      completedAt: isCompleted ? new Date() : null
    } as any
  })

  // If completed, generate certificate record
  if (isCompleted) {
    const existingCert = await (prisma as any).certificate.findUnique({
      where: {
        userId_courseId: {
          userId: enrollment.userId,
          courseId: enrollment.courseId
        }
      }
    })

    if (!existingCert) {
      await (prisma as any).certificate.create({
        data: {
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          code: `KLAD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
        }
      })
    }
  }

  revalidatePath("/", "layout")
  return { success: true, isCompleted }
}

export async function submitQuiz(enrollmentId: string, quizId: string, score: number, passed: boolean) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await (prisma as any).quizSubmission.create({
    data: {
      quizId,
      userId: session.user.id!,
      score,
      passed
    }
  })

  if (passed) {
     // Trigger progress update similar to lesson completion
     return completeLesson(enrollmentId, quizId) // Mocking quiz as a progress trigger
  }

  return { success: true, passed }
}
