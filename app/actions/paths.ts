"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function enrollInPath(userId: string, pathId: string) {
  try {
    const existingEnrollment = await (prisma as any).pathEnrollment.findUnique({
      where: { userId_pathId: { userId, pathId } }
    })

    if (existingEnrollment) {
      return { success: false, message: "Already enrolled" }
    }

    // Create Path Enrollment
    await (prisma as any).pathEnrollment.create({
      data: { userId, pathId }
    })

    // Get all courses in the path
    const pathCourses = await (prisma as any).courseOnPath.findMany({
      where: { pathId },
      include: { course: true }
    })

    // Automatically enroll in all courses in the path
    for (const cp of pathCourses) {
      const courseEnrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: cp.courseId } }
      })

      if (!courseEnrollment) {
        await prisma.enrollment.create({
          data: { userId, courseId: cp.courseId }
        })
      }
    }

    revalidatePath("/[lang]/dashboard/paths", "page")
    return { success: true }
  } catch (error) {
    console.error("Path enrollment error:", error)
    return { success: false, message: "Failed to enroll" }
  }
}
