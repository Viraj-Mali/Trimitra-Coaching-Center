import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentStudent } from '@/lib/auth';

async function requireAdmin() {
  const session = await getCurrentStudent();
  if (!session || session.role !== 'ADMIN') return null;
  return session;
}

// POST — create a chapter under a subject
export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const { subjectId, name, topics, priority, examRelevance, sortOrder, isImportant, sourceNote } = body;
  if (!subjectId || !name) return NextResponse.json({ error: 'subjectId and name required' }, { status: 400 });
  const chapter = await prisma.syllabusChapter.create({
    data: {
      subjectId,
      name,
      topics: topics || '',
      priority: priority || 'Medium',
      examRelevance: examRelevance || '',
      sortOrder: sortOrder || 0,
      isImportant: isImportant || false,
      isActive: true,
      sourceNote: sourceNote || '',
    },
  });
  return NextResponse.json(chapter, { status: 201 });
}
