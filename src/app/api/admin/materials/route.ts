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
  const materials = await prisma.learningMaterial.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(materials);
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { title, description, fileUrl, targetTrack, isPremium, fileType } = await request.json();
  if (!title || !fileUrl || !targetTrack) return NextResponse.json({ error: 'Missing fields.' }, { status: 400 });
  const material = await prisma.learningMaterial.create({
    data: { title, description, fileUrl, targetTrack, isPremium: !!isPremium, fileType: fileType || 'PDF' },
  });
  return NextResponse.json(material, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await request.json();
  await prisma.learningMaterial.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
