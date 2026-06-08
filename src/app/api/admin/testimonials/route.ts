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
  const all = searchParams.get('all') === 'true';
  const testimonials = await prisma.testimonial.findMany({
    where: all ? {} : { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(testimonials);
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const { authorName, authorDetail, authorType, quote, stars, isPublished, sortOrder } = body;
  if (!authorName || !quote) {
    return NextResponse.json({ error: 'authorName and quote are required.' }, { status: 400 });
  }
  const testimonial = await prisma.testimonial.create({
    data: { authorName, authorDetail: authorDetail || '', authorType: authorType || 'STUDENT', quote, stars: stars || 5, isPublished: isPublished || false, sortOrder: sortOrder || 0 },
  });
  return NextResponse.json(testimonial, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const testimonial = await prisma.testimonial.update({ where: { id }, data });
  return NextResponse.json(testimonial);
}

export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
