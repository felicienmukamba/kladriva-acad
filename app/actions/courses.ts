"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function enrollInCourse(userId: string, courseId: string) {
  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    revalidatePath("/dashboard/learning");
    return { success: true, enrollment };
  } catch (error) {
    console.error("Enrollment error:", error);
    return { success: false, error: "Failed to enroll in course" };
  }
}

export async function updateProgress(userId: string, courseId: string, progress: number) {
  try {
    const enrollment = await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        progress,
      },
    });

    revalidatePath("/dashboard/learning");
    return { success: true, enrollment };
  } catch (error) {
    console.error("Progress update error:", error);
    return { success: false, error: "Failed to update progress" };
  }
}
