import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Clear existing data
  console.log('Cleaning up database...');
  try {
    await prisma.activityLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.pathEnrollment.deleteMany();
    await prisma.courseOnPath.deleteMany();
    await prisma.path.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.quizSubmission.deleteMany();
    await prisma.option.deleteMany();
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.jobApplication.deleteMany();
    await prisma.job.deleteMany();
    await prisma.mentorshipSession.deleteMany();
    await prisma.availabilitySlot.deleteMany();
    await prisma.peerReview.deleteMany();
    await prisma.projectSubmission.deleteMany();
    await prisma.project.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.note.deleteMany();
    await prisma.progress.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.module.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.log('Cleanup: Some tables might not exist yet or are already empty.');
  }

  console.log('Seeding Kladriva Academy data...');

  // 1. Create Users (Admin/Instructor & Student)
  const instructor = await prisma.user.create({
    data: {
      name: 'Félicien Mukamba',
      email: 'felicien@kladriva.com',
      password: hashedPassword,
      role: 'ADMIN',
      bio: 'Expert en Architecture Cloud & DevOps. Fondateur de Kladriva.',
      specialties: 'AWS, Kubernetes, Terraform, Next.js',
      image: 'https://github.com/shadcn.png',
    },
  });

  const student = await prisma.user.create({
    data: {
      name: 'Alexandre Rivière',
      email: 'alex@example.com',
      password: hashedPassword,
      role: 'STUDENT',
      bio: 'Développeur passionné par le Web et le Cloud.',
      reputation: 150,
      image: 'https://i.pravatar.cc/150?u=alex',
    },
  });

  // 2. Create Courses
  console.log('Creating courses...');
  const course1 = await prisma.course.create({
    data: {
      title: 'Expertise Kubernetes & Orchestration',
      slug: 'expertise-kubernetes',
      description: 'Maîtrisez le déploiement et la gestion de conteneurs à grande échelle.',
      level: 'ADVANCED',
      technologies: 'Kubernetes, Docker, Helm, ArgoCD',
      duration: 1200, // 20 hours
      published: true,
      instructorId: instructor.id,
      imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=800',
    }
  });

  // 3. Create Modules & Lessons
  const module1 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'Architecture et Concepts de base',
      order: 1,
    }
  });

  const lesson1 = await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'Introduction aux Control Plane et Worker Nodes',
      order: 1,
      type: 'VIDEO',
      videoUrl: 'https://www.youtube.com/watch?v=N3AkSS5hXMA',
      content: 'Dans cette leçon, nous allons explorer les composants internes de Kubernetes...',
      videoDuration: 900, // 15 mins
    }
  });

  // 4. Create Quiz
  const quiz1 = await prisma.quiz.create({
    data: {
      lessonId: lesson1.id,
      title: 'Test de connaissances : Architecture K8s',
      passingScore: 80,
      questions: {
        create: [
          {
            text: 'Quel composant est responsable de l\'ordonnancement des pods ?',
            options: {
              create: [
                { text: 'kube-scheduler', isCorrect: true },
                { text: 'kube-apiserver', isCorrect: false },
                { text: 'etcd', isCorrect: false },
              ]
            }
          }
        ]
      }
    }
  });

  // 5. Create Project
  const project1 = await prisma.project.create({
    data: {
      courseId: course1.id,
      title: 'Déploiement d\'une App Multi-tier sur Cluster GKE',
      description: 'Vous devez déployer une application avec Redis, Node.js et Ingress...',
      difficulty: 'ADVANCED',
      rubric: JSON.stringify({
        criteria: [
          { id: '1', label: 'Utilisation de Helm', weight: 30 },
          { id: '2', label: 'Sécurité (NetworkPolicies)', weight: 40 },
          { id: '3', label: 'HPA Configuré', weight: 30 }
        ]
      })
    }
  });

  // 6. Enrollments & Progress
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
    }
  });

  await prisma.progress.create({
    data: {
      userId: student.id,
      lessonId: lesson1.id,
      isCompleted: true,
      completedAt: new Date(),
    }
  });

  // 7. Activity Logs
  await prisma.activityLog.create({
    data: {
      userId: student.id,
      action: 'COURSE_ENROLLED',
      entityType: 'COURSE',
      entityId: course1.id,
      metadata: JSON.stringify({ title: course1.title })
    }
  });

  // 8. Jobs
  console.log('Creating jobs...');
  const job1 = await prisma.job.create({
    data: {
      title: 'Senior Cloud Architect',
      company: 'TechCorp Global',
      location: 'Remote / Paris',
      type: 'FULL_TIME',
      salary: '85k€ - 110k€',
      description: 'Nous recherchons un expert Kubernetes pour diriger notre migration vers GKE...',
    }
  });

  await prisma.job.create({
    data: {
      title: 'Full-Stack Developer (Next.js)',
      company: 'Kladriva Solutions',
      location: 'Brussels',
      type: 'CONTRACT',
      salary: '600€/jour',
      description: 'Rejoignez l\'équipe Kladriva pour bâtir le futur de l\'éducation en ligne.',
    }
  });

  await prisma.jobApplication.create({
    data: {
      userId: student.id,
      jobId: job1.id,
      status: 'INTERVIEW_SCHEDULED',
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
