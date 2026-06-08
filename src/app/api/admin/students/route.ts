import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentStudent } from '@/lib/auth';

async function requireAdmin() {
  const session = await getCurrentStudent();
  if (!session || session.role !== 'ADMIN') return null;
  return session;
}

export async function GET(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const track = searchParams.get('track');
  const role = searchParams.get('role');

  const where: Record<string, unknown> = {};
  if (track) where.track = track;
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { mobile: { contains: search } },
      { rollNumber: { contains: search } },
    ];
  }

  const students = await prisma.student.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, mobile: true, rollNumber: true,
      role: true, track: true, standard: true, streakCount: true,
      totalXP: true, lastActiveAt: true, isActive: true, createdAt: true,
    },
  });
  return NextResponse.json(students);
}

export async function PATCH(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id, role, isActive } = await request.json();
  if (!id) return NextResponse.json({ error: 'Student ID required.' }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (role) data.role = role;
  if (isActive !== undefined) data.isActive = isActive;

  const student = await prisma.student.update({ where: { id }, data });
  return NextResponse.json(student);
}
