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
  const gallery = await prisma.gallery.findMany({
    where: all ? {} : { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(gallery);
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const { imageUrl, caption, altText, sortOrder, isActive } = body;
  if (!imageUrl) return NextResponse.json({ error: 'imageUrl is required.' }, { status: 400 });
  const item = await prisma.gallery.create({
    data: { imageUrl, caption: caption || '', altText: altText || '', sortOrder: sortOrder || 0, isActive: isActive !== false },
  });
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const item = await prisma.gallery.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await prisma.gallery.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
