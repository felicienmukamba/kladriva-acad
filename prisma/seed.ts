import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Clear existing data
  console.log('Cleaning up database...');
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
  await prisma.projectSubmission.deleteMany();
  await prisma.project.deleteMany();
  await (prisma as any).resource.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Kladriva Academy data...');

  // Create Mentors
  const mentor1 = await prisma.user.create({
    data: {
      name: 'Sarah Jenkins',
      email: 'sarah@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      headline: 'Senior Frontend Engineer at Vercel',
      bio: 'Expert in React, Next.js, and Design Systems.',
      image: 'https://i.pravatar.cc/150?u=sarah',
    },
  });

  // Create Students
  const student1 = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex@example.com',
      password: hashedPassword,
      role: 'STUDENT',
      headline: 'Aspiring Full-Stack Developer',
      bio: 'Learning the ropes of modern web development.',
      image: 'https://i.pravatar.cc/150?u=alex',
    },
  });

  // Create Courses
  console.log('Creating courses...');
  const course1 = await prisma.course.create({
    data: {
      title: 'Modern React Mastery',
      description: 'Master React 19, Server Components, and advanced state management.',
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
      published: true,
      instructorId: mentor1.id,
      modules: {
        create: [
          {
            title: 'Foundations of React',
            description: 'Core concepts and architecture.',
            order: 1,
            lessons: {
              create: [
                { 
                  title: 'The Virtual DOM', 
                  order: 1, 
                  content: 'Deep dive into rendering...', 
                  videoUrl: 'https://www.youtube.com/watch?v=N3AkSS5hXMA',
                  resources: {
                    create: [
                      { title: 'Reconciliation Cheat Sheet', url: 'https://reactjs.org/docs/reconciliation.html', type: 'PDF', category: 'Technical', size: '1.2 MB' },
                      { title: 'DOM Visualization Tool', url: 'https://github.com', type: 'LINK', category: 'Technical' }
                    ]
                  }
                } as any,
                { title: 'JSX & Props', order: 2, content: 'Understanding component communication...', videoUrl: 'https://www.youtube.com/watch?v=N3AkSS5hXMA' },
              ],
            },
            quiz: {
              create: {
                title: 'Foundations Checkpoint',
                passingScore: 80,
                questions: {
                  create: [
                    {
                      text: 'What is the primary benefit of the Virtual DOM?',
                      options: {
                        create: [
                          { text: 'Faster direct manipulation of HTML', isCorrect: false },
                          { text: 'Efficient updates by minimizing real DOM changes', isCorrect: true },
                          { text: 'Automatic CSS optimization', isCorrect: false },
                        ]
                      }
                    },
                    {
                      text: 'React components must return a single element.',
                      type: 'TRUE_FALSE',
                      options: {
                        create: [
                          { text: 'True (or a Fragment)', isCorrect: true },
                          { text: 'False', isCorrect: false },
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    }
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Backend with Prisma & PostgreSQL',
      description: 'Build scalable APIs and manage data with professional tools.',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
      published: true,
      instructorId: mentor1.id,
      modules: {
        create: [
          {
            title: 'Database Modeling',
            description: 'Designing schemas that scale.',
            order: 1,
            lessons: {
              create: [
                { title: 'Relations in Prisma', order: 1, content: '1:1, 1:n, and n:m...', videoUrl: 'https://www.youtube.com/watch?v=N3AkSS5hXMA' },
              ]
            }
          }
        ]
      }
    }
  });

  // Create Path
  console.log('Creating learning paths...');
  const path1 = await prisma.path.create({
    data: {
      title: 'Full-Stack Professional Path',
      description: 'A comprehensive journey from frontend to backend mastery.',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
      published: true,
      courses: {
        create: [
          { courseId: course1.id, order: 1 },
          { courseId: course2.id, order: 2 },
        ]
      }
    }
  });

  // Enroll student
  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      courseId: course1.id,
      progress: 20
    }
  });

  await prisma.pathEnrollment.create({
    data: {
      userId: student1.id,
      pathId: path1.id,
      progress: 10
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
