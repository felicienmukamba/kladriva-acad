"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function sendMessage(recipientId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    });

    // Trigger Pusher event
    // Channel name: chat_USERID (for the recipient)
    await pusherServer.trigger(`chat_${recipientId}`, "new-message", message);
    
    // Also trigger for the sender (to sync across multiple tabs if any)
    await pusherServer.trigger(`chat_${session.user.id}`, "new-message", message);

    return { success: true, message };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { success: false, error: "Failed to send message" };
  }
}

export async function getRecentMessages(otherUserId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: session.user.id },
      ]
    },
    orderBy: { createdAt: "asc" },
    take: 50,
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
        }
      }
    }
  });
}
