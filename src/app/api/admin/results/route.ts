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
  const results = await prisma.result.findMany({
    where: all ? {} : { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { examYear: 'desc' }],
  });
  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const { studentName, examName, score, track, examYear, isPublished, sortOrder } = body;
  if (!studentName || !examName || !score || !track) {
    return NextResponse.json({ error: 'studentName, examName, score, track are required.' }, { status: 400 });
  }
  const result = await prisma.result.create({
    data: { studentName, examName, score, track, examYear: examYear || 2024, isPublished: isPublished || false, sortOrder: sortOrder || 0 },
  });
  return NextResponse.json(result, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const result = await prisma.result.update({ where: { id }, data });
  return NextResponse.json(result);
}

export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await prisma.result.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
