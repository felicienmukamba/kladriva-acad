"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPost(userId: string, content: string) {
  if (!content || !userId) return;

  await prisma.post.create({
    data: {
      userId,
      content,
    },
  });

  revalidatePath("/dashboard/network");
}

export async function likePost(postId: string, userId: string) {
  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
  }

  revalidatePath("/dashboard/network");
}
