import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentStudent } from '@/lib/auth';

export async function GET() {
  const session = await getCurrentStudent();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const student = await prisma.student.findUnique({
    where: { id: session.id },
    select: {
      id: true, name: true, mobile: true, email: true, rollNumber: true,
      role: true, track: true, standard: true, streakCount: true,
      totalXP: true, lastActiveAt: true, lastQuizDate: true, createdAt: true,
    },
  });
  if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(student);
}
