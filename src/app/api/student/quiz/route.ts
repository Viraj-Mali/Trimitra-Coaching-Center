import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentStudent } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getCurrentStudent();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const track = searchParams.get('track') || session.track;

  const questions = await prisma.quizQuestion.findMany({
    where: {
      isActive: true,
      OR: [{ track }, { track: 'ALL' }],
    },
    select: {
      id: true, question: true, optionA: true, optionB: true, optionC: true, optionD: true,
      // Don't send correctIndex to client!
    },
    orderBy: { createdAt: 'asc' },
  });

  // Shuffle and pick 10
  const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
  return NextResponse.json(shuffled);
}
