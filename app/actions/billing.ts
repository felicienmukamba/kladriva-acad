"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function subscribeToProPlan() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  // Mock Stripe Payment Flow
  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id!,
      amount: 49.99,
      currency: "USD",
      status: "PAID",
      transactionId: `TXN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    }
  })

  // Update or Create Subscription
  const existingSub = await prisma.subscription.findUnique({
    where: { userId: session.user.id! }
  })

  if (existingSub) {
    await prisma.subscription.update({
      where: { userId: session.user.id! },
      data: { plan: "PROFESSIONAL", active: true, endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    })
  } else {
    await prisma.subscription.create({
      data: {
        userId: session.user.id!,
        plan: "PROFESSIONAL",
        active: true,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })
  }

  revalidatePath("/", "layout")
  return { success: true, payment }
}

export async function verifyPremiumAccess() {
  const session = await auth()
  if (!session?.user) return false

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id! }
  })

  if (!sub || !sub.active || (sub.endDate && new Date(sub.endDate) < new Date())) {
    return false
  }

  return true
}
