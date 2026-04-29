"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

async function checkAdmin() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }
  return session
}

// JOB ACTIONS
export async function createJob(data: {
  title: string
  description: string
  location: string
  salaryRange: string
  type: string
  remote: boolean
  company: string
}) {
  const session = await checkAdmin()
  
  const job = await prisma.job.create({
    data: {
      ...data,
      companyId: session.user.id!,
    },
  })
  
  revalidatePath("/[lang]/dashboard/admin/jobs", "page")
  return job
}

export async function updateJob(id: string, data: Partial<{
  title: string
  description: string
  location: string
  salaryRange: string
  type: string
  remote: boolean
}>) {
  await checkAdmin()
  
  const job = await prisma.job.update({
    where: { id },
    data,
  })
  
  revalidatePath("/[lang]/dashboard/admin/jobs", "page")
  return job
}

export async function deleteJob(id: string) {
  await checkAdmin()
  
  await prisma.job.delete({
    where: { id },
  })
  
  revalidatePath("/[lang]/dashboard/admin/jobs", "page")
}

// USER ACTIONS
export async function updateUserRole(userId: string, role: string) {
  await checkAdmin()
  
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
  })
  
  revalidatePath("/[lang]/dashboard/admin/users", "page")
  return user
}

export async function deleteUser(userId: string) {
  await checkAdmin()
  
  await prisma.user.delete({
    where: { id: userId },
  })
  
  revalidatePath("/[lang]/dashboard/admin/users", "page")
}

// PROJECT ACTIONS
export async function createProject(data: {
  courseId: string
  title: string
  description: string
  difficulty: string
  rubric?: string
}) {
  await checkAdmin()
  
  const project = await prisma.project.create({
    data,
  })
  
  revalidatePath("/[lang]/dashboard/projects", "page")
  return project
}

// PATH ACTIONS
export async function createPath(data: {
  title: string
  description: string
  published: boolean
}) {
  await checkAdmin()
  
  const path = await prisma.path.create({
    data,
  })
  
  revalidatePath("/[lang]/dashboard/paths", "page")
  return path
}
