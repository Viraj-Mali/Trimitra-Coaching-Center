import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentStudent } from '@/lib/auth';

async function requireAdmin() {
  const session = await getCurrentStudent();
  if (!session || session.role !== 'ADMIN') return null;
  return session;
}

// GET — public read of all published syllabi for a course
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');
  const all = searchParams.get('all') === 'true';

  const where = courseId
    ? { courseId, ...(all ? {} : { isActive: true }) }
    : all ? {} : { isActive: true };

  const syllabi = await prisma.syllabus.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
    include: {
      subjects: {
        orderBy: { sortOrder: 'asc' },
        include: {
          chapters: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
      course: { select: { id: true, title: true, slug: true } },
    },
  });
  return NextResponse.json(syllabi);
}

// POST — create a new syllabus
export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const { courseId, boardExam, academicYear, sourceNote, sortOrder, subjects } = body;

  if (!courseId || !boardExam) {
    return NextResponse.json({ error: 'courseId and boardExam are required.' }, { status: 400 });
  }

  const syllabus = await prisma.syllabus.create({
    data: {
      courseId,
      boardExam,
      academicYear: academicYear || '2024-25',
      sourceNote,
      sortOrder: sortOrder || 0,
      subjects: subjects ? {
        create: subjects.map((sub: { name: string; sortOrder?: number; chapters?: { name: string; topics?: string; priority?: string; examRelevance?: string; sortOrder?: number; isImportant?: boolean; sourceNote?: string }[] }) => ({
          name: sub.name,
          sortOrder: sub.sortOrder || 0,
          chapters: sub.chapters ? {
            create: sub.chapters.map((ch, idx) => ({
              name: ch.name,
              topics: ch.topics || '',
              priority: ch.priority || 'Medium',
              examRelevance: ch.examRelevance || '',
              sortOrder: ch.sortOrder ?? idx,
              isImportant: ch.isImportant || false,
              sourceNote: ch.sourceNote || '',
            })),
          } : undefined,
        })),
      } : undefined,
    },
    include: {
      subjects: { include: { chapters: true } },
    },
  });

  return NextResponse.json(syllabus, { status: 201 });
}

// PATCH — update syllabus, subject, or chapter
export async function PATCH(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const { type, id, ...data } = body;

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  if (type === 'chapter') {
    const chapter = await prisma.syllabusChapter.update({ where: { id }, data });
    return NextResponse.json(chapter);
  } else if (type === 'subject') {
    const subject = await prisma.syllabusSubject.update({ where: { id }, data });
    return NextResponse.json(subject);
  } else {
    const syllabus = await prisma.syllabus.update({ where: { id }, data });
    return NextResponse.json(syllabus);
  }
}

// DELETE — delete syllabus, subject, or chapter
export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { type, id } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  if (type === 'chapter') {
    await prisma.syllabusChapter.delete({ where: { id } });
  } else if (type === 'subject') {
    await prisma.syllabusSubject.delete({ where: { id } });
  } else {
    await prisma.syllabus.delete({ where: { id } });
  }

  return NextResponse.json({ success: true });
}
