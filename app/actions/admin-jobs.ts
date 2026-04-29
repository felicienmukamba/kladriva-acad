"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

async function checkAdmin() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "COMPANY") {
    throw new Error("Unauthorized")
  }
}

export async function createJob(data: {
  title: string
  description: string
  location: string
  salary?: string
  type: string
  company: string
}) {
  await checkAdmin()
  const job = await prisma.job.create({ data })
  revalidatePath("/jobs")
  return job
}

export async function updateJob(id: string, data: {
  title: string
  description: string
  location: string
  salary?: string
  type: string
}) {
  await checkAdmin()
  const job = await prisma.job.update({
    where: { id },
    data
  })
  revalidatePath("/jobs")
  return job
}

export async function deleteJob(id: string) {
  await checkAdmin()
  await prisma.job.delete({ where: { id } })
  revalidatePath("/jobs")
}
