import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.jobApplication.deleteMany();
  await prisma.job.deleteMany();
  await prisma.mentorshipSession.deleteMany();
  await prisma.projectSubmission.deleteMany();
  await prisma.project.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding data...');

  // Create Mentors
  const mentor1 = await prisma.user.create({
    data: {
      name: 'Sarah Jenkins',
      email: 'sarah@vercel.com',
      role: 'MENTOR',
      headline: 'Senior Frontend Engineer at Vercel',
      bio: 'Expert in React, Next.js, and Design Systems. I help developers build beautiful and performant web applications.',
      image: 'https://i.pravatar.cc/150?u=sarah',
    },
  });

  const mentor2 = await prisma.user.create({
    data: {
      name: 'David Okafor',
      email: 'david@stripe.com',
      role: 'MENTOR',
      headline: 'Staff Engineer at Stripe',
      bio: 'Specializing in backend systems, Go, and cloud infrastructure. Passionate about building scalable APIs.',
      image: 'https://i.pravatar.cc/150?u=david',
    },
  });

  // Create Companies (Users with COMPANY role)
  const company1 = await prisma.user.create({
    data: {
      name: 'Vercel',
      email: 'hiring@vercel.com',
      role: 'COMPANY',
      headline: 'The platform for frontend developers.',
      bio: 'Vercel provides the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.',
    },
  });

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Full-Stack Next.js 16 Masterclass',
      description: 'Learn to build production-ready applications with App Router, Server Actions, and Prisma.',
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
      published: true,
      modules: {
        create: [
          {
            title: 'Introduction to Next.js',
            description: 'Getting started with the framework.',
            order: 1,
            lessons: {
              create: [
                { title: 'What is Next.js?', order: 1, content: 'Introduction video content...' },
                { title: 'Setting up your environment', order: 2, content: 'Installation steps...' },
              ],
            },
          },
          {
            title: 'Server Components & Actions',
            description: 'Mastering the new paradigm.',
            order: 2,
            lessons: {
              create: [
                { title: 'RSC Fundamentals', order: 1, content: 'How RSCs work...' },
                { title: 'Server Actions for Mutations', order: 2, content: 'Handling forms...' },
              ],
            },
          },
        ],
      },
    },
  });

  // Create Projects
  await prisma.project.create({
    data: {
      title: 'E-commerce REST API',
      description: 'Build a production-ready API with authentication, payments, and order management using Node.js and Prisma.',
      difficulty: 'INTERMEDIATE',
      skills: 'Node.js, Prisma, REST, Auth',
    },
  });

  await prisma.project.create({
    data: {
      title: 'Real-time Chat Application',
      description: 'Create a full-stack real-time messaging platform with WebSocket, typing indicators, and message persistence.',
      difficulty: 'ADVANCED',
      skills: 'Next.js, WebSocket, PostgreSQL, Redis',
    },
  });

  // Create Jobs
  await prisma.job.create({
    data: {
      companyId: company1.id,
      title: 'Senior Frontend Engineer',
      description: 'Join the team building the future of web development. Work on Next.js, Turbopack, and our deployment platform.',
      location: 'San Francisco, CA',
      remote: true,
      salaryRange: '$160K - $200K',
      type: 'FULL_TIME',
    },
  });

  // Create Availability Slots for Mentor 1
  const today = new Date();
  today.setHours(10, 0, 0, 0);
  
  for (let i = 1; i <= 5; i++) {
    const start = new Date(today);
    start.setDate(today.getDate() + i);
    const end = new Date(start);
    end.setHours(start.getHours() + 1);
    
    await prisma.availabilitySlot.create({
      data: {
        mentorId: mentor1.id,
        startTime: start,
        endTime: end,
      },
    });
  }

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
