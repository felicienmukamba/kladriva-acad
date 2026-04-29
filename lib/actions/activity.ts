"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function logActivity(action: string, entityType?: string, entityId?: string, metadata?: any) {
  const session = await auth();
  if (!session?.user?.id) return;

  try {
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action,
        entityType,
        entityId,
        metadata: metadata ? JSON.stringify(metadata) : null,
      }
    });
    
    // Increment reputation for certain actions
    if (action.includes("COMPLETE") || action.includes("SUBMIT")) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { reputation: { increment: 10 } }
      });
    }
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

export async function getActivities(userId: string) {
  return await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20
  });
}
