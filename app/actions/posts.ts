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

  revalidatePath("/", "layout");
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

  revalidatePath("/", "layout");
}

export async function followUser(followerId: string, followingId: string) {
  if (!followerId || !followingId) return;
  const existing = await prisma.connection.findUnique({
    where: { followerId_followingId: { followerId, followingId } }
  });
  
  if (!existing) {
    await prisma.connection.create({
      data: { followerId, followingId, status: "ACCEPTED" }
    });
  }
  revalidatePath("/", "layout");
}
