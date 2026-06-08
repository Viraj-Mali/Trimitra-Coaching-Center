import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentStudent } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getCurrentStudent();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.role !== 'ENROLLED' && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Premium enrollment required.' }, { status: 403 });
  }

  try {
    const { examTitle, score, totalMarks } = await request.json();
    if (!examTitle || score === undefined || !totalMarks) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const mark = await prisma.testMark.create({
      data: {
        studentId: session.id,
        examTitle,
        score: Number(score),
        totalMarks: Number(totalMarks),
        track: session.track,
      },
    });

    return NextResponse.json({ success: true, markId: mark.id }, { status: 201 });
  } catch (error) {
    console.error('[TEST SUBMIT]', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
