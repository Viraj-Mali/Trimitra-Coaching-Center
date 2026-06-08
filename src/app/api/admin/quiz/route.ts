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
  const questions = await prisma.quizQuestion.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(questions);
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { question, optionA, optionB, optionC, optionD, correctIndex, explanation, track, standard, subject } = await request.json();
  if (!question || !optionA || !optionB || !optionC || !optionD || correctIndex === undefined || !track) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }
  const q = await prisma.quizQuestion.create({
    data: { question, optionA, optionB, optionC, optionD, correctIndex: Number(correctIndex), explanation, track, standard, subject },
  });
  return NextResponse.json(q, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await request.json();
  await prisma.quizQuestion.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
