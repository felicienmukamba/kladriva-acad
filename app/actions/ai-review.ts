"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function runAIProjectReview(submissionId: string) {
  const submission = await prisma.projectSubmission.findUnique({
    where: { id: submissionId },
    include: { project: true }
  });

  if (!submission) return;

  // In a real implementation, you would call OpenAI/Anthropic here
  // passing the repoUrl or content.
  // For now, we simulate a 2-second AI analysis.
  await new Promise(resolve => setTimeout(resolve, 2500));

  const mockFeedback = `
### 🤖 AI Analysis Results

**Code Architecture:**
The structure of your project is solid. You've correctly separated concerns between the data layer and the UI components.

**Performance:**
Consider memoizing the expensive calculations in your main dashboard view to prevent unnecessary re-renders.

**Best Practices:**
- ✅ Great use of TypeScript interfaces.
- ⚠️ Some components are getting a bit large; consider breaking them down.
- ✅ Clean commit history.

**Overall Verdict:**
This is a high-quality submission that demonstrates a strong grasp of the fundamentals.
  `;

  const mockScore = Math.floor(Math.random() * 15) + 80; // Score between 80-95

  await prisma.projectSubmission.update({
    where: { id: submissionId },
    data: {
      status: "REVIEWED",
      feedback: mockFeedback,
      score: mockScore,
    }
  });

  // 4. Award reputation points (score / 10)
  const repPoints = Math.floor(mockScore / 10);
  await prisma.user.update({
    where: { id: submission.userId },
    data: {
      reputation: { increment: repPoints }
    }
  });

  revalidatePath(`/dashboard/projects`);
  revalidatePath(`/dashboard/projects/submissions/${submissionId}`);
  revalidatePath(`/dashboard`);
}
