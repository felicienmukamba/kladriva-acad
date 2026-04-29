"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function submitProject(projectId: string, repoUrl: string, liveUrl?: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.projectSubmission.create({
    data: {
      projectId,
      userId: session.user.id!,
      repoUrl,
      liveUrl,
      status: "PENDING"
    }
  })

  revalidatePath("/", "layout")
  return { success: true }
}

export async function submitPeerReview(submissionId: string, score: number, feedback: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const submission = await prisma.projectSubmission.findUnique({
    where: { id: submissionId }
  })
  if (!submission) throw new Error("Submission not found")

  const review = await prisma.peerReview.create({
    data: {
      submissionId,
      reviewerId: session.user.id!,
      revieweeId: submission.userId,
      totalScore: score,
      comment: feedback,
      scoresJson: "{}" // Default for now
    }
  })

  // Calculate average score for the submission to see if it should be approved
  const allReviews = await prisma.peerReview.findMany({
    where: { submissionId }
  })
  
  if (allReviews.length >= 3) {
    const avgScore = allReviews.reduce((acc, r) => acc + r.totalScore, 0) / allReviews.length
    if (avgScore >= 70) { // Assuming 70 is passing
      await prisma.projectSubmission.update({
        where: { id: submissionId },
        data: { status: "APPROVED", score: avgScore }
      })
    } else {
      await prisma.projectSubmission.update({
        where: { id: submissionId },
        data: { status: "REJECTED", score: avgScore }
      })
    }
  }

  revalidatePath("/", "layout")
  return { success: true, review }
}

export async function getInstructorSubmissionStats(projectId: string) {
  const session = await auth()
  if (!session?.user || session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const submissions = await prisma.projectSubmission.findMany({
    where: { projectId },
    include: { reviews: true, user: true }
  })

  return submissions.map(sub => ({
    ...sub,
    avgGrade: sub.reviews.length > 0 
      ? sub.reviews.reduce((acc, r) => acc + r.totalScore, 0) / sub.reviews.length 
      : null
  }))
}
