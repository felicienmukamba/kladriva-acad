"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createThread(courseId: string, title: string, content: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  // Ensure forum exists for the course
  let forum = await prisma.forum.findUnique({
    where: { courseId }
  })

  if (!forum) {
    forum = await prisma.forum.create({
      data: { courseId }
    })
  }

  const thread = await prisma.thread.create({
    data: {
      forumId: forum.id,
      authorId: session.user.id!,
      title,
      content
    }
  })

  revalidatePath("/", "layout")
  return { success: true, thread }
}

export async function addCommentToThread(threadId: string, content: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const comment = await prisma.comment.create({
    data: {
      threadId,
      userId: session.user.id!,
      content
    }
  })

  revalidatePath("/", "layout")
  return { success: true, comment }
}
