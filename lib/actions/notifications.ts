"use server";

import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function sendNotification(userId: string, type: string, title: string, body?: string, link?: string) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        link,
      }
    });

    // Trigger real-time notification
    await pusherServer.trigger(`notifications_${userId}`, "new-notification", notification);

    return { success: true, notification };
  } catch (error) {
    console.error("Failed to send notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}

export async function markNotificationAsRead(notificationId: string) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true }
  });
}

export async function getUserNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10
  });
}
