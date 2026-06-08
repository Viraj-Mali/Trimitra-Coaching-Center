import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentStudent } from '@/lib/auth';
import { getTodayDateString, XP_PER_CORRECT, XP_PER_QUIZ_COMPLETE, STREAK_BONUS_XP } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const session = await getCurrentStudent();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { answers } = await request.json();
    // answers: Array<{ questionId: string; selectedIdx: number }>

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: 'No answers provided.' }, { status: 400 });
    }

    const today = getTodayDateString();
    const student = await prisma.student.findUnique({ where: { id: session.id } });
    if (!student) return NextResponse.json({ error: 'Student not found.' }, { status: 404 });

    // Check if already completed today's quiz
    if (student.lastQuizDate === today) {
      return NextResponse.json({ error: 'Quiz already completed today.' }, { status: 409 });
    }

    // Grade answers
    const questionIds = answers.map((a: { questionId: string }) => a.questionId);
    const questions = await prisma.quizQuestion.findMany({
      where: { id: { in: questionIds } },
    });

    let xpEarned = 0;
    let correctCount = 0;
    const results: { questionId: string; isCorrect: boolean; correctIndex: number }[] = [];

    for (const answer of answers) {
      const q = questions.find(q => q.id === answer.questionId);
      if (!q) continue;
      const isCorrect = q.correctIndex === answer.selectedIdx;
      if (isCorrect) { correctCount++; xpEarned += XP_PER_CORRECT; }
      results.push({ questionId: q.id, isCorrect, correctIndex: q.correctIndex });
    }

    xpEarned += XP_PER_QUIZ_COMPLETE; // Completion bonus

    // Streak logic
    const wasActiveYesterday = student.lastQuizDate === new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = wasActiveYesterday ? student.streakCount + 1 : 1;
    if (newStreak > 1) xpEarned += STREAK_BONUS_XP;

    // Save attempts
    await prisma.quizAttempt.createMany({
      data: answers.map((a: { questionId: string; selectedIdx: number }) => {
        const r = results.find(r => r.questionId === a.questionId);
        return {
          studentId: student.id,
          questionId: a.questionId,
          selectedIdx: a.selectedIdx,
          isCorrect: r?.isCorrect ?? false,
          xpAwarded: r?.isCorrect ? XP_PER_CORRECT : 0,
        };
      }),
    });

    // Update student stats
    await prisma.student.update({
      where: { id: student.id },
      data: {
        streakCount: newStreak,
        totalXP: student.totalXP + xpEarned,
        lastQuizDate: today,
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      correctCount,
      totalQuestions: answers.length,
      xpEarned,
      newStreak,
      results,
    });
  } catch (error) {
    console.error('[QUIZ COMPLETE POST]', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
