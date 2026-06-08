import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentStudent } from '@/lib/auth';

async function requireAdmin() {
  const session = await getCurrentStudent();
  if (!session || session.role !== 'ADMIN') return null;
  return session;
}

// GET — public read of site settings
export async function GET() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  if (!settings) {
    // Create default settings if not exists
    settings = await prisma.siteSettings.create({
      data: {
        id: 'singleton',
        instituteName: 'Trimitra Coaching Centre',
        phone: '9665269059',
        whatsapp: '9665269059',
        email: 'info@trimitra.in',
        address: '2nd Floor Society Complex, Talegaon Dighe, Pune, Maharashtra — 424611',
        logoUrl: '/logo.png',
        mentorImageUrl: '/mentor-sarthak.png',
        heroHeadline: 'Personal Coaching for Class 6th to 12th, Board Exams & Competitive Exams',
        heroSubheadline: 'Focused mentorship, small batches, regular tests, doubt-solving sessions, and progress tracking under expert guidance.',
      },
    });
  }
  return NextResponse.json(settings);
}

// PATCH — admin only update
export async function PATCH(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const data = await request.json();
  // Remove id from update data if present
  delete data.id;
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', ...data },
    update: data,
  });
  return NextResponse.json(settings);
}
