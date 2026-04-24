"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function bookSession(formData: FormData) {
  const slotId = formData.get("slotId") as string;
  const mentorId = formData.get("mentorId") as string;
  const menteeId = formData.get("menteeId") as string;

  if (!slotId || !mentorId || !menteeId) return;

  // 1. Check if slot is still available
  const slot = await prisma.availabilitySlot.findUnique({
    where: { id: slotId }
  });

  if (!slot || slot.isBooked) {
    throw new Error("This slot is no longer available.");
  }

  // 2. Create the session
  await prisma.mentorshipSession.create({
    data: {
      mentorId,
      menteeId,
      date: slot.startTime,
      status: "SCHEDULED",
    }
  });

  // 3. Mark slot as booked
  await prisma.availabilitySlot.update({
    where: { id: slotId },
    data: { isBooked: true }
  });

  revalidatePath(`/dashboard/mentorship/${mentorId}`);
  revalidatePath("/dashboard/mentorship");
  
  redirect("/dashboard/mentorship?booked=true");
}
