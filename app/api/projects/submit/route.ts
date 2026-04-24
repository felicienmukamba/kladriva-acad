import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, repoUrl, liveUrl } = await req.json();

  const submission = await prisma.projectSubmission.create({
    data: {
      projectId,
      userId: session.user.id!,
      repoUrl,
      liveUrl,
      status: "PENDING",
    }
  });

  return NextResponse.json({ submissionId: submission.id });
}
