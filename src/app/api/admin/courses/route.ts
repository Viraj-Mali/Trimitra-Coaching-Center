import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentStudent } from '@/lib/auth';

async function requireAdmin() {
  const session = await getCurrentStudent();
  if (!session || session.role !== 'ADMIN') return null;
  return session;
}

export async function GET() {
  // Courses are public (used on landing page)
  const courses = await prisma.course.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  return NextResponse.json(courses);
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const {
    title, subtitle, description, subjects, targetTrack, targetClass, duration, isActive, sortOrder,
    slug, whoShouldJoin, teachingMethodology, weeklyTestPlan, doubtSolvingSystem,
    studyMaterial, batchTiming, examPattern, metaTitle, metaDescription,
  } = body;
  if (!title || !targetTrack || !subjects) {
    return NextResponse.json({ error: 'title, targetTrack, and subjects are required.' }, { status: 400 });
  }
  // Auto-generate slug from title if not provided
  const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const course = await prisma.course.create({
    data: {
      title, subtitle: subtitle || '', description: description || '', subjects, targetTrack,
      targetClass: targetClass || '', duration: duration || '',
      isActive: isActive !== false, sortOrder: sortOrder || 0,
      slug: generatedSlug,
      whoShouldJoin: whoShouldJoin || '',
      teachingMethodology: teachingMethodology || '',
      weeklyTestPlan: weeklyTestPlan || '',
      doubtSolvingSystem: doubtSolvingSystem || '',
      studyMaterial: studyMaterial || '',
      batchTiming: batchTiming || '',
      examPattern: examPattern || '',
      metaTitle: metaTitle || '',
      metaDescription: metaDescription || '',
    },
  });
  return NextResponse.json(course, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const course = await prisma.course.update({ where: { id }, data });
  return NextResponse.json(course);
}

export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
