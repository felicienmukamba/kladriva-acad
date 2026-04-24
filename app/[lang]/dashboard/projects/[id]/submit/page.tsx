import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProjectSubmissionForm } from "@/components/ProjectSubmissionForm";

export default async function SubmitProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <ProjectSubmissionForm 
        projectId={project.id} 
        projectTitle={project.title} 
      />
    </div>
  );
}
