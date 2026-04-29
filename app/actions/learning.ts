"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function completeLesson(enrollmentId: string, lessonId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  // Upsert the lesson progress
  await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: session.user.id!,
        lessonId
      }
    },
    create: {
      userId: session.user.id!,
      lessonId,
      isCompleted: true,
      lastPosition: 0
    },
    update: {
      isCompleted: true
    }
  })

  // Fetch enrollment and total lessons for progress calculation
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId }
  })
  if (!enrollment) throw new Error("Enrollment not found")

  const totalLessons = await prisma.lesson.count({
    where: { module: { courseId: enrollment.courseId } }
  }) || 1 // fallback to avoid division by zero if no lessons

  // Recalculate enrollment progress
  const completedLessons = await prisma.progress.count({
    where: {
      userId: session.user.id!,
      isCompleted: true,
      lesson: {
        module: {
          courseId: enrollment.courseId
        }
      }
    }
  })

  const newProgress = Math.min(100, Math.round((completedLessons / totalLessons) * 100))
  const isCompleted = newProgress === 100

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      progress: newProgress,
      isCompleted: isCompleted,
      completedAt: isCompleted ? new Date() : null
    }
  })

  // If completed, generate certificate record
  if (isCompleted) {
    const existingCert = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: enrollment.userId,
          courseId: enrollment.courseId
        }
      }
    })

    if (!existingCert) {
      await prisma.certificate.create({
        data: {
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          qrCodeToken: `KLAD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
        }
      })
    }
  }

  revalidatePath("/", "layout")
  return { success: true, isCompleted }
}

export async function updateVideoPosition(lessonId: string, position: number) {
  const session = await auth()
  if (!session?.user) return

  await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: session.user.id!,
        lessonId
      }
    },
    create: {
      userId: session.user.id!,
      lessonId,
      lastPosition: position
    },
    update: {
      lastPosition: position
    }
  })
}

export async function submitQuiz(enrollmentId: string, quizId: string, score: number, passed: boolean) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.quizSubmission.create({
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
