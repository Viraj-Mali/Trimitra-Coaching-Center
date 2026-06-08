import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentStudent } from '@/lib/auth';

async function requireAdmin() {
  const session = await getCurrentStudent();
  if (!session || session.role !== 'ADMIN') return null;
  return session;
}

export async function GET(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const track = searchParams.get('track');
  const where = track ? { OR: [{ targetTrack: track }, { targetTrack: null }] } : {};
  const notices = await prisma.notice.findMany({ where, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(notices);
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { title, body, targetTrack, isUrgent } = await request.json();
  if (!title || !body) return NextResponse.json({ error: 'Title and body required.' }, { status: 400 });
  const notice = await prisma.notice.create({
    data: { title, body, targetTrack: targetTrack || null, isUrgent: isUrgent || false },
  });
  return NextResponse.json(notice, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await request.json();
  await prisma.notice.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
