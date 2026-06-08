import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentStudent } from '@/lib/auth';

export async function GET() {
  const session = await getCurrentStudent();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const materials = await prisma.learningMaterial.findMany({
    where: {
      OR: [{ targetTrack: session.track }, { targetTrack: 'ALL' }],
    },
    orderBy: { createdAt: 'desc' },
  });

  // For free users, mark premium content
  const isEnrolled = session.role === 'ENROLLED' || session.role === 'ADMIN';
  return NextResponse.json(materials.map(m => ({
    ...m,
    isAccessible: !m.isPremium || isEnrolled,
  })));
}
