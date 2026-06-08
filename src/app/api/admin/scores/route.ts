import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentStudent } from '@/lib/auth';

async function requireAdmin() {
  const session = await getCurrentStudent();
  if (!session || session.role !== 'ADMIN') return null;
  return session;
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { studentId, examTitle, score, totalMarks } = await request.json();
  if (!studentId || !examTitle || score === undefined || !totalMarks) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ error: 'Student not found.' }, { status: 404 });

  const mark = await prisma.testMark.create({
    data: { studentId, examTitle, score: Number(score), totalMarks: Number(totalMarks), track: student.track },
  });
  return NextResponse.json(mark, { status: 201 });
}
