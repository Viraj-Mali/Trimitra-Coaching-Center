import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentStudent } from '@/lib/auth';

async function requireAdmin() {
  const session = await getCurrentStudent();
  if (!session || session.role !== 'ADMIN') return null;
  return session;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');
  const all = searchParams.get('all') === 'true';

  const where = {
    ...(courseId ? { courseId } : {}),
    ...(all ? {} : { isActive: true }),
  };

  const faqs = await prisma.fAQ.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
    include: { course: { select: { id: true, title: true } } },
  });
  return NextResponse.json(faqs);
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const { question, answer, courseId, sortOrder, isActive } = body;
  if (!question || !answer) {
    return NextResponse.json({ error: 'question and answer are required.' }, { status: 400 });
  }
  const faq = await prisma.fAQ.create({
    data: { question, answer, courseId: courseId || null, sortOrder: sortOrder || 0, isActive: isActive !== false },
  });
  return NextResponse.json(faq, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const faq = await prisma.fAQ.update({ where: { id }, data });
  return NextResponse.json(faq);
}

export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await prisma.fAQ.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
