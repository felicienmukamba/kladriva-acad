"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function applyToJob(jobId: string, userId: string, coverNote: string) {
  if (!jobId || !userId) return;

  // Check if already applied
  const existing = await prisma.jobApplication.findUnique({
    where: {
      jobId_userId: {
        jobId,
        userId,
      },
    },
  });

  if (existing) {
    throw new Error("You have already applied for this job.");
  }

  await prisma.jobApplication.create({
    data: {
      jobId,
      userId,
      coverNote,
    },
  });

  revalidatePath("/dashboard/jobs");
}
